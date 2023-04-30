import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from './models/product';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  totalCost: number;

  constructor(private db: AngularFirestore) { }

    private create() {
    return this.db.collection('shopping-carts').add({
      dateCreated: new Date().getTime()
    });
  }

    getCart(cartId: string) {
      return this.db.collection('shopping-carts').doc(cartId);
    }
    // async getCart() {
    //   let cartId = await this.getOrCreateCartId();
    //   return this.db.collection('shopping-carts').doc(cartId);
    // }

    private getItem(cartId, productId: string) {
      return this.db.collection('shopping-carts').doc(cartId).collection('items').doc(productId);
    }

   async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if(cartId)  return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.id);
    return result.id;
  }

  async addToCart(product: Product) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.id);
    item$.snapshotChanges().pipe(take(1)).subscribe(item => {
      if(item.payload.exists) item$.update({quantity: item.payload.data().quantity + 1});
      else item$.set({product: product, quantity: 1});
    });
  }

  async updateQuantity(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.id);
    item$.snapshotChanges().pipe(take(1)).subscribe(item => {
      if(item.payload.exists){
        item$.update({quantity: item.payload.data().quantity + change});
        if(item.payload.data().quantity == 1 && change == -1) {
          this.db.collection('shopping-carts').doc(cartId).collection('items').doc(product.id).delete();
        }
      } 
    });
  }
  
  async clearCart() {
    let cartId = await this.getOrCreateCartId();
  (await this.db.collection('shopping-carts').doc(cartId).collection('items').ref.get()).forEach(item => {
      item.ref.delete();
    });
  }

  setTotalCost(cost: number) {
    this.totalCost = cost;
  }

  getTotalCost() {
    return this.totalCost;
  }

}
