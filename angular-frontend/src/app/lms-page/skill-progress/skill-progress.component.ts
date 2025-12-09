import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Skill, LearningRecommendation } from '../../../models.interface';
import { mockSkillsLMS, mockLearningRecommendations } from '../../../services/test.data';

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  targetDate: string;
}

interface LearningPath {
  id: string;
  name: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  progress: number;
}

@Component({
  selector: 'app-skill-progress',
  standalone: true,
  imports: [],
  templateUrl: './skill-progress.component.html',
  styleUrls: ['./skill-progress.component.css']
})
export class SkillProgressComponent implements OnInit {
  skill: Skill | undefined;
  relatedRecommendations: LearningRecommendation[] = [];

  milestones: Milestone[] = [];
  learningPaths: LearningPath[] = [];

  // Statistics
  totalStudyHours = 0;
  completedLessons = 0;
  totalLessons = 0;
  currentStreak = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSkillData(id);
    }
  }

  loadSkillData(id: string) {
    // Load skill
    this.skill = mockSkillsLMS.find(s => s.id === id);

    if (!this.skill) return;

    // Load related recommendations
    this.relatedRecommendations = mockLearningRecommendations.filter(rec =>
      rec.skillsAddressed.includes(this.skill!.name)
    );

    // Generate mock milestones
    this.milestones = this.generateMilestones();

    // Generate mock learning paths
    this.learningPaths = this.generateLearningPaths();

    // Generate mock statistics
    this.generateStatistics();
  }

  generateMilestones(): Milestone[] {
    if (!this.skill) return [];

    const skillLevel = this.skill.level;
    const targetLevel = this.skill.targetLevel;
    const gap = targetLevel - skillLevel;

    return [
      {
        id: 'm1',
        title: 'Fundamentals Mastery',
        description: 'Complete core concepts and basic exercises',
        completed: skillLevel >= 30,
        targetDate: '2025-02-15'
      },
      {
        id: 'm2',
        title: 'Intermediate Proficiency',
        description: 'Build practical projects and solve complex problems',
        completed: skillLevel >= 60,
        targetDate: '2025-03-30'
      },
      {
        id: 'm3',
        title: 'Advanced Techniques',
        description: 'Master advanced patterns and best practices',
        completed: skillLevel >= 80,
        targetDate: '2025-05-15'
      },
      {
        id: 'm4',
        title: 'Expert Level',
        description: 'Contribute to community and mentor others',
        completed: skillLevel >= targetLevel,
        targetDate: '2025-07-01'
      }
    ];
  }

  generateLearningPaths(): LearningPath[] {
    if (!this.skill) return [];

    return [
      {
        id: 'lp1',
        name: 'Beginner Course',
        duration: '4 weeks',
        difficulty: 'Beginner',
        completed: this.skill.level >= 30,
        progress: Math.min(100, (this.skill.level / 30) * 100)
      },
      {
        id: 'lp2',
        name: 'Intermediate Practice',
        duration: '6 weeks',
        difficulty: 'Intermediate',
        completed: this.skill.level >= 60,
        progress: Math.max(0, Math.min(100, ((this.skill.level - 30) / 30) * 100))
      },
      {
        id: 'lp3',
        name: 'Advanced Mastery',
        duration: '8 weeks',
        difficulty: 'Advanced',
        completed: this.skill.level >= 90,
        progress: Math.max(0, Math.min(100, ((this.skill.level - 60) / 30) * 100))
      }
    ];
  }

  generateStatistics() {
    if (!this.skill) return;

    this.totalStudyHours = Math.floor(this.skill.level * 2.5);
    this.completedLessons = Math.floor(this.skill.level / 5);
    this.totalLessons = Math.floor(this.skill.targetLevel / 5);
    this.currentStreak = Math.floor(Math.random() * 14) + 1;
  }

  goBack() {
    this.router.navigate(['/lms']);
  }

  getProgressColor(): string {
    if (!this.skill) return 'bg-gray-400';

    const progress = (this.skill.level / this.skill.targetLevel) * 100;
    if (progress < 30) return 'bg-red-500';
    if (progress < 60) return 'bg-yellow-500';
    if (progress < 80) return 'bg-blue-500';
    return 'bg-green-500';
  }

  getDifficultyClass(difficulty: string): string {
    const classes: {[key: string]: string} = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-yellow-100 text-yellow-700',
      'Advanced': 'bg-red-100 text-red-700'
    };
    return classes[difficulty] || 'bg-gray-100 text-gray-700';
  }

  navigateToRecommendation(id: string) {
    this.router.navigate(['/recommendation', id]);
  }
}
