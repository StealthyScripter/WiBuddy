import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningRecommendation } from '../../../models.interface';
import { mockLearningRecommendations } from '../../../services/test.data';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendation.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f9fafb;
      padding: 2rem 0;
    }
  `]
})
export class RecommendationComponent implements OnInit {
  recommendation: LearningRecommendation | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recommendation = mockLearningRecommendations.find(r => r.id === id);
    }
  }

  goBack() {
    this.router.navigate(['/trends']);
  }

  getPriorityClass(priority: string): string {
    const classes: {[key: string]: string} = {
      'HIGH': 'bg-red-100 text-red-700',
      'MEDIUM': 'bg-yellow-100 text-yellow-700',
      'LOW': 'bg-blue-100 text-blue-700'
    };
    return classes[priority] || classes['LOW'];
  }
}
