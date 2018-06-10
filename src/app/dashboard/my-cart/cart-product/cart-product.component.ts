import { Component, OnInit, Input } from '@angular/core';
import {ProductService} from '../../../shared';
import {AppService} from '../../../app.service';
declare var $: any;
@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {
  @Input() product:any = {};
  productsInWishlist:any = [];
  quantity:number=1;
  constructor(
	private productService:ProductService,
	private appService:AppService
  ) { }
  ngOnInit() {
  }
  incQuantity(){	  
	this.product.quantity++;
	this.productService.changeQuanity(this.product.id,this.product.quantity);
  }
  decQuantity(){
	  if(this.product.quantity > 1){
		this.product.quantity--;
		this.productService.changeQuanity(this.product.id,this.product.quantity);
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
