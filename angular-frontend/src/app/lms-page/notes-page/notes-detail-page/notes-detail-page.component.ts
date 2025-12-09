import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Note, Attachment } from '../../../../models.interface';
import { mockNotes } from '../../../../services/test.data';

@Component({
  selector: 'app-notes-detail-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notes-detail-page.component.html',
  styleUrl: './notes-detail-page.component.css'
})
export class NotesDetailPageComponent {
  @Input() note: Note = mockNotes[0];
  @Output() backEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<Note>();
  @Output() deleteEvent = new EventEmitter<string>();

  isEditing = false;
  showImportDialog = false;
  importUrl = '';

  editedNote: Note = { ...this.note, content: [...this.note.content] };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const noteId = params.get('noteId');
      if (noteId) {
        this.loadNoteById(noteId);
      }
    });
    this.resetEditedNote();
  }

  loadNoteById(noteId: string) {
    const note = mockNotes.find(n => n.id === noteId);
    if (note) {
      this.note = note;
      this.resetEditedNote();
    } else {
      console.error('Note not found with ID:', noteId);
    }
  }

  resetEditedNote() {
    this.editedNote = JSON.parse(JSON.stringify(this.note));
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveEvent.emit(this.editedNote);
      this.note = { ...this.editedNote };
      this.isEditing = false;
    } else {
      this.resetEditedNote();
      this.isEditing = true;
    }
  }

  addLine() {
    this.editedNote.content.push('');
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
    if (attachment.url) {
      window.open(attachment.url, '_blank');
    }
  }

  openImportDialog() {
    this.showImportDialog = true;
    this.importUrl = '';
  }

  closeImportDialog() {
    this.showImportDialog = false;
    this.importUrl = '';
  }

  importLink() {
    if (this.importUrl.trim()) {
      const newAttachment: Attachment = {
        id: `att-${Date.now()}`,
        type: 'link',
        name: this.importUrl,
        url: this.importUrl
      };

      if (!this.editedNote.attachments) {
        this.editedNote.attachments = [];
      }
      this.editedNote.attachments.push(newAttachment);
      this.closeImportDialog();
    }
  }

  removeAttachment(index: number) {
    if (this.editedNote.attachments) {
      this.editedNote.attachments.splice(index, 1);
    }
  }

  getLastModifiedDate(): string {
    return this.note.lastModified
      ? new Date(this.note.lastModified).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Never';
  }
}
