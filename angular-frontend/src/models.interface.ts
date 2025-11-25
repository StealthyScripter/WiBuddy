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
  id:string;
  quote: string;
  dailyGoals?: string[];
  userId?: UUID;
  author:string;
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

// Add these interfaces to your existing models.interface.ts file

// ============= LMS Models =============

export interface Course extends BaseEntity {
  name: string;
  description?: string;
  progress: number;
  modules: number;
  completedModules: number;
  totalHours?: number;
  category?: string;
  parentId?: UUID; // For nested structure
  type: 'folder' | 'course';
  children?: Course[];
  goal?: LearningGoal;
}

export interface LearningGoal extends BaseEntity {
  courseId: UUID;
  description: string;
  targetDate?: ISODateString;
  milestones: Milestone[];
  isCompleted: boolean;
}

export interface Milestone extends BaseEntity {
  goalId: UUID;
  title: string;
  description: string;
  targetDate?: ISODateString;
  isCompleted: boolean;
  order: number;
}

export interface StudyMaterial extends BaseEntity {
  courseId: UUID;
  title: string;
  type: 'notes' | 'flashcards' | 'resources' | 'practice' | 'quiz' | 'summary';
  content?: string[];
  items: number;
  lastModified: ISODateString;
  attachments?: Attachment[];
}

export interface Flashcard extends BaseEntity {
  materialId: UUID;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: ISODateString;
  nextReview?: ISODateString;
  reviewCount: number;
}

export interface Quiz extends BaseEntity {
  materialId: UUID;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: QuizAttempt[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface QuizAttempt extends BaseEntity {
  quizId: UUID;
  score: number;
  completedAt: ISODateString;
  answers: number[];
}

export interface Skill extends BaseEntity {
  name: string;
  level: number; // 0-100
  targetLevel: number; // 0-100
  trend: 'up' | 'down' | 'neutral';
  category?: string;
  relatedCourses?: UUID[];
  marketDemand?: number; // 0-100
  lastUpdated: ISODateString;
}

export interface LearningActivity extends BaseEntity {
  courseId: UUID;
  moduleName: string;
  completed: boolean;
  timestamp: ISODateString;
  type:"resource" | "notes";
}

// ============= Trends & Insights Models =============

export interface TrendItem extends BaseEntity {
  id:string;
  title: string;
  resource: string;
  sourceType: 'article' | 'bulletin' | 'rss' | 'email' | 'webinar' | 'publication';
  timestamp: ISODateString;
  relevanceScore: number; // 0-100
  category: string;
  summary: string;
  content?: string; // Full content for reading
  tags: string[];
  link: string;
  isStarred: boolean;
  isRead: boolean;
  aiGenerated?: boolean;
}

export interface TechTrend extends BaseEntity {
  name: string;
  trend: 'rising' | 'stable' | 'declining';
  demand: 'high' | 'medium' | 'low';
  marketLevel: number; // Average proficiency in market (0-100)
  jobCount: number; // Number of job listings
  growthRate?: number; // Percentage growth
  category?: string;
}

export interface StandoutSkill extends BaseEntity {
  id: string;
  skillName: string;
  strength: 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner';
  description: string;
  marketPosition: string; // e.g., "Top 15%"
  percentile: number;
  sourceCount: number; // How many job listings mention this
  lastUpdated: ISODateString;
}

export interface LearningRecommendation extends BaseEntity {
  title: string;
  reason: string;
  provider: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
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
  applicationStatus?: 'not_applied' | 'applied' | 'interviewing' | 'rejected' | 'accepted';
}

export interface JobMarketInsight extends BaseEntity {
  totalRelevantJobs: number;
  weeklyGrowth: number; // Percentage
  topSkillsCombination: string[];
  averageSalary?: string;
  hotSkills: Array<{
    id:string;
    skill: string;
    growth: number;
  }>;
  lastUpdated: ISODateString;
}

export interface CareerGoal extends BaseEntity {
  title: string;
  description: string;
  targetDate?: ISODateString;
  requiredSkills: string[];
  currentProgress: number; // 0-100
  milestones: string[];
  isActive: boolean;
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

export interface CourseFilterOptions {
  type?: 'folder' | 'course';
  category?: string;
  minProgress?: number;
  hasGoal?: boolean;
}
