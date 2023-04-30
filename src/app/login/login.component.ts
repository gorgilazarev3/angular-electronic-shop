import { Component } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
  }
  minPw = 8;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(this.minPw)]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a valid email';
    }
    else {
      if(this.email.hasError('email'))
      {
        return "Not a valid email";
      }
      return '';
    }

  }
  getPwErrorMessage() {
    if(this.password.hasError('required')) {
      return 'You must enter a password';
    }
    else {
      if(this.password.hasError('minLength')) {
        return  'Password must have at least 8 characters';
      }
      return 'Password must have at least 8 characters';
    }
     
  }

  confirmPassword(password: string ,password2: string) {
    if(password === password2)
    return true;
    else
    return false;
  }

}
