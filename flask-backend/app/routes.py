from app import app, api
from flask import render_template, redirect, request, jsonify
from .models import Task, Project, Affirmation, Technology
from .services.task_service import TaskService
from .services.project_service import ProjectService
from .services.utility_service import AffirmationService, TechnologyService
from .resources.task_resource import TaskListResource, TaskResource, TaskCompleteResource
import calendar
from sqlalchemy.orm import joinedload
from datetime import datetime

# Add API resources
api.add_resource(TaskListResource, '/api/tasks')
api.add_resource(TaskResource, '/api/tasks/<int:task_id>')
api.add_resource(TaskCompleteResource, '/api/tasks/<int:task_id>/complete')

# Keep the original routes to maintain backward compatibility
@app.route('/', methods=['GET', 'POST'])
def home():
    tasks = TaskService.get_all_tasks()
    progress = TaskService.get_completion_stats()
    all_projects = ProjectService.get_all_projects()
    technologies = TechnologyService.get_all_technologies()
    affirmations = AffirmationService.get_all_affirmations()

    return render_template('index.html', tasks=tasks, all_projects=all_projects, myprogress=progress, affirmations=affirmations, technologies=technologies)

# ... keep the rest of the original routes
