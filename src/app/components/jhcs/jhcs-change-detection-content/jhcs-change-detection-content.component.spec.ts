import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JhcsChangeDetectionContentComponent} from './jhcs-change-detection-content.component';

describe('JhcsChangeDetectionContentComponent', () => {
  let component: JhcsChangeDetectionContentComponent;
  let fixture: ComponentFixture<JhcsChangeDetectionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JhcsChangeDetectionContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JhcsChangeDetectionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
