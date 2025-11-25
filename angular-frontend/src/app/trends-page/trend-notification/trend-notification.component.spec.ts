import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendNotificationComponent } from './trend-notification.component';

describe('TrendNotificationComponent', () => {
  let component: TrendNotificationComponent;
  let fixture: ComponentFixture<TrendNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
