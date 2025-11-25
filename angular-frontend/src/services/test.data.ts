import {
  Task,
  Project,
  Note,
  CalendarEvent,
  Technology,
  Affirmation,
  TaskStatus,
  Priority,  TaskCategory,
  TimelineActivity,
  RecentNote,
  Deadline,
  KeyTakeaway,
  Comment,
  Attachment,
  Course,
  StudyMaterial,
  Skill,
  LearningActivity,
  TrendItem,
  TechTrend,
  StandoutSkill,
  LearningRecommendation,
  JobOpportunity,
  JobMarketInsight
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
    teamMembers: ['member-1', 'member-2', 'member-3'],
    dueDate: '2025-04-15',
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
    teamMembers: ['member-4', 'member-5'],
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
    teamMembers: ['member-1', 'member-6'],
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
    teamMembers: ['member-7', 'member-8'],
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
    teamMembers: ['member-9'],
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
    id: 1,
    name: 'Weekly Team Standup',
    date: new Date(2025, 1, 18, 10, 0),
    endDate: new Date(2025, 1, 18, 10, 30),
    type: 'meeting',
    color: '#4f46e5',
    description: 'Daily standup to discuss progress and blockers'
  },
  {
    id: 2,
    name: 'Website Redesign Deadline',
    date: new Date(2025, 3, 15),
    type: 'deadline',
    projectId: 1,
    color: '#ef4444',
    description: 'Final deadline for website redesign project'
  },
  {
    id: 3,
    name: 'Client Requirements Review',
    date: new Date(2025, 1, 20, 14, 0),
    endDate: new Date(2025, 1, 20, 15, 30),
    type: 'meeting',
    color: '#0ea5e9',
    description: 'Review updated requirements with client stakeholders'
  },
  {
    id: 4,
    name: 'Design System Presentation',
    date: new Date(2025, 1, 22, 13, 0),
    endDate: new Date(2025, 1, 22, 14, 30),
    type: 'meeting',
    projectId: 1,
    color: '#8b5cf6',
    description: 'Present new design system to leadership team'
  },
  {
    id: 5,
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
// =============================================================================
export const mockTimelineActivities: TimelineActivity[] = [
  {
    type: 'task',
    title: 'Completed Frontend Design',
    description: 'Finalized the UI components for the dashboard',
    time: '2 hours ago'
  },
  {
    type: 'project',
    title: 'Created New Project',
    description: 'Started Mobile App Development project',
    time: 'Yesterday'
  },
  {
    type: 'note',
    title: 'Added Meeting Notes',
    description: 'Documented requirements from client meeting',
    time: '3 days ago'
  },
  {
    type: 'task',
    title: 'API Integration Complete',
    description: 'Successfully connected frontend to backend services',
    time: '1 week ago'
  }
];

export const mockRecentNotes: RecentNote[] = [
  {
    id: 'note-1',
    name: 'API Integration Plan',
    preview: 'Steps for connecting the frontend to backend services...',
    date: 'Apr 15'
  },
  {
    id: 'note-2',
    name: 'Client Feedback',
    preview: 'Notes from the latest client review session...',
    date: 'Apr 10'
  },
  {
    id: 'note-3',
    name: 'Design System Guidelines',
    preview: 'Component standards and color palette documentation...',
    date: 'Apr 5'
  }
];

export const mockUpcomingDeadlines: Deadline[] = [
  {
    day: '25',
    month: 'Apr',
    title: 'Backend Integration',
    project: 'Website Redesign',
    priority: 'high'
  },
  {
    day: '30',
    month: 'Apr',
    title: 'User Testing',
    project: 'Mobile App',
    priority: 'medium'
  },
  {
    day: '5',
    month: 'May',
    title: 'Final Presentation',
    project: 'Senior Capstone',
    priority: 'high'
  },
  {
    day: '15',
    month: 'May',
    title: 'Security Audit',
    project: 'Platform Security',
    priority: 'low'
  },
  {
    day: '25',
    month: 'Apr',
    title: 'Backend Integration',
    project: 'Website Redesign',
    priority: 'high'
  },
  {
    day: '30',
    month: 'Apr',
    title: 'User Testing',
    project: 'Mobile App',
    priority: 'medium'
  },
  {
    day: '5',
    month: 'May',
    title: 'Final Presentation',
    project: 'Client Project',
    priority: 'low'
  }
];

// =============================================================================
// PROGRESS SUMMARY TEST DATA
// =============================================================================
export const mockKeyTakeaways: KeyTakeaway[] = [
  {
    title: 'Improved Development Velocity',
    description: 'Team velocity increased by 40% after implementing agile practices and automated testing'
  },
  {
    title: 'Enhanced Code Quality',
    description: 'Reduced bug reports by 60% through code reviews and pair programming initiatives'
  },
  {
    title: 'Better Client Communication',
    description: 'Weekly client demos improved stakeholder satisfaction and reduced requirement changes'
  },
  {
    title: 'Technology Stack Optimization',
    description: 'Migration to modern tech stack reduced deployment time from 2 hours to 15 minutes'
  }
];

// =============================================================================
// COMMENT TEST DATA
// =============================================================================
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    author: 'John Smith',
    content: 'Great progress on this task! The API integration looks solid.',
    timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  },
  {
    id: 'comment-2',
    author: 'Sarah Anderson',
    content: 'I reviewed the code and left some suggestions in the PR. Overall looks good!',
    timestamp: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
  },
  {
    id: 'comment-3',
    author: 'Mike Johnson',
    content: 'Should we schedule a code review session for this? Happy to help with testing.',
    timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
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


// ============= LMS Mock Data =============

export const mockCourses: Course[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    type: 'folder',
    progress: 65,
    modules: 0,
    completedModules: 0,
    dateCreated: new Date('2025-01-01').toISOString(),
    children: [
      {
        id: 'react-basics',
        name: 'React Fundamentals',
        type: 'course',
        progress: 80,
        modules: 12,
        completedModules: 9,
        totalHours: 18,
        category: 'Frontend',
        parentId: 'web-dev',
        dateCreated: new Date('2025-01-05').toISOString()
      },
      {
        id: 'typescript',
        name: 'TypeScript Mastery',
        type: 'course',
        progress: 45,
        modules: 8,
        completedModules: 3,
        totalHours: 12,
        category: 'Programming',
        parentId: 'web-dev',
        dateCreated: new Date('2025-01-10').toISOString()
      }
    ]
  },
  {
    id: 'data-science',
    name: 'Data Science',
    type: 'folder',
    progress: 30,
    modules: 0,
    completedModules: 0,
    dateCreated: new Date('2025-01-15').toISOString(),
    children: [
      {
        id: 'python-ml',
        name: 'Python for ML',
        type: 'course',
        progress: 30,
        modules: 15,
        completedModules: 4,
        totalHours: 24,
        category: 'Machine Learning',
        parentId: 'data-science',
        dateCreated: new Date('2025-01-20').toISOString()
      }
    ]
  }
];

