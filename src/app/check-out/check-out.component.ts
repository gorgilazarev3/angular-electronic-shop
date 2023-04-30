import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestoreDocument, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { OrderService } from '../order.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { FormBuilder, Validators } from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {
cart: AngularFirestoreDocument<any>;
items: QuerySnapshot<any>;
userId: string;
userSubscription: Subscription;
totalCost: number;
cartItems = [];
firstFormGroup = this._formBuilder.group({
  firstCtrl: ['', Validators.required]
});
secondFormGroup = this._formBuilder.group({
  secondCtrl: ['', Validators.required]
});
thirdFormGroup = this._formBuilder.group({
  thirdCtrl: ['', Validators.required]
});
stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService, private cartService: ShoppingCartService, private orderService: OrderService, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 1380px)')
    .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));
   }

 async ngOnInit() {
    this.cart = this.cartService.getCart(await this.cartService.getOrCreateCartId());
    this.items = (await this.cart.collection('items').ref.get());
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
    this.totalCost = this.cartService.getTotalCost();
    this.items.docs.forEach(i => {
      this.cartItems.push(i.data());
      
    });
    console.log(this.cartItems);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  async placeOrder(newOrder) {
    let order = {
      userId: this.userId,
      datePlaced: new Date().getTime(),
      shipping: newOrder,
      totalCost: this.cartService.getTotalCost(),
      
      items: this.items.docs.map(i => {
        return {
          product: {
             title: i.data().product.title,
             imageUrl: i.data().product.imageUrl,
             price: i.data().product.price
            },
          quantity: i.data().quantity
        }
      })
    }; 
    let result = await this.orderService.storeOrder(order);
    this.router.navigate(['/order-success', result.id]);
  }

}
