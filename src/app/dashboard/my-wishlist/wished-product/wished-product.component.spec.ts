import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishedProductComponent } from './wished-product.component';

describe('WishedProductComponent', () => {
  let component: WishedProductComponent;
  let fixture: ComponentFixture<WishedProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishedProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
