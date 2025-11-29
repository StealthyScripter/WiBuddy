import {
  Task,
  Project,
  Note,
  CalendarEvent,
  Technology,
  Affirmation,
  TaskStatus,
  Priority,
  TaskCategory,
  Attachment,
  Resource,
  Skill,
  LearningRecommendation,
  JobOpportunity,
  MarketInsight,
  UUID
} from '../models.interface';

// =============================================================================
// TASK TEST DATA
// =============================================================================
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Update User Interface',
    description: 'Implement new design system across the platform',
    completionStatus: TaskStatus.IN_PROGRESS,
    dueDate: '2025-03-15',
    isCompleted: false,
    dateCreated: new Date('2025-02-01').toISOString(),
    lastModified: new Date('2025-02-10').toISOString(),
    isMilestone: false,
    priority: Priority.HIGH,
    category: TaskCategory.DESIGN,
    projectId: 'uuid-1',
    estimatedDuration: 40,
    assigneeId: 'user-1',
    tags: ['UI', 'Design System', 'Frontend'],
    prerequisites: [],
    dependentTasks: [],
    attachments: [
      {
        id: 'att-1',
        type: 'document',
        name: 'Design_Specs.pdf',
        url: '/assets/design-specs.pdf'
      }
    ]
  },
  {
    id: 'task-2',
    name: 'API Integration',
    description: 'Connect backend services with frontend',
    completionStatus: TaskStatus.COMPLETED,
    dueDate: '2025-03-20',
    isCompleted: true,
    dateCreated: new Date('2025-02-05').toISOString(),
    lastModified: new Date('2025-02-25').toISOString(),
    completionDate: new Date('2025-02-25').toISOString(),
    isMilestone: true,
    priority: Priority.MEDIUM,
    category: TaskCategory.DEVELOPMENT,
    projectId: 'uuid-1',
    estimatedDuration: 24,
    assigneeId: 'user-2',
    tags: ['API', 'Backend', 'Integration'],
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-3',
    name: 'Security Audit',
    description: 'Perform security assessment and fix vulnerabilities',
    completionStatus: TaskStatus.CANCELLED,
    dueDate: '2025-03-25',
    isCompleted: false,
    dateCreated: new Date('2025-02-10').toISOString(),
    lastModified: new Date('2025-02-15').toISOString(),
    isMilestone: false,
    priority: Priority.CRITICAL,
    category: TaskCategory.TESTING,
    estimatedDuration: 16,
    assigneeId: 'user-3',
    tags: ['Security', 'Audit', 'Testing'],
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-4',
    name: 'Create a program dashboard',
    description: 'Build analytics dashboard for program metrics',
    completionStatus: TaskStatus.NOT_STARTED,
    dueDate: '2025-04-15',
    isCompleted: false,
    dateCreated: new Date('2025-01-15').toISOString(),
    lastModified: new Date('2025-01-15').toISOString(),
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DEVELOPMENT,
    projectId: 'uuid-2',
    estimatedDuration: 32,
    tags: ['Dashboard', 'Analytics', 'Charts'],
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-5',
    name: 'Start Documentation',
    description: 'Create comprehensive project documentation',
    completionStatus: TaskStatus.OVERDUE,
    dueDate: '2025-02-01',
    isCompleted: false,
    dateCreated: new Date('2025-01-20').toISOString(),
    lastModified: new Date('2025-01-25').toISOString(),
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DOCUMENTATION,
    projectId: 'uuid-3',
    estimatedDuration: 8,
    tags: ['Documentation', 'Guide'],
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-6',
    name: 'Machine Learning Model',
    description: 'Develop and train ML model for data analysis',
    completionStatus: TaskStatus.IN_PROGRESS,
    dueDate: '2025-04-30',
    isCompleted: false,
    dateCreated: new Date('2025-01-25').toISOString(),
    lastModified: new Date('2025-02-01').toISOString(),
    isMilestone: true,
    priority: Priority.HIGH,
    category: TaskCategory.DEVELOPMENT,
    projectId: 'proj-2',
    estimatedDuration: 80,
    assigneeId: 'user-1',
    tags: ['ML', 'Python', 'Data Science'],
    prerequisites: [],
    dependentTasks: []
  }
];

