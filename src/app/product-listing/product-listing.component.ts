import { Component, OnInit, Input, ViewEncapsulation  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import {ProductService} from '../shared';
import {DataService} from '../shared';
import { CategoryFilterPipe } from '../shared';
import { routerTransitionTop } from '../router.animations';
import { AppService } from '../app.service';
@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CategoryFilterPipe],
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
	private appService:AppService
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
				this.productsList = data;
				this.productService.setProductList(data);
				this.appService.onShowPreloader.emit(false);
			},(data: any) => {
				this.appService.onShowPreloader.emit(false);
			});
		} else {
			this.productsList = this.productService.getProductsList();
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
  }
}
