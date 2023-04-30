import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { OrderService } from '../order.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['customer', 'date'];
  dataSource: MatTableDataSource<any>
  userId: string;
  userOrders;
  userSubscription: Subscription;
  constructor(private afs: AngularFirestore, private authService: AuthenticationService, private orderService: OrderService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    // this.orderService.getOrdersByUser(this.userId).valueChanges().subscribe(data => {
    //   this.dataSource = new MatTableDataSource(data);
    // });
    // this.afs.collection<any>('orders')

    this.afs.collection('orders').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.userOrders = this.getOrdersByUser().valueChanges();
    })
    
  }

  trackByUid(index, item) {
    return item.uid;
  }
  
  getOrdersByUser() {
    // this.afs.collection('orders').ref.where('userId','==',this.userId).get();
    return this.afs.collection('orders',ref => ref.where('userId','==',this.userId));
    // return this.afs.collection('orders',ref => ref.where('userId','==',this.userId)).valueChanges().subscribe(item => {
    //   console.log(item);
    //   item.forEach(i => {
    //     console.log(i);
    //   })
    // });
    
  }

  openDetailsDialog(data) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: data
    });
  }

}
