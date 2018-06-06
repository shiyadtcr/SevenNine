import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import { Subscription } from 'rxjs';
import {ProductService} from '../../shared';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {
  productsInCart:any = {};
  private onRemoveFromCartSub: Subscription;
  productTotal:number = 0;
  constructor(
	private dashboardService:DashboardService,
	private productService:ProductService,
	private appService:AppService
  ) { }

  ngOnInit() {
	  this.dashboardService.pageTitle = 'My Cart'
	  this.productService.getProductsInCartService()
		.subscribe((data: any) => {
			if(data && data.length > 0){
				this.productsInCart = data;
				//this.productService.setProductsInCart(data);
				this.productTotal = this.productService.getCartProductsTotal();
				this.appService.onShowPreloader.emit(false);
				//$.notify(data.message,'success');
			} else {
				this.productsInCart = [];
				this.appService.onShowPreloader.emit(false);
				//$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			//$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
		});	
	  this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((data) => {        
		this.productsInCart = data;
		this.productTotal = this.productService.getCartProductsTotal();
	  });
   
	  this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((data) => {        
		this.productsInCart = data;
		this.productTotal = this.productService.getCartProductsTotal();
	  });
  }
  ngOnDestroy() {
    this.onRemoveFromCartSub.unsubscribe();
  }

}