// =============================================================================
// PROJECT TEST DATA
// =============================================================================
export const mockProjects: Project[] = [
  {
    id: 'uuid-1',
    name: 'Website Redesign',
    department: 'Marketing',
    description: 'Complete overhaul of company website with modern UI/UX principles and responsive design',
    completionStatus: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    progress: 75,
    isCompleted: false,
    dateCreated: new Date('2025-01-10').toISOString(),
    lastModified: new Date('2025-02-15').toISOString(),
    ownerId: 'owner-1',
    milestones: 'Design Complete, Development 75%, Testing Pending',
    comments: [{name:'Great progress so far!'}, {name:'Need to finalize the color scheme.'}, {name:'Client feedback incorporated.'}],
  },
  {
    id: 'uuid-2',
    name: 'Mobile App Development',
    department: 'Technology',
    description: 'Native mobile application for iOS and Android platforms with cross-platform features',
    completionStatus: TaskStatus.NOT_STARTED,
    priority: Priority.CRITICAL,
    progress: 0,
    isCompleted: false,
    dateCreated: new Date('2025-01-15').toISOString(),
    lastModified: new Date('2025-01-15').toISOString(),
    ownerId: 'owner-2',
    dueDate: '2025-06-30',
    milestones: 'Planning, Development, Testing, Deployment'
  },
  {
    id: 'uuid-3',
    name: 'Brand Identity',
    department: 'Design',
    description: 'Complete brand redesign including logo, guidelines, and marketing materials',
    completionStatus: TaskStatus.COMPLETED,
    priority: Priority.MEDIUM,
    progress: 100,
    isCompleted: true,
    dateCreated: new Date('2025-01-20').toISOString(),
    lastModified: new Date('2025-02-20').toISOString(),
    completionDate: new Date('2025-02-20').toISOString(),
    ownerId: 'owner-1',
    dueDate: '2025-02-20',
    milestones: 'Research Complete, Design Complete, Guidelines Complete'
  },
  {
    id: 'proj-2',
    name: 'Machine Learning Platform',
    department: 'Technology',
    description: 'AI-powered analytics platform for business intelligence and predictive modeling',
    completionStatus: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    progress: 40,
    isCompleted: false,
    dateCreated: new Date('2025-01-07').toISOString(),
    lastModified: new Date('2025-02-01').toISOString(),
    ownerId: 'user-1',
    dueDate: '2025-07-15',
    milestones: 'Data Pipeline 60%, Model Training 20%, API Development 0%'
  },
  {
    id: 'proj-3',
    name: 'Senior Capstone Project',
    department: 'Engineering',
    description: 'Final year engineering project focusing on sustainable technology solutions',
    completionStatus: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    progress: 20,
    isCompleted: false,
    dateCreated: new Date('2025-01-12').toISOString(),
    lastModified: new Date('2025-01-20').toISOString(),
    ownerId: 'user-1',
    dueDate: '2025-05-15',
    milestones: 'Research 40%, Prototype 10%, Testing 0%, Documentation 5%'
  }
];

// =============================================================================
// CALENDAR EVENT TEST DATA
// =============================================================================
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    name: 'Weekly Team Standup',
    date: new Date(2025, 1, 18, 10, 0),
    endDate: new Date(2025, 1, 18, 10, 30),
    type: 'meeting',
    color: '#4f46e5',
    description: 'Daily standup to discuss progress and blockers'
  },
  {
    id: '2',
    name: 'Website Redesign Deadline',
    date: new Date(2025, 3, 15),
    type: 'deadline',
    projectId: 1,
    color: '#ef4444',
    description: 'Final deadline for website redesign project'
  },
  {
    id: '3',
    name: 'Client Requirements Review',
    date: new Date(2025, 1, 20, 14, 0),
    endDate: new Date(2025, 1, 20, 15, 30),
    type: 'meeting',
    color: '#0ea5e9',
    description: 'Review updated requirements with client stakeholders'
  },
  {
    id: '4',
    name: 'Design System Presentation',
    date: new Date(2025, 1, 22, 13, 0),
    endDate: new Date(2025, 1, 22, 14, 30),
    type: 'meeting',
    projectId: 1,
    color: '#8b5cf6',
    description: 'Present new design system to leadership team'
  },
  {
    id: '5',
    name: 'ML Model Training Complete',
    date: new Date(2025, 3, 30),
    type: 'deadline',
    projectId: 2,
    color: '#10b981',
    description: 'Machine learning model training milestone'
  }
];

