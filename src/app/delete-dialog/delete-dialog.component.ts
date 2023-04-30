import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from '../order.service';
@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  ordersArray = [];

  constructor(private orderService: OrderService, private afs: AngularFirestore, public dialogRef: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  deleteOrder(order) {
    // console.log(this.data);
    // let orderId: string;
    // this.afs.collection('orders').snapshotChanges().forEach(item => {
    //   item.forEach(i => {
    //     this.ordersArray.push(i.payload.doc.data());
    //     this.ordersArray.forEach(arr => {
    //       if(this.data.shipping.name === arr.shipping.name) {
    //           orderId = i.payload.doc.id;
    //       }
    //     })
    //   });
    // })
    // console.log(orderId);
    this.orderService.deleteOrder(this.data.id);
    this.dialogRef.close();
  }

}
