import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AppService {
  onShowPreloader : EventEmitter<any> = new EventEmitter<any>();
  baseImageUrl:string = 'http://13.232.42.90/seven9/assets/';
  redirectionUrl:string;
  constructor() { }
  setCurrentUser(user){
    if(user == null) localStorage.removeItem('currentUser'); else localStorage.setItem('currentUser',user);	  
  }
  getCurrentUser(){
	localStorage.getItem('currentUser');  
  }
  setRedirectionUrl(url){
    this.redirectionUrl = url;
  }
  getRedirectionUrl(){
    return this.redirectionUrl;
  }
}
