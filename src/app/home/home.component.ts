import { Component, OnInit } from '@angular/core';
import { routerTransitionTop } from '../router.animations';
import {DataService} from '../shared';
import {ProductService} from '../shared';
import { AppService } from '../app.service';
import { LoginService } from '../shared';
//declare var $: any;
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
	private productService:ProductService,
	private loginService: LoginService
  ) { }
  onCarouselLoad(){
	  
  }
  
  ngOnInit() {	  
	this.dataService.getNewCategoryList()
	.subscribe((data: any) => {
		data.forEach(obj => {
			obj.imageUrl = this.appService.baseImageUrl + 'category/' + obj.imageUrl;
		});
		this.categoryList = data;
		this.dataService.setCategoryList(data);
		this.dataService.onCategoryUpdate.emit(data);
		this.appService.onShowPreloader.emit(false);
	},(data: any) => {
		this.appService.onShowPreloader.emit(false);
	});	
  }

}
