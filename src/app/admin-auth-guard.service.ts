import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat';
import { User } from '@firebase/auth-types';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private userService: UserService) { }

  // canActivate(): Observable<boolean> {
  //     return this.auth.user$.pipe(switchMap((user: firebase.User) => {
  //       return this.userService.get(user.uid)).map((appUser) => appUser.isAdmin))
  //     });
  // }
  canActivate(): Observable<boolean> {
    return this.auth.appUser$.pipe(map((appUser) => appUser.isAdmin));
    // auth.user$.pipe(switchMap((user: firebase.User) =>
    //   this.userService.get(user.uid)),
      
   }
}
