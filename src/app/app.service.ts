import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AppService {
  onShowPreloader : EventEmitter<any> = new EventEmitter<any>();
  baseImageUrl:string = 'http://13.232.42.90/seven9/assets/';
  baseServiceUrl:string = 'http://13.232.42.90/service/?/Masters/';
  redirectionUrl:string;
  constructor() { }
  setBaseServiceUrl(url){
    this.baseServiceUrl = url;	  
  }
  getBaseServiceUrl(){
	return this.baseServiceUrl;  
  }
  setCurrentUser(user){
    if(user == null){
		localStorage.removeItem('currentUser'); 
	}else {
		localStorage.setItem('currentUser',user);	
	}
  }
  getCurrentUser(){
	return localStorage.getItem('currentUser');  
  }
  setRedirectionUrl(url){
    this.redirectionUrl = url;
  }
  getRedirectionUrl(){
    return this.redirectionUrl;
  }
}
