// src/test-data/tasks.data.ts
import { TaskCategory } from '../models.interface';

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Update User Interface',
    description: 'Implement new design system across the platform',
    completionStatus: TaskStatus.IN_PROGRESS,
    dueDate: '2025-03-15',
    isCompleted: true,
    dateCreated: new Date('2025-02-01').toISOString(),
    hierarchy: 1,
    isMilestone: false,
    priority: Priority.HIGH,
    category: TaskCategory.DESIGN,
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-2',
    name: 'API Integration',
    description: 'Connect backend services with frontend',
  completionStatus: TaskStatus.COMPLETED,
    dueDate: '2025-03-20',
    isCompleted: true,
    dateCreated: new Date('2025-02-05').toISOString(),
    hierarchy: 1,
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DEVELOPMENT,
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-3',
    name: 'Security Audit',
    description: 'Perform security assessment and fix vulnerabilities',
  completionStatus: TaskStatus.BLOCKED,
    dueDate: '2025-03-25',
    isCompleted: false,
    dateCreated: new Date('2025-02-10').toISOString(),
    hierarchy: 1,
    isMilestone: false,
    priority: Priority.CRITICAL,
    category: TaskCategory.TESTING,
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-4',
    name: 'Create a program dashboard',
    description: '',
  completionStatus: TaskStatus.NOT_STARTED,
    dueDate: '2025-02-28T14:30:00',
    isCompleted: false,
    dateCreated: new Date('2025-01-15').toISOString(),
    hierarchy: 1,
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DEVELOPMENT,
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-5',
    name: 'Start Documentation',
    description: '',
  completionStatus: TaskStatus.OVERDUE,
    dueDate: '2025-02-01T14:30:00',
    isCompleted: false,
    dateCreated: new Date('2025-01-20').toISOString(),
    hierarchy: 1,
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DOCUMENTATION,
    prerequisites: [],
    dependentTasks: []
  },
  {
    id: 'task-6',
    name: 'Make the machine learning model',
    description: '',
  completionStatus: TaskStatus.NOT_STARTED,
    dueDate: '2025-02-09T14:30:00',
    isCompleted: false,
    dateCreated: new Date('2025-01-25').toISOString(),
    hierarchy: 1,
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DEVELOPMENT,
    prerequisites: [],
    dependentTasks: []
  }
];

// src/test-data/projects.data.ts
import { Project, TaskStatus, Priority } from '../models.interface';

export const mockProjects: Project[] = [
  {
    id: 'uuid-1',
    name: 'Website Redesign',
    department: 'Marketing',
    description: 'Complete overhaul of company website with modern UI/UX principles',
  completionStatus: TaskStatus.ACTIVE,
    priority: Priority.HIGH,
    progress: 75,
    isCompleted: false,
    dateCreated: new Date('2025-01-10').toISOString(),
    ownerId: 'owner-1',
    teamMembers: ['member-1', 'member-2', 'member-3'],
    tasks: [],
    date:'2025-02-02'
  },
  {
    id: 'uuid-2',
    name: 'Mobile App Development',
    department: 'Technology',
    description: 'Native mobile application for iOS and Android platforms',
  completionStatus: TaskStatus.UPCOMING,
    priority: Priority.CRITICAL,
    progress: 0,
    isCompleted: false,
    dateCreated: new Date('2025-01-15').toISOString(),
    ownerId: 'owner-2',
    teamMembers: ['member-4', 'member-5'],
    tasks: [],
    date:'2025-02-02'
  },
  {
    id: 'uuid-3',
    name: 'Brand Identity',
    department: 'Design',
    description: 'Complete brand redesign including logo and guidelines',
  completionStatus: TaskStatus.COMPLETED,
    priority: Priority.MEDIUM,
    progress: 68,
    isCompleted: true,
    dateCreated: new Date('2025-01-20').toISOString(),
    ownerId: 'owner-1',
    teamMembers: ['member-1', 'member-6'],
    tasks: [],
    date: '2025-02-10'
  },
  {
    id: 'proj-1',
    name: 'Website redesign',
    description: '',
  completionStatus: TaskStatus.ACTIVE,
    priority: Priority.HIGH,
    progress: 0,
    isCompleted: false,
    dateCreated: new Date('2025-01-05').toISOString(),
    ownerId: 'user-1',
    teamMembers: [],
    tasks: [],
    date:'2025-04-01'
  },
  {
    id: 'proj-2',
    name: 'Machine Learning',
    description: '',
  completionStatus: TaskStatus.ACTIVE,
    priority: Priority.MEDIUM,
    progress: 40,
    isCompleted: false,
    dateCreated: new Date('2025-01-07').toISOString(),
    ownerId: 'user-1',
    teamMembers: [],
    tasks: [],
    date: '2025-06-08'
  },
  {
    id: 'proj-3',
    name: 'Senior project',
    description: '',
  completionStatus: TaskStatus.ACTIVE,
    priority: Priority.HIGH,
    progress: 20,
    isCompleted: false,
    dateCreated: new Date('2025-01-12').toISOString(),
    ownerId: 'user-1',
    teamMembers: [],
    tasks: [],
    date:'2025-03-02'
  }
];

// src/test-data/notes.data.ts
import { Note } from '../models.interface';

