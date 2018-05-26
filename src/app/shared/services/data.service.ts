import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AppService } from '../../app.service';

@Injectable()
export class DataService{
  httpOptions = {
	  headers: new HttpHeaders({
		'Content-Type':  'application/json',
		'Client-Service': 'frontend-client',
		'Auth-Key': 'simplerestapi',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Allow-Methods': 'GET',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true'
	  })
	};
  orderHistory:any = [{
	orderNo:9,
	totalAmount:399.00,
	date:'2018-03-18',
	time:'08:50:42 PM',
	status:'pending',
	products:[{
		id:'boofle1231',
		title:'Home Style Ganapathi Gift FU99',
		price:'259.00',
		quantity: 3,
		categoryId:'giftsandpremium'
	},{
		id:'boofle1232',
		title:'Home Style Budha Gift S129',
		price:'119.00',
		quantity: 1,
		categoryId:'giftsandpremium'
	},
	{
		id:'boofle1233',
		title:'Home Style Budha Gift S74',
		price:'199.00',
		quantity: 5,
		categoryId:'giftsandpremium'
	}]
  }];
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
	this.addressList.additionalAddress.push(address);  
  }
  getNewCategoryList(){ 
    let categoyUrl = "http://13.232.42.90/service/?/Masters/categories";
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

   
  
   getAddressList(){ 
		return this.addressList;
   } 
   getOrderHistory(){ 
		return this.orderHistory;
   } 
}
