import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsPageComponent } from './lms-page.component';

describe('LmsPageComponent', () => {
  let component: LmsPageComponent;
  let fixture: ComponentFixture<LmsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
