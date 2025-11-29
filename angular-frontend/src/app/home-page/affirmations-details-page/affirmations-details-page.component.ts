import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Affirmation } from '../../../models.interface';

interface AffirmationCard extends Affirmation {
  isFavorited?: boolean;
  viewCount?: number;
  category?: string;
  color?: string;
}

@Component({
  selector: 'app-affirmations-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './affirmations-details-page.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `]
})
export class AffirmationsDetailsPageComponent implements OnInit {
  affirmations: AffirmationCard[] = [];
  filteredAffirmations: AffirmationCard[] = [];
  selectedTag: string | null = null;
  searchQuery = '';
  loading = true;
  allTags: string[] = [];

  categoryColors: {[key: string]: string} = {
    'confidence': 'from-blue-500 to-cyan-500',
    'growth': 'from-green-500 to-emerald-500',
    'mindfulness': 'from-purple-500 to-pink-500',
    'abundance': 'from-amber-500 to-orange-500',
    'goals': 'from-indigo-500 to-blue-500',
    'motivation': 'from-rose-500 to-red-500',
    'gratitude': 'from-yellow-500 to-amber-500',
    'self-love': 'from-pink-500 to-rose-500',
    'success': 'from-emerald-500 to-green-500',
    'prosperity': 'from-yellow-400 to-yellow-600'
  };

  mockAffirmations: AffirmationCard[] = [
    {
      id: '1',
      quote: "I am capable of achieving my goals and dreams.",
      author: "Louise Hay",
      dailyGoals: ["Complete one challenging task", "Help someone in need", "Practice gratitude"],
      tags: ['confidence', 'goals', 'motivation'],
      reminderTime: '09:00:00',
      isActive: true,
      isFavorited: false,
      viewCount: 1243,
      category: 'confidence',
      dateCreated: new Date().toISOString()
    },
    {
      id: '2',
      quote: "Every day is a new opportunity to grow and improve.",
      author: "Unknown",
      dailyGoals: ["Learn something new", "Move your body", "Practice self-care"],
      tags: ['growth', 'mindfulness', 'daily'],
      reminderTime: '07:00:00',
      isActive: true,
      isFavorited: false,
      viewCount: 892,
      category: 'growth',
      dateCreated: new Date().toISOString()
    },
    {
      id: '3',
      quote: "I attract success and abundance into my life.",
      author: "Affirmation Master",
      dailyGoals: ["Visualize success", "Take action toward goals", "Express gratitude"],
      tags: ['abundance', 'success', 'prosperity'],
      reminderTime: '08:00:00',
      isActive: true,
      isFavorited: false,
      viewCount: 756,
      category: 'abundance',
      dateCreated: new Date().toISOString()
    },
    {
      id: '4',
      quote: "My potential is unlimited and I believe in myself.",
      author: "Brené Brown",
      dailyGoals: ["Challenge a limiting belief", "Celebrate a win", "Practice courage"],
      tags: ['confidence', 'self-love', 'mindfulness'],
      reminderTime: '06:30:00',
      isActive: true,
      isFavorited: false,
      viewCount: 654,
      category: 'confidence',
      dateCreated: new Date().toISOString()
    },
    {
      id: '5',
      quote: "I choose to focus on what I can control and let go of what I cannot.",
      author: "Epictetus",
      dailyGoals: ["Practice letting go", "Focus on solutions", "Breathe mindfully"],
      tags: ['mindfulness', 'gratitude', 'growth'],
      reminderTime: '20:00:00',
      isActive: true,
      isFavorited: false,
      viewCount: 521,
      category: 'mindfulness',
      dateCreated: new Date().toISOString()
    },
    {
      id: '6',
      quote: "Success is not final, failure is not fatal. It is the courage to continue that counts.",
      author: "Winston Churchill",
      dailyGoals: ["Take a brave step", "Learn from setbacks", "Keep moving forward"],
      tags: ['motivation', 'success', 'goals'],
      reminderTime: '10:00:00',
      isActive: true,
      isFavorited: false,
      viewCount: 1089,
      category: 'success',
      dateCreated: new Date().toISOString()
    },
    {
      id: '7',
      quote: "I am worthy of love, respect, and all good things.",
      author: "Maya Angelou",
      dailyGoals: ["Practice self-compassion", "Acknowledge your worth", "Set healthy boundaries"],
      tags: ['self-love', 'gratitude', 'mindfulness'],
      reminderTime: '21:00:00',
      isActive: true,
      isFavorited: false,
      viewCount: 943,
      category: 'self-love',
      dateCreated: new Date().toISOString()
    },
    {
      id: '8',
      quote: "I am strong, resilient, and capable of overcoming any challenge.",
      author: "Unknown",
      dailyGoals: ["Face a challenge head-on", "Build resilience", "Trust yourself"],
      tags: ['confidence', 'motivation', 'growth'],
      reminderTime: '07:30:00',
      isActive: true,
      isFavorited: false,
      viewCount: 687,
      category: 'confidence',
      dateCreated: new Date().toISOString()
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadAffirmations();
    this.extractTags();
  }

  loadAffirmations() {
    // Simulate loading from backend
    this.affirmations = this.mockAffirmations;
    this.filteredAffirmations = this.mockAffirmations;
    this.loading = false;
  }

  extractTags() {
    const tagSet = new Set<string>();
    this.affirmations.forEach(aff => {
      aff.tags?.forEach(tag => tagSet.add(tag));
    });
    this.allTags = Array.from(tagSet).sort();
  }

  filterByTag(tag: string) {
    this.selectedTag = this.selectedTag === tag ? null : tag;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredAffirmations = this.affirmations.filter(aff => {
      const matchesSearch = aff.quote.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          aff.author.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesTag = !this.selectedTag || aff.tags?.includes(this.selectedTag);
      return matchesSearch && matchesTag;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  toggleFavorite(affirmation: AffirmationCard, event: Event) {
    event.stopPropagation();
    affirmation.isFavorited = !affirmation.isFavorited;
  }

  shareAffirmation(affirmation: AffirmationCard, event: Event) {
    event.stopPropagation();
    const shareText = `"${affirmation.quote}" - ${affirmation.author}`;

    if (navigator.share) {
      navigator.share({
        title: 'Daily Affirmation',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Affirmation copied to clipboard!');
    }
  }

  setReminder(affirmation: AffirmationCard, event: Event) {
    event.stopPropagation();
    alert(`Reminder set for ${affirmation.reminderTime}`);
  }

  navigateToAffirmation(id: string) {
    this.router.navigate(['/affirmations', id]);
  }

  getGradientClass(tags?: string[]): string {
    if (!tags || tags.length === 0) return 'from-indigo-500 to-purple-500';
    const primaryTag = tags[0];
    return this.categoryColors[primaryTag] || 'from-indigo-500 to-purple-500';
  }

  clearFilters() {
    this.selectedTag = null;
    this.searchQuery = '';
    this.filteredAffirmations = this.affirmations;
  }

  getSortedByPopularity() {
    return [...this.filteredAffirmations].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  }
}
