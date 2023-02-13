import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivityProductionComponent} from './activity-production.component';

describe('ActivityRecordComponent', () => {
  let component: ActivityProductionComponent;
  let fixture: ComponentFixture<ActivityProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
