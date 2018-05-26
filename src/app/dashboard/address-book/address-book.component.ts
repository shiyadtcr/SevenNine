import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DashboardService } from '../../shared';
import { DataService } from '../../shared';
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit {
  addressList:any = [];
  constructor(
	private dashboardService:DashboardService,
	private dataService:DataService,
	private router: Router
  ) { }

  ngOnInit() {
	  this.dashboardService.pageTitle = "Address Book";
	  this.addressList = this.dataService.getAddressList();
  }
  addNewAddr(){
	  this.router.navigate(['/addnewaddress']);
  }
}
