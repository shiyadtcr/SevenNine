import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../shared';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { ProductService } from '../shared';
declare var $: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupFormGroup:FormGroup;
  constructor(
	private appService: AppService,
	private router: Router,
	private signupForm: FormBuilder,
	private loginService: LoginService,
	private productService: ProductService
  ) {
	this.signupFormGroup = this.signupForm.group({
      mob: ['', [Validators.required] ],
      name: ['', [Validators.required] ],
      email: [''],
      pwd: ['', Validators.required ]
    });
  }
  get _mob() { return this.signupFormGroup.get('mob'); }
  get _name() { return this.signupFormGroup.get('name'); }
  get _email() { return this.signupFormGroup.get('email'); }
  get _pwd() { return this.signupFormGroup.get('pwd'); }
  ngOnInit() {
  }
  isError(field){
	  return field.invalid && field.touched;
  }
  navigateToLogin(){
	 this.router.navigate(['login']);
  }
  navigateTo(){
    let _signupData = {
		mob:this._mob.value,
		name:this._name.value,
		email:this._email.value,
		pwd:this._pwd.value
	  }
	this.loginService.signupUser(_signupData)
	.subscribe((data: any) => {
		if(data.custID){
			//this.productService.addToWishlist(this.productService.getSelectedProduct().id);
			this.appService.onShowPreloader.emit(false);
			this.appService.setCurrentUser(data.custID);
			this.loginService.setLoggedInStatus(true);
			if(this.appService.getRedirectionUrl()){
			  this.router.navigate([this.appService.getRedirectionUrl()]);
			} else {
				this.productService.setProductList([]);
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