export const mockNotes: Note[] = [
  {
    id: '1',
    name: 'Make measurements of the model',
    content: ['Calipers will be provided by the dean'],
    attachments: [
      {
        id: '1',
        type: 'image',
        name: 'Sample Image',
        url: '/assets/sample.jpg',
        thumbnail: '/assets/sample-thumb.jpg'
      },
      {
        id: '4',
        type: 'github',
        name: 'Repository',
        url: 'https://github.com/user/repo'
      }
    ],
    dateCreated: new Date('2025-02-01').toISOString(),
    lastModified: new Date('2025-02-01').toISOString(),
  },
  {
    id: '2',
    name: 'Note 2',
    content: ['This is a preview text that should be truncated if it is too long. Otherwise, it will be displayed fully','are under-defined; there are many solutions, good, bad, and indifferent. The art is to arrive at a good ','Ready to make today productive' ],
    attachments: [
      {
        id: '3',
        type: 'link',
        name: 'TaskFlow Docs',
        url: 'https://taskflow.docs.com'
      },
      {
        id: '4',
        type: 'github',
        name: 'Repository',
        url: 'https://github.com/user/repo'
      }
    ],
    dateCreated: new Date('2025-02-03').toISOString(),
    lastModified: new Date('2025-02-03').toISOString(),
  },
  {
    id: '3',
    name: 'Lorem ipsum',
    content: ['maiores debitis magni in maxime.'],
    attachments: [
      {
        id: '1',
        type: 'image',
        name: 'Sample Image',
        url: '/assets/sample.jpg',
        thumbnail: '/assets/sample-thumb.jpg'
      }
    ],
    dateCreated: new Date('2025-01-15').toISOString(),
    lastModified: new Date('2025-01-15').toISOString(),
  },
  {
    id: '4',
    name: 'Lorem ipsum',
    content: ['Lorem ipsum dolor, sit amet consectetur'],
    attachments: [
      {
        id: '4',
        type: 'github',
        name: 'Repository',
        url: 'https://github.com/user/repo'
      }
    ],
    dateCreated: new Date('2025-01-20').toISOString(),
    lastModified: new Date('2025-01-20').toISOString(),
  }
];

// src/test-data/calendar-events.data.ts
import { CalendarEvent } from '../models.interface';

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 1,
    name: 'Team Meeting',
    date: new Date(2025, 1, 18, 10, 0),
    endDate: new Date(2025, 1, 18, 11, 0),
    type: 'meeting',
    color: '#4f46e5',
    description: 'Weekly team sync to discuss project progress'
  },
  {
    id: 2,
    name: 'Project Deadline',
    date: new Date(2025, 1, 25),
    type: 'deadline',
    projectId: 1,
    color: '#ef4444',
    description: 'Website redesign project due'
  },
  {
    id: 3,
    name: 'Client Call',
    date: new Date(2025, 1, 20, 14, 0),
    endDate: new Date(2025, 1, 20, 15, 0),
    type: 'meeting',
    color: '#0ea5e9',
    description: 'Review app requirements with client'
  },
  {
    id: 4,
    name: 'Design Review',
    date: new Date(2025, 1, 18, 13, 0),
    endDate: new Date(2025, 1, 18, 14, 30),
    type: 'meeting',
    projectId: 1,
    color: '#8b5cf6',
    description: 'Review mockups for website redesign'
  }
];

// src/test-data/progress-summary.data.ts
import { Task, TechStack } from '../models.interface';

export const mockUpcomingTasks: Task[] = [
  {
    name: 'API Integration',
    dueDate: 'Jan 15, 2025',
    id: '',
    description: '',
  completionStatus: TaskStatus.NOT_STARTED,
    isCompleted: false,
    dateCreated: '',
    hierarchy: 0,
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DEVELOPMENT,
    prerequisites: [],
    dependentTasks: []
  },
  {
    name: 'Database Migration',
    dueDate: 'Jan 20, 2025',
    id: '',
    description: '',
  completionStatus: TaskStatus.NOT_STARTED,
    isCompleted: false,
    dateCreated: '',
    hierarchy: 0,
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DEVELOPMENT,
    prerequisites: [],
    dependentTasks: []
  }
];

export const mockCompletedTasks: Task[] = [
  {
    name: 'User Authentication',
    dueDate: 'Jan 5, 2025',
    id: '',
    description: '',
  completionStatus: TaskStatus.COMPLETED,
    isCompleted: true,
    dateCreated: '',
    hierarchy: 0,
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DEVELOPMENT,
    prerequisites: [],
    dependentTasks: []
  },
  {
    name: 'Frontend Redesign',
    dueDate: 'Jan 2, 2025',
    id: '',
    description: '',
  completionStatus: TaskStatus.COMPLETED,
    isCompleted: true,
    dateCreated: '',
    hierarchy: 0,
    isMilestone: false,
    priority: Priority.MEDIUM,
    category: TaskCategory.DESIGN,
    prerequisites: [],
    dependentTasks: []
  }
];

export const mockTechStack: TechStack[] = [
  { name: 'React', count: '15 components', icon: '⚛️' },
  { name: 'Node.js', count: '8 services', icon: '🟢' },
  { name: 'Python', count: '5 scripts', icon: '🐍' },
  { name: 'MongoDB', count: '3 databases', icon: '🍃' }
];

import { Technology } from '../models.interface';

export const mockTech: Technology[] = [
  { id:'1',name: 'React', proficiency: 85 },
  { id: '2',name: 'Node.js', proficiency: 70 },
  { id: '3',name: 'TypeScript', proficiency: 65 }
];

// src/test-data/daily-affirmation.data.ts
import { DailyAffirmation } from '../models.interface';

export const mockDailyAffirmation: DailyAffirmation = {
  quote: "Engineering problems are under-defined; there are many solutions, good, bad, and indifferent. The art is to arrive at a good solution.",
  author: "Richard James"
};
