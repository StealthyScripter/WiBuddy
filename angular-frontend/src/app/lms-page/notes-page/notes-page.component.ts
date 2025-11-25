import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router} from '@angular/router';
import { Note } from '../../../models.interface';
import { mockNotes } from '../../../services/test.data';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notes-page.component.html',
  styleUrl: './notes-page.component.css'
})
export class NotesPageComponent{
    notes: Note[] = mockNotes;

    constructor(private router: Router){
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

    navigateToNote(noteId: string){
      this.router.navigate(['notes-details',noteId]);
    }

    navigateToNewNote() {
      this.router.navigate(['add-notes']);
    }
  }
