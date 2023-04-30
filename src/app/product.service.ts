import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFirestore) { }

  create(product) {
    const newId = this.db.createId();
    this.db.collection('/products').doc(newId).set({
      title: product.title,
      price: product.price,
      category: product.category,
      subCategory: product.subcategory,
      imageUrl: product.imageUrl,
      id: newId
    });
  }

  delete(productId) {
    this.db.collection('products').doc(productId).delete();
  }

  getAll() {
    return this.db.collection('products');
  }

  getProducts() {
    return this.db.collection('products').valueChanges();
  }
}
