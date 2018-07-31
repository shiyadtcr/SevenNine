import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../shared';
import { LoginService } from '../shared';
import { AppService } from '../app.service';
import { routerTransitionTop } from '../router.animations';
import { RatingModule } from "ngx-rating";
declare var $: any;
declare var navigator: any;
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  animations: [routerTransitionTop()]
})
export class ProductDetailsComponent implements OnInit {
  private sub: any;
  productId:string;
  productData:any = {};
  quantity:number = 1;
	cartSpinner:boolean = false;
  wishlistSpinner:boolean = false;
  private onAddToWishlistSub: Subscription;
  private onRemoveFromWishlistSub: Subscription;
  constructor(
	private route: ActivatedRoute,
	private productService: ProductService,
	private appService: AppService,
	private loginService: LoginService,
	private router: Router
  ) { }

  ngOnInit() {
	  this.sub = this.route.params.subscribe(params => {
        this.productId = params['productid'];
		this.productService.getSelectedDetailedProductService(this.productId)
		.subscribe((data: any) => {
			if(data){
				if(data.imageUrl){
					data.imageUrl = this.appService.baseImageUrl + 'item/' + data.imageUrl;
				} else {
					data.imageUrl = this.appService.defaultImageUrl;
				}
				this.productData = data; 				
				if(this.loginService.getLoggedInStatus()){
					if(this.productService.getSelectedProduct()){
						switch(this.productService.getRedirectionMode()){
							case 'cart':
								this.cartSpinner = true;
								this.productService.addToCartService(this.productService.getSelectedProduct().id,this.productService.getSelectedQuantity(),false)
								.subscribe((data: any) => {
									if(data.cartID){
										//this.productService.addToCart(this.productService.getSelectedProduct().id,this.productService.getSelectedQuantity(),false);  
										this.productService.onAddToCart.emit();
										this.productService.resetRedirectionData();
										//this.appService.onShowPreloader.emit(false);										
										$.notify(this.productData.title + " has been successfully added to cart.","success");
									} else {
										//this.appService.onShowPreloader.emit(false);
										$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
									}
									this.cartSpinner = false;
								},(data: any) => {
									//this.appService.onShowPreloader.emit(false);
									this.cartSpinner = false;
									$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
								});	
								//alert(this.productService.getSelectedProduct().title + ' ' + this.productService.getSelectedQuantity() + ' item(s) added to the cart!');
								break;
							case 'wishlist':
								this.wishlistSpinner = true;
								this.productService.addToWishlistService(this.productService.getSelectedProduct())
								.subscribe((data: any) => {
									if(data.wishID){
										//this.productService.addToWishlist(this.productService.getSelectedProduct());
										this.productService.onAddToWishlist.emit();
										this.productService.resetRedirectionData();
										//this.appService.onShowPreloader.emit(false);
										$.notify(this.productData.title + " has been successfully added to wish list.","success");
									} else {
										//this.appService.onShowPreloader.emit(false);
										$.notify('Product adding to wishlist failed due to an error. Try after some time.',"error");
									}
									this.wishlistSpinner = false;
								},(data: any) => {
									//this.appService.onShowPreloader.emit(false);
									this.wishlistSpinner = true;
									$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
								});	
								//alert(this.productService.getSelectedProduct().title + ' has been added to the wishlist!' )
								break;
						}				
					} else {
						this.appService.onShowPreloader.emit(false);
					}
				} else {
					this.productService.resetRedirectionData();
					this.appService.onShowPreloader.emit(false);
				}
				this.appService.onShowPreloader.emit(false);
			} else {
				this.appService.onShowPreloader.emit(false);
				$.notify('Getting product details failed due to an error. Try after some time.',"error");
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			$.notify('Getting product details failed due to an error. Try after some time.',"error");
		});	
    });
	 this.onAddToWishlistSub = this.productService.onAddToWishlist.subscribe((data) => {
		this.productData = this.productService.getSelectedDetailedProduct();
	  });
	  this.onRemoveFromWishlistSub = this.productService.onRemoveFromWishlist.subscribe((data) => {   
		this.productData.isFavorate = false;
	  }); 
  }
  alertDismissed(){
	  
  }
  incQuantity(){
   if((this.quantity + this.productData.quantity) < this.productData.stock){
		this.quantity++;
	} else {
		//alert('Max limit reached!');
		navigator.notification.alert(
			'Max limit reached!',  // message
			this.alertDismissed,         // callback
			'SevenNine - Mobile Super Market',            // title
			'OK'             // buttonName
		);
	}
  }
  decQuantity(){
	  if(this.quantity > 1){
		this.quantity--;
	  }
  }
  addToCart(){
	  if(this.loginService.getLoggedInStatus()){	
			this.cartSpinner = true;
		this.productService.addToCartService(this.productData.id,this.quantity,false)
		.subscribe((data: any) => {
			if(data.cartID){
				//this.productService.addToCart(this.productData,this.quantity,false);  
				this.productService.onAddToCart.emit();
				//this.appService.onShowPreloader.emit(false);
				$.notify(this.productData.title + " has been successfully updated in cart.","success");
			} else {
				//this.appService.onShowPreloader.emit(false);
				$.notify('Product adding to cart failed due to an error. Try after some time.','error');
			}
			this.cartSpinner = false;
		},(data: any) => {
			//this.appService.onShowPreloader.emit(false);
			this.cartSpinner = false;
			$.notify('Product adding to cart failed due to an error. Try after some time.','error');
		});	
	  } else {
		this.appService.setRedirectionUrl(this.router.url);
		this.productService.setSelectedProduct(this.productData);
		this.productService.setSelectedQuantity(this.quantity);
		this.productService.setRedirectionMode('cart');
		this.router.navigate(['/login']);
	  }
  }
  addToWishlist(){	  
	  if(this.loginService.getLoggedInStatus() == 'true'){
		this.productData.isFavorate = true;
		this.productService.addToWishlistService(this.productData.id)
		.subscribe((data: any) => {
			if(data.wishID){
				//this.productService.addToWishlist(this.productData);  
				this.productService.onAddToWishlist.emit();
				$.notify(this.productData.title + " has been successfully updated in wish list.","success");
			} else {
				//this.appService.onShowPreloader.emit(false);
				$.notify('Product add/remove to wishlist failed due to an error. Try after some time.','error');
			}
			this.wishlistSpinner = false;
		},(data: any) => {
			//this.appService.onShowPreloader.emit(false);
			this.wishlistSpinner = false;
			$.notify('Product add/remove to wishlist failed due to an error. Try after some time.','error');
		});	
	  } else {
		this.appService.setRedirectionUrl(this.router.url);
		this.productService.setSelectedProduct(this.productData);
		this.productService.setRedirectionMode('wishlist');
		this.router.navigate(['/login']);
	  }
  }
	saveRating(){
		let postData = {
			custId:this.appService.getCurrentUser(),
			prodId:this.productData.id,
			rating:this.productData.rating,
			comment:this.productData.comment
		}
		this.productService.saveRating(postData)
		.subscribe((data: any) => {
			if(data){
				$.notify('Thank you for rating the product.','success');	
				this.productService.getSelectedDetailedProductService(this.productId)
				.subscribe((data: any) => {
					if(data){
						if(data.imageUrl){
							data.imageUrl = this.appService.baseImageUrl + 'item/' + data.imageUrl;
						} else {
							data.imageUrl = this.appService.defaultImageUrl;
						}
						this.productData = data; 
					} 
					this.appService.onShowPreloader.emit(false);
				},(data: any) => {
					this.appService.onShowPreloader.emit(false);
					$.notify('Getting product details failed due to an error. Try after some time.',"error");
				});	
			} else {
				this.appService.onShowPreloader.emit(false);
				$.notify('Uanable to rate product due to an error. Try after some time.','error');
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			$.notify('Uanable to rate product due to an error. Try after some time.','error');
		});	

	}
}
