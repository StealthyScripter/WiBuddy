import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffirmationsDetailsPageComponent } from './affirmations-details-page.component';

describe('AffirmationsDetailsPageComponent', () => {
  let component: AffirmationsDetailsPageComponent;
  let fixture: ComponentFixture<AffirmationsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffirmationsDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffirmationsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
