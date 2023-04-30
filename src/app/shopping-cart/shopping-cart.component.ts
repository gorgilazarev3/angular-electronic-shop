import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../models/product';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, AfterViewInit {

  cart$;
  cartItems = [];
  totalCost = 0;
  cartId;
  displayedColumns: string[] = ['thumbnail', 'title', 'quantity', 'price'];
  dataSource: MatTableDataSource<any>;

  constructor(private cartService: ShoppingCartService, private afs: AngularFirestore) {
  }


  async ngOnInit() {
    this.cart$ = this.cartService.getCart(await this.cartService.getOrCreateCartId()).snapshotChanges();
    this.cartId = await this.cartService.getOrCreateCartId();
    this.afs.collection<any>('shopping-carts').doc(this.cartId).collection('items').valueChanges().forEach(item => {
      item.map(result => {
        this.cartItems.push(result);
        this.totalCost = this.getTotalCost();
        this.sendTotalCost();
      })
      this.cartItems.length = 0;
  });
    
 
  }
  
  async ngAfterViewInit() {
    this.afs.collection<any>('shopping-carts').doc(await this.cartService.getOrCreateCartId()).collection('items').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
    
  }
  
  trackByUid(index, item) {
    return item.uid;
  }

  sendTotalCost() {
    this.cartService.setTotalCost(this.totalCost);
  }

  getTotalCost() {
    let totalCost = 0;
    for(let item of this.cartItems) {
      totalCost += (item.quantity*item.product.price);
    }
    this.totalCost = totalCost;
    return this.totalCost;
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems.length = 0;
    this.totalCost = 0;
  }

  updateQuantity(product: Product, change: number) {
    this.cartService.updateQuantity(product,change);
  }

}
