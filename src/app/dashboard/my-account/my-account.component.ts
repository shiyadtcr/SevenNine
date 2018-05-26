import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  changePassword:boolean = false;
  constructor(
	private dashboardService:DashboardService
  ) { }

  ngOnInit() {
	  this.dashboardService.pageTitle = "My Account";
  }

}
