import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDayDetailComponent } from './calendar-day-detail.component';

describe('CalendarDayDetailComponent', () => {
  let component: CalendarDayDetailComponent;
  let fixture: ComponentFixture<CalendarDayDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDayDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarDayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
