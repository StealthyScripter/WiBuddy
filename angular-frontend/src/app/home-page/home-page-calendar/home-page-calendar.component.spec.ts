import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageCalendarComponent } from './home-page-calendar.component';

describe('HomePageCalendarComponent', () => {
  let component: HomePageCalendarComponent;
  let fixture: ComponentFixture<HomePageCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
