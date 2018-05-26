import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import {ProductService} from '../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.scss']
})
export class MyWishlistComponent implements OnInit {
  productsInWishlist:any = {};
  private onRemoveFromWishlistSub: Subscription;
  constructor(
	private dashboardService:DashboardService,
	private productService:ProductService
  ) { }

  ngOnInit() {
	  this.dashboardService.pageTitle = "My Wishlist";
	  this.productsInWishlist = this.productService.getProductsInWishlist();
	  this.onRemoveFromWishlistSub = this.productService.onRemoveFromWishlist.subscribe((id) => {        
		this.productService.removeWishlistItem(id);
		this.productsInWishlist = this.productService.getProductsInWishlist();
		console.log("product service: ",this.productService.productsList);
		console.log("my cart: ",this.productsInWishlist);
      });
  }
}
