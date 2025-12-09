// angular-frontend/src/app/trends-page/trend-notification/trend-notification.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketInsight } from '../../../models.interface';
import { mockTrendItems } from '../../../services/test.data';

@Component({
  selector: 'app-trend-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trend-notification.component.html',
  styleUrls: ['./trend-notification.component.css']
})
export class TrendNotificationComponent implements OnInit {
  trend: MarketInsight | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trend = mockTrendItems.find(t => t.id === id);
    }
  }

  goBack() {
    this.router.navigate(['/trends']);
  }

  toggleStar() {
    if (this.trend) {
      this.trend.isStarred = !this.trend.isStarred;
    }
  }
}
