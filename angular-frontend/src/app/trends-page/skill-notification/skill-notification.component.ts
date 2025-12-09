import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from '../../../models.interface';
import { mockStandoutSkills, mockSkillsLMS } from '../../../services/test.data';

@Component({
  selector: 'app-skill-notification',
  standalone: true,
  imports: [],
  templateUrl: './skill-notification.component.html',
  styleUrls: ['./skill-notification.component.css']
})
export class SkillNotificationComponent implements OnInit {
  skill: Skill | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Try both skill sources
      this.skill = [...mockStandoutSkills, ...mockSkillsLMS].find(s => s.id === id);
    }
  }

  goBack() {
    this.router.navigate(['/trends']);
  }
}
