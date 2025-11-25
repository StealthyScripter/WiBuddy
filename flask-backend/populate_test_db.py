from app import app, db
from app.models import *
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import json

def convert_frontend_enum(enum_value, backend_enum):
    """Convert a frontend enum string to a backend enum object"""
    if enum_value is None:
        return None
    return backend_enum[enum_value]

def init_db():
    with app.app_context():
        # Drop all tables first for a clean slate
        db.drop_all()
        # Create all tables based on the models
        db.create_all()
        print("Database initialized successfully")

        # Create users
        admin_user = User(
            username="admin",
            email="admin@example.com",
            password_hash=generate_password_hash("AdminPassword123!"),
            is_admin=True
        )

        regular_user = User(
            username="user",
            email="user@example.com",
            password_hash=generate_password_hash("UserPassword123!"),
            is_admin=False
        )

        team_member1 = User(
            username="member1",
            email="member1@example.com",
            password_hash=generate_password_hash("Member1Pass!")
        )

        team_member2 = User(
            username="member2",
            email="member2@example.com",
            password_hash=generate_password_hash("Member2Pass!")
        )

        db.session.add_all([admin_user, regular_user, team_member1, team_member2])
        db.session.commit()

  
        technologies = []
        tech_map = {}  # For mapping frontend IDs to backend IDs

        # Tech stack items
        tech_items = [
            {"id": "1", "name": "React", "count": 15, "icon": "⚛️"},
            {"id": "2", "name": "Node.js", "count": 8, "icon": "🟢"},
            {"id": "3", "name": "Python", "count": 5, "icon": "🐍"},
            {"id": "4", "name": "MongoDB", "count": 3, "icon": "🍃"},
            {"id": "1", "name": "React", "proficiency": 85},
            {"id": "2", "name": "Node.js", "proficiency": 70},
            {"id": "3", "name": "TypeScript", "proficiency": 65}
        ]

        # Deduplicate by name
        seen_techs = {}
        for tech_item in tech_items:
            name = tech_item["name"]
            if name not in seen_techs:
                tech = Technology(name=name)
                if "count" in tech_item:
                    tech.count = tech_item["count"]
                if "icon" in tech_item:
                    tech.icon = tech_item["icon"]
                if "proficiency" in tech_item:
                    tech.proficiency = tech_item["proficiency"]

                technologies.append(tech)
                seen_techs[name] = tech
                tech_map[tech_item["id"]] = tech

        db.session.add_all(technologies)
        db.session.commit()

        # Create projects from mockProjects
        projects = []
        project_map = {}  # For mapping frontend IDs to backend IDs

        project_items = [
            {
                "id": "uuid-1",
                "name": "Website Redesign",
                "department": "Marketing",
                "description": "Complete overhaul of company website with modern UI/UX principles",
                "completionStatus": "IN_PROGRESS",
                "priority": "HIGH",
                "progress": 75,
                "isCompleted": False,
                "dateCreated": "2025-01-10T00:00:00.000Z",
                "ownerId": "owner-1",
                "teamMembers": ["member-1", "member-2", "member-3"],
                "dueDate": "2025-02-02"
            },
            {
                "id": "uuid-2",
                "name": "Mobile App Development",
                "department": "Technology",
                "description": "Native mobile application for iOS and Android platforms",
                "completionStatus": "NOT_STARTED",
                "priority": "CRITICAL",
                "progress": 0,
                "isCompleted": False,
                "dateCreated": "2025-01-15T00:00:00.000Z",
                "ownerId": "owner-2",
                "teamMembers": ["member-4", "member-5"],
                "dueDate": "2025-02-02"
            },
            {
                "id": "uuid-3",
                "name": "Brand Identity",
                "department": "Design",
                "description": "Complete brand redesign including logo and guidelines",
                "completionStatus": "COMPLETED",
                "priority": "MEDIUM",
                "progress": 68,
                "isCompleted": True,
                "dateCreated": "2025-01-20T00:00:00.000Z",
                "ownerId": "owner-1",
                "teamMembers": ["member-1", "member-6"],
                "dueDate": "2025-02-10"
            },
            {
                "id": "proj-1",
                "name": "Website redesign",
                "description": "",
                "completionStatus": "IN_PROGRESS",
                "priority": "HIGH",
                "progress": 0,
                "isCompleted": False,
                "dateCreated": "2025-01-05T00:00:00.000Z",
                "ownerId": "user-1",
                "dueDate": "2025-04-01"
            },
            {
                "id": "proj-2",
                "name": "Machine Learning",
                "description": "",
                "completionStatus": "IN_PROGRESS",
                "priority": "MEDIUM",
                "progress": 40,
                "isCompleted": False,
                "dateCreated": "2025-01-07T00:00:00.000Z",
                "ownerId": "user-1",
                "dueDate": "2025-06-08"
            },
            {
                "id": "proj-3",
                "name": "Senior project",
                "description": "",
                "completionStatus": "IN_PROGRESS",
                "priority": "HIGH",
                "progress": 20,
                "isCompleted": False,
                "dateCreated": "2025-01-12T00:00:00.000Z",
                "ownerId": "user-1",
                "dueDate": "2025-03-02"
            }
        ]

        for proj_item in project_items:
            project = Project(
                name=proj_item["name"],
                description=proj_item.get("description", ""),
                date_created=datetime.fromisoformat(proj_item["dateCreated"].replace("Z", "+00:00")) if "dateCreated" in proj_item and proj_item["dateCreated"] else datetime.utcnow(),
                due_date=datetime.fromisoformat(proj_item["dueDate"].replace("Z", "+00:00")) if "dueDate" in proj_item and proj_item["dueDate"] else None,
                is_completed=proj_item.get("isCompleted", False),
                owner_id=admin_user.id,  # Default to admin user
                status=convert_frontend_enum(proj_item.get("completionStatus"), TaskStatus),
                priority=convert_frontend_enum(proj_item.get("priority"), Priority),
                department=proj_item.get("department", "")
            )

            # Add team members
            if "teamMembers" in proj_item and proj_item["teamMembers"]:
                # For simplicity, add admin and regular users as team members
                project.team_members.append(admin_user)
                project.team_members.append(regular_user)

            projects.append(project)
            project_map[proj_item["id"]] = project

        db.session.add_all(projects)
        db.session.commit()

        # Create tasks from mockTasks
        tasks = []
        task_map = {}  # For mapping frontend IDs to backend IDs

        task_items = [
            {
                "id": "task-1",
                "name": "Update User Interface",
                "description": "Implement new design system across the platform",
                "completionStatus": "IN_PROGRESS",
                "dueDate": "2025-03-15",
                "isCompleted": False,
                "dateCreated": "2025-02-01T00:00:00.000Z",
                "isMilestone": False,
                "priority": "HIGH",
                "category": "DESIGN"
            },
            {
                "id": "task-2",
                "name": "API Integration",
                "description": "Connect backend services with frontend",
                "completionStatus": "COMPLETED",
                "dueDate": "2025-03-20",
                "isCompleted": True,
                "dateCreated": "2025-02-05T00:00:00.000Z",
                "isMilestone": False,
                "priority": "MEDIUM",
                "category": "DEVELOPMENT"
            },
            {
                "id": "task-3",
                "name": "Security Audit",
                "description": "Perform security assessment and fix vulnerabilities",
                "completionStatus": "CANCELLED",
                "dueDate": "2025-03-25",
                "isCompleted": False,
                "dateCreated": "2025-02-10T00:00:00.000Z",
                "isMilestone": False,
                "priority": "CRITICAL",
                "category": "TESTING"
            },
            {
                "id": "task-4",
                "name": "Create a program dashboard",
                "description": "",
                "completionStatus": "NOT_STARTED",
                "dueDate": "2025-02-28T14:30:00",
                "isCompleted": False,
                "dateCreated": "2025-01-15T00:00:00.000Z",
                "isMilestone": False,
                "priority": "MEDIUM",
                "category": "DEVELOPMENT"
            },
            {
                "id": "task-5",
                "name": "Start Documentation",
                "description": "",
                "completionStatus": "OVERDUE",
                "dueDate": "2025-02-01T14:30:00",
                "isCompleted": False,
                "dateCreated": "2025-01-20T00:00:00.000Z",
                "isMilestone": False,
                "priority": "MEDIUM",
                "category": "DOCUMENTATION"
            },
            {
                "id": "task-6",
                "name": "Make the machine learning model",
                "description": "",
                "completionStatus": "NOT_STARTED",
                "dueDate": "2025-02-09T14:30:00",
                "isCompleted": False,
                "dateCreated": "2025-01-25T00:00:00.000Z",
                "isMilestone": False,
                "priority": "MEDIUM",
                "category": "DEVELOPMENT"
            },
            {
                "id": "task-7",
                "name": "User Authentication",
                "dueDate": "Jan 5, 2025",
                "description": "",
                "completionStatus": "COMPLETED",
                "isCompleted": True,
                "isMilestone": False,
                "priority": "MEDIUM",
                "category": "DEVELOPMENT"
            },
            {
                "id": "task-8",
                "name": "Frontend Redesign",
                "dueDate": "Jan 2, 2025",
                "description": "",
                "completionStatus": "COMPLETED",
                "isCompleted": True,
                "isMilestone": False,
                "priority": "MEDIUM",
                "category": "DESIGN"
            }
        ]

        for task_item in task_items:
            # Handle date formatting - ISO or string format
            due_date = None
            if "dueDate" in task_item and task_item["dueDate"]:
                try:
                    # Try ISO format
                    due_date = datetime.fromisoformat(task_item["dueDate"].replace("Z", "+00:00"))
                except ValueError:
                    # Try simple date format like "Jan 5, 2025"
                    try:
                        due_date = datetime.strptime(task_item["dueDate"], "%b %d, %Y")
                    except ValueError:
                        print(f"Could not parse date: {task_item['dueDate']}")

            # Create task
            task = Task(
                name=task_item["name"],
                description=task_item.get("description", ""),
                is_completed=task_item.get("isCompleted", False),
                date_created=datetime.fromisoformat(task_item["dateCreated"].replace("Z", "+00:00")) if "dateCreated" in task_item and task_item["dateCreated"] else datetime.utcnow(),
                due_date=due_date,
                is_milestone=task_item.get("isMilestone", False),
                status=convert_frontend_enum(task_item.get("completionStatus"), TaskStatus),
                priority=convert_frontend_enum(task_item.get("priority"), Priority),
                category=convert_frontend_enum(task_item.get("category"), TaskCategory),
                assignee_id=regular_user.id,  # Default to regular user
                project_id=projects[0].id if projects else None  # Default to first project
            )

            # Assign to different projects based on task type
            if "category" in task_item:
                if task_item["category"] == "DEVELOPMENT":
                    task.project_id = project_map.get("proj-2", projects[0]).id if "proj-2" in project_map else projects[0].id
                elif task_item["category"] == "DESIGN":
                    task.project_id = project_map.get("uuid-1", projects[0]).id if "uuid-1" in project_map else projects[0].id

            # Set completion date if task is completed
            if task.is_completed:
                task.completion_date = datetime.utcnow() - timedelta(days=2)

            tasks.append(task)
            task_map[task_item["id"]] = task

        db.session.add_all(tasks)
        db.session.commit()

        # Create notes from mockNotes
        notes = []
        note_map = {}  # For mapping frontend IDs to backend IDs

        note_items = [
            {
                "id": "1",
                "name": "Make measurements of the model",
                "content": ["Calipers will be provided by the dean"],
                "attachments": [
                    {
                        "id": "1",
                        "type": "image",
                        "name": "Sample Image",
                        "url": "/assets/sample.jpg",
                        "thumbnail": "/assets/sample-thumb.jpg"
                    },
                    {
                        "id": "4",
                        "type": "github",
                        "name": "Repository",
                        "url": "https://github.com/user/repo"
                    }
                ],
                "dateCreated": "2025-04-13T00:00:00.000Z",
                "lastModified": "2025-02-01T00:00:00.000Z"
            },
            {
                "id": "2",
                "name": "Note 2",
                "content": [
                    "This is a preview text that should be truncated if it is too long. Otherwise, it will be displayed fully",
                    "are under-defined; there are many solutions, good, bad, and indifferent. The art is to arrive at a good ",
                    "Ready to make today productive"
                ],
                "attachments": [
                    {
                        "id": "3",
                        "type": "link",
                        "name": "TaskFlow Docs",
                        "url": "https://taskflow.docs.com"
                    },
                    {
                        "id": "4",
                        "type": "github",
                        "name": "Repository",
                        "url": "https://github.com/user/repo"
                    }
                ],
                "dateCreated": "2025-04-10T00:00:00.000Z",
                "lastModified": "2025-02-03T00:00:00.000Z"
            },
            {
                "id": "3",
                "name": "Lorem ipsum",
                "content": ["maiores debitis magni in maxime."],
                "attachments": [
                    {
                        "id": "1",
                        "type": "image",
                        "name": "Sample Image",
                        "url": "/assets/sample.jpg",
                        "thumbnail": "/assets/sample-thumb.jpg"
                    }
                ],
                "dateCreated": "2025-04-15T00:00:00.000Z",
                "lastModified": "2025-01-15T00:00:00.000Z"
            },
            {
                "id": "4",
                "name": "Lorem ipsum",
                "content": ["Lorem ipsum dolor, sit amet consectetur"],
                "attachments": [
                    {
                        "id": "4",
                        "type": "github",
                        "name": "Repository",
                        "url": "https://github.com/user/repo"
                    }
                ],
                "dateCreated": "2025-03-13T00:00:00.000Z",
                "lastModified": "2025-01-20T00:00:00.000Z"
            }
        ]

        # First, create and save all notes without attachments
        for note_item in note_items:
            note = Note(
                name=note_item["name"],
                content=json.dumps(note_item["content"]),
                date_created=datetime.fromisoformat(note_item["dateCreated"].replace("Z", "+00:00")) if "dateCreated" in note_item and note_item["dateCreated"] else datetime.utcnow(),
                last_modified=datetime.fromisoformat(note_item["lastModified"].replace("Z", "+00:00")) if "lastModified" in note_item and note_item["lastModified"] else datetime.utcnow(),
                type="text",
                user_id=admin_user.id
            )

            notes.append(note)
            note_map[note_item["id"]] = note

        # Add all notes to the session and commit to get their IDs
        db.session.add_all(notes)
        db.session.commit()

        # Now create attachments for notes (after notes have been committed and have IDs)
        for note_item in note_items:
            if "attachments" in note_item:
                note = note_map[note_item["id"]]

                for attachment_item in note_item["attachments"]:
                    attachment = Attachment(
                        type=attachment_item["type"],
                        name=attachment_item.get("name", ""),
                        url=attachment_item.get("url", ""),
                        thumbnail=attachment_item.get("thumbnail", ""),
                        entity_type="note",  # This maps to the Note model
                        entity_id=note.id    # Now the note has a valid ID from the database
                    )
                    db.session.add(attachment)

        db.session.commit()

        # Create calendar events from mockCalendarEvents
        events = []

        event_items = [
            {
                "id": 1,
                "name": "Team Meeting",
                "date": datetime(2025, 1, 18, 10, 0),
                "endDate": datetime(2025, 1, 18, 11, 0),
                "type": "meeting",
                "color": "#4f46e5",
                "description": "Weekly team sync to discuss project progress"
            },
            {
                "id": 2,
                "name": "Project Deadline",
                "date": datetime(2025, 1, 25),
                "type": "deadline",
                "projectId": 1,
                "color": "#ef4444",
                "description": "Website redesign project due"
            },
            {
                "id": 3,
                "name": "Client Call",
                "date": datetime(2025, 1, 20, 14, 0),
                "endDate": datetime(2025, 1, 20, 15, 0),
                "type": "meeting",
                "color": "#0ea5e9",
                "description": "Review app requirements with client"
            },
            {
                "id": 4,
                "name": "Design Review",
                "date": datetime(2025, 1, 18, 13, 0),
                "endDate": datetime(2025, 1, 18, 14, 30),
                "type": "meeting",
                "projectId": 1,
                "color": "#8b5cf6",
                "description": "Review mockups for website redesign"
            }
        ]

        for event_item in event_items:
            # Map event type to enum
            event_type = None
            if event_item["type"] == "meeting":
                event_type = EventType.MEETING
            elif event_item["type"] == "deadline":
                event_type = EventType.DEADLINE
            elif event_item["type"] == "task":
                event_type = EventType.TASK

            event = CalendarEvent(
                name=event_item["name"],
                date=event_item["date"],
                end_date=event_item.get("endDate"),
                type=event_type,
                color=event_item.get("color", "#4f46e5"),
                description=event_item.get("description", ""),
                project_id=projects[0].id if "projectId" in event_item else None,
                user_id=admin_user.id
            )

            events.append(event)

        db.session.add_all(events)
        db.session.commit()

        # Create a sample affirmation
        affirmation = Affirmation(
            content="Engineering problems are under-defined; there are many solutions, good, bad, and indifferent. The art is to arrive at a good solution.",
            daily_goals=json.dumps(["Complete API integration", "Review design mockups"]),
            user_id=admin_user.id,
            tags=json.dumps(["motivation", "engineering"]),
            reminder_time=datetime.utcnow().replace(hour=9, minute=0, second=0),
            is_active=True
        )

        db.session.add(affirmation)
        db.session.commit()

        # Add task prerequisites and technology relationships
        # Task 3 (Security Audit) depends on Task 2 (API Integration)
        if "task-3" in task_map and "task-2" in task_map:
            task_map["task-3"].prerequisites.append(task_map["task-2"])

        # Add technologies to tasks
        for task in tasks:
            # Assign relevant technologies based on task category
            if task.category == TaskCategory.DEVELOPMENT:
                for tech in technologies:
                    if tech.name in ["React", "Node.js", "TypeScript"]:
                        task.technologies.append(tech)
            elif task.category == TaskCategory.DESIGN:
                for tech in technologies:
                    if tech.name == "React":
                        task.technologies.append(tech)

        db.session.commit()

        print("All mock data loaded successfully")
        print("\nDefault Admin User:")
        print("Username: admin")
        print("Password: AdminPassword123!")
        print("\nDefault Regular User:")
        print("Username: user")
        print("Password: UserPassword123!")

if __name__ == '__main__':
    init_db()
