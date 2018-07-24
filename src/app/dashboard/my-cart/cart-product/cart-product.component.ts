import { Component, OnInit, Input } from '@angular/core';
import {ProductService} from '../../../shared';
import {AppService} from '../../../app.service';
declare var $: any;
declare var navigator: any;
@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {
  @Input() product:any = {};
  productsInWishlist:any = [];
  quantity:number=1;
  incQuantitySpinner:boolean = false;
  decQuantitySpinner:boolean = false;
  constructor(
	private productService:ProductService,
	private appService:AppService
  ) { }
  ngOnInit() {
  }
  addToCart(){
	  this.productService.addToCartService(this.product.id,this.product.quantity,true)
		.subscribe((data: any) => {
			if(data.cartID){
				this.productService.addToCart(this.product,this.product.quantity); 
				this.productService.changeQuanity(this.product.id,this.product.quantity);
			} else {
				$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
			}
			this.incQuantitySpinner = false;
			this.decQuantitySpinner = false;
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			if(data.message){
				$.notify(data.message,'error');
			} else {
				$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
			}
			this.incQuantitySpinner = false;
			this.decQuantitySpinner = false;
		});	
  }
	alertDismissed(){
	  
  }
  incQuantity(){	
		if((this.quantity + this.product.quantity) < this.product.stock){
			this.product.quantity++;
			this.incQuantitySpinner = true;
			this.addToCart();
		} else {
			//alert('Max limit reached!');
			navigator.notification.alert(
				'Max limit reached!',  // message
				this.alertDismissed,         // callback
				'SevenNine - Mobile Super Market',            // title
				'OK'             // buttonName
			);
		}  	
  }
  decQuantity(){
	  if(this.product.quantity > 1){
		this.product.quantity--;
		this.decQuantitySpinner = true;
		this.addToCart();
	  }
  }  
  removeCartItem(){
	  this.productService.removeCartItemService(this.product.id)
		.subscribe((data: any) => {
			if(data){
				this.productService.removeCartItem(this.product.id);
				this.appService.onShowPreloader.emit(false);
				$.notify(this.product.title + " has been successfully removed from cart.",'success');
			} else {
				if(data.message){
					$.notify(data.message,'error');
				} else {
					$.notify('Product removing from cart failed due to an error. Try after some time.',"error");
				}
				this.appService.onShowPreloader.emit(false);
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			$.notify('Product removing from cart failed due to an error. Try after some time.',"error");
		});		 
  }
}
