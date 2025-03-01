import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNotePageComponent } from './new-note-page.component';

describe('NewNotePageComponent', () => {
  let component: NewNotePageComponent;
  let fixture: ComponentFixture<NewNotePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewNotePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewNotePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
