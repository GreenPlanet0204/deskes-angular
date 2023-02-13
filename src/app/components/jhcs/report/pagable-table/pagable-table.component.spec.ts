import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PagableTableComponent} from './pagable-table.component';

describe('PagableTableComponent', () => {
  let component: PagableTableComponent;
  let fixture: ComponentFixture<PagableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagableTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


