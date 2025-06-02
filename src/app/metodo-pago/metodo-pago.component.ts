import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../service/carrito.service';

interface CompraRequest {
  idBanco: string;
  idFranquicia: string;
  idMetodoPago: number;
  numTarjeta: string;
  identificacion: string;
  items: Array<{
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
  }>;
}

interface CompraResponse {
  success: boolean;
  message: string;
  transaccion: {
    id: number;
    fecha: Date;
    valor: number;
    estado: number;
    metodoPago: {
      tipo: string;
      banco: string;
      franquicia: string;
      numTarjeta: string;
    };
  };
}

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.css']
})
export class MetodoPagoComponent implements OnInit {
  private apiUrl = 'http://172.172.90.61:8181/api/transacciones';
  
  selectedMethod: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  // Campos comunes
  identificacion: string = '';
  cardNumber: string = '';
  expiry: string = '';
  cvv: string = '';
  cardName: string = '';

  bank: string = '';
  pseEmail: string = '';

  // Datos del carrito
  cartItems: any[] = [];
  total: number = 0;
  subtotal: number = 0;
  iva: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  async ngOnInit() {
    try {
      this.cartItems = this.carritoService.obtenerCarrito();
      if (this.cartItems.length === 0) {
        this.router.navigate(['/carrito']);
        return;
      }
      this.calcularTotales();
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      this.error = error instanceof Error ? error.message : 'Error al inicializar el componente';
    }
  }

  calcularTotales() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.precioVentaActual * item.cantidad), 0);
    this.iva = this.subtotal * 0.19;
    this.total = this.subtotal + this.iva;
  }

  private resetForm() {
    this.cardNumber = '';
    this.expiry = '';
    this.cvv = '';
    this.cardName = '';
    this.bank = '';
    this.pseEmail = '';
    this.error = '';
    this.loading = false;
  }

  private validateCardPayment(): boolean {
    if (!this.identificacion.trim()) {
      this.error = 'La identificación es requerida';
      return false;
    }

    if (!this.cardNumber.trim()) {
      this.error = 'El número de tarjeta es requerido';
      return false;
    }
    if (!this.expiry.trim()) {
      this.error = 'La fecha de vencimiento es requerida';
      return false;
    }
    if (!this.cvv.trim()) {
      this.error = 'El código CVV es requerido';
      return false;
    }
    if (!this.cardName.trim()) {
      this.error = 'El nombre del titular es requerido';
      return false;
    }

    // Validaciones de formato
    if (!/^\d{16}$/.test(this.cardNumber.replace(/\s/g, ''))) {
      this.error = 'El número de tarjeta debe tener 16 dígitos';
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiry)) {
      this.error = 'La fecha de vencimiento debe tener el formato MM/YY';
      return false;
    }
    if (!/^\d{3,4}$/.test(this.cvv)) {
      this.error = 'El CVV debe tener 3 o 4 dígitos';
      return false;
    }

    return true;
  }

  private validatePSEPayment(): boolean {
    if (!this.identificacion.trim()) {
      this.error = 'La identificación es requerida';
      return false;
    }
    
    if (!this.bank) {
      this.error = 'Debe seleccionar un banco';
      return false;
    }
    if (!this.pseEmail) {
      this.error = 'El correo electrónico es requerido';
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.pseEmail.trim())) {
      this.error = 'El correo electrónico no es válido';
      return false;
    }
    return true;
  }

  async payWithCard(): Promise<void> {
    this.selectedMethod = 'card';
    if (this.validateCardPayment()) {
      await this.procesarCompra();
    }
  }

  async payWithPSE(): Promise<void> {
    this.selectedMethod = 'pse';
    if (this.validatePSEPayment()) {
      await this.procesarCompra();
    }
  }

  private async procesarCompra() {
    if (this.cartItems.length === 0) {
      this.error = 'No hay productos en el carrito';
      return;
    }

    if (!this.selectedMethod) {
      this.error = 'Por favor seleccione un método de pago';
      return;
    }

    if (!this.identificacion) {
      this.error = 'La identificación es requerida';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const compraRequest: CompraRequest = {
        idBanco: this.selectedMethod === 'pse' ? this.bank : '',
        idFranquicia: this.selectedMethod === 'card' ? 'VISA' : '',
        idMetodoPago: this.selectedMethod === 'card' ? 1 : 2,
        numTarjeta: this.selectedMethod === 'card' ? this.cardNumber.replace(/\s/g, '') : '',
        identificacion: this.identificacion,
        items: this.cartItems.map(item => ({
          idProducto: item.id,
          cantidad: item.cantidad,
          precioUnitario: item.precioVentaActual
        }))
      };

      console.log('Enviando datos de compra:', compraRequest);

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      const response = await this.http.post<CompraResponse>(
        `${this.apiUrl}/realizarCompra`,
        compraRequest,
        { headers }
      ).toPromise();

      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      console.log('Respuesta de la compra:', response);

      if (response.success) {
        localStorage.setItem('ultimaTransaccion', JSON.stringify({
          id: response.transaccion.id,
          fecha: response.transaccion.fecha,
          total: response.transaccion.valor,
          estado: response.transaccion.estado,
          metodoPago: response.transaccion.metodoPago
        }));

        this.carritoService.vaciarCarrito();
        this.cartItems = [];
        this.total = 0;
        this.subtotal = 0;
        this.iva = 0;
        this.resetForm();

        const metodoPago = response.transaccion.metodoPago.tipo;
        const mensaje = `¡Compra realizada con éxito!\n\n` +
                       `ID Transacción: ${response.transaccion.id}\n` +
                       `Total: $${response.transaccion.valor}\n` +
                       `Método de pago: ${metodoPago}\n\n` +
                       `Serás redirigido al inicio.`;
        
        alert(mensaje);
        this.router.navigate(['/home']);
      } else {
        this.error = response.message || 'Error al procesar la compra';
      }
    } catch (error) {
      console.error('Error en la transacción:', error);
      const errorMessage = error instanceof HttpErrorResponse 
        ? error.error?.message || 'Error al procesar el pago. Por favor, intente nuevamente.'
        : 'Error al procesar el pago';
      alert('Error en la transacción: ' + errorMessage);
      this.error = errorMessage;
    } finally {
      this.loading = false;
    }
  }
}