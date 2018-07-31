import { Component, OnInit, Input, ViewEncapsulation  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {ProductService} from '../shared';
import {LoginService} from '../shared';
import {DataService} from '../shared';
import { CategoryFilterPipe } from '../shared';
import { routerTransitionTop } from '../router.animations';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [routerTransitionTop()] 
})
export class ProductListingComponent implements OnInit {
  categoryId:string;
  categoryData:any = {};
  productsList:any = [];
  
  
  private sub: any;
  private onRemoveFromCartSub: Subscription;
  private onAddToWishlistSub: Subscription;
  private onAddToCartSub: Subscription;
  private onRemoveFromWishlistSub: Subscription;
  constructor(
	private route: ActivatedRoute,
	private productService:ProductService,
	private dataService:DataService,
	private appService:AppService,
	private loginService:LoginService,
	private router : Router
  ) { }
  ngOnInit() {
	this.sub = this.route.params.subscribe(params => {
        this.categoryId = params['id'];
		this.categoryData = this.dataService.getCategoryById(this.categoryId);
		this.getProductsList();
		if(this.productService.getRedirectionMode() == "wishlist"){
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
		if(this.loginService.getLoggedInStatus()){
			if(this.productService.getSelectedProduct()){
				let selectedProd = this.productService.getSelectedProduct();
				switch(this.productService.getRedirectionMode()){					
					case 'cart':
						this.productService.getProductsInCartService()
						.subscribe((data: any) => {
							if(data && data.length > 0){
								this.productService.setProductsInCart(data || []);
								this.productService.addToCartService(selectedProd.id,this.productService.getSelectedQuantity(),false)
								.subscribe((data1: any) => {
									if(data1.cartID){
										//this.productService.addToCart(selectedProd.id,this.productService.getSelectedQuantity(),false);
										this.productService.onAddToCart.emit();
										this.productService.resetRedirectionData();
										this.appService.onShowPreloader.emit(false);
										$.notify(data1.message,'success');
									} else {
										this.appService.onShowPreloader.emit(false);
										if(data1.message){
											$.notify(data1.message,'error');
										} else {
											$.notify('Product adding to cart failed due to an error. Try after some time.','error');
										}
									}
								},(data1: any) => {
									this.appService.onShowPreloader.emit(false);
									$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
								});	
							} else {
								this.productService.setProductsInCart([]);
								this.appService.onShowPreloader.emit(false);
							}
						},(data: any) => {
							this.appService.onShowPreloader.emit(false);
						});	
						break;
					case 'wishlist':
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
								let prod = data.filter(function(item){
									return item.id == selectedProd.id;
								});	
								if(prod.length > 0){
									$.notify(selectedProd.title + ' already existing in wishlist.','error');
								} else {
									this.productService.addToWishlistService(selectedProd.id)
									.subscribe((data1: any) => {
										if(data1.wishID){
											//this.productService.addToWishlist(selectedProd);
											this.productService.onAddToWishlist.emit();
											this.productService.resetRedirectionData();
											this.appService.onShowPreloader.emit(false);
											$.notify(data1.message,'success');
										} else {
											this.appService.onShowPreloader.emit(false);
											$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
										}
									},(data1: any) => {
										this.appService.onShowPreloader.emit(false);
										$.notify('Product adding to cart failed due to an error. Try after some time.','error');
									});	
									//this.productService.setProductsInWishlist(data);
								}
							} else {
								this.productService.setProductsInWishlist([]);
								this.appService.onShowPreloader.emit(false);
							}
						},(data: any) => {
							this.appService.onShowPreloader.emit(false);
						});							
						break;
				}
				
			}	
		} else {
			this.productService.resetRedirectionData();
		}
		
    });
	this.onAddToCartSub = this.productService.onAddToCart.subscribe(() => {   	
		if(this.router.url.indexOf('/products/') != -1){
			this.getProductsList();
		}
	  });
	this.onAddToWishlistSub = this.productService.onAddToWishlist.subscribe((data) => {        
		if(this.router.url.indexOf('/products/') != -1){
			this.getProductsList();
		}
	  });
	  this.onRemoveFromWishlistSub = this.productService.onRemoveFromWishlist.subscribe((data) => {        
		if(this.router.url.indexOf('/products/') != -1){
			this.getProductsList();
		}
	  });
	this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((data) => {        
		if(this.router.url.indexOf('/products/') != -1){
			this.getProductsList();
		}
	  });
	  

  }
  getProductsList(){
		this.productService.getNewProductsByCategory(this.categoryId)
		.subscribe((data: any) => {
			this.productsList = data;
			this.productService.setProductList(data);
			this.appService.onShowPreloader.emit(false);
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
		});
	}
  ngOnDestroy() {
    this.sub.unsubscribe();
	this.onAddToCartSub.unsubscribe;
	this.onAddToWishlistSub.unsubscribe;
	this.onRemoveFromWishlistSub.unsubscribe;
	this.onRemoveFromCartSub.unsubscribe;
  }
}
