import { Component, ViewEncapsulation, ViewChild, OnInit, OnDestroy, NgZone  } from '@angular/core';
import {MatMenuTrigger} from '@angular/material';
import {DataService} from './shared';
import {ProductService} from './shared';
import { Subscription, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromEvent';
import { LoginService } from './shared';
import { AppService } from './app.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from './shared';
declare var $: any;
declare var window: any;
declare var navigator: any;
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
	private backbutton: BehaviorSubject<boolean>;
	private _openRight: boolean = false;
    private _openLeft: boolean = false;
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
		private router:Router,
		private zone: NgZone
	) { 
	  this.backbutton = new BehaviorSubject<boolean>(null);
      Observable.fromEvent(document, 'backbutton').subscribe(event => {
         this.zone.run(() => {
            this.onBackbutton();
         });
      });
	}
	onDeviceReady() {
		setTimeout(function() {
			navigator.splashscreen.hide();
		}, 1000);
    }
	onBackbutton() {
		//alert('this._openRight: ' + this._openRight + "this._openLeft: " + this._openLeft);
		if(this._openRight){
			this._openRight = false;
		} else if(this._openLeft){
			this._openLeft = false;
		} else {
			 if(window.location.href == 'file:///android_asset/www/'){
				//alert('yes');
				navigator.notification.confirm(
					'Are you sure to exit now?',  // message
					function(buttonIndex){
						if(buttonIndex == 2){
							navigator.app.exitApp();
						}
					},              // callback to invoke with index of button pressed
					'SevenNine - Mobile Super Market',            // title
					['No','Yes']          // buttonLabels
				);				
			} else {
				//alert('no');
				window.history.back();
			}	
		}
    }
	ngOnInit(){		
		 
		$.notify.defaults( {
			autoHideDelay: 2000
		});
		this.getProducinCart();
		this.getProducinWishlist();
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
	getProducinCart(){
	if(this.loginService.getLoggedInStatus()){
		this.productService.getProductsInCartService()
		.subscribe((data: any) => {
			if(data && data.length > 0){
				this.productService.setProductsInCart(data || []);
				this.appService.onShowPreloader.emit(false);
				//$.notify(data.message,'success');
			} else {
				this.productService.setProductsInCart([]);
				this.appService.onShowPreloader.emit(false);
				//$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			//$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
		});	
	}
  }
  getProducinWishlist(){
	if(this.loginService.getLoggedInStatus()){
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
				this.productService.setProductsInWishlist(data);
				this.appService.onShowPreloader.emit(false);
			} else {
				this.productService.setProductsInWishlist([]);
				this.appService.onShowPreloader.emit(false);
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
		});		
	}
  }
	navigateTo(url){
		this._openRight = false;
		this.router.navigate([url]);
	}
	removeCartItem(product){
		this.productService.removeCartItemService(product.id)
		.subscribe((data: any) => {
			if(data){
				this.productService.removeCartItem(product.id);
				this.appService.onShowPreloader.emit(false);
				$.notify(product.title + " has been successfully removed from cart.",'success');
			} else {
				if(data.message){
					$.notify(data.message,'error');
				} else {
					$.notify('Product removing from cart failed due to an error. Try after some time.',"error");
				}
				this.appService.onShowPreloader.emit(false);
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			$.notify('Product removing from cart failed due to an error. Try after some time.',"error");
		});
	  }
	ngOnDestroy(){
      //this.subscription.unsubscribe();
	    this.onAddToCartSub.unsubscribe;
		this.onRemoveFromCartSub.unsubscribe;
		this.onShowPreloaderSub.unsubscribe;
		this.onCategoryUpdateSub.unsubscribe;
    }
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
