import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import {
  Course,
  StudyMaterial,
  Skill,
  LearningActivity,
  LearningGoal,
  Milestone,
  Flashcard,
  Quiz,
  QuizAttempt,
  CourseFilterOptions
} from '../models.interface';
import { BaseHttpService, BaseMockService, BaseService } from './base_service';
import { UtilityService } from './utility_service';

/**
 * HTTP-based LMS Service for production use
 */
@Injectable({
  providedIn: 'root'
})
export class LMSService extends BaseHttpService<Course> {
  constructor(private httpClient: HttpClient) {
    super(`${environment.apiUrl}/lms/courses`, httpClient);
  }

  /**
   * Get courses with optional filtering
   */
  getCourses(options: CourseFilterOptions = {}): Observable<any> {
    let params = new HttpParams();

    if (options.type) {
      params = params.set('type', options.type);
    }
    if (options.category) {
      params = params.set('category', options.category);
    }
    if (options.minProgress !== undefined) {
      params = params.set('min_progress', options.minProgress.toString());
    }
    if (options.hasGoal !== undefined) {
      params = params.set('has_goal', options.hasGoal.toString());
    }

    return this.http.get(this.apiUrl, { params })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch courses')));
  }

  /**
   * Get course tree structure
   */
  getCourseTree(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tree`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch course tree')));
  }

  /**
   * Get study materials for a course
   */
  getStudyMaterials(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/materials`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch study materials')));
  }

  /**
   * Create study material
   */
  createStudyMaterial(courseId: string, material: Partial<StudyMaterial>): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/materials`, material)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to create study material')));
  }

  /**
   * Get skills
   */
  getSkills(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/lms/skills`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch skills')));
  }

  /**
   * Update skill level
   */
  updateSkillLevel(skillId: string, level: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/lms/skills/${skillId}`, { level })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to update skill')));
  }

  /**
   * Get learning activities
   */
  getRecentActivities(limit: number = 10): Observable<any> {
    return this.http.get(`${environment.apiUrl}/lms/activities?limit=${limit}`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch activities')));
  }

  /**
   * Set learning goal for course
   */
  setLearningGoal(courseId: string, goal: Partial<LearningGoal>): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/goal`, goal)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to set learning goal')));
  }

  /**
   * Get AI-generated milestones for a goal
   */
  generateMilestones(goalId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/lms/goals/${goalId}/generate-milestones`, {})
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to generate milestones')));
  }

  /**
   * Complete milestone
   */
  completeMilestone(milestoneId: string): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/lms/milestones/${milestoneId}/complete`, {})
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to complete milestone')));
  }

  /**
   * Get flashcards for material
   */
  getFlashcards(materialId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/lms/materials/${materialId}/flashcards`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch flashcards')));
  }

  /**
   * Submit quiz attempt
   */
  submitQuizAttempt(quizId: string, answers: number[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/lms/quizzes/${quizId}/attempt`, { answers })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to submit quiz')));
  }
}

/**
 * Mock LMS Service for development use
 */
@Injectable({
  providedIn: 'root'
})
export class MockLMSService extends BaseMockService<Course> {
  private studyMaterials: StudyMaterial[] = [];
  private skills: Skill[] = [];
  private activities: LearningActivity[] = [];

  constructor() {
    super([]);
  }

  setCourses(mockCourses: Course[]) {
    this.data = [...mockCourses];
  }

  setStudyMaterials(materials: StudyMaterial[]) {
    this.studyMaterials = [...materials];
  }

  setSkills(skills: Skill[]) {
    this.skills = [...skills];
  }

  setActivities(activities: LearningActivity[]) {
    this.activities = [...activities];
  }

  async getCourseTree(): Promise<Course> {
    await UtilityService.simulateDelay();
    // Build tree structure from flat data
    const courses = [...this.data];
    const root: Course = {
      id: 'root',
      name: 'My Learning',
      type: 'folder',
      progress: 0,
      modules: 0,
      completedModules: 0,
      children: []
    };

    // Simple tree building - in real implementation, handle nesting better
    courses.forEach(course => {
      if (!course.parentId) {
        root.children = root.children || [];
        root.children.push(course);
      }
    });

    return root;
  }

  async getStudyMaterials(courseId: string): Promise<StudyMaterial[]> {
    await UtilityService.simulateDelay();
    return this.studyMaterials.filter(m => m.courseId === courseId);
  }

  async getSkills(): Promise<Skill[]> {
    await UtilityService.simulateDelay();
    return [...this.skills];
  }

  async getRecentActivities(limit: number = 10): Promise<LearningActivity[]> {
    await UtilityService.simulateDelay();
    return this.activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async updateSkillLevel(skillId: string, level: number): Promise<Skill | undefined> {
    await UtilityService.simulateDelay();
    const index = this.skills.findIndex(s => s.id === skillId);
    if (index === -1) return undefined;

    this.skills[index] = {
      ...this.skills[index],
      level,
      lastUpdated: new Date().toISOString()
    };

    return this.skills[index];
  }
}

/**
 * LMS Service Factory
 */
@Injectable({
  providedIn: 'root'
})
export class LMSServiceFactory {
  static getService(http?: HttpClient): BaseService<Course> {
    if (environment.production && http) {
      return new LMSService(http);
    } else {
      return new MockLMSService();
    }
  }
}

