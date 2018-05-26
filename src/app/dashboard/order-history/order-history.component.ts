import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared';
import {SqueezeBoxModule} from 'squeezebox/dist';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orderHistory:any = [];
  constructor(
	private dataService:DataService
  ) { }

  ngOnInit() {
	  this.orderHistory = this.dataService.getOrderHistory();
  }

}
