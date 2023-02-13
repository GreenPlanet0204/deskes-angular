import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EsmamComponent} from './esmam.component';

describe('EsmamComponent', () => {
  let component: EsmamComponent;
  let fixture: ComponentFixture<EsmamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsmamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsmamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
