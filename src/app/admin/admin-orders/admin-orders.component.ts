import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['customer', 'date','delete'];
  dataSource: MatTableDataSource<any>
  constructor(private afs: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.afs.collection<any>('orders').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    })
  }

  trackByUid(index, item) {
    return item.uid;
  }
  
  openDeleteDialog(data) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: data
    });
  }

}
