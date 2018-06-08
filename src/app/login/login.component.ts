import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../shared';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
	loginFormGroup:FormGroup;
  constructor(
	private appService: AppService,
	private router: Router,
	private loginForm: FormBuilder,
	private loginService: LoginService
  ) {
	this.loginFormGroup = this.loginForm.group({
      uname: ['', [Validators.required] ],
      pwd: ['', Validators.required ]
    });
  }
  get _uname() { return this.loginFormGroup.get('uname'); }
  get _pwd() { return this.loginFormGroup.get('pwd'); }
  ngOnInit() {
  }
  isError(field){
	  return field.invalid && field.touched;
  }
  navigateTo(){
    let _signinData = {
			uname:this._uname.value,
			pwd:this._pwd.value
		  }
	this.loginService.signinUser(_signinData)
	.subscribe((data: any) => {
		if(data.custID){
			//this.productService.addToWishlist(this.productService.getSelectedProduct().id);
			this.appService.onShowPreloader.emit(false);
			this.appService.setCurrentUser(data.custID);
			this.loginService.setLoggedInStatus(true);
			if(this.appService.getRedirectionUrl()){
			  this.router.navigate([this.appService.getRedirectionUrl()]);
			} else {
				 this.router.navigate(['/']);
			}
			$.notify(data.message,'success');
		} else {
			this.appService.onShowPreloader.emit(false);
			$.notify('User signup failed due to an error. Try after some time.','error');
		}
	},(data: any) => {
		this.appService.onShowPreloader.emit(false);
		$.notify('User signup failed due to an error. Try after some time.','error');
	});	
	
  }
  OnInit(){
	  
  }
}
