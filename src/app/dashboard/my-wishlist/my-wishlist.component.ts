import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import {ProductService} from '../../shared';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
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
	private productService:ProductService,
	private appService:AppService
  ) { }

  ngOnInit() {
	  this.dashboardService.pageTitle = "My Wishlist";
	 	this.getWishlist();
	  
			this.onRemoveFromWishlistSub = this.productService.onAddToWishlist.subscribe((data) => {        
				this.getWishlist();
			});
  }
	getWishlist(){
		  this.productService.getProductsInWishlistService()
			.subscribe((data: any) => {
				if(data && data.length > 0){
					this.productsInWishlist = data;
					this.productsInWishlist.forEach((v,i) => {
						if(this.productsInWishlist[i].imageUrl){
							this.productsInWishlist[i].imageUrl = this.appService.baseImageUrl + 'item/' + this.productsInWishlist[i].imageUrl;
						} else {
							this.productsInWishlist[i].imageUrl = this.appService.defaultImageUrl;
						}
					});
					//this.productService.setProductsInWishlist(data);
					this.appService.onShowPreloader.emit(false);
				} else {
					this.productsInWishlist = [];
					this.appService.onShowPreloader.emit(false);
				}
			},(data: any) => {
				this.appService.onShowPreloader.emit(false);
			});	
	 }
  ngOnDestroy() {
    this.onRemoveFromWishlistSub.unsubscribe();
  }
}
