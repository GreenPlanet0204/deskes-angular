import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JhcsComponent} from './jhcs.component';

describe('JhcsComponent', () => {
  let component: JhcsComponent;
  let fixture: ComponentFixture<JhcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JhcsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JhcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
