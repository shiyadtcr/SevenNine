import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DataService} from '../shared';
@Component({
  selector: 'app-inner-page',
  templateUrl: './inner-page.component.html',
  styleUrls: ['./inner-page.component.scss']
})
export class InnerPageComponent implements OnInit {
  private sub:any;
  private menuId:any;
  menu:any = [];
  constructor(
    private route: ActivatedRoute,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.menuId = params['id'];
      this.menu = this.dataService.getMenuData().filter((v) => {return this.menuId == v.id})[0];
    });
  }

}
