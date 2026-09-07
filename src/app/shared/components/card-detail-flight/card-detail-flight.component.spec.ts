import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailFlightComponent } from './card-detail-flight.component';

describe('CardDetailFlightComponent', () => {
  let component: CardDetailFlightComponent;
  let fixture: ComponentFixture<CardDetailFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDetailFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
