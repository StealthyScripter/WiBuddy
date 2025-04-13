import {Note, Task, Project} from '../models.interface';
import {mockNotes, mockProjects, mockTasks} from '../test-data/task.data'

// Base service class with common functionality
abstract class BaseService<T> {
  protected data: T[];

  constructor(mockData: T[]) {
    this.data = mockData;
  }

  // Simulate API delay
  protected async delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all items
  async getAll(): Promise<T[]> {
    await this.delay();
    return [...this.data];
  }

  // Get item by ID
  async getById(id: string): Promise<T | undefined> {
    await this.delay();
    return this.data.find((item: any) => item.id === id);
  }

  // Create a new item
  async create(item: Omit<T, 'id'>): Promise<T> {
    await this.delay();
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    } as unknown as T;

    this.data.push(newItem);
    return newItem;
  }

  // Update an existing item
  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    await this.delay();
    const index = this.data.findIndex((item: any) => item.id === id);

    if (index === -1) return undefined;

    const updatedItem = {
      ...this.data[index],
      ...updates,
    } as T;

    this.data[index] = updatedItem;
    return updatedItem;
  }

  // Delete an item
  async delete(id: string): Promise<boolean> {
    await this.delay();
    const index = this.data.findIndex((item: any) => item.id === id);

    if (index === -1) return false;

    this.data.splice(index, 1);
    return true;
  }
}

// Task Service
export class TaskService extends BaseService<Task> {
  constructor() {
    super(mockTasks);
  }

  // Get tasks by project ID
  async getByProjectId(projectId: string): Promise<Task[]> {
    await this.delay();
    return this.data.filter(task => task.projectId === projectId);
  }

  // Get tasks by completion status
  async getByCompletionStatus(completed: boolean): Promise<Task[]> {
    await this.delay();
    return this.data.filter(task => task.isCompleted === completed);
  }

  // Get tasks by due date range
  async getByDueDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    await this.delay();
    return this.data.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    });
  }

  // Get tasks by priority
  async getByPriority(priority: Task['priority']): Promise<Task[]> {
    await this.delay();
    return this.data.filter(task => task.priority === priority);
  }

  // Get tasks by tag
  async getByTag(tag: string): Promise<Task[]> {
    await this.delay();
    return this.data.filter(task => task.tags?.includes(tag));
  }

  // Toggle task completion status
  async toggleCompletion(id: string): Promise<Task | undefined> {
    const task = await this.getById(id);
    if (!task) return undefined;

    return this.update(id, { isCompleted: !task.isCompleted });
  }
}

// Project Service
export class ProjectService extends BaseService<Project> {
  constructor() {
    super(mockProjects);
  }

  // Get project with all related tasks
  async getProjectWithTasks(id: string): Promise<{ project: Project; tasks: Task[] } | undefined> {
    const project = await this.getById(id);
    if (!project) return undefined;

    const taskService = new TaskService();
    const tasks = await taskService.getByProjectId(id);

    return { project, tasks };
  }

  // Get recently updated projects
  async getRecentProjects(limit: number = 5): Promise<Project[]> {
    await this.delay();
    return [...this.data]
    .sort((a, b) =>
      new Date(b.lastModified || Date.now()).getTime() - new Date(a.lastModified || Date.now()).getTime())
      .slice(0, limit);
  }
}

// Note Service
export class NoteService extends BaseService<Note> {
  constructor() {
    super(mockNotes);
  }

  // Get notes by task ID
  async getByTaskId(taskId: string): Promise<Note[]> {
    await this.delay();
    return this.data.filter(note => note.id === taskId);
  }
  
  // Search notes by content
async searchNotes(query: string): Promise<Note[]> {
  await this.delay();
  const lowerCaseQuery = query.toLowerCase();

  return this.data.filter(note => {
    // Ensure `name` is a string and apply `toLowerCase()`
    const name = note.name.toLowerCase();

    // Join `content` (array of strings) into a single string and apply `toLowerCase()`
    const content = note.content.join(' ').toLowerCase();

    // Check if either name or content includes the query (case-insensitive)
    return name.includes(lowerCaseQuery) || content.includes(lowerCaseQuery);
  });
}

  // Get recent notes
  async getRecentNotes(limit: number = 5): Promise<Note[]> {
    await this.delay();
    return [...this.data]
    .sort((a, b) =>
      new Date(b.dateCreated || Date.now()).getTime() - new Date(a.dateCreated || Date.now()).getTime())
      .slice(0, limit);
  }
}
