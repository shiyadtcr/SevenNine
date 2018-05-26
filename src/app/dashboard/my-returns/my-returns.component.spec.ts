import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReturnsComponent } from './my-returns.component';

describe('MyReturnsComponent', () => {
  let component: MyReturnsComponent;
  let fixture: ComponentFixture<MyReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
