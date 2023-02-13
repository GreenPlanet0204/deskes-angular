import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActivityMissingTechComponent} from './activity-missing-tech.component';

describe('ActivityMissingTechComponent', () => {
  let component: ActivityMissingTechComponent;
  let fixture: ComponentFixture<ActivityMissingTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityMissingTechComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMissingTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
