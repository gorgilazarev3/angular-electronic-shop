import { NumberFormatStyle } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { MatCarousel, MatCarouselComponent } from '@ngbmodule/material-carousel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  // products$;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  addedProducts: any = [];
  categories$;
  subCategories$;
  cart;
   // Slider Images
   slides = [{'image': 'https://i.imgur.com/g4Fq9uy.png'}, {'image': 'https://i.imgur.com/Mnk5ekO.png'},{'image': 'https://i.imgur.com/rmZ5ugj.png'}, {'image': 'https://i.imgur.com/rPHjDgx.png'}, {'image': 'https://goodmockups.com/wp-content/uploads/2021/04/Free-Apple-iPhone-12-Pro-Clay-Mockup-PSD-File.jpg'}];

   panelOpenState = false;
   
   minValue: number = 0;
   maxValue: number = 3000;
   options: Options = {
     floor: 0,
     ceil: 3000
   };


  constructor(productService: ProductService, private categoryService: CategoryService, private cartService: ShoppingCartService, private _snackBar: MatSnackBar) {
    // this.products$ = productService.getProducts();
    productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filteredProducts = this.products;
    });
    this.categories$ = categoryService.getCategories();

   }



  // async ngOnInit() {
  //   this.subscription = (await this.cartService.getCart()).snapshotChanges().subscribe(cart => this.cart = cart);
  // }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  getSubCategory(categoryId: string) {
    this.subCategories$ = this.categoryService.getSubCategory(categoryId);
  }

  filterProducts(category,subCat?: boolean) {
    if(subCat) {
      this.filteredProducts = (category) ?
      this.products.filter(p => p.subCategory === category) :
      this.products;
    }
    else {
      this.filteredProducts = (category) ?
      this.products.filter(p => p.category === category) :
      this.products;
    }

  }

  searchProducts(key: string) {
      this.filteredProducts = (key) ?
      this.filteredProducts.filter(p => (p.title).toLowerCase().includes(key)) :
      this.products;
  }

  sortProducts() {
      this.filteredProducts = (this.minValue >= 0 && this.maxValue <= 3000) ?
      this.products.filter(p => p.price < this.maxValue && p.price > this.minValue) :
      this.products;
}




  async addToCart(product: Product) {
    let quantity;
    this.cartService.addToCart(product);
    this.cart = (await this.cartService.getCart(await this.cartService.getOrCreateCartId()).ref.collection('items').doc(product.id).get()).data();
    if(!this.cart) {
      quantity = 0;
    }
    else {
      quantity = this.cart.quantity;
    }
    if(this.addedProducts.length > 0) {
      this.addedProducts.forEach(element => {
        if(element.product.id === product.id) {
          element.quantity =  quantity;
        }
        else {
          this.addedProducts.push({ product: product, quantity: quantity });
        }
      });
    }
    else {
      this.addedProducts.push({ product: product, quantity: quantity });
    }
  }

  openSnackBar(productTitle: string) {
    this._snackBar.open('You have added ' + productTitle +  ' to your shopping cart', 'Dismiss', {
      duration: 5000,
      panelClass: ['snackbar-color']
    });
  }
}
