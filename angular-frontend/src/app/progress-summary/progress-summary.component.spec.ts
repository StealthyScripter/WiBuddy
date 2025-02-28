import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressSummaryComponent } from './progress-summary.component';

describe('ProgressSummaryComponent', () => {
  let component: ProgressSummaryComponent;
  let fixture: ComponentFixture<ProgressSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
