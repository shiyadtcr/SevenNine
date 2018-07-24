import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
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
	httpOptions = {
	  headers: new HttpHeaders({
		'Content-Type':  'application/x-www-form-urlencoded; charset=utf8'
	  })
	};
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
		this.productsList.forEach((v,i) => {
			if(this.productsList[i].imageUrl){
					this.productsList[i].imageUrl = this.appService.baseImageUrl + 'item/' + this.productsList[i].imageUrl;
				} else {
					this.productsList[i].imageUrl = this.appService.defaultImageUrl;
				}
			});
   }
  getProductsInCart(){
	return this.productsInCart;
   } 
   getSelectedDetailedProductService(id){
	   let userId = this.appService.getCurrentUser() ? this.appService.getCurrentUser() : 0;
	   let productDetailsUrl = this.appService.getBaseServiceUrl() + "productDet?userId=" + userId + '&itemId=' + id;
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(productDetailsUrl);
   }
   getProductsInCartService(){
	let cartlistUrl = this.appService.getBaseServiceUrl() + "cartlist/" + this.appService.getCurrentUser();
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(cartlistUrl);
   } 
	 setProductsInCart(data){
		 let _trigger = false;
		 if(data.length != this.productsInCart.length){
			_trigger = true;			
		}
		this.productsInCart = data;
		this.updateProductTotal();
		if(_trigger){
			this.onAddToCart.emit(this.productsInCart);
		}
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
  addToCartService(id,quantity,fromCart){
		let productExisting = this.productsList.filter(function(item){
			return item.id == id;
		});		
		if(productExisting.length != 0){
			if(!fromCart){
				productExisting[0].quantity += quantity;
			} else {
				productExisting[0].quantity = quantity;
			}
		}
	  let addtoCartUrl = this.appService.getBaseServiceUrl() + "cart/" + this.appService.getCurrentUser() + "/" + id + "/" + productExisting[0].quantity;
	   //this.appService.onShowPreloader.emit(true);
	   return this.http.get(addtoCartUrl);
  }
  addToCart(product,quantity){
	let productExisting = this.productsInCart.filter(function(item){
		return item.id == product.id;
	});		
	if(productExisting.length != 0){
		
		this.updateProductTotal();	
		this.onAddToCart.emit(this.productsInCart);
	} else {
		
		product.addedToCart = true;
		this.productsInCart.push(product);
		this.updateProductTotal();	
		this.onAddToCart.emit(this.productsInCart);
	}
  }
  addToWishlistService(id){
	  let addtoWishlistUrl = this.appService.getBaseServiceUrl() + "wishlist/" + this.appService.getCurrentUser() + "/" + id;
	   //this.appService.onShowPreloader.emit(true);
	   return this.http.get(addtoWishlistUrl);
  }
  addToWishlist(product){
	let productExisting = this.productsList.filter(function(item){
		return item.id == product.id;
	});	
	product.isFavorate = !product.isFavorate;
	if(this.productsList.length != 0){
		let prod = this.productsList.filter(function(item){
			return item.id == product.id;
		});	
		prod[0].isFavorate = product.isFavorate;
		this.setProductList(this.productsList);
	}
	if(productExisting.length != 0){
		productExisting[0].isFavorate = product.isFavorate;
		this.productsInWishlist = this.productsInWishlist.filter(function(item){
			return item.id != product.id;
		});	
		this.onAddToWishlist.emit(this.productsInWishlist);
	} else {
		this.productsInWishlist.push(product);		
		this.onAddToWishlist.emit(this.productsInWishlist);
	}	
  }
  removeCartItemService(id){
	  let removeFromCartUrl = this.appService.getBaseServiceUrl() + "remCartItem?userId=" + this.appService.getCurrentUser() + "&itemId=" + id;
	   this.appService.onShowPreloader.emit(true);
	   return this.http.get(removeFromCartUrl );
  }
	saveRating(data){
	  let saveRatingUrl = this.appService.getBaseServiceUrl() + "setRating";
	   this.appService.onShowPreloader.emit(true);
	   return this.http.post(saveRatingUrl,data,this.httpOptions);
  }
	placeOrder(data){
	  let placeOrderUrl = this.appService.getBaseServiceUrl() + "placeOrder";
	   this.appService.onShowPreloader.emit(true);
	   return this.http.post(placeOrderUrl,data,this.httpOptions);
  }
  removeCartItem(id){
	let productExisting = this.productsInCart.filter(function(item){
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
