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
	this.quantity++;
	this.productService.onIncQuantity.emit([this.product.id,this.quantity]);
  }
  decQuantity(){
	  if(this.quantity > 1){
		this.quantity--;
		this.productService.onDecQuantity.emit([this.product.id,this.quantity]);
	  }
  }
  removeCartItem(id){
	 this.productService.onRemoveFromCart.emit(this.product.id); 
  }
}
