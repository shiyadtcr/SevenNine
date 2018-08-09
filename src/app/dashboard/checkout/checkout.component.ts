import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import {ProductService} from '../../shared';
import {DataService} from '../../shared';
import {AppService} from '../../app.service';
import { Subscription } from 'rxjs';
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
  addressList:any = [];
  defaultAddress:any = {};
  checkoutFormGroup:FormGroup;
  private onRemoveFromCartSub: Subscription;
  productTotal:number = 0;
  discount:number = 0;
  deliveryTimes:any = [];
  shippingMethods:any = [];
  paymentMethods:any = [];
  shippingFee:any = 0;

	
  constructor(
	private dashboardService:DashboardService,
	private productService:ProductService,
	private dataService:DataService,
	private appService:AppService,
	private checkoutForm: FormBuilder,
	private router: Router
  ) { 
	this.checkoutFormGroup = this.checkoutForm.group({
      address: ['', Validators.required ],
      shippingmethod: ['', Validators.required ],
      deliverydate: [''],
      deliverytime: ['', Validators.required ],
      paymentmethod: ['', Validators.required ]
    });
  }
  get _address() { return this.checkoutFormGroup.get('address'); }
  set _address(value:any) { this._address.value = value; }
  get _shippingmethod() { return this.checkoutFormGroup.get('shippingmethod'); }
  set _shippingmethod(value:any) { this._shippingmethod.value = value; }
  get _deliverydate() { return this.checkoutFormGroup.get('deliverydate'); }
  set _deliverydate(value:any) { this._deliverydate.value = value; }
  get _deliverytime() { return this.checkoutFormGroup.get('deliverytime'); }
  set _deliverytime(value:any) { this._deliverytime.value = value; }
  get _paymentmethod() { return this.checkoutFormGroup.get('paymentmethod'); }
  isError(field){
	  return field.invalid && (field.dirty || field.touched);
  }
  getSelectedShippingMethod(id){
	  if(this.shippingMethods.length > 0){
		  let _item = this.shippingMethods.filter((v) => {return v.id == id});
		  if(_item.length != 0){
			this.shippingFee = _item[0].shipCost;
		  }
	  }
  }
  getCartList(){
	this.productService.getProductsInCartService()
	.subscribe((data: any) => {
		if(data && data.length > 0){
			this.productsInCart = data;
			this.productsInCart.forEach((v,i) => {
				if(this.productsInCart[i].imageUrl){
					this.productsInCart[i].imageUrl = this.appService.baseImageUrl + 'item/' + this.productsInCart[i].imageUrl;
				} else {
					this.productsInCart[i].imageUrl = this.appService.defaultImageUrl;
				}
			});
			//this.productService.setProductsInCart(data);
			this.productTotal = this.productService.getCartProductsTotal();
			this.appService.onShowPreloader.emit(false);
			//$.notify(data.message,'success');
		} else {
			this.productsInCart = [];
			this.appService.onShowPreloader.emit(false);
			//$.notify('Please add products in cart to checkout.','error');
		}
	},(data: any) => {
		this.appService.onShowPreloader.emit(false);
		$.notify('Cart update failed due to an error. Try after some time.','error');
	});	
	}
  ngOnInit() {
	this.dashboardService.pageTitle = "Checkout";	
	this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((data) => {        
		this.getCartList();
	});
	this.dataService.getAddressList()
	.subscribe((data:any) => {
		if(data){
			if(data.length == 0){
				this.router.navigate(['dashboard','addressbook']);
			} else {
				this.addressList = data;
				this.defaultAddress = this.addressList.filter((val,ind) => { return val.status == 1})[0];
				this._address.value = 1;
				this.dataService.getShippingMethods()
				.subscribe((data:any) => {
					if(data){
						this.shippingMethods = data;			
						//this._shippingmethod.value = this.shippingMethods[0].id;
					} else {
						$.notify('Error on getting shipping methods. Try after some time.',"error");
					}
					//this.appService.onShowPreloader.emit(false);
				},(data:any) => {
					this.appService.onShowPreloader.emit(false);
					$.notify('Error on getting shipping methods. Try after some time.',"error");
				});
				this.dataService.getDeliveryTimes()
				.subscribe((data:any) => {
					if(data){
						this.deliveryTimes = data;
					} else {
						$.notify('Error on getting delivery times. Try after some time.',"error");
					}
					//this.appService.onShowPreloader.emit(false);
				},(data:any) => {
					this.appService.onShowPreloader.emit(false);
					$.notify('Error on getting delivery times. Try after some time.',"error");
				});
				this.dataService.getPaymentMethods()
				.subscribe((data:any) => {
					if(data){
						this.paymentMethods = data;	
					} else {
						$.notify('Error on getting payment methods. Try after some time.',"error");
					}
					//this.appService.onShowPreloader.emit(false);
				},(data:any) => {
					this.appService.onShowPreloader.emit(false);
					$.notify('Error on getting payment methods. Try after some time.',"error");
				});
				this._deliverytime.value = 1;	
				this.getCartList();
			}
		} else {
			$.notify('Getting address list failed due to an error. Try after some time.',"error");
		}
		//this.appService.onShowPreloader.emit(false);
	},(data:any) => {
			this.appService.onShowPreloader.emit(false);
			$.notify('Getting address list failed due to an error. Try after some time.',"error");
	});
  }
  changeAddress(event){
		this.defaultAddress = this.addressList.filter((v) => { return v.status = event.target.value; })[0];
  }
  placeOrder(){
	  let _checkoutData = {
		  addressId: this._address.value,
		  shippingMethod: this._shippingmethod.value,
		  deliveryDate: "2018-08-03",//this._deliverydate.value,
		  deliveryTime: this._deliverytime.value,
		  paymentMethod: this._paymentmethod.value,
		  custId:this.appService.getCurrentUser(),
		  orderAmt:(this.productTotal + this.shippingFee) - this.discount
	  }
	  this.productService.placeOrder(_checkoutData)
		.subscribe((data: any) => {
			if(data){
				this.productService.onAddToCart.emit();
				let _url = '/dashboard/checkout/' + data;
				this.router.navigate([_url]);
			} else {
				$.notify('Unable to place order due to an error. Please try later','error');
			}
			this.appService.onShowPreloader.emit(false);
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			$.notify('Unable to place order due to an error. Please try later','error');
		});	
	  //console.log('_checkoutData: ',_checkoutData);
	  
  }
  navigateHome(){
	 this.router.navigate(['/']);
  }
  ngOnDestroy() {
    this.onRemoveFromCartSub.unsubscribe();
  }
}
