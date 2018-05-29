import { Component, ViewEncapsulation, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {MatMenuTrigger} from '@angular/material';
import {DataService} from './shared';
import {ProductService} from './shared';
import { Subscription } from 'rxjs';
import { LoginService } from './shared';
import { AppService } from './app.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy{ 
	@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
	showPreloader: boolean = false;
	menuOpen: boolean = false;
	productsInCart:any = {};
	categoryList:any = [];
	categoryListHeight:number = 0;
	private onAddToCartSub: Subscription;
	private onRemoveFromCartSub: Subscription;
	private onShowPreloaderSub: Subscription;
	private onCategoryUpdateSub: Subscription;
	private onSuccessLoginSub: Subscription;
	hasUserLoggedIn:any = this.loginService.getLoggedInStatus();
	constructor(
		private dataService:DataService,
		private productService:ProductService,
		private loginService:LoginService,
		private appService:AppService,
		private cdRef:ChangeDetectorRef,
		private authGuard:AuthGuard,
		private router:Router
	) { }
	ngOnInit(){
	  this.productsInCart = this.productService.getProductsInCart();
	  this.onShowPreloaderSub = this.appService.onShowPreloader.subscribe((isVisible) => {        
		this.showPreloader = isVisible;
		this.cdRef.detectChanges();
	  });
	  this.onCategoryUpdateSub = this.dataService.onCategoryUpdate.subscribe((data) => {        
		this.categoryList = data;
	  });
	  this.onAddToCartSub = this.productService.onAddToCart.subscribe((data) => {        
		this.productsInCart = data;
	  });
	  this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((data) => {        
		this.productsInCart = data;
	  });
	  this.onSuccessLoginSub = this.loginService.onSuccessLogin.subscribe((data) => {        
		this.hasUserLoggedIn = data;
	  });
	  //this.productsInCart = this.dataService.getProductsInCart();
	  //this.productsInWishlist = this.dataService.getProductsInWishlist();
	 
    } 
	navigateTo(url){
		this._openRight = false;
		this.router.navigate([url]);
	}
	removeCartItem(id){
		this.productService.removeCartItem(id);
		this.productsInCart = this.productService.getProductsInCart();
		console.log("product service: ",this.productService.productsList);
	  }
	ngOnDestroy(){
      //this.subscription.unsubscribe();
	    this.onAddToCartSub.unsubscribe;
		this.onRemoveFromCartSub.unsubscribe;
		this.onShowPreloaderSub.unsubscribe;
		this.onCategoryUpdateSub.unsubscribe;
    }
	
	openMyMenu() {
		this.trigger.openMenu();
	  } 
	  closeMyMenu() {
		this.trigger.closeMenu();
	  } 
   private _openRight: boolean = false;
   private _openLeft: boolean = false;
 
  private _toggleRightSidebar() {
    this._openRight = !this._openRight;
  }
  private _toggleLeftSidebar() {
    this._openLeft = !this._openLeft;
  }
  toggleMenu(){
	this.menuOpen = !this.menuOpen; 
	if(this.menuOpen){
		this.categoryListHeight = this.categoryList.length * 53.4;
	}	else {
		this.categoryListHeight = 0;
	}
  }
}