export const mockStudyMaterials: StudyMaterial[] = [
  {
    id: 'material-1',
    courseId: 'react-basics',
    title: 'React Hooks Deep Dive',
    type: 'notes',
    items: 12,
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    dateCreated: new Date('2025-02-01').toISOString(),
    content: [
      'useState: Managing component state',
      'useEffect: Side effects and lifecycle',
      'useContext: Global state management',
      'useReducer: Complex state logic',
      'Custom hooks: Reusable logic'
    ]
  },
  {
    id: 'material-2',
    courseId: 'react-basics',
    title: 'TypeScript Types Quiz',
    type: 'flashcards',
    items: 45,
    lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    dateCreated: new Date('2025-02-05').toISOString()
  },
  {
    id: 'material-3',
    courseId: 'react-basics',
    title: 'Web Performance Articles',
    type: 'resources',
    items: 8,
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dateCreated: new Date('2025-02-10').toISOString()
  },
  {
    id: 'material-4',
    courseId: 'react-basics',
    title: 'Coding Challenges',
    type: 'practice',
    items: 20,
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dateCreated: new Date('2025-02-15').toISOString()
  }
];

export const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'React',
    level: 80,
    targetLevel: 90,
    trend: 'up',
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
    trend: 'up',
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
    trend: 'neutral',
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
    trend: 'up',
    category: 'Database',
    marketDemand: 85,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date('2024-01-01').toISOString()
  }
];

