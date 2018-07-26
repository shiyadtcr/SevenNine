import { Component, OnInit, Input, EventEmitter  } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../shared';
import { AppService } from '../../app.service';
import { LoginService } from '../../shared';
import { Router } from '@angular/router';
declare var $: any;
declare var navigator: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product;
  @Input() categoryId:string = '';
  quantity:number = 1;
  cartSpinner:boolean = false;
  wishlistSpinner:boolean = false;
  constructor(
	private productService: ProductService,
	private appService:AppService,
	private router: Router,
	private loginService: LoginService
  ) { }

  ngOnInit() {
	  console.log(this.product);	  
  }
  alertDismissed(){
	  
  }
  incQuantity(){	
	if((this.quantity + this.product.quantity) < this.product.stock){
		this.quantity++;
	} else {
		//alert('Max limit reached!');
		navigator.notification.alert(
			'Stock limit reached!',  // message
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
  addToCart(){
	  if(this.loginService.getLoggedInStatus()){
		  this.cartSpinner = true;
		this.productService.addToCartService(this.product.id,this.quantity,false)
		.subscribe((data: any) => {
			if(data.cartID){
				this.productService.addToCart(this.product,this.quantity); 
				//this.appService.onShowPreloader.emit(false);
				$.notify(this.product.title + " has been successfully updated in cart.","success");
			} else {
				//this.appService.onShowPreloader.emit(false);
				if(data.message){
					$.notify(data.message,'error');
				} else {
					$.notify('Product add/remove to cart failed due to an error. Try after some time.',"error");
				}
			}
			this.cartSpinner = false;
		},(data: any) => {
			//this.appService.onShowPreloader.emit(false);
			$.notify('Product add/remove to cart failed due to an error. Try after some time.',"error");
			this.cartSpinner = false;
		});		
	  } else {
		this.appService.setRedirectionUrl(this.router.url);
		this.productService.setSelectedProduct(this.product);
		this.productService.setSelectedQuantity(this.quantity);
		this.productService.setRedirectionMode('cart');
		this.router.navigate(['/login']);
	  }
  }
  addToWishlist(){	  
	  if(this.loginService.getLoggedInStatus() == 'true'){
		this.wishlistSpinner = true;
		this.productService.addToWishlistService(this.product.id)
		.subscribe((data: any) => {
			if(data.wishID){
				this.productService.addToWishlist(this.product);
				//this.appService.onShowPreloader.emit(false);
				$.notify(this.product.title + " has been successfully updated in wish list.","success");
			} else {
				//this.appService.onShowPreloader.emit(false);
				if(data.message){
					$.notify(data.message,'error');
				} else {
					$.notify('Product add/remove to wishlist failed due to an error. Try after some time.','error');
				}
			}
			this.wishlistSpinner = false;
		},(data: any) => {
			//this.appService.onShowPreloader.emit(false);
			$.notify('Product add/remove to cart failed due to an error. Try after some time.','error');
			this.wishlistSpinner = false;
		});	
	  } else {
		this.appService.setRedirectionUrl(this.router.url);
		this.productService.setSelectedProduct(this.product);
		this.productService.setRedirectionMode('wishlist');
		this.router.navigate(['/login']);
	  }
  }
  ngOnDestroy() {
  }
  
}
