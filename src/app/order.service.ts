import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderId: string;
  constructor(private db: AngularFirestore, private cartService: ShoppingCartService) { }

  async storeOrder(order) {
    let result = await this.db.collection('orders').add(order);
    this.cartService.clearCart();
    this.orderId = result.id;
    return result;
  }

  deleteOrder(orderId) {
    this.db.collection('orders').doc(orderId).delete();
  }

  getOrdersByUser(userId: string) {
    console.log(this.db.collection('orders').ref.where('userId','==',userId));
    return this.db.collection('orders').valueChanges().subscribe(item => {
      console.log(item);
      item.forEach(i => {
        console.log(i);
      })
    });
    
  }
}
