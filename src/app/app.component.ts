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
	productsInCart:any = [];
	categoryList:any = [];
	categoryListHeight:number = 0;
	productTotal:number = 0;
	notifyCartItem:boolean = false;
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
		private router:Router
	) { }
	ngOnInit(){
	  this.onShowPreloaderSub = this.appService.onShowPreloader.subscribe((isVisible) => {        
		this.showPreloader = isVisible;
		this.cdRef.detectChanges();
	  });
	  this.onCategoryUpdateSub = this.dataService.onCategoryUpdate.subscribe((data) => {        
		this.categoryList = data;
	  });
	  this.onAddToCartSub = this.productService.onAddToCart.subscribe((data) => {        
		this.productsInCart = data;
		this.notifyCartItem = true;
		setTimeout(()=>{
			this.notifyCartItem = false;
		},1000);
		this.productTotal = this.productService.getCartProductsTotal();
	  });
	  this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((data) => {        
		this.productsInCart = data;
		this.productTotal = this.productService.getCartProductsTotal();
	  });
	  this.onSuccessLoginSub = this.loginService.onSuccessLogin.subscribe((data) => {        
			if(data == 'true'){
				this.hasUserLoggedIn = true;
			}  else {
				this.hasUserLoggedIn = false;
				this.appService.setCurrentUser(null);
				this.productService.setProductList([]);
				this.productService.setRedirectionMode(null);
				this.productService.setSelectedProduct(null);
				this.productService.setProductsInCart([]);
				this.productService.setProductsInWishlist([]);
			}
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
	logout(){
		this.loginService.setLoggedInStatus(false);		
		this.router.navigate(['/']);
	}
}
