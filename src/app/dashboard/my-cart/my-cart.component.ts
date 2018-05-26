import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
import { Subscription } from 'rxjs';
import {ProductService} from '../../shared';
@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {
  productsInCart:any = {};
  private onRemoveFromCartSub: Subscription;
  constructor(
	private dashboardService:DashboardService,
	private productService:ProductService
  ) { }

  ngOnInit() {
	  this.dashboardService.pageTitle = 'My Cart'
	  this.productsInCart = this.productService.getProductsInCart();
	  this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((id) => {        
		this.productService.removeCartItem(id);
		this.productsInCart = this.productService.getProductsInCart();
		console.log("product service: ",this.productService.productsList);
		console.log("my cart: ",this.productsInCart);
      });
  }

}
