import { Component, OnInit, Input } from '@angular/core';
import {ProductService} from '../../../shared';

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
  removeCartItem(id){
	 this.productService.removeCartItem(this.product.id); 
  }
}
