import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Note } from '../../../models.interface';
import { mockNotes } from '../../../test-data/task.data';

@Component({
  selector: 'app-notes-detail-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notes-detail-page.component.html',
  styleUrl: './notes-detail-page.component.css'
})
export class NotesDetailPageComponent implements OnInit {
  noteId: string | null= null;
  selectedNotes: Note | null = null;
  notes: Note[] = mockNotes;
  Array = Array;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.noteId = params.get('noteId');
      if (this.noteId) {
        this.selectedNotes = this.notes.find(note => note.id === this.noteId) || null;
      }
    });
  }

  loadNote(id: string): void {
    this.getNoteById(id).subscribe({
      next: (note) => {
        this.selectedNotes = note; // ✅ Fixed incorrect property reference
      },
      error: (error) => {
        console.error('Error loading note:', error);
        this.selectedNotes = null;
      }
    });
  }

  getNoteById(id: string): Observable<Note | null> {
    const note = this.notes.find(n => n.id === id) || null;
    return of(note);
  }

  deleteNote(id: string): Observable<void> {
    return new Observable(observer => {
      const index = this.notes.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notes.splice(index, 1);
      }
      observer.next();
      observer.complete();
    });
  }

  goBack(): void {
    this.router.navigate(['/notes']);
  }

  editselectedNotes(): void {
    if (this.selectedNotes) { // ✅ Fixed incorrect property reference
      this.router.navigate(['/notes/edit', this.selectedNotes.id]);
    }
  }

  confirmDelete(): void {
    if (!this.selectedNotes) return; // ✅ Fixed incorrect property reference

    if (confirm('Are you sure you want to delete this note?')) {
      this.deleteNote(this.selectedNotes.id).subscribe({
        next: () => {
          this.router.navigate(['/notes']);
        },
        error: (error) => {
          console.error('Error deleting note:', error);
        }
      });
    }
  }
}