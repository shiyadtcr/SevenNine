import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
  IsLoggedIn:string = 'false';
  constructor() { 
    localStorage.setItem('isLoggedin','true');
	this.IsLoggedIn = localStorage.getItem('isLoggedin');
  }

}
