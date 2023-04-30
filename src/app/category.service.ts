import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFirestore) { }

  getCategories() {
    return this.db.collection('/categories').snapshotChanges().pipe(
      map(snapshots => {
         return snapshots.map(s => {
          const data = s.payload.doc.data();
          const id = s.payload.doc.id;
          return {id, data};
       });
      }))
  }

    getSubCategory(categoryId: string) {
      return this.db.collection('/categories').doc(categoryId).collection('subcategories').snapshotChanges().pipe(map(querySnapshot => {
        return querySnapshot.map(s => {
          const id = s.payload.doc.id;
          const data = s.payload.doc.data();
          return { id, data };
        })
      }))

      }
}
