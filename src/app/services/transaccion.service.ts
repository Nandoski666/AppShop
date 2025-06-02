import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemCompra {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface DatosCompra {
  tipoPago: string;
  referencia: string;
  items: ItemCompra[];
}

export interface DetalleTransaccion {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  items: ItemCompra[];
}

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private apiUrl = 'http://172.172.90.61:8181';

  constructor(private http: HttpClient) {}

  realizarCompra(datosCompra: DatosCompra): Observable<any> {
    const compraFormateada = {
      ...datosCompra,
      referencia: 'REF-' + new Date().getTime() // Aseguramos que siempre tenga una referencia única
    };

    return this.http.post(`${this.apiUrl}/transaccion/realizarCompra`, compraFormateada, {
      withCredentials: true
    });
  }

  obtenerDetalles(transaccionId: number): Observable<DetalleTransaccion> {
    return this.http.get<DetalleTransaccion>(`${this.apiUrl}/transaccion/detalles/${transaccionId}`, {
      withCredentials: true
    });
  }

  obtenerHistorial(): Observable<DetalleTransaccion[]> {
    return this.http.get<DetalleTransaccion[]>(`${this.apiUrl}/transaccion/historial`, {
      withCredentials: true
    });
  }
} 