import { Component, OnInit } from '@angular/core';
import { routerTransitionTop } from '../router.animations';
import {DataService} from '../shared';
import {ProductService} from '../shared';
import { AppService } from '../app.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routerTransitionTop()]
})
export class HomeComponent implements OnInit {
  carouselOne: any = {
	  grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
	  slide: 2,
	  speed: 400,
	  interval: 4000,
	  point: {
		visible: true
	  },
	  load: 2,
	  touch: true,
	  loop: true,
	  custom: 'banner'
	};
	categoryList:any = [];
  constructor(
	private dataService:DataService,
	private appService:AppService,
	private productService:ProductService
  ) { }
  onCarouselLoad(){
	  
  }
  getProducinCart(){
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
  ngOnInit() {	  
	if(this.dataService.getCategoryList().length == 0){
		this.dataService.getNewCategoryList()
		.subscribe((data: any) => {
			this.categoryList = data;
			this.dataService.setCategoryList(data);
			this.dataService.onCategoryUpdate.emit(data);
			this.appService.onShowPreloader.emit(false);
		},(data: any) => {
			this.appService.onShowPreloader.emit(false);
		});
		this.getProducinCart();
	} else {
		this.categoryList = this.dataService.getCategoryList();
		this.getProducinCart();
	}	
  }

}
