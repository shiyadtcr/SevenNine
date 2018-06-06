import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {
  private sub: any;
  orderId: string = '';
  constructor(
	private route: ActivatedRoute	
  ) { }

  ngOnInit() {
	  this.sub = this.route.params.subscribe(params => {
        this.orderId = params['orderid'];
		
	  });
  }

}
