import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CategoryService } from '../category.service';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent  {
  categories$;
  changeTitle: boolean = false;
  changePrice: boolean = false;
  changeCategory: boolean = false;
  changeImage: boolean = false;
  newImage: boolean = false;
  oldImage: boolean = true;
  constructor(private afs: AngularFirestore, private dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, categoryService: CategoryService, private productService: ProductService) { 
    this.categories$ = categoryService.getCategories();
  }

  onNoClick() {
    this.dialogRef.close();
  }
  
  editProduct(product) {
    if(this.changeTitle) {
      this.afs.collection('products').doc(this.data.id).update({ title: product.title });
      this.changeTitle = false;
    }
    if(this.changePrice) {
      this.afs.collection('products').doc(this.data.id).update({ price: product.price });
      this.changePrice = false;
    }
    if(this.changeCategory) {
      this.afs.collection('products').doc(this.data.id).update({ category: product.category });
      this.changeCategory = false;
    }
    if(this.changeImage) {
      this.afs.collection('products').doc(this.data.id).update({ imageUrl: product.imageUrl });
      this.changeImage = false;
    }
    this.dialogRef.close();
    this.newImage = false;
    this.oldImage = true;
  }

  delete(product) {
    if(confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(product.id);
      this.dialogRef.close();
    }
  }
}
