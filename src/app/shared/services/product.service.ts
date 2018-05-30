import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppService } from '../../app.service';

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
  redirectionMode:any;
  selectedQuantity:any;
  constructor(
	private http: HttpClient,
	private appService: AppService
  ) { 
  }
   setSelectedProduct(data){
    this.selectedProduct = data;
  }
  getSelectedProduct(){
    return this.selectedProduct;
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
	 setProductsInCart(data){
		this.productsInCart = data;
		if(data.length == 0){
			this.updateProductTotal();
			this.onAddToCart.emit(this.productsInCart);
		 }
   } 
   getProductsInWishlist(){ 
		return this.productsInWishlist;
   } 
	 setProductsInWishlist(data){ 		 
		this.productsInWishlist = data;
		if(data.length == 0){
			this.onAddToWishlist.emit(this.productsInWishlist);
		 }		
   } 
  getNewProductsByCategory(id){
	   let productUrl = "http://13.232.42.90/service/?/Masters/products/" + id;
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(productUrl);
	   /* let product = this.productList.filter(function(item){
			return item.id == id;
		});
		return product; */
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
