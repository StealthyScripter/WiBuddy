import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffirmationsSectionComponent } from './affirmations-section.component';

describe('AffirmationsSectionComponent', () => {
  let component: AffirmationsSectionComponent;
  let fixture: ComponentFixture<AffirmationsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffirmationsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AffirmationsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
