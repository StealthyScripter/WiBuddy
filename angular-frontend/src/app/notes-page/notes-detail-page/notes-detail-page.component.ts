import { Component, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note, Attachment } from '../../../models.interface';
import { mockNotes } from '../../../test-data/task.data';


@Component({
  selector: 'app-notes-detail-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notes-detail-page.component.html',
  styleUrl: './notes-detail-page.component.css'
})
export class NotesDetailPageComponent {
  @Input() note: Note = mockNotes[0];
  @Output() backEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<Note>();
  @Output() deleteEvent = new EventEmitter<string>();

  isEditing = false;
  showAISummary = false;

  editedNote: Note = { ...this.note, content: [...this.note.content] };

  constructor(private route: ActivatedRoute){}

  ngOnInit() {
     // Get the noteId from the route parameter
     this.route.paramMap.subscribe(params => {
      const noteId = params.get('noteId');
      if (noteId) {
        this.loadNoteById(noteId);
      }
    });
    // Deep clone the note to prevent modifying the original
    this.resetEditedNote();
  }

  loadNoteById(noteId: string) {
    // Retrieve the note by ID (for now using mock data)
    const note = mockNotes.find(n => n.id === noteId);
    if (note) {
      this.note = note;
      this.resetEditedNote();
    } else {
      // Handle case where note is not found
      console.error('Note not found with ID:', noteId);
    }
  }

  resetEditedNote() {
    this.editedNote = JSON.parse(JSON.stringify(this.note));
  }

  toggleEdit() {
    if (this.isEditing) {
      // Save changes
      this.saveEvent.emit(this.editedNote);
      this.isEditing = false;
    } else {
      // Enter edit mode
      this.resetEditedNote();
      this.isEditing = true;
    }
  }

  addLine() {
  //   this.editedNote.content.push('');
   }

  removeLine(index: number) {
    this.editedNote.content.splice(index, 1);
  }

  onBack() {
    if (this.isEditing) {
      if (confirm('Discard unsaved changes?')) {
        this.isEditing = false;
        this.backEvent.emit();
      }
    } else {
      this.backEvent.emit();
    }
  }

  confirmDelete() {
    if (confirm('Are you sure you want to delete this note?')) {
      this.deleteEvent.emit(this.note.id);
    }
  }

  openAttachment(attachment: Attachment) {
    window.open(attachment.url, '_blank');
  }

  generateAISummary() {
    if (this.note.aiSummary) {
      this.showAISummary = !this.showAISummary;
    } else {
      // Simulate AI summary generation
      setTimeout(() => {
        this.note.aiSummary = 'This note contains information about the project requirements, including key deliverables and timeline. There are attachments with additional specifications and reference materials.';
        this.showAISummary = true;
      }, 1000);
    }
  }


}
