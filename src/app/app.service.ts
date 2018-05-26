import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AppService {
  onShowPreloader : EventEmitter<any> = new EventEmitter<any>();
  baseImageUrl:string = 'http://13.232.42.90/seven9/assets/';
  constructor() { }

}
