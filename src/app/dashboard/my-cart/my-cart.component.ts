import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import { Subscription } from 'rxjs';
import {ProductService} from '../../shared';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {
  productsInCart:any = {};
  private onRemoveFromCartSub: Subscription;
	private onAddToCartSub: Subscription;
  productTotal:number = 0;
  constructor(
	private dashboardService:DashboardService,
	private productService:ProductService,
	private appService:AppService,
	private router: Router
  ) { }

  ngOnInit() {
	  this.dashboardService.pageTitle = 'My Cart'
	  this.productService.getProductsInCartService()
		.subscribe((data: any) => {
			if(data && data.length > 0){
				this.productsInCart = data;
				//this.productService.setProductsInCart(data);
				this.productsInCart.forEach((v,i) => {
					if(this.productsInCart[i].imageUrl){
						this.productsInCart[i].imageUrl = this.appService.baseImageUrl + 'item/' + this.productsInCart[i].imageUrl;
					} else {
						this.productsInCart[i].imageUrl = this.appService.defaultImageUrl;
					}
				});
				this.productTotal = this.productService.getCartProductsTotal();
				this.appService.onShowPreloader.emit(false);
			} else {
				this.productsInCart = [];
				this.appService.onShowPreloader.emit(false);
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
		});	
	  this.onAddToCartSub = this.productService.onAddToCart.subscribe((data) => {        
		this.productsInCart = data;
		this.productTotal = this.productService.getCartProductsTotal();
	  });
   
	  this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((data) => {        
		this.productsInCart = data;
		this.productTotal = this.productService.getCartProductsTotal();
	  });
  }
  navigateHome(){
	 this.router.navigate(['/']);
  }
  ngOnDestroy() {
    this.onRemoveFromCartSub.unsubscribe();
  }

}
