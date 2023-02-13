import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartiallySharedComponent} from './partially-shared.component';

describe('HomeComponent', () => {
  let component: PartiallySharedComponent;
  let fixture: ComponentFixture<PartiallySharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartiallySharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiallySharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
