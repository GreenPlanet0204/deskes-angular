import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivityMissingComponent} from './activity-missing.component';

describe('ActivityMissingComponent', () => {
  let component: ActivityMissingComponent;
  let fixture: ComponentFixture<ActivityMissingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityMissingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
