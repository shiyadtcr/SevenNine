import { Component, OnInit, Input, ViewEncapsulation  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {ProductService} from '../shared';
import {LoginService} from '../shared';
import {DataService} from '../shared';
import { CategoryFilterPipe } from '../shared';
import { routerTransitionTop } from '../router.animations';
import { AppService } from '../app.service';
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
  private onRemoveFromWishlistSub: Subscription;
  constructor(
	private route: ActivatedRoute,
	private productService:ProductService,
	private dataService:DataService,
	private appService:AppService,
	private loginService:LoginService
  ) { }
  ngOnInit() {
	this.sub = this.route.params.subscribe(params => {
        this.categoryId = params['id'];
		if(this.productService.getSelectedCategory() != this.categoryId){
			this.productService.setProductList([]);
		}
		this.productService.setSelectedCategory(this.categoryId);
		
		this.categoryData = this.dataService.getCategoryById(this.categoryId);
		if(this.productService.getProductsList().length == 0){
			this.productService.getNewProductsByCategory(this.categoryId)
			.subscribe((data: any) => {
				data.forEach(obj => {
					if(obj.imageUrl){
						obj.imageUrl = this.appService.baseImageUrl + 'item/' + obj.imageUrl;
					} else {
						obj.imageUrl = this.appService.defaultImageUrl;
					}
				});
				this.productsList = data;
				this.productService.setProductList(data);
				this.appService.onShowPreloader.emit(false);
			},(data: any) => {
				this.appService.onShowPreloader.emit(false);
			});
		} else {
			this.productsList = this.productService.getProductsList();
		}
		if(this.loginService.getLoggedInStatus()){
			if(this.productService.getSelectedProduct()){
				switch(this.productService.getRedirectionMode()){
					case 'cart':
						this.productService.addToCartService(this.productService.getSelectedProduct().id,this.productService.getSelectedQuantity())
						.subscribe((data: any) => {
							if(data.cartID){
								this.productService.addToCart(this.productService.getSelectedProduct().id,this.productService.getSelectedQuantity());  
								this.productService.resetRedirectionData();
								this.appService.onShowPreloader.emit(false);
								$.notify(data.message,'success');
							} else {
								this.appService.onShowPreloader.emit(false);
								$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
							}
						},(data: any) => {
							this.appService.onShowPreloader.emit(false);
							$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
						});	
						//alert(this.productService.getSelectedProduct().title + ' ' + this.productService.getSelectedQuantity() + ' item(s) added to the cart!');
						break;
					case 'wishlist':
						this.productService.addToWishlistService(this.productService.getSelectedProduct().id)
						.subscribe((data: any) => {
							if(data.wishID){
								this.productService.addToWishlist(this.productService.getSelectedProduct().id);
								this.productService.resetRedirectionData();
								this.appService.onShowPreloader.emit(false);
								$.notify(data.message,'success');
							} else {
								this.appService.onShowPreloader.emit(false);
								$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
							}
						},(data: any) => {
							this.appService.onShowPreloader.emit(false);
							$.notify('Product adding to cart failed due to an error. Try after some time.','error');
						});	
						//alert(this.productService.getSelectedProduct().title + ' has been added to the wishlist!' )
						break;
				}
				
			}	
		} else {
			this.productService.resetRedirectionData();
		}
		
    });
	this.onAddToWishlistSub = this.productService.onAddToWishlist.subscribe((data) => {        
		this.productsList = this.productService.getProductsList();
	  });
	  this.onRemoveFromWishlistSub = this.productService.onRemoveFromWishlist.subscribe((data) => {        
		this.productsList = this.productService.getProductsList();
	  });
	this.onRemoveFromCartSub = this.productService.onRemoveFromCart.subscribe((data) => {        
		this.productsList = this.productService.getProductsList();
	  });
	  

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
	this.onAddToWishlistSub.unsubscribe;
	this.onRemoveFromWishlistSub.unsubscribe;
	this.onRemoveFromCartSub.unsubscribe;
  }
}
