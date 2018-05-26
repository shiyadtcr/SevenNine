import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../../../shared';
import { DataService } from '../../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.component.html',
  styleUrls: ['./add-new-address.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddNewAddressComponent implements OnInit {
  addressFormGroup:FormGroup;
  constructor(
	private dashboardService:DashboardService,
	private dataService:DataService,
	private addressForm: FormBuilder
  ) {
	this.addressFormGroup = this.addressForm.group({
      fname: ['', Validators.required ],
      lname: ['', Validators.required ],
      tel: ['', Validators.required ],
      address: this.addressForm.group({
        street1: ['', Validators.required ],
        street2: ['', Validators.required ],
        country: ['--Select Country--', Validators.required ],
        state: ['--Select State--', Validators.required ],
        city: ['', Validators.required ],
        zip: ['', Validators.required ]
      })
    });
  }
  onCountrySelect(value){
	  console.log(value);
  }
  onStateSelect(value){
	  console.log(value);
  }
  get _fname() { return this.addressFormGroup.get('fname'); }
  get _lname() { return this.addressFormGroup.get('lname'); }
  get _tel() { return this.addressFormGroup.get('tel'); }
  get _street1() { return this.addressFormGroup.get('address.street1'); }
  get _street2() { return this.addressFormGroup.get('address.street2'); }
  get _state() { return this.addressFormGroup.get('address.state'); }
  get _city() { return this.addressFormGroup.get('address.city'); }
  get _country() { return this.addressFormGroup.get('address.country'); }
  get _zip() { return this.addressFormGroup.get('address.zip'); }
  ngOnInit() {
	  this.dashboardService.pageTitle = "Add New Address";
  }
  isError(field){
	  return field.invalid && (field.dirty || field.touched);
  }
  saveAddress(){
	  let _addr = {
		firstame:this._fname.value,
		lastName:this._lname.value,
		telephone:this._tel.value,
		streetAddr:this._street1.value,
		streetAddr2:this._street2.value,
		country:this._country.value,
		state:this._state.value,
		city:this._city.value,
		postorzip:this._zip.value
	  }
	  this.dataService.saveAddress(_addr);
  }
}