export const mockLearningActivities: LearningActivity[] = [
  {
    id: 'activity-1',
    courseId: 'react-basics',
    moduleName: 'Custom Hooks',
    completed: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    dateCreated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'activity-2',
    courseId: 'typescript',
    moduleName: 'Generics',
    completed: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    dateCreated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'activity-3',
    courseId: 'react-basics',
    moduleName: 'Context API',
    completed: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// ============= Trends Mock Data =============

export const mockTrendItems: TrendItem[] = [
  {
    id: 'trend-1',
    title: 'React 19 Released with New Features',
    resource: 'React Blog',
    sourceType: 'article',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 95,
    category: 'Frontend',
    summary: 'React 19 introduces major improvements including automatic batching, new hooks, and performance optimizations.',
    tags: ['React', 'Frontend', 'JavaScript'],
    link: 'https://react.dev/blog',
    isStarred: true,
    isRead: false,
    dateCreated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trend-2',
    title: 'TypeScript 5.4 Announcement',
    resource: 'TypeScript Docs',
    sourceType: 'bulletin',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 88,
    category: 'Programming Languages',
    summary: 'New type inference improvements and better error messages make TypeScript more developer-friendly.',
    tags: ['TypeScript', 'Programming'],
    link: 'https://devblogs.microsoft.com/typescript',
    isStarred: false,
    isRead: false,
    dateCreated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trend-3',
    title: 'AI in Healthcare: Latest Developments',
    resource: 'Healthcare Tech RSS',
    sourceType: 'rss',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 72,
    category: 'AI/ML',
    summary: 'Machine learning models are achieving breakthrough accuracy in medical diagnosis applications.',
    tags: ['AI', 'Healthcare', 'Machine Learning'],
    link: 'https://example.com',
    isStarred: false,
    isRead: true,
    dateCreated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trend-4',
    title: 'Job Market Update: Frontend Developers',
    resource: 'LinkedIn Newsletter',
    sourceType: 'email',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 85,
    category: 'Career',
    summary: 'Demand for React and TypeScript developers increased 40% this quarter with remote opportunities growing.',
    tags: ['Jobs', 'Frontend', 'Career'],
    link: 'https://linkedin.com',
    isStarred: true,
    isRead: false,
    dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockTechTrends: TechTrend[] = [
  {
    id: 'tech-1',
    name: 'React',
    trend: 'rising',
    demand: 'high',
    marketLevel: 75,
    jobCount: 1240,
    growthRate: 15,
    category: 'Frontend',
    dateCreated: new Date().toISOString()
  },
  {
    id: 'tech-2',
    name: 'TypeScript',
    trend: 'rising',
    demand: 'high',
    marketLevel: 70,
    jobCount: 980,
    growthRate: 23,
    category: 'Programming',
    dateCreated: new Date().toISOString()
  },
  {
    id: 'tech-3',
    name: 'Python',
    trend: 'stable',
    demand: 'high',
    marketLevel: 65,
    jobCount: 2100,
    growthRate: 8,
    category: 'Programming',
    dateCreated: new Date().toISOString()
  },
  {
    id: 'tech-4',
    name: 'Docker',
    trend: 'rising',
    demand: 'medium',
    marketLevel: 60,
    jobCount: 750,
    growthRate: 18,
    category: 'DevOps',
    dateCreated: new Date().toISOString()
  },
  {
    id: 'tech-5',
    name: 'Kubernetes',
    trend: 'rising',
    demand: 'high',
    marketLevel: 55,
    jobCount: 680,
    growthRate: 25,
    category: 'DevOps',
    dateCreated: new Date().toISOString()
  }
];

export const mockStandoutSkills: StandoutSkill[] = [
  {
    id: 'standout-1',
    skillName: 'React',
    strength: 'Expert',
    description: 'Strong proficiency with hooks, context, and performance optimization',
    marketPosition: 'Top 15%',
    percentile: 85,
    sourceCount: 1240,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date().toISOString()
  },
  {
    id: 'standout-2',
    skillName: 'TypeScript',
    strength: 'Advanced',
    description: 'Excellent understanding of generics, utility types, and type inference',
    marketPosition: 'Top 25%',
    percentile: 75,
    sourceCount: 980,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date().toISOString()
  },
  {
    id: 'standout-3',
    skillName: 'System Design',
    strength: 'Intermediate',
    description: 'Good grasp of scalability patterns and microservices architecture',
    marketPosition: 'Top 40%',
    percentile: 60,
    sourceCount: 450,
    lastUpdated: new Date().toISOString(),
    dateCreated: new Date().toISOString()
  }
];

export const mockLearningRecommendations: LearningRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Container Orchestration with Kubernetes',
    reason: 'High market demand + Large skill gap',
    provider: 'Coursera',
    duration: '6 weeks',
    priority: 'high',
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
    priority: 'medium',
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
    priority: 'low',
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

export const mockJobMarketInsight: JobMarketInsight = {
  id: 'insight-1',
  totalRelevantJobs: 847,
  weeklyGrowth: 23,
  topSkillsCombination: ['React', 'TypeScript', 'Node.js'],
  averageSalary: '$130k - $170k',
  hotSkills: [
    { id: '1', skill: 'React', growth: 23 },
    { id: '2', skill: 'TypeScript', growth: 18 },
    { id: '3', skill: 'Kubernetes', growth: 45 },
    { id: '4', skill: 'GraphQL', growth: 32 }
  ],
  lastUpdated: new Date().toISOString(),
  dateCreated: new Date().toISOString()
};
