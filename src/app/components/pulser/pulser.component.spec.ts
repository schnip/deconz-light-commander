import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulserComponent } from './pulser.component';

describe('PulserComponent', () => {
  let component: PulserComponent;
  let fixture: ComponentFixture<PulserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PulserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PulserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
