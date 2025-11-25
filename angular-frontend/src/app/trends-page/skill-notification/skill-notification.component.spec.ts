import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillNotificationComponent } from './skill-notification.component';

describe('SkillNotificationComponent', () => {
  let component: SkillNotificationComponent;
  let fixture: ComponentFixture<SkillNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
