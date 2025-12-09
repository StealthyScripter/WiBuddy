import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';
import { Course, Module, UUID, StudyField } from '../models.interface';

// ============= Store Classes =============

class CourseStore {
  private courses: Map<UUID, Course> = new Map();
  private coursesList: Course[] = [];

  add(course: Course): void {
    this.courses.set(course.id, course);
    this.coursesList.push(course);
  }

  update(id: UUID, course: Partial<Course>): void {
    const existing = this.courses.get(id);
    if (existing) {
      const updated = { ...existing, ...course, lastModified: new Date().toISOString() };
      this.courses.set(id, updated);
      const index = this.coursesList.findIndex(c => c.id === id);
      if (index !== -1) {
        this.coursesList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.courses.delete(id);
    this.coursesList = this.coursesList.filter(c => c.id !== id);
  }

  get(id: UUID): Course | undefined {
    return this.courses.get(id);
  }

  getAll(): Course[] {
    return [...this.coursesList];
  }

  clear(): void {
    this.courses.clear();
    this.coursesList = [];
  }
}

class ModuleStore {
  private modules: Map<UUID, Module> = new Map();
  private modulesList: Module[] = [];

  add(module: Module): void {
    this.modules.set(module.id, module);
    this.modulesList.push(module);
  }

  update(id: UUID, module: Partial<Module>): void {
    const existing = this.modules.get(id);
    if (existing) {
      const updated = { ...existing, ...module, lastModified: new Date().toISOString() };
      this.modules.set(id, updated);
      const index = this.modulesList.findIndex(m => m.id === id);
      if (index !== -1) {
        this.modulesList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.modules.delete(id);
    this.modulesList = this.modulesList.filter(m => m.id !== id);
  }

  get(id: UUID): Module | undefined {
    return this.modules.get(id);
  }

  getByCourseId(courseId: UUID): Module[] {
    return this.modulesList.filter(m => m.courseId === courseId);
  }

  getAll(): Module[] {
    return [...this.modulesList];
  }

  clear(): void {
    this.modules.clear();
    this.modulesList = [];
  }
}

// ============= Logger =============

interface ILogger {
  log(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
}

class ConsoleLogger implements ILogger {
  log(message: string, ...args: any[]): void {
    console.log(`[CourseService] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[CourseService] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[CourseService] ${message}`, ...args);
  }
}

// ============= Date Provider =============

class DateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

// ============= Main Service =============

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courseStore = new CourseStore();
  private moduleStore = new ModuleStore();
  private logger: ILogger = new ConsoleLogger();
  private dateProvider = new DateProvider();

  // Observables for courses
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable().pipe(distinctUntilChanged());

  // Observables for modules
  private modulesSubject = new BehaviorSubject<Module[]>([]);
  public modules$ = this.modulesSubject.asObservable().pipe(distinctUntilChanged());

  // Error subjects
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.logger.log('CourseService initialized');
  }

  // ============= Course CRUD Operations =============

  createCourse(courseData: Omit<Course, 'id' | 'dateCreated' | 'lastModified'>): Course {
    try {
      const course: Course = {
        ...courseData,
        id: this.generateId(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        modules: courseData.modules || [],
        progress: courseData.progress || 0
      };

      this.courseStore.add(course);
      this.coursesSubject.next(this.courseStore.getAll());
      this.logger.log('Course created:', course.name);

      return course;
    } catch (error) {
      this.handleError('Failed to create course', error);
      throw error;
    }
  }

  updateCourse(id: UUID, updates: Partial<Course>): void {
    try {
      this.courseStore.update(id, updates);
      this.coursesSubject.next(this.courseStore.getAll());
      this.logger.log('Course updated:', id);
    } catch (error) {
      this.handleError('Failed to update course', error);
      throw error;
    }
  }

  deleteCourse(id: UUID): void {
    try {
      // Delete all modules associated with the course
      const modules = this.moduleStore.getByCourseId(id);
      modules.forEach(module => this.moduleStore.delete(module.id));

      this.courseStore.delete(id);
      this.coursesSubject.next(this.courseStore.getAll());
      this.modulesSubject.next(this.moduleStore.getAll());
      this.logger.log('Course deleted:', id);
    } catch (error) {
      this.handleError('Failed to delete course', error);
      throw error;
    }
  }

  getCourseById(id: UUID): Course | undefined {
    return this.courseStore.get(id);
  }

  getAllCourses(): Course[] {
    return this.courseStore.getAll();
  }

  getCoursesByField(field: StudyField): Course[] {
    return this.courseStore.getAll().filter(course => course.field === field);
  }

  getActiveCourses(): Course[] {
    const now = new Date();
    return this.courseStore.getAll().filter(course => {
      if (!course.endDate) return true;
      return new Date(course.endDate) >= now;
    });
  }

  // ============= Module CRUD Operations =============

  createModule(moduleData: Omit<Module, 'id' | 'dateCreated' | 'lastModified'>): Module {
    try {
      const module: Module = {
        ...moduleData,
        id: this.generateId(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        contents: moduleData.contents || [],
        progress: moduleData.progress || 0
      };

      this.moduleStore.add(module);

      // Add module to course
      const course = this.courseStore.get(moduleData.courseId);
      if (course) {
        course.modules.push(module);
        this.courseStore.update(course.id, { modules: course.modules });
        this.recalculateCourseProgress(course.id);
      }

      this.modulesSubject.next(this.moduleStore.getAll());
      this.coursesSubject.next(this.courseStore.getAll());
      this.logger.log('Module created:', module.name);

      return module;
    } catch (error) {
      this.handleError('Failed to create module', error);
      throw error;
    }
  }

  updateModule(id: UUID, updates: Partial<Module>): void {
    try {
      const module = this.moduleStore.get(id);
      if (!module) {
        throw new Error(`Module with id ${id} not found`);
      }

      this.moduleStore.update(id, updates);

      // Update in course
      const course = this.courseStore.get(module.courseId);
      if (course) {
        const moduleIndex = course.modules.findIndex(m => m.id === id);
        if (moduleIndex !== -1) {
          course.modules[moduleIndex] = { ...course.modules[moduleIndex], ...updates };
          this.courseStore.update(course.id, { modules: course.modules });
          this.recalculateCourseProgress(course.id);
        }
      }

      this.modulesSubject.next(this.moduleStore.getAll());
      this.coursesSubject.next(this.courseStore.getAll());
      this.logger.log('Module updated:', id);
    } catch (error) {
      this.handleError('Failed to update module', error);
      throw error;
    }
  }

  deleteModule(id: UUID): void {
    try {
      const module = this.moduleStore.get(id);
      if (!module) {
        throw new Error(`Module with id ${id} not found`);
      }

      this.moduleStore.delete(id);

      // Remove from course
      const course = this.courseStore.get(module.courseId);
      if (course) {
        course.modules = course.modules.filter(m => m.id !== id);
        this.courseStore.update(course.id, { modules: course.modules });
        this.recalculateCourseProgress(course.id);
      }

      this.modulesSubject.next(this.moduleStore.getAll());
      this.coursesSubject.next(this.courseStore.getAll());
      this.logger.log('Module deleted:', id);
    } catch (error) {
      this.handleError('Failed to delete module', error);
      throw error;
    }
  }

  getModuleById(id: UUID): Module | undefined {
    return this.moduleStore.get(id);
  }

  getModulesByCourse(courseId: UUID): Module[] {
    return this.moduleStore.getByCourseId(courseId).sort((a, b) => a.order - b.order);
  }

  getAllModules(): Module[] {
    return this.moduleStore.getAll();
  }

  // ============= Progress Calculation =============

  recalculateModuleProgress(moduleId: UUID): void {
    const module = this.moduleStore.get(moduleId);
    if (!module || !module.contents || module.contents.length === 0) return;

    const completedContents = module.contents.filter(c => c.isCompleted).length;
    const progress = Math.round((completedContents / module.contents.length) * 100);

    this.updateModule(moduleId, { progress });
  }

  recalculateCourseProgress(courseId: UUID): void {
    const course = this.courseStore.get(courseId);
    if (!course || !course.modules || course.modules.length === 0) return;

    const totalProgress = course.modules.reduce((sum, module) => sum + module.progress, 0);
    const progress = Math.round(totalProgress / course.modules.length);

    this.courseStore.update(courseId, { progress });
    this.coursesSubject.next(this.courseStore.getAll());
  }

  // ============= Search & Filter =============

  searchCourses(query: string): Course[] {
    const lowerQuery = query.toLowerCase();
    return this.courseStore.getAll().filter(course =>
      course.name.toLowerCase().includes(lowerQuery) ||
      course.description?.toLowerCase().includes(lowerQuery) ||
      course.code?.toLowerCase().includes(lowerQuery) ||
      course.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  searchModules(query: string): Module[] {
    const lowerQuery = query.toLowerCase();
    return this.moduleStore.getAll().filter(module =>
      module.name.toLowerCase().includes(lowerQuery) ||
      module.description?.toLowerCase().includes(lowerQuery)
    );
  }

  getUpcomingModules(daysAhead: number = 7): Module[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.moduleStore.getAll()
      .filter(module => {
        if (!module.dueDate) return false;
        const dueDate = new Date(module.dueDate);
        return dueDate >= now && dueDate <= futureDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.dueDate!).getTime();
        const dateB = new Date(b.dueDate!).getTime();
        return dateA - dateB;
      });
  }

  // ============= Statistics =============

  getCourseStatistics() {
    const courses = this.courseStore.getAll();
    const modules = this.moduleStore.getAll();

    const totalCourses = courses.length;
    const activeCourses = this.getActiveCourses().length;
    const completedCourses = courses.filter(c => c.progress === 100).length;
    const totalModules = modules.length;
    const completedModules = modules.filter(m => m.progress === 100).length;

    const averageProgress = courses.length > 0
      ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
      : 0;

    const coursesByField = courses.reduce((acc, course) => {
      acc[course.field] = (acc[course.field] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCourses,
      activeCourses,
      completedCourses,
      totalModules,
      completedModules,
      averageProgress,
      coursesByField
    };
  }

  // ============= Utility Methods =============

  private generateId(): UUID {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleError(message: string, error: any): void {
    this.logger.error(message, error);
    this.errorSubject.next(message);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // ============= Data Management =============

  setInitialData(courses: Course[], modules: Module[]): void {
    this.courseStore.clear();
    this.moduleStore.clear();

    courses.forEach(course => this.courseStore.add(course));
    modules.forEach(module => this.moduleStore.add(module));

    this.coursesSubject.next(this.courseStore.getAll());
    this.modulesSubject.next(this.moduleStore.getAll());

    this.logger.log(`Initialized with ${courses.length} courses and ${modules.length} modules`);
  }

  clearAllData(): void {
    this.courseStore.clear();
    this.moduleStore.clear();
    this.coursesSubject.next([]);
    this.modulesSubject.next([]);
    this.logger.log('All data cleared');
  }
}
