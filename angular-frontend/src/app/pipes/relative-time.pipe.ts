import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {
  transform(date: string | Date | null): string {
    if (!date) return '';

    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    // Just now or minutes ago
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'min' : 'mins'} ago`;

    // Hours ago
    if (diffHr < 24) return `${diffHr} ${diffHr === 1 ? 'hr' : 'hrs'} ago`;

    // Yesterday (24-48 hours ago)
    if (diffDays === 1) return 'Yesterday';

    // Within last 7 days - show day name and time
    if (diffDays < 7) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[dateObj.getDay()];
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

      return `${dayName} ${formattedHours}:${minutes} ${ampm}`;
    }

    // Same year - show month/day
    if (dateObj.getFullYear() === now.getFullYear()) {
      const month = dateObj.getMonth() + 1; // getMonth() is 0-indexed
      const day = dateObj.getDate();
      return `${month}/${day}`;
    }

    // Different year - show month/day/year
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
