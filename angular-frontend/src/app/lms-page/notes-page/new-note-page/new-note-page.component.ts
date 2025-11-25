import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-note-page',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './new-note-page.component.html',
  styleUrl: './new-note-page.component.css'
})
export class NewNotePageComponent {
  notebookLines = Array(15).fill(''); // Creates 10 empty lines by default

  constructor() {}
}
