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
  completionStatus?: TaskStatus;
  priority?: Priority;
  department?: string;
  progress:number;
  milestones?:string;
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
  id:string;
  quote: string;
  dailyGoals?: string[];
  author:string;
  tags?: string[];
  reminderTime?: ISODateString;
  isActive?: boolean;
}

export interface Attachment {
  id: string;
  type: string;
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
  type?: string ; // Different note types
  tags?: string[];
  items?: string[];  // For list-type notes
  aiSummary?: string;
  attachments?:Attachment[];
  preview?: string;
}

export interface CalendarEvent {
  id: number;
  name: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
  type: string;
  projectId?: number;
  color: string;
  description?: string;
}

export interface FilterOptions {
  completionStatus?: TaskStatus;
  priority?: Priority;
  category?: string;
  searchQuery?: string;
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

// ============= LMS Models =============

export interface Resource extends BaseEntity {
  name: string;
  description?: string;
  content: string[]
  progress: number;
  modules: number;
  completedModules: number;
  totalHours?: number;
  category?: string;
  parentId?: UUID; // For nested structure
  type: string;
  children?: Resource[];
}

export interface Skill extends BaseEntity {
  name: string;
  level: number; // 0-100
  targetLevel: number; // 0-100
  category?: string;
  relatedCourses?: UUID[];
  marketDemand?: number; // 0-100
  lastUpdated: ISODateString;
}

export interface MarketInsight extends BaseEntity {
  name:string;
  trend?:string;
  demand?:Priority;
  marketLevel?:number;
  jobListingCount?:number;
  growthRate?: number;
  category?: string;
  totalRelevantJobs?: number;
  weeklyGrowth?: number; // Percentage
  topSkillsCombination?: string[];
  averageSalary?: string;
  isStarred?:boolean | undefined;
  relevanceScore?:number;
  link?:string;
  sourceType?: string;
  hotSkills?: Array<{
    id:string;
    skill: string;
    growth: number;
  }>;
  lastUpdated: ISODateString;
}

export interface LearningRecommendation extends BaseEntity {
  title: string;
  reason: string;
  provider: string;
  duration: string;
  priority: Priority;
  matchScore: number; // 0-100
  skillsAddressed: string[];
  link?: string;
  cost?: number;
}

export interface JobOpportunity extends BaseEntity {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requiredSkills: string[];
  matchPercentage: number; // How well user matches (0-100)
  postedDate: ISODateString;
  link: string;
  isStarred: boolean;
  applicationStatus?: string;
}

// ============= Filter Options =============

export interface TrendFilterOptions {
  sourceType?: 'article' | 'bulletin' | 'rss' | 'email' | 'webinar' | 'publication' | 'all' | 'starred';
  category?: string;
  minRelevanceScore?: number;
  tags?: string[];
  dateRange?: {
    start: ISODateString;
    end: ISODateString;
  };
  isRead?: boolean;
}


