import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../shared';
import { LoginService } from '../shared';
import { AppService } from '../app.service';
import { routerTransitionTop } from '../router.animations';
import { RatingModule } from "ngx-rating";
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
		this.productData = this.productService.getSelectedDetailedProduct();
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
								//$.notify(data.message,"success");
							} else {
								this.appService.onShowPreloader.emit(false);
								//$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
							}
						},(data: any) => {
							this.appService.onShowPreloader.emit(false);
							//$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
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
								//$.notify(data.message,"success");
							} else {
								this.appService.onShowPreloader.emit(false);
								//$.notify('Product adding to wishlist failed due to an error. Try after some time.',"error");
							}
						},(data: any) => {
							this.appService.onShowPreloader.emit(false);
							//$.notify('Product adding to cart failed due to an error. Try after some time.',"error");
						});	
						//alert(this.productService.getSelectedProduct().title + ' has been added to the wishlist!' )
						break;
				}				
			}	
		} else {
			this.productService.resetRedirectionData();
		}
       // In a real app: dispatch action to load the details here.
    });
	 this.onAddToWishlistSub = this.productService.onAddToWishlist.subscribe((data) => {
		this.productData = this.productService.getSelectedDetailedProduct();
	  });
	  this.onRemoveFromWishlistSub = this.productService.onRemoveFromWishlist.subscribe((data) => {   
		this.productData.isFavorate = false;
	  }); 
  }
  incQuantity(){	  
	this.quantity++;
  }
  decQuantity(){
	  if(this.quantity > 1){
		this.quantity--;
	  }
  }
  addToCart(){
	  if(this.loginService.getLoggedInStatus()){	
		this.productService.addToCartService(this.productData.id,this.quantity)
		.subscribe((data: any) => {
			if(data.cartID){
				this.productService.addToCart(this.productData.id,this.quantity);  
				this.appService.onShowPreloader.emit(false);
				//$.notify(data.message,'success');
			} else {
				this.appService.onShowPreloader.emit(false);
				//$.notify('Product adding to cart failed due to an error. Try after some time.','error');
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			//$.notify('Product adding to cart failed due to an error. Try after some time.','error');
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
				this.productService.setSelectedDetailedProduct(this.productData);
				this.productService.addToWishlist(this.productData.id);  
				//$.notify(data.message,'success');
			} else {
				this.appService.onShowPreloader.emit(false);
				//$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
			}
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
			//$.notify('Product adding to wishlist failed due to an error. Try after some time.','error');
		});	
	  } else {
		this.appService.setRedirectionUrl(this.router.url);
		this.productService.setSelectedProduct(this.productData);
		this.productService.setRedirectionMode('wishlist');
		this.router.navigate(['/login']);
	  }
  }

}
