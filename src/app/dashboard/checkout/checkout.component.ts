import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import {ProductService} from '../../shared';
import {DataService} from '../../shared';
import {AppService} from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
declare var $: any;
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
  checkoutFormGroup:FormGroup;
  productTotal:number = 0;
  constructor(
	private dashboardService:DashboardService,
	private productService:ProductService,
	private dataService:DataService,
	private appService:AppService,
	private checkoutForm: FormBuilder,
	private router: Router
  ) { 
	this.checkoutFormGroup = this.checkoutForm.group({
      billingaddr: ['', Validators.required ],
      shippingaddr: ['', Validators.required ],
      shippingmethod: ['', Validators.required ],
      deiverydate: ['', Validators.required ],
      deiverytime: ['', Validators.required ],
      paymentmethod: ['', Validators.required ]
    });
  }
  get _billingaddr() { return this.checkoutFormGroup.get('billingaddr'); }
  get _shippingaddr() { return this.checkoutFormGroup.get('shippingaddr'); }
  get _shippingmethod() { return this.checkoutFormGroup.get('shippingmethod'); }
  get _deiverydate() { return this.checkoutFormGroup.get('deiverydate'); }
  get _deiverytime() { return this.checkoutFormGroup.get('deiverytime'); }
  get _paymentmethod() { return this.checkoutFormGroup.get('paymentmethod'); }
  isError(field){
	  return field.invalid && (field.dirty || field.touched);
  }
  ngOnInit() {
	this.dashboardService.pageTitle = "Checkout";
	this.addressList = this.dataService.getAddressList();
	this.shippingAddr = this.addressList.shippingAddress[0];
	this.billingAddr = this.addressList.billingAddress[0];
	this.additionalAddr = JSON.parse(JSON.stringify(this.addressList.additionalAddress));
	this.additionalAddr.push(this.billingAddr);
	this.additionalAddr.push(this.shippingAddr);
	this.selectedBillingAddr = this.addressList.additionalAddress[0];
	this.productService.getProductsInCartService()
	.subscribe((data: any) => {
		if(data && data.length > 0){
			this.productsInCart = data;
			//this.productService.setProductsInCart(data);
			this.productTotal = this.productService.getCartProductsTotal();
			this.appService.onShowPreloader.emit(false);
			$.notify(data.message,'success');
		} else {
			this.productsInCart = [];
			this.appService.onShowPreloader.emit(false);
			$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
		}
	},(data: any) => {
		this.appService.onShowPreloader.emit(false);
		$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
	});	
  }
  changeBillingAddr(event){
	this.billingAddr = this.additionalAddr[event.target.value];
  }
  changeShippingAddr(event){
	this.shippingAddr = this.additionalAddr[event.target.value];
  }
  placeOrder(){
	  let _checkoutData = {
		  billingaddr: this.addressList.billingAddress[this._billingaddr.value],
		  shippingaddr: this.addressList.shippingAddress[this._shippingaddr.value],
		  shippingmethod: this._shippingmethod.value,
		  deiverydate: this._deiverydate.value,
		  deiverytime: this._deiverytime.value,
		  paymentmethod: this._paymentmethod.value
	  }
	  console.log('_checkoutData: ',_checkoutData);
	  this.router.navigate(['/dashboard/checkout/1234567890']);
  }
}
