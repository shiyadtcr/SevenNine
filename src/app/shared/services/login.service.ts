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
    if(status == true){
      localStorage.setItem('hasUserLoggedIn',status);
    } else {
      localStorage.removeItem('hasUserLoggedIn');
    }	  
	  this.onSuccessLogin.emit(this.getLoggedInStatus());
  }
  getLoggedInStatus(){
	  return localStorage.getItem('hasUserLoggedIn');
  }
  

}
