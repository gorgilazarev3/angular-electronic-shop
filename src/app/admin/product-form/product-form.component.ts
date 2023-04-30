import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/category.service';
import { ProductService } from 'src/app/product.service';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  subCategories$;
  constructor(public categoryService: CategoryService, private productService: ProductService,private router: Router) {
      this.categories$ = categoryService.getCategories();
   }

  ngOnInit(): void {
  }

  getSubCategory(categoryId: string) {
   this.subCategories$ = this.categoryService.getSubCategory(categoryId);
  }

  save(product) {
    this.productService.create(product);
    this.router.navigate(['admin/products']);
  }

}