// =============================================================================
// TECHNOLOGY TEST DATA
// =============================================================================
export const mockTechStack: Technology[] = [
  {
    id: 'tech-1',
    name: 'React',
    description: 'Frontend JavaScript library',
    version: '18.2.0',
    category: 'Frontend',
    documentationUrl: 'https://react.dev/',
    proficiency: 85,
    count: 15,
    icon: '⚛️',
    dateCreated: new Date('2024-01-10').toISOString()
  },
  {
    id: 'tech-2',
    name: 'Node.js',
    description: 'Backend JavaScript runtime',
    version: '20.x',
    category: 'Backend',
    documentationUrl: 'https://nodejs.org/',
    proficiency: 70,
    count: 8,
    icon: '🟢',
    dateCreated: new Date('2024-02-15').toISOString()
  },
  {
    id: 'tech-3',
    name: 'Python',
    description: 'General-purpose programming language',
    version: '3.12',
    category: 'Backend',
    documentationUrl: 'https://python.org/',
    proficiency: 78,
    count: 5,
    icon: '🐍',
    dateCreated: new Date('2024-01-20').toISOString()
  },
  {
    id: 'tech-4',
    name: 'MongoDB',
    description: 'NoSQL database',
    version: '7.0',
    category: 'Database',
    documentationUrl: 'https://mongodb.com/',
    proficiency: 65,
    count: 3,
    icon: '🍃',
    dateCreated: new Date('2024-03-01').toISOString()
  },
  {
    id: 'tech-5',
    name: 'TypeScript',
    description: 'Typed superset of JavaScript',
    version: '5.3',
    category: 'Language',
    documentationUrl: 'https://typescriptlang.org/',
    proficiency: 80,
    count: 12,
    icon: '📘',
    dateCreated: new Date('2024-01-05').toISOString()
  },
  {
    id: 'tech-6',
    name: 'Angular',
    description: 'Frontend TypeScript framework',
    version: '17.x',
    category: 'Frontend',
    documentationUrl: 'https://angular.dev/',
    proficiency: 75,
    count: 8,
    icon: '🅰️',
    dateCreated: new Date('2024-02-01').toISOString()
  }
];

// =============================================================================
// USER & PROFILE TEST DATA
// =============================================================================
export const mockUsers = [
  {
    id: 'user-1',
    username: 'sarah_anderson',
    fullName: 'Sarah Anderson',
    email: 'sarah.anderson@company.com',
    role: 'Senior Software Developer',
    avatar: '/assets/avatars/sarah.jpg',
    skills: ['React', 'Angular', 'TypeScript', 'Node.js'],
    isAdmin: false,
    dateJoined: new Date('2023-06-15').toISOString()
  },
  {
    id: 'user-2',
    username: 'john_smith',
    fullName: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Backend Developer',
    avatar: '/assets/avatars/john.jpg',
    skills: ['Python', 'Node.js', 'MongoDB', 'Docker'],
    isAdmin: false,
    dateJoined: new Date('2023-03-20').toISOString()
  },
  {
    id: 'user-3',
    username: 'admin',
    fullName: 'Admin User',
    email: 'admin@company.com',
    role: 'System Administrator',
    avatar: '/assets/avatars/admin.jpg',
    skills: ['DevOps', 'Security', 'Cloud'],
    isAdmin: true,
    dateJoined: new Date('2022-01-10').toISOString()
  }
];

// =============================================================================
// PROFILE PAGE TEST DATA
// ============================================================================
export const mockRecentNotes: Note[] = [
  {
    id: 'note-1',
    name: 'API Integration Plan',
    content: [],
    preview: 'Steps for connecting the frontend to backend services...',
    dateCreated: 'Apr 15',
    lastModified: 'June 12'
  },
  {
    id: 'note-2',
    name: 'Client Feedback',
    content: [],
    preview: 'Notes from the latest client review session...',
    dateCreated: 'Apr 10',
    lastModified: 'Aug 23'
  },
  {
    id: 'note-3',
    name: 'Design System Guidelines',
    content: [],
    preview: 'Component standards and color palette documentation...',
    dateCreated: 'Apr 5',
    lastModified: 'Sep 12'
  }
];

// =============================================================================
// DAILY AFFIRMATION TEST DATA
// =============================================================================
export const mockDailyAffirmation: Affirmation = {
  id:'1',
  quote: "Engineering problems are under-defined; there are many solutions, good, bad, and indifferent. The art is to arrive at a good solution.",
  author: "Richard James"
};

