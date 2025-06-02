import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Pan Francés',
      price: 2.50,
      quantity: 2,
      image: 'assets/images/pan-frances.jpg'
    },
    {
      id: 2,
      name: 'Croissant',
      price: 3.00,
      quantity: 1,
      image: 'assets/images/croissant.jpg'
    }
  ];

  shippingCost: number = 5.00;
  discount: number = 2.50;

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.updateCart();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.updateCart();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotal(): number {
    return this.getSubtotal() + this.shippingCost - this.discount;
  }

  updateCart(): void {
    // Aquí iría la lógica para actualizar el carrito en el backend
    console.log('Carrito actualizado', this.cartItems);
  }

  checkout(): void {
    // Aquí iría la lógica para proceder al pago
    console.log('Procediendo al pago', this.getTotal());
  }
} 