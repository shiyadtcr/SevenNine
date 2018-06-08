import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import {ProductService} from '../../shared';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
declare var $: any;
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
	  this.productService.getProductsInWishlistService()
		.subscribe((data: any) => {
			if(data && data.length > 0){
				data.forEach(obj => {
					if(obj.imageUrl){
						obj.imageUrl = this.appService.baseImageUrl + 'item/' + obj.imageUrl;
					} else {
						obj.imageUrl = this.appService.defaultImageUrl;
					}
				});
				this.productsInWishlist = data;
				//this.productService.setProductsInWishlist(data);
				this.appService.onShowPreloader.emit(false);
				$.notify(data.message,'success');
			} else {
				this.productsInWishlist = [];
				this.appService.onShowPreloader.emit(false);
				$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
		});	
	  
	  this.onRemoveFromWishlistSub = this.productService.onRemoveFromWishlist.subscribe((data) => {        
		this.productsInWishlist = data;
	  });
  }
  ngOnDestroy() {
    this.onRemoveFromWishlistSub.unsubscribe();
  }
}
