import { DurationUnit } from "date-fns";

// Common Types
type ISODateString = string;
type UUID = string;

// Status and Priority Enums
export enum TaskStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  OVERDUE = 'OVERDUE',
  NOT_STARTED = 'NOT_STARTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum TaskCategory {
  DEVELOPMENT = 'DEVELOPMENT',
  DESIGN = 'DESIGN',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  DEPLOYMENT = 'DEPLOYMENT'
}

// Base Interface for common properties
interface BaseEntity {
  id: UUID;
  dateCreated?: ISODateString;
  lastModified?: ISODateString;
}

// Task Interface
export interface Task extends BaseEntity {
  name: string;
  description?: string;
  isCompleted?: boolean; //for data manipulation - default false
  dueDate?: string;
  estimatedDuration?: number; // Consider using a Duration type
  completionDate?: ISODateString; //default today
  isMilestone?: boolean;
  projectId?: UUID;
  technologyId?: UUID[];
  completionStatus: TaskStatus;
  priority?: Priority;
  category?: TaskCategory;
  prerequisites?: UUID[]; // Array of Task IDs
  dependentTasks?: Task[]; // Populated through resolver
  assigneeId?: UUID;
  tags?: string[];
  attachments?: Attachment[];
}

// Project Interface
export interface Project extends BaseEntity {
  name: string;
  description?: string;
  dueDate?: string;
  completionDate?: ISODateString;
  isCompleted?: boolean;
  tasks?: Task[];
  ownerId?: UUID;
  teamMembers?: UUID[];
  completionStatus?: TaskStatus;
  priority?: Priority;
  department?: string;
  progress:number;
  milestones?:string;
}

// Project Methods Interface (Separate from data interface)
export interface ProjectMethods {
  getProjectMilestones(projectId: UUID): Promise<Task[]>;
  calculateProjectProgress(projectId: UUID): Promise<number>;
  getTechnologiesUsed(projectId: UUID): Promise<Technology[]>;
}

// Progress Interface
export interface Progress extends BaseEntity {
  entityType: 'TASK' | 'PROJECT';
  entityId: UUID;
  progressValue: number; // 0-100
  timestamp: ISODateString;
  notes?: string;
  updatedBy: UUID;
}

// Progress Service Interface
export interface ProgressService {
  calculateProgress(entityType: string, entityId: UUID): Promise<number>;
  trackProgress(progress: Omit<Progress, 'id' | 'dateCreated'>): Promise<Progress>;
}

// Technology Interface
export interface Technology extends BaseEntity {
  name: string;
  description?: string;
  version?: string;
  tasks?: Task[];
  category?: string;
  documentationUrl?: string;
  proficiency?:number;
  count?:number;
  icon?:string;
}

// Affirmation Interface
export interface Affirmation extends BaseEntity {
  content: string;
  dailyGoals?: string[];
  userId?: UUID;
  tags?: string[];
  reminderTime?: ISODateString;
  isActive?: boolean;
}

// Graph Interface
export interface Graph extends BaseEntity {
  name: string;
  type: 'BAR' | 'LINE' | 'PIE' | 'GANTT';
  dataSource?: {
    entityType: 'TASK' | 'PROJECT' | 'PROGRESS';
    entityId: UUID;
  };
  config: GraphConfig;
  refreshInterval?: number; // in milliseconds
}

// Additional Types
interface GraphConfig {
  xAxis?: {
    label: string;
    dataKey: string;
  };
  yAxis?: {
    label: string;
    dataKey: string;
  };
  colors?: string[];
  showLegend: boolean;
  isInteractive: boolean;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'link' | 'github';
  name?: string;
  url?: string;
  thumbnail?: string;
}

export interface Note {
  id: string;
  name: string;
  content: string[];
  dateCreated: string | null;
  lastModified?: string | null;
  type?: 'text' | 'list' | 'media' ; // Different note types
  imageUrl?: string;  // Preview thumbnail
  images?: { url: string; alt?: string }[];  // Full-size images in the note
  tags?: string[];
  items?: string[];  // For list-type notes
  aiSummary?: string;
  attachments?:Attachment[];
}

export interface DailyAffirmation {
  quote: string;
  author: string;
}

export interface CalendarEvent {
  id: number;
  name: string;
  date: Date;
  endDate?: Date;
  type: 'meeting' | 'deadline' | 'task';
  projectId?: number;
  color: string;
  description?: string;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  teamMembers: number;
  milestones: Task[];
}

export interface FilterOptions {
  completionStatus?: TaskStatus;
  priority?: Priority;
  category?: string;
  searchQuery?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
  }>;
}

export interface CalendarDay {
  date: Date;
  dayName: string;
  isToday: boolean;
  items: Array<{
    id: string;
    name: string;
    type: 'task' | 'project';
    priority: Priority;
    projectId?: string;
    projectColor?: string;
  }>;
}

export interface TimelineActivity {
  type: 'task' | 'project' | 'note';
  title: string;
  description: string;
  time: string;
}

export interface RecentNote {
  id:string;
  name: string;
  preview: string;
  date: string;
}

export interface Deadline {
  day: string;
  month: string;
  title: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
}

export interface KeyTakeaway {
  title: string;
  description: string;
}
