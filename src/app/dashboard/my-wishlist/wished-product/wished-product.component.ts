import { Component, OnInit, Input } from '@angular/core';
import {ProductService} from '../../../shared';
import {AppService} from '../../../app.service';
declare var $: any;
@Component({
  selector: 'app-wished-product',
  templateUrl: './wished-product.component.html',
  styleUrls: ['./wished-product.component.scss']
})
export class WishedProductComponent implements OnInit {
  @Input() product:any = {};
  productsInWishlist:any = [];
  quantity:number = 1;
  constructor(
	private productService:ProductService,
	private appService:AppService
  ) { }

  ngOnInit() {
	  this.productsInWishlist = this.productService.getProductsInWishlist();	  
  }
  
  addToCart(){
	  this.productService.addToCartService(this.product.id,this.quantity)
		.subscribe((data: any) => {
			if(data.cartID){
				this.productService.addToCart(this.product,this.quantity); 
				this.appService.onShowPreloader.emit(false);
				$.notify(data.message,"success");
			} else {
				this.appService.onShowPreloader.emit(false);
				$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
		});	
  }
  removeWishlistItem(id){
	 this.productService.addToWishlistService(this.product.id)
	.subscribe((data: any) => {
		if(data.wishID){
			this.productService.addToWishlist(this.product.id);
			this.appService.onShowPreloader.emit(false);
			$.notify(data.message,"success");
		} else {
			this.appService.onShowPreloader.emit(false);
			$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
		}
		
	},(data: any) => {
		this.appService.onShowPreloader.emit(false);
		$.notify('Product adding to cart failed due to an error. Try after some time.','error');
	});	
  }
  incQuantity(){	  
	this.quantity++;
  }
  decQuantity(){
	  if(this.quantity > 1){
		this.quantity--;
	  }
  }
}
