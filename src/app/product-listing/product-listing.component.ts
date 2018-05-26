import { Component, OnInit, Input, ViewEncapsulation  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {ProductService} from '../shared';
import {DataService} from '../shared';
import { CategoryFilterPipe } from '../shared';
import { Subscription } from 'rxjs';
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
  private onAddToWishlistSub: Subscription;
  productsList:any = [];
  
  private sub: any;
  constructor(
	private route: ActivatedRoute,
	private productService:ProductService,
	private dataService:DataService,
	private appService:AppService
  ) { }
  ngOnInit() {
	this.sub = this.route.params.subscribe(params => {
        this.categoryId = params['id'];
		this.categoryData = this.dataService.getCategoryById(this.categoryId);
		this.productService.getProductsByCategory(this.categoryId)
		.subscribe((data: any) => {
			this.productsList = data;
			this.productService.setProductList(data);
			this.appService.onShowPreloader.emit(false);
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
		});
    });
	this.onAddToWishlistSub = this.productService.onAddToWishlist.subscribe((product) => {        
		this.productService.addToWishlist(product);
		this.productsList = this.productService.getProductsList();
		console.log("product service: ",this.productService.getProductsList());
	  });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
