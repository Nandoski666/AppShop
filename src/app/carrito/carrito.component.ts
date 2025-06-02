import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../service/carrito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shp-carrito',
  standalone: true,
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  imports: [CommonModule, RouterModule]
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;

  constructor(private router: Router, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.subtotal = this.carrito.reduce((acc, p) => acc + p.precioVentaActual * p.cantidad, 0);
    this.iva = this.subtotal * 0.19;
    this.total = this.subtotal + this.iva;
  }

  eliminarProducto(id: number): void {
    this.carritoService.eliminarProducto(id);
    this.ngOnInit();
  }

  actualizarCantidad(prod: any, event: Event): void {
    const nuevaCantidad = parseInt((event.target as HTMLInputElement).value, 10);
    if (nuevaCantidad > 0) {
      prod.cantidad = nuevaCantidad;
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
      this.calcularTotales();
    }
  }

  irAPagar(): void {
    this.router.navigate(['/metodo-pago']);
  }
}
