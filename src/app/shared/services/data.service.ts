import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AppService } from '../../app.service';

@Injectable()
export class DataService{
  httpOptions = {
	  headers: new HttpHeaders({
		'Content-Type':  'application/x-www-form-urlencoded; charset=utf8'
	  })
	};
	menuData:any = [];
  orderHistory:any = [
		{
			orderNo:9,
			totalAmount:290.00,
			date:'2018-03-18',
			time:'08:50:42 PM',
			status:'pending',
			products:[
				{"id":4,"title":"Green Cabbage","imageUrl":"cabbage.jpg","price":15,"categoryId":2,"quantity":2,},
				{"id":5,"title":"Onion Red 1Kg","imageUrl":"onion2.jpg","price":22.5,"categoryId":2,"quantity":6},
				{"id":10,"title":"Carrot 1KG","imageUrl":"carrot.jpg","price":25,"categoryId":2,"quantity":5,}
			]
		},{
			orderNo:9,
			totalAmount:1850.00,
			date:'2018-03-18',
			time:'08:50:42 PM',
			status:'pending',
			products:[
				{"id":1,"title":"Home Style Ganapathi Gift FU99","imageUrl":"alleppey.jpg","price":259,"categoryId":1,"quantity":3},
				{"id":2,"title":"Home Style Budha Gift S129","imageUrl":"hom_budha.jpg","categoryId":1,"price":75,"quantity":9},
				{"id":3,"title":"Home Style Budha Gift S74","imageUrl":"carrot.jpg","price":199,"categoryId":1,"quantity":2}
			]
		}
	];
  addressList:any = {
	  billingAddress:[{
		firstame:'Shiyad',
		lastName:'C K',
		telephone:'+918129796790',
		streetAddr:'test123',
		streetAddr2:'test124',
		country:'India',
		state:'Kerala',
		city:'Thrissur',
		postorzip:'680543'
	  }],
	  shippingAddress:[{
		firstame:'Shiyad',
		lastName:'C K',
		telephone:'+918129796790',
		streetAddr:'test456',
		streetAddr2:'test457',
		country:'India',
		state:'Kerala',
		city:'Thrissur',
		postorzip:'680543'
	  }],
	  additionalAddress:[{
		firstame:'Shiyad123',
		lastName:'C K',
		telephone:'+918129796790',
		streetAddr:'jhjhgj',
		streetAddr2:'hukjk',
		country:'India',
		state:'Kerala',
		city:'Thrissur',
		postorzip:'680543'
	  },
	  {
		firstame:'Shiyad456',
		lastName:'C K',
		telephone:'+918129796790',
		streetAddr:'awaw344',
		streetAddr2:'vcvxv567',
		country:'India',
		state:'Kerala',
		city:'Thrissur',
		postorzip:'680543'
	  }]
  };
  categoryList: any = [];
  productList: any = [];
  onCategoryUpdate : EventEmitter<any> = new EventEmitter<any>();
  constructor(
	private http: HttpClient,
	private appService: AppService
  ) { }
  saveAddress(address){		
    let saveAddrUrl = this.appService.getBaseServiceUrl() + 'setAddress';
		var saveAddrPromise = this.http.post(saveAddrUrl,address,this.httpOptions);
		this.appService.onShowPreloader.emit(true);
			return saveAddrPromise;
  }
	getCountryList(){ 
    let countryListUrl = this.appService.getBaseServiceUrl() + "country";
	var countryListPromise = this.http.get(countryListUrl);
	this.appService.onShowPreloader.emit(true);
    return countryListPromise;
   } 
	 getList(type,param){ 
		 let paramVal = type == 'state' ? 'country' : type == 'city' ? 'state' : type == 'area' ? 'city' : '';
    let listUrl = this.appService.getBaseServiceUrl() + type + "?" + paramVal + "=" + param;
	var listPromise = this.http.get(listUrl);
	this.appService.onShowPreloader.emit(true);
    return listPromise;
   } 
	 getShippingMethods(){ 
		 let listUrl = this.appService.getBaseServiceUrl() + "shippingMethod?custId=" + this.appService.getCurrentUser();
		var listPromise = this.http.get(listUrl);
		this.appService.onShowPreloader.emit(true);
			return listPromise;
   } 
	 getDeliveryTimes(){ 
		 let listUrl = this.appService.getBaseServiceUrl() + 'deliveryTime';
		var listPromise = this.http.get(listUrl);
		this.appService.onShowPreloader.emit(true);
			return listPromise;
   } 
	 getPaymentMethods(){ 
		 let listUrl = this.appService.getBaseServiceUrl() + 'paymentMethod';
		var listPromise = this.http.get(listUrl);
		this.appService.onShowPreloader.emit(true);
			return listPromise;
   } 
	 
  getNewCategoryList(){ 
    let categoyUrl = this.appService.getBaseServiceUrl() + "categories";
	var categoryPromise = this.http.get(categoyUrl);
	this.appService.onShowPreloader.emit(true);
    return categoryPromise;
   } 
   getCategoryList(){
	   return this.categoryList;
   }
   setCategoryList(data){ 
	  this.categoryList = data; 
   } 
   getCategoryById(id){
	   let category = this.categoryList.filter(function(item){
			return item.id == id;
		});
		return category;
   }

   
  	getData(url){
			var pageDataPromise = this.http.get(url);
			this.appService.onShowPreloader.emit(true);
				return pageDataPromise;
		}
   getAddressList(){ 
		let addressListUrl = this.appService.getBaseServiceUrl() + "getAddress?custId=" + this.appService.getCurrentUser();
		var addressListPromise = this.http.get(addressListUrl);
		this.appService.onShowPreloader.emit(true);
			return addressListPromise;
   } 
	 getMenuItemsService(){ 
		let menuItemUrl = this.appService.getBaseServiceUrl() + "articles";
		var menuItemPromise = this.http.get(menuItemUrl);
		this.appService.onShowPreloader.emit(true);
			return menuItemPromise;
   } 
	 setMenuData(data){ 
		this.menuData = data;
   } 
	 getMenuData(){ 
		return this.menuData;
   } 
   getOrderHistory(){ 
		return this.orderHistory;
   } 
}
