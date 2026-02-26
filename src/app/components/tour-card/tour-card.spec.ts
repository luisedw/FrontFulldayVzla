import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCardComponent } from './tour-card';

describe('TourCard', () => {
  let component: TourCardComponent;
  let fixture: ComponentFixture<TourCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
