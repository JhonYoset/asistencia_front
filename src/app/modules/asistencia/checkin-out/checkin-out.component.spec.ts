import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinOutComponent } from './checkin-out.component';

describe('CheckinOutComponent', () => {
  let component: CheckinOutComponent;
  let fixture: ComponentFixture<CheckinOutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckinOutComponent]
    });
    fixture = TestBed.createComponent(CheckinOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
