import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../shared';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {  
  pageTitle:string = '';
  constructor(
	private dashboardService:DashboardService
  ) { }

  ngOnInit() {
    this.dashboardService.pageTitle = "Dashboard";
	  this.pageTitle = this.dashboardService.pageTitle;
  }

}
