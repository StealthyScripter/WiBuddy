import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Technology, Skill } from '../../../models.interface';
import { mockTechTrends, mockSkillsLMS } from '../../../services/test.data';

interface TechDetail {
  tech: Technology;
  proficiency: number;
  jobDemand: number;
  averageSalary: string;
  relatedSkills: Skill[];
  learningResources: Array<{
    title: string;
    provider: string;
    duration: string;
    level: string;
  }>;
}

@Component({
  selector: 'app-tech-stack-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack-page.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f9fafb;
    }
  `]
})
export class TechStackPageComponent implements OnInit {
  techDetail: TechDetail | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('techId');
    if (id) {
      this.loadTechData(id);
    }
  }

  loadTechData(id: string) {
    // Find technology from mock data
    const techTrend = mockTechTrends.find(t => t.id === id);

    if (!techTrend) {
      this.loading = false;
      return;
    }

    // Create tech detail object
    this.techDetail = {
      tech: {
        id,
        name: techTrend.name,
        description: this.getDescriptionForTech(techTrend.name),
        category: techTrend.category,
        proficiency: 45,
        count: techTrend.jobListingCount || 0,
        dateCreated: new Date().toISOString()
      },
      proficiency: 45,
      jobDemand: techTrend.marketLevel || 0,
      averageSalary: '$85,000 - $130,000',
      relatedSkills: this.getRelatedSkills(techTrend.name),
      learningResources: this.getLearningResources(techTrend.name)
    };

    this.loading = false;
  }

  private getDescriptionForTech(techName: string): string {
    const descriptions: {[key: string]: string} = {
      'React': 'A JavaScript library for building user interfaces with reusable components and efficient rendering.',
      'Node.js': 'A JavaScript runtime for building scalable server-side applications.',
      'TypeScript': 'A typed superset of JavaScript that compiles to plain JavaScript.',
      'Python': 'A versatile, high-level programming language known for its simplicity and readability.',
      'Kubernetes': 'Container orchestration platform for automating deployment, scaling, and management.',
      'AWS': 'Comprehensive cloud computing platform with services for compute, storage, and networking.'
    };
    return descriptions[techName] || 'A key technology in modern development';
  }

  private getRelatedSkills(techName: string): Skill[] {
    return mockSkillsLMS.filter(skill =>
      skill.name.toLowerCase().includes(techName.toLowerCase()) ||
      skill.category?.toLowerCase().includes(techName.toLowerCase())
    ).slice(0, 5);
  }

  private getLearningResources(techName: string): Array<any> {
    return [
      {
        title: `${techName} Fundamentals`,
        provider: 'Coursera',
        duration: '4 weeks',
        level: 'Beginner'
      },
      {
        title: `Advanced ${techName} Patterns`,
        provider: 'Udemy',
        duration: '8 weeks',
        level: 'Intermediate'
      },
      {
        title: `${techName} in Production`,
        provider: 'Pluralsight',
        duration: '6 weeks',
        level: 'Advanced'
      }
    ];
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  getMarketColor(demand: number): string {
    if (demand >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (demand >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  }

  getProficiencyColor(proficiency: number): string {
    if (proficiency >= 70) return 'text-green-600';
    if (proficiency >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  navigateToSkill(skillId: string) {
    this.router.navigate(['/skill-progress', skillId]);
  }
}
