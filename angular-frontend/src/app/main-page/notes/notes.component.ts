import { Component } from '@angular/core';


@Component({
  selector: 'app-notes',
  imports: [],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  notes = [
    { title: "Project Ideas", content: "Brainstorm new features for the mobile app including AI recommendations, better UI/UX, and cloud integration...", date: "2025-01-29" },
    { title: "Meeting Notes", content: "Follow up with team regarding deadline and ensure documentation is complete before the next sprint review...", date: new Date().toISOString().split('T')[0] } // Today
  ];

  getFormattedDate(date: string): string {
    const today = new Date();
    const noteDate = new Date(date);
    const diffTime = today.getTime() - noteDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return noteDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  }

  getTruncatedText(content: string): string {
    return content.length > 50 ? content.substring(0, 50) + "..." : content;
  }

}
