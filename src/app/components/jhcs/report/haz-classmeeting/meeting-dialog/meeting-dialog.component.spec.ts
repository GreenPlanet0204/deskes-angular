import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MeetingDialogComponent} from './meeting-dialog.component';

describe('MettingDialogComponent', () => {
  let component: MeetingDialogComponent;
  let fixture: ComponentFixture<MeetingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
