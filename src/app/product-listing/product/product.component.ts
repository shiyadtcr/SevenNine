import { Component, OnInit, Input, EventEmitter  } from '@angular/core';
import { ProductService } from '../../shared';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product;
  @Input() categoryId:string = '';
  quantity:number = 1;
  constructor(
	private productService: ProductService,
	private appService:AppService
) { }

  ngOnInit() {
	  console.log(this.product);
	  
  }
  incQuantity(){	  
	this.quantity++;
	//this.productService.onIncQuantity.emit([this.product.id,this.quantity]);
  }
  decQuantity(){
	  if(this.quantity > 1){
		this.quantity--;
		//this.productService.onDecQuantity.emit([this.product.id,this.quantity]);
	  }
  }
  addToCart(){
	  this.productService.onAddToCart.emit([this.product.id,this.quantity]);
	  //this.productService.addToCart(this.product,this.quantity);
  }
  addToWishlist(){
	  this.productService.onAddToWishlist.emit(this.product.id);
	  //this.productService.addToWishlist(this.product);
  }
}
