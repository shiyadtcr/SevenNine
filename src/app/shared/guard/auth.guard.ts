import { Injectable, OnInit } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
		private router: Router
	) {}
    canActivate() {
		localStorage.setItem('isLoggedin','true');
        if (localStorage.getItem('isLoggedin') == 'true') {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
	ngOnInit(){
	}
}
