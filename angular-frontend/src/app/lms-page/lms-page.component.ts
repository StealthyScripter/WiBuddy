import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  Course,
  StudyMaterial,
  Skill,
  LearningActivity
} from '../../models.interface';
import { BaseService } from '../../services/base_service';
import { MockLMSService } from '../../services/lms_service';
import {
  mockCourses,
  mockStudyMaterials,
  mockSkills,
  mockLearningActivities
} from '../../services/test.data';

@Component({
  selector: 'app-lms-page',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf],
  templateUrl: './lms-page.component.html',
  styleUrls: ['./lms-page.component.css']
})
export class LmsPageComponent implements OnInit {
  expandedFolders: string[] = ['root', 'web-dev'];
  selectedItem: string = 'react-basics';
  activeTab: string = 'overview';

  courseTree: Course | null = null;
  studyMaterials: StudyMaterial[] = [];
  skills: Skill[] = [];
  recentActivities: LearningActivity[] = [];

  selectedCourse: Course | null = null;
  loading = false;

  // Stats
  activeCourses = 3;
  studyHours = 42;
  skillsMastered = 8;
  avgProgress = 58;

  constructor(
    private router: Router,
    @Inject('LMSServiceToken') private lmsService: BaseService<Course>
  ) {}

  ngOnInit() {
    this.loadLMSData();
  }

  async loadLMSData() {
    this.loading = true;

    try {
      // Initialize mock service with data if using mock
      if (this.lmsService instanceof MockLMSService) {
        (this.lmsService as MockLMSService).setCourses(mockCourses);
        (this.lmsService as MockLMSService).setStudyMaterials(mockStudyMaterials);
        (this.lmsService as MockLMSService).setSkills(mockSkills);
        (this.lmsService as MockLMSService).setActivities(mockLearningActivities);
      }

      // Load course tree
      const treeResult = (this.lmsService as any).getCourseTree();
      if (treeResult instanceof Promise) {
        this.courseTree = await treeResult;
      } else {
        treeResult.subscribe((data: Course) => {
          this.courseTree = data;
        });
      }

      // Load selected course details
      await this.loadCourseDetails(this.selectedItem);

      // Load skills
      const skillsResult = (this.lmsService as any).getSkills();
      if (skillsResult instanceof Promise) {
        this.skills = await skillsResult;
      } else {
        skillsResult.subscribe((data: Skill[]) => {
          this.skills = data;
        });
      }

      // Load recent activities
      const activitiesResult = (this.lmsService as any).getRecentActivities();
      if (activitiesResult instanceof Promise) {
        this.recentActivities = await activitiesResult;
      } else {
        activitiesResult.subscribe((data: LearningActivity[]) => {
          this.recentActivities = data;
        });
      }

    } catch (error) {
      console.error('Failed to load LMS data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadCourseDetails(courseId: string) {
    const courseResult = this.lmsService.getById(courseId);

    if (courseResult instanceof Promise) {
      this.selectedCourse = await courseResult || null;
    } else {
      courseResult.subscribe(data => {
        this.selectedCourse = data;
      });
    }

    // Load study materials for selected course
    const materialsResult = (this.lmsService as any).getStudyMaterials(courseId);
    if (materialsResult instanceof Promise) {
      this.studyMaterials = await materialsResult;
    } else {
      materialsResult.subscribe((data: StudyMaterial[]) => {
        this.studyMaterials = data;
      });
    }
  }

  toggleFolder(id: string) {
    if (this.expandedFolders.includes(id)) {
      this.expandedFolders = this.expandedFolders.filter(f => f !== id);
    } else {
      this.expandedFolders.push(id);
    }
  }

  selectItem(item: Course) {
    if (item.type === 'folder') {
      this.toggleFolder(item.id);
    } else {
      this.selectedItem = item.id;
      this.loadCourseDetails(item.id);
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isExpanded(id: string): boolean {
    return this.expandedFolders.includes(id);
  }

  isSelected(id: string): boolean {
    return this.selectedItem === id;
  }

  getItemPaddingLeft(level: number): string {
    return `${level * 20 + 8}px`;
  }

  getMaterialIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'notes': 'file-text',
      'flashcards': 'brain',
      'resources': 'book',
      'practice': 'zap',
      'quiz': 'help-circle',
      'summary': 'file'
    };
    return icons[type] || 'file';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  }

  getProgressBarWidth(skill: Skill): string {
    return `${skill.level}%`;
  }

  getTargetPosition(skill: Skill): string {
    return `${skill.targetLevel}%`;
  }
}
