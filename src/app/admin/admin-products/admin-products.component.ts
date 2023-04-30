import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EditDialogComponent } from 'src/app/edit-dialog/edit-dialog.component';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements AfterViewInit {

  products$;

  displayedColumns: string[] = ['title', 'price','edit'];
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private productService: ProductService, public dialog: MatDialog, private afs: AngularFirestore) {

    this.products$ = this.productService.getAll();
   }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.afs.collection<any>('products').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  trackByUid(index, item) {
    return item.uid;
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '350px',
      data: data
    });
  }

}
