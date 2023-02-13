import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JhcsFormComponent} from './jhcs-form.component';

describe('JhcsFormComponent', () => {
  let component: JhcsFormComponent;
  let fixture: ComponentFixture<JhcsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JhcsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JhcsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
