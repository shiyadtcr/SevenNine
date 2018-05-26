import { Injectable, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';
@Injectable()
export class LoginService {
  IsLoggedIn:any;
  onSuccessLogin : EventEmitter<any> = new EventEmitter<any>();  
  onSuccessLogout : EventEmitter<any> = new EventEmitter<any>();  
  onSuccessSignup : EventEmitter<any> = new EventEmitter<any>();  
  constructor(
	private appService: AppService
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
