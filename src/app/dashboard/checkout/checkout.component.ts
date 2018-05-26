import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import {ProductService} from '../../shared';
import {DataService} from '../../shared';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  deliveryDate:string = '';
  productsInCart:any = [];
  shippingAddr:any = {};
  addressList:any = [];
  additionalAddr:any = [];
  discount:number = 0;
  billingAddr:any = {};
  selectedBillingAddr:any = {};
  constructor(
	private dashboardService:DashboardService,
	private productService:ProductService,
	private dataService:DataService
  ) { }

  ngOnInit() {
	this.dashboardService.pageTitle = "Checkout";
	this.addressList = this.dataService.getAddressList();
	this.shippingAddr = this.addressList.shippingAddress[0];
	this.billingAddr = this.addressList.billingAddress[0];
	this.additionalAddr = JSON.parse(JSON.stringify(this.addressList.additionalAddress));
	this.additionalAddr.push(this.billingAddr);
	this.additionalAddr.push(this.shippingAddr);
	this.selectedBillingAddr = this.addressList.additionalAddress[0];
	this.productsInCart = this.productService.getProductsInCart();
  }
  changeBillingAddr(event){
	this.billingAddr = this.additionalAddr[event.target.value];
  }
  changeShippingAddr(event){
	this.shippingAddr = this.additionalAddr[event.target.value];
  }

}
