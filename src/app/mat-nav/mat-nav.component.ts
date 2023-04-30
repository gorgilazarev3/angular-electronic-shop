import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-mat-nav',
  templateUrl: './mat-nav.component.html',
  styleUrls: ['./mat-nav.component.css']
})
export class MatNavComponent {

  appUser: AppUser;
  isClicked: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public authService: AuthenticationService) {
    authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }
  
}
