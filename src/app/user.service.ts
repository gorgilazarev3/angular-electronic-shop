import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '@firebase/auth-types';
import firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { AppUser } from './models/app-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$: AngularFirestoreCollection<any>;
  constructor(private db: AngularFirestore ) {
    this.users$ = db.collection('users');
   }
  
  save(user: firebase.User) {
    // this.db.object('/users/' + user.uid).set({
    //   email: user.email
    // });
    this.users$.doc(user.uid).set({
      email: user.email,
      isAdmin: false
    });
  }

  get(uid: string): Observable<any> {
    return this.users$.doc(uid).valueChanges();
  }
}