// Alternative affirmations for rotation
export const mockDailyAffirmations: Affirmation[] = [
  {
    id:'2',
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    id:'3',
    quote: "Quality is not an act, it is a habit.",
    author: "Aristotle"
  },
  {
    id:'4',
    quote: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  mockDailyAffirmation
];

// =============================================================================
// STATISTICS AND METRICS
// =============================================================================
export const mockStatistics = {
  tasksCompleted: 47,
  tasksGrowth: 12, // percentage change
  activeProjects: 5,
  projectsGrowth: -5,
  notesCreated: 23,
  notesGrowth: 8,
  teamMembers: 8,
  completionRate: 78, // percentage
  overdueTasksCount: 3
};

// =============================================================================
// HELPER FUNCTIONS FOR TEST DATA
// =============================================================================
export class TestDataHelpers {
  /**
   * Get random items from an array
   */
  static getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Generate test user ID
   */
  static generateTestUserId(): string {
    return `test-user-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get mock data by date range
   */
  static getTasksByDateRange(startDate: Date, endDate: Date): Task[] {
    return mockTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    });
  }

  /**
   * Get mock data by project
   */
  static getTasksByProject(projectId: string): Task[] {
    return mockTasks.filter(task => task.projectId === projectId);
  }

  /**
   * Get mock data by status
   */
  static getTasksByStatus(status: TaskStatus): Task[] {
    return mockTasks.filter(task => task.completionStatus === status);
  }
}

export const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'React',
    level: 80,
    targetLevel: 90,
    category: 'Frontend',
    marketDemand: 95,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  },
  {
    id: 'skill-2',
    name: 'TypeScript',
    level: 65,
    targetLevel: 85,
    category: 'Programming',
    marketDemand: 88,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  },
  {
    id: 'skill-3',
    name: 'Python',
    level: 45,
    targetLevel: 70,
    category: 'Programming',
    marketDemand: 92,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  },
  {
    id: 'skill-4',
    name: 'SQL',
    level: 70,
    targetLevel: 80,
    category: 'Database',
    marketDemand: 85,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  }
];

// ============= Trends Mock Data =============

export const mockCalendarEventsExtended: CalendarEvent[] = [
  {
    id: '1',
    name: 'Weekly Team Standup',
    date: new Date(2025, 1, 18, 10, 0),
    startDate: new Date(2025, 1, 18, 10, 0),
    endDate: new Date(2025, 1, 18, 10, 30),
    type: 'meeting',
    color: '#4f46e5',
    description: 'Daily standup to discuss progress and blockers'
  },
  {
    id: '2',
    name: 'Website Redesign Deadline',
    date: new Date(2025, 3, 15),
    type: 'deadline',
    projectId: 1,
    color: '#ef4444',
    description: 'Final deadline for website redesign project'
  },
  {
    id: '3',
    name: 'Client Requirements Review',
    date: new Date(2025, 1, 20, 14, 0),
    startDate: new Date(2025, 1, 20, 14, 0),
    endDate: new Date(2025, 1, 20, 15, 30),
    type: 'meeting',
    color: '#0ea5e9',
    description: 'Review updated requirements with client stakeholders'
  },
  {
    id: '4',
    name: 'Design System Presentation',
    date: new Date(2025, 1, 22, 13, 0),
    startDate: new Date(2025, 1, 22, 13, 0),
    endDate: new Date(2025, 1, 22, 14, 30),
    type: 'meeting',
    projectId: 1,
    color: '#8b5cf6',
    description: 'Present new design system to leadership team'
  },
  {
    id: '5',
    name: 'ML Model Training Complete',
    date: new Date(2025, 3, 30),
    type: 'deadline',
    projectId: 2,
    color: '#10b981',
    description: 'Machine learning model training milestone'
  },
  {
    id: '6',
    name: 'Sprint Planning Meeting',
    date: new Date(2025, 1, 24, 11, 0),
    startDate: new Date(2025, 1, 24, 11, 0),
    endDate: new Date(2025, 1, 24, 12, 30),
    type: 'meeting',
    color: '#f59e0b',
    description: 'Plan tasks for next sprint'
  }
];

// ENHANCED TECHNOLOGY STACK
export const mockTechStackExtended: Technology[] = [
  ...mockTechStack,
  {
    id: 'tech-7',
    name: 'GraphQL',
    description: 'Query language for APIs',
    version: '3.5',
    category: 'Backend',
    documentationUrl: 'https://graphql.org/',
    proficiency: 60,
    count: 4,
    icon: '🔷',
    dateCreated: new Date('2024-03-10').toISOString()
  },
  {
    id: 'tech-8',
    name: 'PostgreSQL',
    description: 'Relational database',
    version: '15.x',
    category: 'Database',
    documentationUrl: 'https://postgresql.org/',
    proficiency: 72,
    count: 6,
    icon: '🐘',
    dateCreated: new Date('2024-03-05').toISOString()
  }
];
// =============================================================================
// NEW EVENT FORM DEFAULT DATA
// =============================================================================
export const mockEventTemplates = {
  meeting: {
    name: 'Team Meeting',
    type: 'meeting',
    duration: 60,
    color: '#4f46e5'
  },
  deadline: {
    name: 'Project Deadline',
    type: 'deadline',
    duration: 1440, // All day
    color: '#ef4444'
  },
  milestone: {
    name: 'Project Milestone',
    type: 'milestone',
    duration: 1440,
    color: '#10b981'
  },
  reminder: {
    name: 'Reminder',
    type: 'reminder',
    duration: 30,
    color: '#f59e0b'
  }
};

// =============================================================================
// SKILLS WITH DETAILED PROGRESSION DATA
// =============================================================================
export const mockSkillsDetailed: Skill[] = [
  {
    id: 'skill-detail-1',
    name: 'React',
    level: 82,
    targetLevel: 95,
    category: 'Frontend',
    relatedCourses: ['resource-102'],
    marketDemand: 92,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  },
  {
    id: 'skill-detail-2',
    name: 'Angular',
    level: 56,
    targetLevel: 85,
    category: 'Frontend',
    relatedCourses: ['resource-201'],
    marketDemand: 78,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  },
  {
    id: 'skill-detail-3',
    name: 'Python',
    level: 68,
    targetLevel: 90,
    category: 'Backend',
    relatedCourses: ['resource-301'],
    marketDemand: 95,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  },
  {
    id: 'skill-detail-4',
    name: 'Kubernetes',
    level: 42,
    targetLevel: 80,
    category: 'DevOps',
    relatedCourses: ['resource-401'],
    marketDemand: 88,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  },
  {
    id: 'skill-detail-5',
    name: 'GraphQL',
    level: 35,
    targetLevel: 75,
    category: 'Backend',
    relatedCourses: [],
    marketDemand: 82,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  }
];

// =============================================================================
// PROJECT TEST DATA
// =============================================================================
// Enhanced mock trend items with all required template properties
export const mockTrendItems: MarketInsight[] = [
  {
    id: 'insight-1',
    name: 'React 19 Released with New Features',
    trend: 'upward',
    demand: Priority.HIGH,
    marketLevel: 88,
    jobListingCount: 12500,
    growthRate: 14.2,
    category: 'AI',
    totalRelevantJobs: 45000,
    weeklyGrowth: 3.1,
    topSkillsCombination: ['LLM Ops', 'Prompt Engineering', 'Python'],
    averageSalary: '$148k',
    sourceType: 'article',
    relevanceScore: 95,
    isStarred: true,
    link: 'https://react.dev/blog',
    lastUpdated: '2 hours ago',
    hotSkills: [
      { id: 'hs1', skill: 'AI Model Integration', growth: 22 },
      { id: 'hs2', skill: 'Vector Databases', growth: 18 }
    ]
  },
  {
    id: 'insight-2',
    name: 'TypeScript 5.4 Announcement',
    trend: 'stable',
    demand: Priority.HIGH,
    marketLevel: 74,
    jobListingCount: 6300,
    growthRate: 9.1,
    category: 'Cloud',
    totalRelevantJobs: 23000,
    weeklyGrowth: 1.6,
    topSkillsCombination: ['FinOps', 'Kubernetes', 'Automation'],
    averageSalary: '$132k',
    sourceType: 'bulletin',
    relevanceScore: 88,
    isStarred: false,
    link: 'https://typescript.org',
    lastUpdated: '5 hours ago',
    hotSkills: [
      { id: 'hs3', skill: 'FinOps Analysis', growth: 16 },
      { id: 'hs4', skill: 'Cloud Monitoring', growth: 12 }
    ]
  },
  {
    id: 'insight-3',
    name: 'AI in Healthcare: Latest Developments',
    trend: 'upward',
    demand: Priority.MEDIUM,
    marketLevel: 61,
    jobListingCount: 15800,
    growthRate: 4.5,
    category: 'Frontend',
    totalRelevantJobs: 52000,
    weeklyGrowth: 0.4,
    topSkillsCombination: ['TypeScript', 'React', 'Bun'],
    averageSalary: '$118k',
    sourceType: 'rss',
    relevanceScore: 72,
    isStarred: false,
    link: 'https://healthtech.news',
    lastUpdated: '1 day ago',
    hotSkills: [
      { id: 'hs5', skill: 'TypeScript Patterns', growth: 8 },
      { id: 'hs6', skill: 'Bun Runtime', growth: 7 }
    ]
  }
];

// Enhanced tech trends with better formatting
export const mockTechTrends: MarketInsight[] = [
  {
    id: 'tech-2',
    name: 'TypeScript',
    trend: 'rising',
    demand: Priority.HIGH,
    marketLevel: 70,
    jobListingCount: 980,
    growthRate: 23,
    category: 'Programming',
    sourceType: 'article',
    relevanceScore: 85,
    link: 'https://typescript.org',
    lastUpdated: 'Feb 15',
    dateCreated: new Date().toISOString()
  },
  {
    id: 'tech-3',
    name: 'Python',
    trend: 'stable',
    demand: Priority.HIGH,
    marketLevel: 65,
    jobListingCount: 2100,
    growthRate: 8,
    category: 'Programming',
    sourceType: 'bulletin',
    relevanceScore: 92,
    link: 'https://python.org',
    lastUpdated: 'Dec 01',
    dateCreated: new Date().toISOString()
  }
];

// Standout skills with enhanced properties
export const mockStandoutSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'Prompt Engineering',
    level: 65,
    targetLevel: 90,
    category: 'AI',
    relatedCourses: ['course-101', 'course-102'],
    marketDemand: 94,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2025-01-03').toISOString()
  },
  {
    id: 'skill-2',
    name: 'FinOps Cloud Optimization',
    level: 40,
    targetLevel: 80,
    category: 'Cloud',
    relatedCourses: ['course-201'],
    marketDemand: 82,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2025-01-03').toISOString()
  },
  {
    id: 'skill-3',
    name: 'TypeScript Mastery',
    level: 80,
    targetLevel: 95,
    category: 'Frontend',
    relatedCourses: ['course-300', 'course-301'],
    marketDemand: 70,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2025-01-02').toISOString()
  }
];

// Learning recommendations with enhanced details
export const mockLearningRecommendations: LearningRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Container Orchestration with Kubernetes',
    reason: 'High market demand + Large skill gap',
    provider: 'Coursera',
    duration: '6 weeks',
    priority: Priority.HIGH,
    matchScore: 92,
    skillsAddressed: ['Kubernetes', 'Docker', 'DevOps'],
    link: 'https://coursera.org',
    cost: 49,
    dateCreated: new Date().toISOString()
  },
  {
    id: 'rec-2',
    title: 'Advanced Python for Data Science',
    reason: 'Growing in your field + Career goal alignment',
    provider: 'edX',
    duration: '8 weeks',
    priority: Priority.MEDIUM,
    matchScore: 78,
    skillsAddressed: ['Python', 'Data Science', 'ML'],
    link: 'https://edx.org',
    cost: 99,
    dateCreated: new Date().toISOString()
  },
  {
    id: 'rec-3',
    title: 'TypeScript Design Patterns',
    reason: 'Close to mastery + Job requirement',
    provider: 'Udemy',
    duration: '4 weeks',
    priority: Priority.LOW,
    matchScore: 65,
    skillsAddressed: ['TypeScript', 'Design Patterns'],
    link: 'https://udemy.com',
    cost: 29,
    dateCreated: new Date().toISOString()
  }
];

// Job opportunities
export const mockJobOpportunities: JobOpportunity[] = [
  {
    id: 'job-1',
    title: 'Senior React Developer',
    company: 'Tech Corp',
    location: 'Remote',
    salary: '$120k - $160k',
    description: 'Looking for experienced React developer with TypeScript expertise',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    matchPercentage: 92,
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://jobs.example.com/1',
    isStarred: true,
    applicationStatus: 'not_applied',
    dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    company: 'Startup Inc',
    location: 'New York, NY',
    salary: '$100k - $140k',
    description: 'Join our fast-growing startup building next-gen SaaS platform',
    requiredSkills: ['React', 'Python', 'PostgreSQL', 'AWS'],
    matchPercentage: 85,
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://jobs.example.com/2',
    isStarred: false,
    applicationStatus: 'not_applied',
    dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-3',
    title: 'Frontend Architect',
    company: 'Big Tech Co',
    location: 'San Francisco, CA',
    salary: '$150k - $200k',
    description: 'Lead frontend architecture for enterprise applications',
    requiredSkills: ['React', 'TypeScript', 'System Design', 'Microservices'],
    matchPercentage: 78,
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://jobs.example.com/3',
    isStarred: true,
    applicationStatus: 'not_applied',
    dateCreated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Overall job market insight
export const mockJobMarketInsight: MarketInsight = {
  id: 'market-insight-2025',
  name: '2025 Global Software Engineering Job Market Overview',
  trend: 'upward',
  demand: Priority.HIGH,
  marketLevel: 91,
  jobListingCount: 185000,
  growthRate: 15.4,
  category: 'Software Engineering',
  totalRelevantJobs: 820000,
  weeklyGrowth: 2.9,
  topSkillsCombination: [
    'AI-Augmented Development',
    'Cloud Automation',
    'Secure Coding'
  ],
  averageSalary: '$142k',
  sourceType: 'article',
  relevanceScore: 88,
  link: 'https://market-report.example.com',
  lastUpdated: '2025-01-04',
  dateCreated: new Date().toISOString(),
  hotSkills: [
    { id: 'hs10', skill: 'AI Code Assistants', growth: 28 },
    { id: 'hs11', skill: 'Cloud Security Automation', growth: 21 },
    { id: 'hs12', skill: 'Rust for Backend Systems', growth: 19 }
  ]
};

// ============================================================================
// ENHANCED TEST DATA FOR LMS - test.data.ts
// ============================================================================

import {
  LibraryItem,
} from '../models.interface';

// Enhanced Skills with more data points
export const mockSkillsLMS: Skill[] = [
  {
    id: 'skill-1',
    name: 'JavaScript',
    level: 65,
    targetLevel: 85,
    category: 'Programming',
    relatedCourses: ['resource-101', 'resource-102'],
    marketDemand: 90,
    lastUpdated: '2024-11-10T10:00:00Z',
    dateCreated: '2024-01-15T00:00:00Z'
  },
  {
    id: 'skill-2',
    name: 'Angular',
    level: 50,
    targetLevel: 80,
    category: 'Frontend',
    relatedCourses: ['resource-201'],
    marketDemand: 88,
    lastUpdated: '2024-11-05T12:15:00Z',
    dateCreated: '2024-02-20T00:00:00Z'
  },
  {
    id: 'skill-3',
    name: 'Python',
    level: 72,
    targetLevel: 90,
    category: 'Backend',
    relatedCourses: ['resource-301', 'resource-302'],
    marketDemand: 95,
    lastUpdated: '2024-10-18T08:40:00Z',
    dateCreated: '2024-01-10T00:00:00Z'
  },
  {
    id: 'skill-4',
    name: 'Docker',
    level: 40,
    targetLevel: 75,
    category: 'DevOps',
    relatedCourses: ['resource-401'],
    marketDemand: 85,
    lastUpdated: '2024-10-01T15:00:00Z',
    dateCreated: '2024-03-05T00:00:00Z'
  },
  {
    id: 'skill-5',
    name: 'TypeScript',
    level: 78,
    targetLevel: 95,
    category: 'Programming',
    relatedCourses: ['resource-102', 'resource-201'],
    marketDemand: 92,
    lastUpdated: '2024-11-12T09:30:00Z',
    dateCreated: '2024-01-20T00:00:00Z'
  }
];

// Enhanced Resources with proper nesting
export const mockResourcesData: Resource[] = [
  {
    id: 'resource-root-1',
    name: 'Frontend Development',
    description: 'Complete frontend path',
    content: [],
    progress: 52,
    modules: 3,
    completedModules: 1,
    totalHours: 120,
    category: 'Frontend',
    type: 'folder',
    dateCreated: new Date('2024-01-15').toISOString(),
    children: [
      {
        id: 'resource-101',
        name: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts',
        content: ['Variables', 'Functions', 'Async/Await', 'Promises'],
        progress: 45,
        modules: 8,
        completedModules: 3,
        totalHours: 40,
        category: 'Frontend',
        type: 'course',
        dateCreated: new Date('2024-01-15').toISOString()
      },
      {
        id: 'resource-102',
        name: 'Advanced React Patterns',
        description: 'Master React concepts',
        content: ['Hooks', 'Context API', 'Performance', 'Testing'],
        progress: 62,
        modules: 6,
        completedModules: 4,
        totalHours: 30,
        category: 'Frontend',
        type: 'course',
        dateCreated: new Date('2024-02-01').toISOString()
      },
      {
        id: 'resource-201',
        name: 'Angular Mastery Course',
        description: 'Comprehensive Angular guide',
        content: ['Components', 'Services', 'Routing', 'RxJS'],
        progress: 35,
        modules: 10,
        completedModules: 3,
        totalHours: 50,
        category: 'Frontend',
        type: 'course',
        dateCreated: new Date('2024-02-15').toISOString()
      }
    ]
  },
  {
    id: 'resource-root-2',
    name: 'Backend Development',
    description: 'Backend specialization path',
    content: [],
    progress: 45,
    modules: 3,
    completedModules: 1,
    totalHours: 150,
    category: 'Backend',
    type: 'folder',
    dateCreated: new Date('2024-01-20').toISOString(),
    children: [
      {
        id: 'resource-301',
        name: 'Python for Data Science',
        description: 'Data analysis with Python',
        content: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
        progress: 28,
        modules: 12,
        completedModules: 3,
        totalHours: 60,
        category: 'Backend',
        type: 'course',
        dateCreated: new Date('2024-03-01').toISOString()
      },
      {
        id: 'resource-302',
        name: 'FastAPI Backend Development',
        description: 'Build modern APIs',
        content: ['REST APIs', 'Database Integration', 'Authentication', 'Testing'],
        progress: 55,
        modules: 8,
        completedModules: 4,
        totalHours: 40,
        category: 'Backend',
        type: 'course',
        dateCreated: new Date('2024-03-15').toISOString()
      }
    ]
  },
  {
    id: 'resource-root-3',
    name: 'DevOps & Infrastructure',
    description: 'DevOps specialization',
    content: [],
    progress: 18,
    modules: 3,
    completedModules: 0,
    totalHours: 120,
    category: 'DevOps',
    type: 'folder',
    dateCreated: new Date('2024-02-10').toISOString(),
    children: [
      {
        id: 'resource-401',
        name: 'Docker & Kubernetes',
        description: 'Container orchestration mastery',
        content: ['Docker Basics', 'Kubernetes', 'Helm', 'Deployment'],
        progress: 18,
        modules: 9,
        completedModules: 1,
        totalHours: 45,
        category: 'DevOps',
        type: 'course',
        dateCreated: new Date('2024-03-15').toISOString()
      },
      {
        id: 'resource-402',
        name: 'CI/CD Pipelines',
        description: 'Automated deployment strategies',
        content: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'ArgoCD'],
        progress: 0,
        modules: 7,
        completedModules: 0,
        totalHours: 35,
        category: 'DevOps',
        type: 'course',
        dateCreated: new Date('2024-04-01').toISOString()
      }
    ]
  }
];

// Enhanced Notes with better structure
export const mockNotes: Note[] = [
  {
    id: 'note-1',
    name: 'JavaScript Async Patterns',
    content: [
      'Promises provide a cleaner alternative to callbacks',
      'Async/await syntax makes asynchronous code look synchronous',
      'Error handling with try/catch blocks',
      'Promise.all() for parallel operations'
    ],
    dateCreated: new Date('2025-01-13').toISOString(),
    lastModified: new Date('2025-02-01').toISOString(),
    tags: ['javascript', 'async', 'promises'],
    attachments: [
      {
        id: 'att-note-1',
        type: 'code',
        name: 'async_examples.js',
        url: '/assets/async-examples.js'
      }
    ]
  },
  {
    id: 'note-2',
    name: 'React Hooks Study Guide',
    content: [
      'useState for managing component state',
      'useEffect for side effects and lifecycle',
      'useContext for prop drilling elimination',
      'Custom hooks for reusable logic'
    ],
    dateCreated: new Date('2025-01-10').toISOString(),
    lastModified: new Date('2025-02-03').toISOString(),
    tags: ['react', 'hooks', 'frontend'],
    attachments: [
      {
        id: 'att-note-2',
        type: 'document',
        name: 'hooks_reference.pdf',
        url: '/assets/hooks-reference.pdf'
      }
    ]
  },
  {
    id: 'note-3',
    name: 'Docker Container Basics',
    content: [
      'Docker images are blueprints for containers',
      'Dockerfile specifies image construction steps',
      'Volumes enable persistent data storage',
      'Networks connect multiple containers'
    ],
    dateCreated: new Date('2025-01-20').toISOString(),
    lastModified: new Date('2025-02-15').toISOString(),
    tags: ['docker', 'devops', 'containers'],
    attachments: []
  },
  {
    id: 'note-4',
    name: 'Python Best Practices',
    content: [
      'Use virtual environments for project isolation',
      'Follow PEP 8 style guide',
      'Write type hints for clarity',
      'Document with docstrings'
    ],
    dateCreated: new Date('2025-02-05').toISOString(),
    lastModified: new Date('2025-02-10').toISOString(),
    tags: ['python', 'best-practices', 'code-quality'],
    attachments: []
  }
];

// Enhanced Recent Activities with proper task data
export const mockRecentActivities: Task[] = [
  {
    id: 'activity-1',
    name: 'Complete React Hooks Module',
    description: 'Finish the useContext and useReducer sections',
    completionStatus: TaskStatus.IN_PROGRESS,
    dueDate: '2025-03-20',
    isCompleted: false,
    dateCreated: new Date('2025-02-15').toISOString(),
    lastModified: new Date('2025-02-20').toISOString(),
    priority: Priority.HIGH,
    estimatedDuration: 12,
    tags: ['react', 'frontend', 'learning']
  },
  {
    id: 'activity-2',
    name: 'Docker Containerization Project',
    description: 'Containerize the FastAPI application',
    completionStatus: TaskStatus.IN_PROGRESS,
    dueDate: '2025-03-25',
    isCompleted: false,
    dateCreated: new Date('2025-02-10').toISOString(),
    lastModified: new Date('2025-02-18').toISOString(),
    priority: Priority.MEDIUM,
    estimatedDuration: 20,
    tags: ['docker', 'devops', 'project']
  },
  {
    id: 'activity-3',
    name: 'Complete Python Data Science Fundamentals',
    description: 'Finish Pandas and NumPy modules',
    completionStatus: TaskStatus.COMPLETED,
    dueDate: '2025-02-14',
    isCompleted: true,
    dateCreated: new Date('2025-01-20').toISOString(),
    lastModified: new Date('2025-02-14').toISOString(),
    completionDate: new Date('2025-02-14').toISOString(),
    priority: Priority.HIGH,
    estimatedDuration: 15,
    tags: ['python', 'data-science']
  },
  {
    id: 'activity-4',
    name: 'Angular Components Review',
    description: 'Review component lifecycle and change detection',
    completionStatus: TaskStatus.NOT_STARTED,
    dueDate: '2025-03-10',
    isCompleted: false,
    dateCreated: new Date('2025-02-16').toISOString(),
    lastModified: new Date('2025-02-16').toISOString(),
    priority: Priority.MEDIUM,
    estimatedDuration: 8,
    tags: ['angular', 'frontend']
  },
  {
    id: 'activity-5',
    name: 'Create study notes on TypeScript generics',
    description: 'Document generic types and constraints',
    completionStatus: TaskStatus.IN_PROGRESS,
    dueDate: '2025-03-05',
    isCompleted: false,
    dateCreated: new Date('2025-02-12').toISOString(),
    lastModified: new Date('2025-02-19').toISOString(),
    priority: Priority.LOW,
    estimatedDuration: 5,
    tags: ['typescript', 'documentation']
  }
];
