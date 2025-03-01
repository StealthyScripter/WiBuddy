import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Note } from '../../models.interface';
import { mockNotes } from '../../test-data/task.data';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notes-page.component.html',
  styleUrl: './notes-page.component.css'
})
export class NotesPageComponent {
    notes: Note[] = mockNotes;
    
    openNote(noteId: string) {
      // Implement navigation to note detail
      console.log('Opening note:', noteId);
    }
  }
