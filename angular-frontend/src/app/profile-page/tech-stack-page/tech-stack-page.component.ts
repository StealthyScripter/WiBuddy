import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Technology } from '../../../models.interface';
import { mockTechStack } from '../../../services/test.data';

@Component({
  selector: 'app-tech-stack-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack-page.component.html',
  styleUrl: './tech-stack-page.component.css'
})
export class TechStackPageComponent implements OnInit {
  technology: Technology | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const techId = this.route.snapshot.paramMap.get('techId');
    if (techId) {
      this.technology = mockTechStack.find(t => t.id === techId);
    }
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
