import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivityHazComponent} from './activity-haz.component';

describe('ActivityHazComponent', () => {
  let component: ActivityHazComponent;
  let fixture: ComponentFixture<ActivityHazComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityHazComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
