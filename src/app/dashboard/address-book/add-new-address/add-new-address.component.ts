import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../../../shared';
import { DataService } from '../../../shared';
import {AppService} from '../../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.component.html',
  styleUrls: ['./add-new-address.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddNewAddressComponent implements OnInit {
  addressFormGroup:FormGroup;
  checkoutFlag:boolean = this.dashboardService.getCheckoutFlag();
  addressList:any = this.dataService.getAddressList();
  countryList:any = [];
  stateList:any = [];
  cityList:any = [];
  areaList:any = [];
  constructor(
	private dashboardService:DashboardService,
	private dataService:DataService,
	private addressForm: FormBuilder,
	private router: Router,
  private appService: AppService
  ) {
	this.addressFormGroup = this.addressForm.group({
      fname: ['', Validators.required ],
      mobile: ['', Validators.required ],
      address: this.addressForm.group({
        address: ['', Validators.required ],
        wardNumber: [''],
        landmark: ['', Validators.required ],
        country: ['--Select Country--', Validators.required ],
        state: ['--Select State--', Validators.required ],
        city: ['', Validators.required ],
        area: ['', Validators.required ],
        zip: ['', Validators.required ]
      })
    });
  }
  
  get _fname() { return this.addressFormGroup.get('fname'); }
  get _mobile() { return this.addressFormGroup.get('mobile'); }
  get _address() { return this.addressFormGroup.get('address.address'); }
  get _wardNumber() { return this.addressFormGroup.get('address.wardNumber'); }
  get _landmark() { return this.addressFormGroup.get('address.landmark'); }
  get _state() { return this.addressFormGroup.get('address.state'); }
  get _city() { return this.addressFormGroup.get('address.city'); }
  get _area() { return this.addressFormGroup.get('address.area'); }
  get _country() { return this.addressFormGroup.get('address.country'); }
  get _zip() { return this.addressFormGroup.get('address.zip'); }  
  set _zip(value:any) { this._zip.value = value; }
  ngOnInit() {
	  this.dashboardService.pageTitle = "Add New Address";    
    this._zip.value = 812082;
    this.dataService.getCountryList()
    .subscribe((data:any) => {
      if(data){
        this.countryList = data;
      } else {
        $.notify('Getting country list failed due to an error. Try after some time.',"error");
      }
      this.appService.onShowPreloader.emit(false);
    },(data:any) => {
      this.appService.onShowPreloader.emit(false);
      	$.notify('Getting country list failed due to an error. Try after some time.',"error");
    });
  }
  onCountrySelect(value){
	  console.log(value);
    this.dataService.getList('state',this._country.value)
    .subscribe((data:any) => {
      if(data){
        this.stateList = data;
      } else {
        $.notify('Getting state list failed due to an error. Try after some time.',"error");
      }
      this.appService.onShowPreloader.emit(false);
    },(data:any) => {
        this.appService.onShowPreloader.emit(false);
      	$.notify('Getting state list failed due to an error. Try after some time.',"error");
    });
  }
  onStateSelect(value){
	  console.log(value);
    this.dataService.getList('city',this._state.value)
    .subscribe((data:any) => {
      if(data){
        this.cityList = data;
      } else {
        $.notify('Getting city list failed due to an error. Try after some time.',"error");
      }
      this.appService.onShowPreloader.emit(false);
    },(data:any) => {
        this.appService.onShowPreloader.emit(false);
      	$.notify('Getting city list failed due to an error. Try after some time.',"error");
    });
  }
  onCitySelect(value){
	  console.log(value);
    this.dataService.getList('area',this._city.value)
    .subscribe((data:any) => {
      if(data){
        this.areaList = data;
      } else {
        $.notify('Getting area list failed due to an error. Try after some time.',"error");
      }
      this.appService.onShowPreloader.emit(false);
    },(data:any) => {
        this.appService.onShowPreloader.emit(false);
      	$.notify('Getting area list failed due to an error. Try after some time.',"error");
    });
  }
  onAreaSelect(value){
    let selectedArea = this.areaList.filter((v) => { return this._area.value == v.area_id});
    if(selectedArea.length > 0)
	    this._zip.value = selectedArea[0].pincode;      
  }
  isError(field){
	  return field.invalid && (field.dirty || field.touched);
  }
  saveAddress(){
	  let _addr = {
      custId:this.appService.getCurrentUser(),
      firstname:this._fname.value,		
      mobile:this._mobile.value,
      address:this._address.value,
      wardNumber:this._wardNumber.value,
      landMark:this._landmark.value,
      country:this._country.value,
      state:this._state.value,
      city:this._city.value,
      area:this._area.value,
      zip:this._zip.value
	  }
	  this.dataService.saveAddress(_addr)
    .subscribe((data:any) => {
      if(data){
        console.log(data);
        this.router.navigate(['dashboard','addressbook']);        
      } else {
        $.notify('Getting area list failed due to an error. Try after some time.',"error");
      }
      this.appService.onShowPreloader.emit(false);
    },(data:any) => {
        this.appService.onShowPreloader.emit(false);
      	$.notify('Getting area list failed due to an error. Try after some time.',"error");
    });
  }
  gotoCheckout(){
	  this.dashboardService.setCheckoutFlag(false);
	    this.router.navigate(['dashboard','checkout']);
  }
}
