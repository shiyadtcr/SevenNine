import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../shared';
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
      uname: ['', [Validators.required, Validators.email] ],
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
	if(this.appService.getRedirectionUrl()){
	  this.router.navigate([this.appService.getRedirectionUrl()]);
	} else {
		let _login = {
			uname:this._uname.value,
			pwd:this._pwd.value
		  }
		this.appService.setCurrentUser(_login.uname);
		this.loginService.setLoggedInStatus(true);		
		 this.router.navigate(['/']);
	}
  }
}
