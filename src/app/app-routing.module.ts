import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { MyAccountComponent } from './dashboard/my-account/my-account.component';
import { AddressBookComponent } from './dashboard/address-book/address-book.component';
import { AddNewAddressComponent } from './dashboard/address-book/add-new-address/add-new-address.component';
import { MyWishlistComponent } from './dashboard/my-wishlist/my-wishlist.component';
import { MyCartComponent } from './dashboard/my-cart/my-cart.component';
import { CheckoutComponent } from './dashboard/checkout/checkout.component';
import { PlaceOrderComponent } from './dashboard/checkout/place-order.component';
import { OrderHistoryComponent } from './dashboard/order-history/order-history.component';
import { InnerPageComponent } from './inner-page/inner-page.component';
import { AuthGuard } from './shared';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products/:id', component: ProductListingComponent },
  { path: 'products/:id/:productid', component: ProductDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
	{ path: 'innerpage/:id', component: InnerPageComponent },
  { 
		path: 'dashboard', 
		component: DashboardComponent,
		canActivate: [AuthGuard],
			children:[		
			{ path: '', component: DashboardHomeComponent},
			{ path: 'myaccount', component: MyAccountComponent},
			{ path: 'addressbook', component: AddressBookComponent},
			{ path:'addnewaddress',component:AddNewAddressComponent},
			{ path: 'mywishlist', component: MyWishlistComponent},
			{ path: 'mycart', component: MyCartComponent},		
			{ path: 'checkout', component: CheckoutComponent},
			{ path: 'checkout/:orderid', component: PlaceOrderComponent},
			{ path: 'orderhistory', component: OrderHistoryComponent}		
	]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
  declarations: []
})
export class AppRoutingModule { }
