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
  MarketInsight
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
    milestones: 'Design Complete, Development 75%, Testing Pending'
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
// NOTE TEST DATA
// =============================================================================
export const mockNotes: Note[] = [
  {
    id: 'note-1',
    name: 'Make measurements of the model',
    content: [
      'Calipers will be provided by the dean',
      'Measurements should be taken at room temperature',
      'Record all dimensions in millimeters',
      'Take photos of the measurement process for documentation'
    ],
    dateCreated: new Date('2025-01-13').toISOString(),
    lastModified: new Date('2025-02-01').toISOString(),
    tags: ['measurements', 'equipment', 'documentation'],
    attachments: [
      {
        id: 'att-note-1',
        type: 'image',
        name: 'measurement_setup.jpg',
        url: '/assets/measurement-setup.jpg',
        thumbnail: '/assets/measurement-setup-thumb.jpg'
      },
      {
        id: 'att-note-2',
        type: 'document',
        name: 'measurement_guide.pdf',
        url: '/assets/measurement-guide.pdf'
      }
    ]
  },
  {
    id: 'note-2',
    name: 'Project Requirements Analysis',
    content: [
      'Stakeholder interviews completed last week',
      'Key requirements identified: scalability, security, user experience',
      'Technical constraints: budget limitations, timeline pressure',
      'Next steps: create technical specification document'
    ],
    dateCreated: new Date('2025-01-10').toISOString(),
    lastModified: new Date('2025-02-03').toISOString(),
    tags: ['requirements', 'analysis', 'stakeholders'],
    attachments: [
      {
        id: 'att-note-3',
        type: 'link',
        name: 'Project Requirements Doc',
        url: 'https://docs.company.com/requirements'
      }
    ],
    aiSummary: 'Requirements analysis for the project including stakeholder input, key requirements (scalability, security, UX), technical constraints, and next steps for technical specification.'
  },
  {
    id: 'note-3',
    name: 'Weekly Team Meeting Notes',
    content: [
      'Team velocity is improving - completed 23 story points last sprint',
      'Blocker identified: waiting for design approval from client',
      'New team member Sarah starts Monday',
      'Sprint review scheduled for Friday 2 PM'
    ],
    dateCreated: new Date('2025-02-15').toISOString(),
    lastModified: new Date('2025-02-15').toISOString(),
    tags: ['meeting', 'team', 'sprint', 'velocity']
  },
  {
    id: 'note-4',
    name: 'Technical Architecture Decision',
    content: [
      'Evaluated three options: microservices, monolith, serverless',
      'Decision: Go with microservices for better scalability',
      'Trade-offs: Increased complexity but better maintainability',
      'Implementation timeline: 2 months for initial setup'
    ],
    dateCreated: new Date('2025-01-20').toISOString(),
    lastModified: new Date('2025-01-25').toISOString(),
    tags: ['architecture', 'technical', 'decision', 'microservices'],
    attachments: [
      {
        id: 'att-note-4',
        type: 'github',
        name: 'Architecture Repository',
        url: 'https://github.com/company/architecture-docs'
      }
    ]
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
    dateCreated: new Date().toISOString(),
    lastUpdated: 'Feb 15'
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
    dateCreated: new Date().toISOString(),
    lastUpdated:'Dec 01'
  }
];

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

export const mockSkillsLMS: Skill[] = [
  {
    id: 'skill-1',
    name: 'JavaScript',
    level: 65,
    targetLevel: 85,
    category: 'Programming',
    relatedCourses: ['resource-101', 'resource-102'],
    marketDemand: 90,
    lastUpdated: '2024-11-10T10:00:00Z'
  },
  {
    id: 'skill-2',

    name: 'Angular',
    level: 50,
    targetLevel: 80,
    category: 'Frontend',
    relatedCourses: ['resource-201'],
    marketDemand: 88,
    lastUpdated: '2024-11-05T12:15:00Z'
  },
  {
    id: 'skill-3',

    name: 'Python',
    level: 72,
    targetLevel: 90,
    category: 'Backend',
    relatedCourses: ['resource-301', 'resource-302'],
    marketDemand: 95,
    lastUpdated: '2024-10-18T08:40:00Z'
  },
  {
    id: 'skill-4',

    name: 'Docker',
    level: 40,
    targetLevel: 75,
    category: 'DevOps',
    relatedCourses: ['resource-401'],
    marketDemand: 85,
    lastUpdated: '2024-10-01T15:00:00Z'
  },
  {
    id: 'skill-5',
    name: 'UI/UX Design',
    level: 30,
    targetLevel: 70,
    category: 'Design',
    relatedCourses: ['resource-501'],
    marketDemand: 60,
    lastUpdated: '2024-09-12T07:20:00Z'
  }
];

export const mockTrendItems: MarketInsight[] = [
  {
    id: 'insight-1',
    name: 'AI Engineering Demand Surge',
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
    hotSkills: [
      { id: 'hs1', skill: 'AI Model Integration', growth: 22 },
      { id: 'hs2', skill: 'Vector Databases', growth: 18 }
    ],
    lastUpdated: '2025-01-03'
  },
  {
    id: 'insight-2',
    name: 'Cloud Cost Optimization Roles Rising',
    trend: 'upward',
    demand: Priority.MEDIUM,
    marketLevel: 74,
    jobListingCount: 6300,
    growthRate: 9.1,
    category: 'Cloud',
    totalRelevantJobs: 23000,
    weeklyGrowth: 1.6,
    topSkillsCombination: ['FinOps', 'Kubernetes', 'Automation'],
    averageSalary: '$132k',
    hotSkills: [
      { id: 'hs3', skill: 'FinOps Analysis', growth: 16 },
      { id: 'hs4', skill: 'Cloud Monitoring', growth: 12 }
    ],
    lastUpdated: '2025-01-02'
  },
  {
    id: 'insight-3',
    name: 'JavaScript Ecosystem Expanding Again',
    trend: 'neutral',
    demand: Priority.LOW,
    marketLevel: 61,
    jobListingCount: 15800,
    growthRate: 4.5,
    category: 'Frontend',
    totalRelevantJobs: 52000,
    weeklyGrowth: 0.4,
    topSkillsCombination: ['TypeScript', 'React', 'Bun'],
    averageSalary: '$118k',

    hotSkills: [
      { id: 'hs5', skill: 'TypeScript Patterns', growth: 8 },
      { id: 'hs6', skill: 'Bun Runtime', growth: 7 }
    ],
    lastUpdated: '2025-01-01'
  }
];

export const mockStandoutSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'Prompt Engineering',
    level: 65,
    targetLevel: 90,
    category: 'AI',
    relatedCourses: ['course-101', 'course-102'],
    marketDemand: 94,
    lastUpdated: '2025-01-03'
  },
  {
    id: 'skill-2',
    name: 'FinOps Cloud Optimization',
    level: 40,
    targetLevel: 80,
    category: 'Cloud',
    relatedCourses: ['course-201'],
    marketDemand: 82,
    lastUpdated: '2025-01-03'
  },
  {
    id: 'skill-3',
    name: 'TypeScript Mastery',
    level: 80,
    targetLevel: 95,
    category: 'Frontend',
    relatedCourses: ['course-300', 'course-301'],
    marketDemand: 70,
    lastUpdated: '2025-01-02'
  }
];

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
  hotSkills: [
    { id: 'hs10', skill: 'AI Code Assistants', growth: 28 },
    { id: 'hs11', skill: 'Cloud Security Automation', growth: 21 },
    { id: 'hs12', skill: 'Rust for Backend Systems', growth: 19 }
  ],
  lastUpdated: '2025-01-04'
};
