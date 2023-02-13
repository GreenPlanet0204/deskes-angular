import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivityRecordComponent} from './activity-record.component';

describe('ActivityRecordComponent', () => {
  let component: ActivityRecordComponent;
  let fixture: ComponentFixture<ActivityRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
