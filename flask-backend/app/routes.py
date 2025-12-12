from app import app, api
from flask import render_template, redirect, request, jsonify
from .models import Task, Project, Affirmation, Technology
from .services.task_service import TaskService
from .services.project_service import ProjectService
from .services.utility_service import AffirmationService, TechnologyService
from .resources.task_resource import TaskListResource, TaskResource, TaskCompleteResource
from .resources.project_resource import ProjectListResource, ProjectResource, ProjectCompleteResource
from .resources.technology_resource import TechnologyListResource, TechnologyResource
from .resources.affirmation_resource import AffirmationListResource, AffirmationResource
from .resources.auth_resource import RegisterResource, LoginResource, UserListResource, UserResource
from .resources.note_resource import NoteListResource, NoteResource, NoteSearchResource
from .resources.folder_resource import FolderListResource, FolderResource
from .resources.course_resource import CourseListResource, CourseResource, CourseProgressResource
from .resources.module_resource import ModuleListResource, ModuleResource
from .resources.ai_resource import AISummarizeResource, AIFlashcardsResource, AIQuestionsResource, AICheatSheetResource
from .resources.document_resource import DocumentListResource, DocumentResource, DocumentProcessResource
import calendar
from sqlalchemy.orm import joinedload
from datetime import datetime

# Register API resources
api.add_resource(TaskListResource, '/api/tasks')
api.add_resource(TaskResource, '/api/tasks/<int:task_id>')
api.add_resource(TaskCompleteResource, '/api/tasks/<int:task_id>/complete')

api.add_resource(ProjectListResource, '/api/projects')
api.add_resource(ProjectResource, '/api/projects/<int:project_id>')
api.add_resource(ProjectCompleteResource, '/api/projects/<int:project_id>/complete')

api.add_resource(TechnologyListResource, '/api/technologies')
api.add_resource(TechnologyResource, '/api/technologies/<int:tech_id>')

api.add_resource(AffirmationListResource, '/api/affirmations')
api.add_resource(AffirmationResource, '/api/affirmations/<int:affirmation_id>')

# Add authentication endpoints
api.add_resource(RegisterResource, '/api/auth/register')
api.add_resource(LoginResource, '/api/auth/login')
api.add_resource(UserListResource, '/api/users')
api.add_resource(UserResource, '/api/users/<int:user_id>')

# Add LMS endpoints (Notes, Folders, Courses, Modules)
api.add_resource(NoteListResource, '/api/notes')
api.add_resource(NoteResource, '/api/notes/<int:note_id>')
api.add_resource(NoteSearchResource, '/api/notes/search')

api.add_resource(FolderListResource, '/api/folders')
api.add_resource(FolderResource, '/api/folders/<int:folder_id>')

api.add_resource(CourseListResource, '/api/courses')
api.add_resource(CourseResource, '/api/courses/<int:course_id>')
api.add_resource(CourseProgressResource, '/api/courses/<int:course_id>/progress')

api.add_resource(ModuleListResource, '/api/modules')
api.add_resource(ModuleResource, '/api/modules/<int:module_id>')

# Add AI endpoints
api.add_resource(AISummarizeResource, '/api/ai/summarize')
api.add_resource(AIFlashcardsResource, '/api/ai/flashcards')
api.add_resource(AIQuestionsResource, '/api/ai/questions')
api.add_resource(AICheatSheetResource, '/api/ai/cheatsheet')

# Add document management endpoints
api.add_resource(DocumentListResource, '/api/documents')
api.add_resource(DocumentResource, '/api/documents/<int:document_id>')
api.add_resource(DocumentProcessResource, '/api/documents/<int:document_id>/process')

# original routes for backward compatibility
@app.route('/', methods=['GET', 'POST'])
def home():
    tasks = TaskService.get_all_tasks()
    progress = TaskService.get_completion_stats()
    all_projects = ProjectService.get_all_projects()
    technologies = TechnologyService.get_all_technologies()
    affirmations = AffirmationService.get_all_affirmations()

    return render_template('index.html', tasks=tasks, all_projects=all_projects, myprogress=progress, affirmations=affirmations, technologies=technologies)


