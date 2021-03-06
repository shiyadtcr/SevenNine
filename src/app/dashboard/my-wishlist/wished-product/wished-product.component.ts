import { Component, OnInit, Input } from '@angular/core';
import {ProductService} from '../../../shared';
import {AppService} from '../../../app.service';
declare var $: any;
declare var navigator: any;
@Component({
  selector: 'app-wished-product',
  templateUrl: './wished-product.component.html',
  styleUrls: ['./wished-product.component.scss']
})
export class WishedProductComponent implements OnInit {
  @Input() product:any = {};
  productsInWishlist:any = [];
  quantity:number = 1;
  cartSpinner:boolean = false;
  constructor(
	private productService:ProductService,
	private appService:AppService
  ) { }

  ngOnInit() {
	  this.productsInWishlist = this.productService.getProductsInWishlist();	  
  }
  
  addToCart(){
			if((this.quantity + this.product.quantity) < this.product.stock){
				this.cartSpinner = true;
				this.productService.addToCartService(this.product.id,this.quantity,false)
				.subscribe((data: any) => {
					if(data.cartID){
						//this.productService.addToCartFromWislist(this.product,this.quantity); 
						this.productService.onAddToCart.emit();
						this.appService.onShowPreloader.emit(false);
						$.notify(this.product.title + " has been successfully added to cart.","success");
					} else {
						this.appService.onShowPreloader.emit(false);
						$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
					}
					this.cartSpinner = false;
				},(data: any) => {
					this.appService.onShowPreloader.emit(false);
					if(data.message){
						$.notify(data.message,'error');
					} else {
						$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
					}
					this.cartSpinner = false;
				});
			} else {
				//alert('Max limit reached!');
				navigator.notification.alert(
					'Stock not available!',  // message
					this.alertDismissed,         // callback
					'SevenNine - Mobile Super Market',            // title
					'OK'             // buttonName
				);
			}	  	
  }
  removeWishlistItem(){
	 this.productService.addToWishlistService(this.product.id)
	.subscribe((data: any) => {
		if(data.wishID){
			//this.productService.addToWishlist(this.product);
			this.productService.onAddToWishlist.emit();
			this.appService.onShowPreloader.emit(false);
			$.notify(this.product.title + " has been successfully added to wish list.","success");
		} else {
			this.appService.onShowPreloader.emit(false);
			if(data.message){
				$.notify(data.message,'error');
			} else {
				$.notify('Product removal from wis hlist failed due to an error. Try after some time.','error');
			}
		}
		
	},(data: any) => {
		this.appService.onShowPreloader.emit(false);
		$.notify('Product removal from wish list failed due to an error. Try after some time.','error');
	});	
  }
  alertDismissed(){
	  
  }
  incQuantity(){    
	if((this.quantity + this.product.quantity) < this.product.stock){
		this.quantity++;
	} else {
		//alert('Max limit reached!');
		navigator.notification.alert(
			'Stock not available!',  // message
			this.alertDismissed,         // callback
			'SevenNine - Mobile Super Market',            // title
			'OK'             // buttonName
		);
	}
	//this.productService.onIncQuantity.emit([this.product.id,this.quantity]);
  }
  decQuantity(){
	  if(this.quantity > 1){
		this.quantity--;
		//this.productService.onDecQuantity.emit([this.product.id,this.quantity]);
	  }
  }
}
