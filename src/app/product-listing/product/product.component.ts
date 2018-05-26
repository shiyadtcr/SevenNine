import { Component, OnInit, Input, EventEmitter  } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../shared';
import { AppService } from '../../app.service';
import { LoginService } from '../../shared';
import { Router } from '@angular/router';
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
	private appService:AppService,
	private router: Router
	private loginService: LoginService
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
	  if(this.loginService.getLoggedInStatus()){
		this.productService.addToCart(this.product.id,this.quantity);  
	  } else {
		this.appService.setRedirectionUrl(this.router.url);
		this.productService.setSelectedProduct(this.product);
		this.productService.setSelectedQuantity(this.quantity);
		this.productService.setRedirectionMode('cart');
		this.router.navigate(['/login']);
	  }
  }
  addToWishlist(){	  
	  if(this.loginService.getLoggedInStatus()){
		this.productService.addToWishlist(this.product.id);  
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
