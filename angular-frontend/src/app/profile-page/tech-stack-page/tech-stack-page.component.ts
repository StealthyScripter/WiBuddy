import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Technology, Skill } from '../../../models.interface';
import { mockTechStack, mockSkillsLMS } from '../../../services/test.data';

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
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('techId');
      if (id) {
        this.loadTechData(id);
      } else {
        this.loading = false;
        this.error = true;
      }
    });
  }

  loadTechData(id: string) {
    this.loading = true;
    this.error = false;

    // Find technology from mockTechStack (primary source)
    const tech = mockTechStack.find(t => t.id === id);

    if (!tech) {
      console.warn(`Technology with ID ${id} not found`);
      this.loading = false;
      this.error = true;
      return;
    }

    // Create tech detail object
    this.techDetail = {
      tech: {
        id: tech.id,
        name: tech.name,
        description: tech.description || this.getDescriptionForTech(tech.name),
        category: tech.category,
        proficiency: tech.proficiency || 45,
        count: tech.count || 0,
        dateCreated: tech.dateCreated || new Date().toISOString()
      },
      proficiency: tech.proficiency || 45,
      jobDemand: this.getJobDemandForTech(tech.name),
      averageSalary: this.getAverageSalaryForTech(tech.name),
      relatedSkills: this.getRelatedSkills(tech.name),
      learningResources: this.getLearningResources(tech.name)
    };

    this.loading = false;
  }

  private getDescriptionForTech(techName: string): string {
    const descriptions: { [key: string]: string } = {
      'React': 'A JavaScript library for building user interfaces with reusable components and efficient rendering.',
      'Node.js': 'A JavaScript runtime for building scalable server-side applications.',
      'TypeScript': 'A typed superset of JavaScript that compiles to plain JavaScript.',
      'Python': 'A versatile, high-level programming language known for its simplicity and readability.',
      'MongoDB': 'A NoSQL document database for flexible, scalable data storage.',
      'Angular': 'A comprehensive TypeScript framework for building dynamic web applications.',
      'Docker': 'Container technology for packaging applications with all dependencies.',
      'GraphQL': 'Query language and runtime for building flexible APIs.'
    };
    return descriptions[techName] || 'A key technology in modern development';
  }

  private getJobDemandForTech(techName: string): number {
    const demands: { [key: string]: number } = {
      'React': 92,
      'Node.js': 88,
      'TypeScript': 85,
      'Python': 95,
      'MongoDB': 76,
      'Angular': 72,
      'Docker': 82,
      'GraphQL': 70
    };
    return demands[techName] || 75;
  }

  private getAverageSalaryForTech(techName: string): string {
    const salaries: { [key: string]: string } = {
      'React': '$90,000 - $150,000',
      'Node.js': '$85,000 - $140,000',
      'TypeScript': '$95,000 - $155,000',
      'Python': '$80,000 - $135,000',
      'MongoDB': '$75,000 - $125,000',
      'Angular': '$85,000 - $140,000',
      'Docker': '$90,000 - $145,000',
      'GraphQL': '$95,000 - $150,000'
    };
    return salaries[techName] || '$85,000 - $130,000';
  }

  private getRelatedSkills(techName: string): Skill[] {
    return mockSkillsLMS
      .filter(skill =>
        skill.name.toLowerCase().includes(techName.toLowerCase()) ||
        skill.category?.toLowerCase().includes(techName.toLowerCase())
      )
      .slice(0, 5);
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

  getProficiencyColor(proficiency: number): string {
    if (proficiency >= 70) return 'text-green-600';
    if (proficiency >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  navigateToSkill(skillId: string) {
    this.router.navigate(['/skill-progress', skillId]);
  }
}
