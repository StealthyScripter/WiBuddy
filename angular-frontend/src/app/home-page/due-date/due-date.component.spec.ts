import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueDateComponent } from './due-date.component';

describe('DueDateComponent', () => {
  let component: DueDateComponent;
  let fixture: ComponentFixture<DueDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DueDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
