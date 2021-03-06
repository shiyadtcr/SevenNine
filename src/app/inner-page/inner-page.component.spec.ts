import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerPageComponent } from './inner-page.component';

describe('InnerPageComponent', () => {
  let component: InnerPageComponent;
  let fixture: ComponentFixture<InnerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
