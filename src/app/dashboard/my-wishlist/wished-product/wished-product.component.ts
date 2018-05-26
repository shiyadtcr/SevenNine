import { Component, OnInit, Input } from '@angular/core';
import {ProductService} from '../../../shared';
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
  ) { }

  ngOnInit() {
	  this.productsInWishlist = this.productService.getProductsInWishlist();	  
  }
  
  addToCart(){
	  this.productService.addToCart(this.product.id,this.quantity);
  }
  removeWishlistItem(id){
	 this.productService.addToWishlist(this.product.id); 
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
