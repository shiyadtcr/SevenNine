import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared';
import {SqueezeBoxModule} from 'squeezebox/dist';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orderHistory:any = [];
  constructor(
	private dataService:DataService,
  private appService:AppService
  ) { }

  ngOnInit() {
	  this.orderHistory = this.dataService.getOrderHistory();
    this.orderHistory.forEach((val,ind) => {
      val.products.forEach((v,i) => {
        if(val.products[i].imageUrl){
          val.products[i].imageUrl = this.appService.baseImageUrl + 'item/' + val.products[i].imageUrl;
        } else {
          val.products[i].imageUrl = this.appService.defaultImageUrl;
        }
      });
    });
  }

}
