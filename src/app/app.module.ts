import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material';
import { CategoryFilterPipe } from './shared';
import { DataService } from './shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService} from './shared';
import { LoginService} from './shared';
import { AppService } from './app.service';
import { AuthGuard} from './shared';
import {SqueezeBoxModule} from 'squeezebox/dist';
import { HttpClientModule } from '@angular/common/http';
import {RatingModule} from "ngx-rating";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ProductComponent } from './product-listing/product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { MyAccountComponent } from './dashboard/my-account/my-account.component';
import { AddressBookComponent } from './dashboard/address-book/address-book.component';
import { MyWishlistComponent } from './dashboard/my-wishlist/my-wishlist.component';
import { MyCartComponent } from './dashboard/my-cart/my-cart.component';
import { CheckoutComponent } from './dashboard/checkout/checkout.component';
import { OrderHistoryComponent } from './dashboard/order-history/order-history.component';
import { MyReturnsComponent } from './dashboard/my-returns/my-returns.component';
import { RewardPointsComponent } from './dashboard/reward-points/reward-points.component';
import { DashboardService } from './shared';
import { AddNewAddressComponent } from './dashboard/address-book/add-new-address/add-new-address.component';
import { WishedProductComponent } from './dashboard/my-wishlist/wished-product/wished-product.component';
import { CartProductComponent } from './dashboard/my-cart/cart-product/cart-product.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductDetailsComponent,
    LoginComponent,
    SignupComponent,
    ProductListingComponent,
    ProductComponent,    
    MyAccountComponent,
	CategoryFilterPipe,
	DashboardComponent,
	AddressBookComponent,
	MyWishlistComponent,
	MyCartComponent,
	CheckoutComponent,
	OrderHistoryComponent,
	MyReturnsComponent,
	RewardPointsComponent,
	DashboardHomeComponent,
	AddNewAddressComponent,
	WishedProductComponent,
	CartProductComponent
  ],
  imports: [
    BrowserModule,
	BrowserAnimationsModule,
    AppRoutingModule,
	NgxCarouselModule,
	SidebarModule, 
	MatMenuModule,
	FormsModule,
	ReactiveFormsModule,
	SqueezeBoxModule,
	HttpClientModule,
	RatingModule
  ],
  providers: [DataService, ProductService, LoginService, AppService, AuthGuard, DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
