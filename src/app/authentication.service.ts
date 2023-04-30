import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from '@firebase/auth-types';
import { AppUser } from './models/app-user';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user$!: Observable<firebase.User>;
  isLoggedOut: boolean = false;
  isRegistered: boolean = false;
  constructor(public afAuth: AngularFireAuth, private router: Router, private userService: UserService) {
    this.user$ = afAuth.authState;
  }

  register(email: any, password: any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then((result) => {
      this.isRegistered = true;
      console.log(result.user);
      this.userService.save(result.user);
      this.router.navigate(['/']);
    }).catch((error) => {
      window.alert(error.message)
    })
  }

  login(email: any, password: any) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
         this.router.navigate(['/']);

      }).catch((error) => {
        window.alert(error.message)
      })
  }

  logOut() {
    this.afAuth.signOut().then((result) => {
      this.router.navigate(['/']);
    });
    this.isLoggedOut = true;
  }

  get appUser$(): Observable<AppUser> {
    return this.user$.pipe(switchMap((user: firebase.User) => {
      if(user) return this.userService.get(user.uid);

      return new Observable<AppUser>();
    }
    ));
  }

  forgotPassword(email: string) {
    this.afAuth.sendPasswordResetEmail(email);
    alert('Password reset link sent to your email');
  }
}
