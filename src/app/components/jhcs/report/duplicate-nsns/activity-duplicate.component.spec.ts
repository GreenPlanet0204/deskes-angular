import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivityDuplicateComponent} from './activity-duplicate.component';

describe('ActivityDuplicateComponent', () => {
  let component: ActivityDuplicateComponent;
  let fixture: ComponentFixture<ActivityDuplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityDuplicateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
