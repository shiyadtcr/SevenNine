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
        country: ['', Validators.required ],
        state: ['', Validators.required ],
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
  set _state(value:any) { this._state.value = value; }
  set _city(value:any) { this._city.value = value; }
  set _area(value:any) { this._area.value = value; }
  set _country(value:any) { this._country.value = value; }
  get _zip() { return this.addressFormGroup.get('address.zip'); }  
  set _zip(value:any) { this._zip.value = value; }
  ngOnInit() {
	  this.dashboardService.pageTitle = "Add New Address";    
    //this._zip.value = 812082;
    this.dataService.getCountryList()
    .subscribe((data:any) => {
      if(data){
        this.countryList = data;
        /*this.addressFormGroup.patchValue({
          address:{
            country:this.countryList[0].country_id
          }
        });*/
        //this._country.value = this.countryList[0].country_id;
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
    if(this._country.value){
      this.dataService.getList('state',this._country.value)
      .subscribe((data:any) => {
        if(data){
          this.stateList = data;
          /*this.addressFormGroup.patchValue({
            address:{
              state:this.stateList[0].state_id
            }
          });*/
          //this._state.value = this.stateList[0].state_id;
        } else {
          $.notify('Getting state list failed due to an error. Try after some time.',"error");
        }
        this.appService.onShowPreloader.emit(false);
      },(data:any) => {
          this.appService.onShowPreloader.emit(false);
          $.notify('Getting state list failed due to an error. Try after some time.',"error");
      });
    }
    
  }
  onStateSelect(value){
	  console.log(value);
    if(this._state.value){
      this.dataService.getList('city',this._state.value)
      .subscribe((data:any) => {
        if(data){
          this.cityList = data;
          /*this.addressFormGroup.patchValue({
            address:{
              city:this.cityList[0].city_id
            }
          });*/
          //this._city.value = this.cityList[0].city_id;
        } else {
          $.notify('Getting city list failed due to an error. Try after some time.',"error");
        }
        this.appService.onShowPreloader.emit(false);
      },(data:any) => {
          this.appService.onShowPreloader.emit(false);
          $.notify('Getting city list failed due to an error. Try after some time.',"error");
      });
    }
    
  }
  onCitySelect(value){
	  console.log(value);
    if(this._city.value){
      this.dataService.getList('area',this._city.value)
      .subscribe((data:any) => {
        if(data){
          this.areaList = data;
          /*this.addressFormGroup.patchValue({
            address:{
              area:this.areaList[0].area_id
            }
          });*/
          //this._area.value = this.areaList[0].area_id;
        } else {
          $.notify('Getting area list failed due to an error. Try after some time.',"error");
        }
        this.appService.onShowPreloader.emit(false);
      },(data:any) => {
          this.appService.onShowPreloader.emit(false);
          $.notify('Getting area list failed due to an error. Try after some time.',"error");
      });
    }
    
  }
  onAreaSelect(value){
    if(this._area.value){
      let selectedArea = this.areaList.filter((v) => { return this._area.value == v.area_id});
      if(selectedArea.length > 0){
        this.addressFormGroup.patchValue({
          address:{
            zip:this.areaList[0].pincode
          }
        });
        this._zip.value = selectedArea[0].pincode;
      }	   
    }
           
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
