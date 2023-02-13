import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportTableComponent} from './export-table.component';

describe('ExportTableComponent', () => {
  let component: ExportTableComponent;
  let fixture: ComponentFixture<ExportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
