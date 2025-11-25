import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketInsightComponent } from './market-insight.component';

describe('MarketInsightComponent', () => {
  let component: MarketInsightComponent;
  let fixture: ComponentFixture<MarketInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketInsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
