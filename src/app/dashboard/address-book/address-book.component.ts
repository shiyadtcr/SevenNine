import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DashboardService } from '../../shared';
import { DataService } from '../../shared';
import {AppService} from '../../app.service';
declare var $: any;
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit {
  addressList:any = [];
  defaultAddress:any = [];
  constructor(
	private dashboardService:DashboardService,
	private dataService:DataService,
	private router: Router,
  private appService: AppService
  ) { }

  ngOnInit() {
	  this.dashboardService.pageTitle = "Address Book";
	  this.dataService.getAddressList()
    .subscribe((data:any) => {
      if(data){
        console.log(data);
        if(data.length == 0){
          this.router.navigate(['dashboard','addressbook']);
        } else {
          this.addressList = data;
          this.defaultAddress = this.addressList.filter((val,ind) => { return val.status == 1})[0];
        }
      } else {
        $.notify('Getting area list failed due to an error. Try after some time.',"error");
      }
      this.appService.onShowPreloader.emit(false);
    },(data:any) => {
        this.appService.onShowPreloader.emit(false);
      	$.notify('Getting area list failed due to an error. Try after some time.',"error");
    });
  }
  addNewAddr(){
    this.router.navigate(['dashboard','addnewaddress']);
  }
}
