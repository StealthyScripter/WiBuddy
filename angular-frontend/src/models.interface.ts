import { DurationUnit } from "date-fns";

// Common Types
type ISODateString = string;
export type UUID = string;

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
  startDate?: Date;
  comments?:Comment[];
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
  id:UUID;
  quote: string;
  dailyGoals?: string[];
  author:string;
  tags?: string[];
  reminderTime?: ISODateString;
  isActive?: boolean;
}

export interface Attachment {
  id: UUID;
  type: string;
  name?: string;
  url?: string;
  thumbnail?: string;
}

export interface Note {
  id: UUID;
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
  id: UUID;
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
    id: UUID;
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
    id:UUID;
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

export type LibraryCreateType = 'resource' | 'folder' | 'note' | 'resource' | 'pdf' | 'image' | 'video' | 'audio' | 'ppt';

export interface LibraryItem {
  id: UUID;
  name: string;
  type: LibraryCreateType;
  parentId?: string;
  children?: LibraryItem[];
  dateCreated: string;
  lastModified: string;
  size?: number;
  icon?: string;
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

export interface Comment{
  authorId?: UUID;
  name?: string;
  content?: string;
  dateCreated?: ISODateString;
  projectId?: UUID;
  attachments?: Attachment[];
}

// ============= Learning Platform Models =============

export enum StudyField {
  TECHNOLOGY = 'TECHNOLOGY',
  NURSING = 'NURSING',
  BUSINESS = 'BUSINESS',
  ENGINEERING = 'ENGINEERING',
  SCIENCE = 'SCIENCE',
  ARTS = 'ARTS',
  OTHER = 'OTHER'
}

export enum ContentType {
  NOTE = 'NOTE',
  PDF = 'PDF',
  PPT = 'PPT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  ATTACHMENT = 'ATTACHMENT',
  LINK = 'LINK'
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum PerformanceLevel {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  POOR = 'POOR'
}

// Course/Module Management
export interface Course extends BaseEntity {
  name: string;
  code?: string;
  description?: string;
  field: StudyField;
  instructor?: string;
  semester?: string;
  credits?: number;
  modules: Module[];
  startDate?: ISODateString;
  endDate?: ISODateString;
  progress: number; // 0-100
  color?: string;
  tags?: string[];
  syllabus?: Document;
}

export interface Module extends BaseEntity {
  courseId: UUID;
  name: string;
  description?: string;
  order: number;
  learningObjectives?: string[];
  contents: LearningContent[];
  assessments?: Assessment[];
  progress: number; // 0-100
  estimatedHours?: number;
  completedHours?: number;
  dueDate?: ISODateString;
}

// Content Management (grouping materials)
export interface LearningContent extends BaseEntity {
  moduleId: UUID;
  name: string;
  description?: string;
  type: ContentType;
  fileUrl?: string;
  fileSize?: number;
  thumbnail?: string;
  notes?: Note[];
  attachments?: Attachment[];
  images?: string[];
  aiSummary?: string;
  aiCheatSheet?: string;
  flashcards?: Flashcard[];
  questions?: Question[];
  transcript?: Transcript;
  annotations?: Annotation[];
  isCompleted?: boolean;
  lastAccessedDate?: ISODateString;
  tags?: string[];
  order?: number;
}

// AI-Generated Learning Materials
export interface Flashcard extends BaseEntity {
  contentId: UUID;
  front: string;
  back: string;
  difficulty?: Priority;
  tags?: string[];
  reviewCount: number;
  lastReviewedDate?: ISODateString;
  nextReviewDate?: ISODateString;
  confidenceLevel?: number; // 0-100
  isStarred?: boolean;
}

export interface Question extends BaseEntity {
  contentId: UUID;
  moduleId?: UUID;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  difficulty?: Priority;
  tags?: string[];
  relatedConcepts?: string[];
  points?: number;
}

export interface CheatSheet extends BaseEntity {
  contentId?: UUID;
  moduleId?: UUID;
  courseId?: UUID;
  title: string;
  sections: CheatSheetSection[];
  tags?: string[];
  isStarred?: boolean;
  lastUpdated: ISODateString;
}

export interface CheatSheetSection {
  id: UUID;
  title: string;
  content: string;
  examples?: string[];
  keyPoints?: string[];
  order: number;
}

// Performance Tracking
export interface StudySession extends BaseEntity {
  moduleId?: UUID;
  courseId?: UUID;
  contentIds: UUID[];
  startTime: ISODateString;
  endTime?: ISODateString;
  duration?: number; // in minutes
  activitiesCompleted: string[];
  flashcardsReviewed?: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  notes?: string;
  focusScore?: number; // 0-100
}

export interface Assessment extends BaseEntity {
  moduleId: UUID;
  courseId: UUID;
  name: string;
  type: 'QUIZ' | 'EXAM' | 'ASSIGNMENT' | 'PROJECT' | 'PRACTICE';
  questions: Question[];
  totalPoints: number;
  passingScore?: number;
  dueDate?: ISODateString;
  submissionDate?: ISODateString;
  score?: number;
  feedback?: string;
  isGraded?: boolean;
  timeLimit?: number; // in minutes
}

export interface PerformanceMetrics extends BaseEntity {
  userId: UUID;
  courseId?: UUID;
  moduleId?: UUID;
  conceptId?: UUID;
  overallScore: number; // 0-100
  performanceLevel: PerformanceLevel;
  assessmentScores: AssessmentScore[];
  flashcardPerformance: FlashcardPerformance;
  studyTimeTotal: number; // in minutes
  weakPoints: WeakPoint[];
  strengths: string[];
  lastCalculated: ISODateString;
  trends?: PerformanceTrend[];
}

export interface AssessmentScore {
  assessmentId: UUID;
  score: number;
  maxScore: number;
  percentage: number;
  date: ISODateString;
  type: string;
}

export interface FlashcardPerformance {
  totalReviewed: number;
  averageConfidence: number;
  cardsNeedingReview: number;
  masteredCards: number;
  streak?: number;
}

export interface WeakPoint {
  id: UUID;
  concept: string;
  moduleId?: UUID;
  courseId?: UUID;
  score: number; // 0-100
  occurrences: number;
  relatedQuestions: UUID[];
  suggestedResources: LearningRecommendation[];
  lastIdentified: ISODateString;
  isAddressed?: boolean;
}

export interface PerformanceTrend {
  date: ISODateString;
  score: number;
  studyTime: number;
  assessmentsTaken: number;
}

// Document Management
export interface Document extends BaseEntity {
  name: string;
  originalName?: string;
  type: ContentType;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType?: string;
  pageCount?: number;
  annotations: Annotation[];
  status: DocumentStatus;
  processedPdfUrl?: string; // For converted PPT to PDF
  extractedText?: string;
  ocrText?: string;
  tags?: string[];
  uploadedBy?: UUID;
  isShared?: boolean;
  sharedWith?: UUID[];
}

export interface Annotation {
  id: UUID;
  documentId?: UUID;
  contentId?: UUID;
  noteId?: UUID;
  type: 'HIGHLIGHT' | 'UNDERLINE' | 'STRIKETHROUGH' | 'COMMENT' | 'DRAWING' | 'TEXT';
  content?: string;
  page?: number;
  position?: AnnotationPosition;
  color?: string;
  createdBy?: UUID;
  dateCreated: ISODateString;
  lastModified?: ISODateString;
  isResolved?: boolean;
  replies?: AnnotationReply[];
}

export interface AnnotationPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
  coordinates?: number[][]; // For complex shapes
}

export interface AnnotationReply {
  id: UUID;
  authorId: UUID;
  content: string;
  dateCreated: ISODateString;
}

// Transcription
export interface Transcript extends BaseEntity {
  contentId: UUID;
  audioUrl: string;
  text: string;
  segments: TranscriptSegment[];
  language?: string;
  duration?: number; // in seconds
  status: DocumentStatus;
  aiSummary?: string;
  keyPoints?: string[];
  speakers?: Speaker[];
}

export interface TranscriptSegment {
  id: UUID;
  text: string;
  startTime: number; // in seconds
  endTime: number;
  speakerId?: UUID;
  confidence?: number; // 0-100
}

export interface Speaker {
  id: UUID;
  name?: string;
  label: string; // e.g., "Speaker 1", "Speaker 2"
}

// AI Chat Assistant
export interface ChatConversation extends BaseEntity {
  courseId?: UUID;
  moduleId?: UUID;
  contentIds?: UUID[];
  title: string;
  messages: ChatMessage[];
  context?: string; // Summary of what the conversation is about
  isActive?: boolean;
  lastMessageDate: ISODateString;
}

export interface ChatMessage {
  id: UUID;
  conversationId: UUID;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  timestamp: ISODateString;
  relatedContent?: UUID[]; // References to course materials
  citations?: Citation[];
  isStarred?: boolean;
  feedback?: 'HELPFUL' | 'NOT_HELPFUL';
}

export interface Citation {
  contentId: UUID;
  contentName: string;
  excerpt: string;
  page?: number;
  url?: string;
}

// Trend Tracking Enhancement
export interface FieldTrend extends BaseEntity {
  field: StudyField;
  trendType: 'HOT_SKILL' | 'LATEST_RELEASE' | 'RESEARCH' | 'BEST_PRACTICE' | 'TOOL' | 'CERTIFICATION';
  title: string;
  description: string;
  source?: string;
  sourceUrl?: string;
  relevanceScore: number; // 0-100
  publishedDate: ISODateString;
  expiryDate?: ISODateString;
  tags?: string[];
  isStarred?: boolean;
  relatedSkills?: string[];
  difficulty?: Priority;
}

export interface LearningPattern {
  id: UUID;
  name: string;
  description: string;
  field: StudyField;
  steps: LearningStep[];
  estimatedDuration: string;
  difficulty: Priority;
  prerequisites?: string[];
  outcomes?: string[];
  successRate?: number; // 0-100
  isRecommended?: boolean;
}

export interface LearningStep {
  id: UUID;
  order: number;
  title: string;
  description: string;
  resources?: LearningRecommendation[];
  estimatedTime?: string;
}

// Calendar Enhancement
export interface ImportedCalendar extends BaseEntity {
  name: string;
  source: 'GOOGLE' | 'OUTLOOK' | 'ICAL' | 'MANUAL';
  url?: string;
  accessToken?: string;
  lastSynced?: ISODateString;
  syncFrequency?: number; // in minutes
  color?: string;
  isActive?: boolean;
  events?: CalendarEvent[];
}

export interface RecentActivity extends BaseEntity {
  type: 'COURSE' | 'MODULE' | 'CONTENT' | 'ASSESSMENT' | 'STUDY_SESSION' | 'FLASHCARD';
  entityId: UUID;
  entityName: string;
  action: 'VIEWED' | 'COMPLETED' | 'STARTED' | 'UPDATED' | 'CREATED' | 'REVIEWED';
  description?: string;
  timestamp: ISODateString;
  metadata?: Record<string, any>;
}


