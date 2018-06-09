import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppService } from '../../app.service';
import { LoginService } from './login.service';

@Injectable()
export class ProductService {
  onAddToCart : EventEmitter<any> = new EventEmitter<any>();
  onAddToWishlist : EventEmitter<any> = new EventEmitter<any>();
  onRemoveFromCart : EventEmitter<any> = new EventEmitter<any>();
  onRemoveFromWishlist : EventEmitter<any> = new EventEmitter<any>();
  onIncQuantity : EventEmitter<any> = new EventEmitter<any>();
  onDecQuantity : EventEmitter<any> = new EventEmitter<any>();  
  onChangeQuantity : EventEmitter<any> = new EventEmitter<any>();  
  productTotal:number = 0;
  productsList:any = [];
  productsInCart:any = [];
  productsInWishlist:any = [];
  selectedCategory:string = '';
  selectedProduct:any;
  selectedDetailedProduct:any = {
		id : 1,
		categoryId:1,
		imageUrl:"alleppey.jpg",
		isFavorate:false,
		price:259,
		quantity:0,
		title:'Home Style Ganapathi Gift FU99',		
		rating:0,
		description:"testing desc",
		details:{
			"Description" : "Testing Description Testing Description Testing Description Testing Description ",
			"Features & Details" : "Testing Features & Details Testing Features & Details Testing Features & Details Testing Features & Details ",
			"Other Information" : "Testing Other Information Testing Other Information Testing Other Information Testing Other Information "
		},
		reviews:[{
			commentBy:'Priya',
			comment:'Good',
			rating:4
		},
		{
			commentBy:'Laya',
			comment:'Not Bad',
			rating:2
		},{
			commentBy:'Shekhar',
			comment:'Okay',
			rating:3
		},{
			commentBy:'Ahmed',
			comment:'Bad',
			rating:1
		},{
			commentBy:'Shiyad',
			comment:'Great',
			rating:5
		}]
	};
  redirectionMode:any;
  selectedQuantity:any;
  constructor(
	private http: HttpClient,
	private appService: AppService,
	private loginService: LoginService
  ) { 
  }
  setSelectedProduct(data){
    this.selectedProduct = data;
  }
  getSelectedProduct(){
    return this.selectedProduct;
  }
  setSelectedDetailedProduct(data){
    this.selectedDetailedProduct = data;
  }
  getSelectedDetailedProduct(){
    return this.selectedDetailedProduct;
  }
  setRedirectionMode(data){
    this.redirectionMode = data;
  }
  getRedirectionMode(){
    return this.redirectionMode;
  }
  setSelectedQuantity(data){
    this.selectedQuantity = data;
  }
  getSelectedQuantity(){
    return this.selectedQuantity;
  }
   getProductsList(){ 
	  return this.productsList;
   }
   setProductList(data){ 
		this.productsList = data;
   }
  getProductsInCart(){
	return this.productsInCart;
   } 
   getProductsInCartService(){
	let cartlistUrl = this.appService.getBaseServiceUrl() + "cartlist/" + this.appService.getCurrentUser();
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(cartlistUrl);
   } 
	 setProductsInCart(data){
		this.productsInCart = data;
		this.updateProductTotal();
		this.onAddToCart.emit(this.productsInCart);
   } 
   resetRedirectionData(){
		this.appService.setRedirectionUrl(null);
		this.setSelectedProduct(null);
		this.setSelectedQuantity(null);
		this.setRedirectionMode(null);
	}
   getProductsInWishlist(){ 
		return this.productsInWishlist;
   }
	getProductsInWishlistService(){ 
		let wishlistUrl = this.appService.getBaseServiceUrl() + "wishlists/" + this.appService.getCurrentUser();
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(wishlistUrl);
   }   
	 setProductsInWishlist(data){ 		 
		this.productsInWishlist = data;
		if(data.length == 0){
			this.onAddToWishlist.emit(this.productsInWishlist);
		 }		
   } 
  getNewProductsByCategory(id){
	   let productUrl = this.appService.getBaseServiceUrl() + "products/" + id + "/0";
	   if(this.loginService.getLoggedInStatus()){
		   productUrl = this.appService.getBaseServiceUrl() + "products/" + id + '/' + this.appService.getCurrentUser();
	   }
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(productUrl);
   }
   getCartProductsTotal(){
	   this.updateProductTotal();
	   return this.productTotal;
   }
  updateProductTotal(){
	this.productTotal = 0;
	this.productsInCart.forEach((val) => {
		this.productTotal += (val.price * val.quantity);
	});  
  }  
  changeQuanity(id,quantity){
	let productExisting = this.productsInCart.filter(function(item){
		return item.id == id;
	});		
	if(productExisting.length != 0){
		productExisting[0].quantity = quantity;
	}	
	this.updateProductTotal();
	this.onChangeQuantity.emit(this.productsInCart);
  }
  setSelectedCategory(cat){
	  this.selectedCategory = cat;
  }
  getSelectedCategory(){
	  return this.selectedCategory;
  }
  addToCartService(id,quantity){
	  let addtoCartUrl = this.appService.getBaseServiceUrl() + "cart/" + this.appService.getCurrentUser() + "/" + id + "/" + quantity;
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(addtoCartUrl);
  }
  addToCart(id,quantity){
	let productExisting = this.productsList.filter(function(item){
		return item.id == id;
	});		
	if(productExisting.length != 0){
		productExisting[0].quantity += quantity;
		productExisting[0].addedToCart = true;
		if(this.productsInCart.filter(function(v){return v.id == id}).length == 0){
			this.productsInCart.push(productExisting[0]);
		}	
		this.updateProductTotal();	
		this.onAddToCart.emit(this.productsInCart);
	}
			
	this.updateProductTotal();
  }
  addToWishlistService(id){
	  let addtoWishlistUrl = this.appService.getBaseServiceUrl() + "wishlist/" + this.appService.getCurrentUser() + "/" + id;
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(addtoWishlistUrl);
  }
  addToWishlist(id){
	let productExisting = this.productsList.filter(function(item){
		return item.id == id;
	});		
	if(productExisting.length != 0){
		productExisting[0].isFavorate = !productExisting[0].isFavorate;
		if(productExisting[0].isFavorate == false){
			this.productsInWishlist = this.productsInWishlist.filter(function(v){
				return v.id != id;
			});
			this.onRemoveFromWishlist.emit(this.productsInWishlist);
		} else {
			this.productsInWishlist.push(productExisting[0]);
			this.onAddToWishlist.emit(this.productsInWishlist);
		}		
	}
  }
  removeCartItem(id){
	let productExisting = this.productsList.filter(function(item){
		return item.id == id;
	});	
	if(productExisting.length != 0){
		productExisting[0].quantity = 0;
	}
	this.productsInCart = this.productsInCart.filter(function(item){
		return item.id != id;
	});
	this.updateProductTotal();
	this.onRemoveFromCart.emit(this.productsInCart); 
  }
  
}
