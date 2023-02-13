import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RevisionDialogComponent} from './revision-dialog.component';

describe('MettingDialogComponent', () => {
  let component: RevisionDialogComponent;
  let fixture: ComponentFixture<RevisionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
