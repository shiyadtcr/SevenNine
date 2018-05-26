import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {ProductService} from '../shared';
import { routerTransitionTop } from '../router.animations';
import {RatingModule} from "ngx-rating";
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  animations: [routerTransitionTop()]
})
export class ProductDetailsComponent implements OnInit {
  private sub: any;
  productId:string;
  productData:any = {};
  quantity:number = 1;
  constructor(
	private route: ActivatedRoute,
	private productService: ProductService
  ) { }

  ngOnInit() {
	  this.sub = this.route.params.subscribe(params => {
        this.productId = params['productid'];
		this.productData = {
			id : "1",
			categoryId:1,
			imageUrl:"alleppey.jpg",
			isFavorate:false,
			price:259,
			quantity:0,
			title:'Home Style Ganapathi Gift FU99',
			rating:3
		};
       // In a real app: dispatch action to load the details here.
    });
	  
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
	  this.productService.addToCart(this.productData.id,this.quantity);
	  //this.productService.addToCart(this.product,this.quantity);
  }
  addToWishlist(){
	  this.productService.addToWishlist(this.productData.id);
	  this.productData.isFavorate = !this.productData.isFavorate;
	  /* if(this.productData.isFavorate == false){
		this.productService.removeWishlistItem(this.productData.id);
	  }	   */
  }

}
