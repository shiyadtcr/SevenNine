import { Injectable } from '@angular/core';

@Injectable()
export class DashboardService {
  pageTitle:string = '';
  checkoutFlag:boolean = false;
  constructor() { }
  getCheckoutFlag(){
	  return this.checkoutFlag;
  }
  setCheckoutFlag(f){
	  this.checkoutFlag = f;
  }

}
