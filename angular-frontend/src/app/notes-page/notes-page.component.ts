import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Note } from '../../models.interface';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notes-page.component.html',
  styleUrl: './notes-page.component.css'
})
export class NotesPageComponent {
    notes: Note[] = [
      {
        id: '1',
        title: 'Lorem ipsum',
        content: 'maiores debitis magni in maxime.',
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Lorem ipsum',
        content: 'Lorem ipsum dolor, sit amet consectetur',
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    ];
  
    openNote(noteId: string) {
      // Implement navigation to note detail
      console.log('Opening note:', noteId);
    }
  }
