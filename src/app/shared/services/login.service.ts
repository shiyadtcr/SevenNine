import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppService } from '../../app.service';
@Injectable()
export class LoginService {
  IsLoggedIn:any;
  onSuccessLogin : EventEmitter<any> = new EventEmitter<any>();  
  onSuccessLogout : EventEmitter<any> = new EventEmitter<any>();  
  onSuccessSignup : EventEmitter<any> = new EventEmitter<any>();  
  constructor(
	private http: HttpClient,
	private appService: AppService
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
  signupUser(d){
	   let signupUrl = "http://13.232.42.90/service/?/Masters/signup/" + d.name + "/" + d.pwd + "/" + d.email + "/" + d.mob;
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(signupUrl);
   }
   signinUser(d){
	   let signinUrl = "http://13.232.42.90/service/?/Masters/signin/" + d.uname + "/" + d.pwd;
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(signinUrl);
   }

}
