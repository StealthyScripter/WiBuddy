import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import {
  Resource,
  Skill,
  Task
} from '../models.interface';
import { BaseHttpService, BaseMockService, BaseService } from './base_service';
import { UtilityService } from './utility_service';

/**
 * HTTP-based LMS Service for production use
 */
@Injectable({
  providedIn: 'root'
})
export class LMSService extends BaseHttpService<Resource> {
  constructor(private httpClient: HttpClient) {
    super(`${environment.apiUrl}/lms/courses`, httpClient);
  }

  /**
   * Get resource tree structure
   */
  getCourseTree(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tree`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch resource tree')));
  }

  /**
   * Get study materials for a resource
   */
  getStudyMaterials(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/materials`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch study materials')));
  }

  /**
   * Create study material
   */
  createStudyMaterial(courseId: string, material: Partial<Resource>): Observable<any> {
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
   * Set learning goal for resource
   */
  setLearningGoal(courseId: string, goal: Partial<any>): Observable<any> {
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
export class MockLMSService extends BaseMockService<Resource> {
  private studyMaterials: Resource[] = [];
  private skills: Skill[] = [];
  private activities: Task[] = [];

  constructor() {
    super([]);
  }

  setCourses(mockCourses: Resource[]) {
    this.data = [...mockCourses];
  }

  setStudyMaterials(materials: Resource[]) {
    this.studyMaterials = [...materials];
  }

  setSkills(skills: Skill[]) {
    this.skills = [...skills];
  }

  setActivities(activities: Task[]) {
    this.activities = [...activities];
  }

  async getCourseTree(): Promise<Resource> {
    await UtilityService.simulateDelay();
    // Build tree structure from flat data
    const courses = [...this.data];
    const root: Resource = {
      id: 'root',
      name: 'My Learning',
      type: 'folder',
      progress: 0,
      modules: 0,
      completedModules: 0,
      content: ['string'],
      children: []
    };

    // Simple tree building - in real implementation, handle nesting better
    courses.forEach(resource => {
      if (!resource.parentId) {
        root.children = root.children || [];
        root.children.push(resource);
      }
    });

    return root;
  }

  async getStudyMaterials(courseId: string): Promise<Resource[]> {
    await UtilityService.simulateDelay();
    return this.studyMaterials.filter(m => m.id === courseId);
  }

  async getSkills(): Promise<Skill[]> {
    await UtilityService.simulateDelay();
    return [...this.skills];
  }

  async getRecentActivities(limit: number = 10): Promise<Task[]> {
    await UtilityService.simulateDelay();
    return this.activities;
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
  static getService(http?: HttpClient): BaseService<Resource> {
    if (environment.production && http) {
      return new LMSService(http);
    } else {
      return new MockLMSService();
    }
  }
}

