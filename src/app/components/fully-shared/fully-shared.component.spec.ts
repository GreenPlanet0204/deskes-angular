import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FullySharedComponent} from './fully-shared.component';

describe('HomeComponent', () => {
  let component: FullySharedComponent;
  let fixture: ComponentFixture<FullySharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullySharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullySharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
