import {
  Task,
  Project,
  Note,
  CalendarEvent,
  Technology,
  DailyAffirmation,
  TaskStatus,
  Priority,  TaskCategory,
  TimelineActivity,
  RecentNote,
  Deadline,
  KeyTakeaway,
  Comment,
  Attachment
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
export const mockDailyAffirmation: DailyAffirmation = {
  quote: "Engineering problems are under-defined; there are many solutions, good, bad, and indifferent. The art is to arrive at a good solution.",
  author: "Richard James"
};

// Alternative affirmations for rotation
export const mockDailyAffirmations: DailyAffirmation[] = [
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    quote: "Quality is not an act, it is a habit.",
    author: "Aristotle"
  },
  {
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
