import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note } from '../../../models.interface';
import { mockNotes } from '../../../test-data/task.data';

interface Attachment {
  id: string;
  type: 'image' | 'document' | 'link' | 'github';
  name: string;
  url: string;
  thumbnail?: string;
}

@Component({
  selector: 'app-notes-detail-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notes-detail-page.component.html',
  styleUrl: './notes-detail-page.component.css'
})
export class NotesDetailPageComponent {
  @Input() note: Note = {
    id: '1',
    name: 'Sample Note',
    content: ['This is a sample note line.', 'You can view and edit this note.'],
    attachments: [
      {
        id: '1',
        type: 'image',
        name: 'Sample Image',
        url: '/assets/sample.jpg',
        thumbnail: '/assets/sample-thumb.jpg'
      },
      {
        id: '2',
        type: 'document',
        name: 'Project Spec',
        url: '/assets/spec.pdf'
      },
      {
        id: '3',
        type: 'link',
        name: 'TaskFlow Docs',
        url: 'https://taskflow.docs.com'
      },
      {
        id: '4',
        type: 'github',
        name: 'Repository',
        url: 'https://github.com/user/repo'
      }
    ],
    dateCreated:'2025-03-30T10:00:00',  //new Date('2025-03-30T10:00:00'),
    lastModified:'2025-04-03T15:30:00' //new Date('2025-04-03T15:30:00')
  };

  @Output() backEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<Note>();
  @Output() deleteEvent = new EventEmitter<string>();

  isEditing = false;
  showAISummary = false;

  editedNote: Note = { ...this.note, content: [...this.note.content] };

  ngOnInit() {
    // Deep clone the note to prevent modifying the original
    this.resetEditedNote();
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
    this.editedNote.content.slice(index, 1);
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
