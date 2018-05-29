import { Injectable, EventEmitter } from '@angular/core';
@Injectable()
export class LoginService {
  IsLoggedIn:any;
  onSuccessLogin : EventEmitter<any> = new EventEmitter<any>();  
  onSuccessLogout : EventEmitter<any> = new EventEmitter<any>();  
  onSuccessSignup : EventEmitter<any> = new EventEmitter<any>();  
  constructor(
  ) { 
    //localStorage.setItem('isLoggedin','true');
  }
  setLoggedInStatus(status){
	  localStorage.setItem('hasUserLoggedIn',status);
	  this.onSuccessLogin.emit(status);
  }
  getLoggedInStatus(){
	  return localStorage.getItem('hasUserLoggedIn');
  }
  

}
