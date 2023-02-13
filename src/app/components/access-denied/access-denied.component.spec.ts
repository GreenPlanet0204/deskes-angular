import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SsmmComponent} from './access-denied.component';

describe('SsmmComponent', () => {
  let component: SsmmComponent;
  let fixture: ComponentFixture<SsmmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsmmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsmmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
