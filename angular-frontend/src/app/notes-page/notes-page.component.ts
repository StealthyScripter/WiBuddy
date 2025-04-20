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

    getNotesPreview(notes: string[]): string {
      if (!notes || notes.length === 0) return '';

      // Get the first content item and split
      const content = notes[0] || '';
      const words = content.split(' ');
      const baseWordCount = 10;

      if (words.length > baseWordCount) {
        return words.slice(0, baseWordCount).join(' ') + '...';
      }

      return content;
    }
  }
