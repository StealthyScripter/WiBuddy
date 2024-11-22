from . import app
from flask import render_template, redirect, request, jsonify
from .models import Task,Project,Affirmation,Technology
from .services.task_service import TaskService
from .services.project_service import ProjectService
from .services.utility_service import AffirmationService,TechnologyService
import calendar
from sqlalchemy.orm import joinedload
from datetime import datetime

#default route to render the home page
@app.route('/', methods=['GET', 'POST'])
def home():
    tasks = TaskService.get_all_tasks()
    progress = TaskService.get_completion_stats()
    all_projects = ProjectService.get_all_projects()
    technologies = TechnologyService.get_all_technologies()
    affirmations = AffirmationService.get_all_affirmations()
    

    
    return render_template('index.html', tasks=tasks, all_projects=all_projects, myprogress=progress, affirmations=affirmations,technologies=technologies)

    
#Task management 
#Add task Route   
@app.route('/add_task/', methods=['GET', 'POST'])
def add_task():
    all_projects = ProjectService.get_all_projects()
    technologies = TechnologyService.get_all_technologies()

    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        due_date = request.form['due_date']
        estimated_duration = request.form['estimated_duration']
        project_id = request.form['project_id']
        technology_id = request.form['technology_id']
        is_milestone = request.form['is_milestone'] == '1'

        TaskService.add_task(
            name=name,
            description=description,
            due_date=due_date,
            estimated_duration=estimated_duration,
            project_id=project_id,
            technology_id=technology_id,
            is_milestone=is_milestone
        )
        return redirect('/')
    else:
        return render_template(
            'task_manager/add_task.html',
            all_projects=all_projects,
            technologies=technologies
        )


#update task route
@app.route('/update/<int:id>',methods=['GET','POST'])
def update(id):
    task = Task.query.get_or_404(id)
    all_projects = ProjectService.get_all_projects()
    technologies = TechnologyService.get_all_technologies()
    if request.method == 'POST':
        TaskService.update_task(id)
    else:
        return render_template("task_manager/update.html", task=task, all_projects=all_projects, technologies=technologies)

#complete task route
@app.route('/complete_task/', methods=['POST','GET'])
def completion_status():
    task_id = request.form.get('task_id')
    task_complete = request.form.get('task_complete') == '1'  

    try:
        TaskService.complete_task(task_id,task_complete)
        return redirect('/') 
    except:
        return "Unable to mark your task complete"

#Delete task route
@app.route('/delete/<int:id>')
def delete(id):
    TaskService.delete_task(id)
    return redirect('/')


@app.route('/display_task/<int:id>')
def display_task(id):
    task=TaskService.get_task(id)
    return render_template('task_manager/display_task.html', task=task)

#sort task route   
def sort_tasks(sorting_metric='id', position='all'):
    #returns a query of items pre-sorted
    tasks=sort_tasks('name','last')
    return
    
    

#Ongoing projects section
@app.route('/project/<int:id>')
def projects(id):
    project = ProjectService.get_project(id)
    return render_template("ongoing_projects/projectpage.html", project=project)

@app.route('/add_project/',methods=['POST','GET'])
def addProjects():
    if request.method == 'POST':
        name = request.form['name']
        description=request.form['description']
        due_date=request.form['due_date']
        ProjectService.add_project(name=name,description=description,due_date=due_date)
        return redirect('/')
    else:
        return render_template('ongoing_projects/add_project.html')
    
@app.route('/update_project/<int:id>', methods=['POST','GET'])
def updateProject(id):
    current_project=ProjectService.get_project(id)
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        due_date = request.form.get('due_date')
        is_completed = request.form.get('is_completed') == '1'  # Assuming it's a checkbox

        # Pass parameters to `update_project`
        ProjectService.update_project(id, name=name, description=description, due_date=due_date, is_completed=is_completed)
        return redirect(f'/project/{id}')
    else:
        return render_template('ongoing_projects/update_project.html',project=current_project)
    
@app.route('/complete_project/<int:project_id>', methods=['POST','GET'])
def project_completion_status(project_id):
    try:
        ProjectService.complete_project(project_id)
        return redirect('/') 
    except:
        return "Unable to mark your task complete"
    

#Delete project route
@app.route('/delete_project/<int:id>')
def deleteProject(id):
    ProjectService.delete_project(id)
    return redirect('/')



"""
    Technology routes
"""
@app.route('/add_tech/', methods=['POST','GET'])
def add_tech():
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        TechnologyService.add_tech(name,description)
        return redirect('/')
    else:
        return render_template('add_technology.html')
    


@app.route('/add_affirmation/', methods=['POST','GET'])
def add_affirmation():
    if request.method == 'POST':
        affirmation = request.form['affirmation']
        daily_goals = request.form['daily_goals']
    
        AffirmationService.add_affirmation(affirmation, daily_goals)
        return redirect('/')
    else:
        return render_template('add_affirmations.html')





# def create_monthly_calendar_with_tasks(year, month, all_tasks):
#     cal = calendar.HTMLCalendar()
    
#     html_calendar = "<table border='0' cellpadding='0' cellspacing='0' class='calendar'>"
#     html_calendar += "<tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>"
    
#     for week in cal.monthdayscalendar(year, month):
#         html_calendar += "<tr>"
#         for day in week:
#             if day == 0:
#                 html_calendar += "<td class='noday'>&nbsp;</td>"
#             else:
#                 date_str = f"{year}-{month:02d}-{day:02d}"
#                 html_calendar += f"<td><strong>{day}</strong>"
                
#                 # Fetch tasks for that specific day
#                 tasks_for_day = [task for task in all_tasks if task.date_created.strftime("%Y-%m-%d") == date_str and not task.completed]
#                 if tasks_for_day:
#                     html_calendar += "<ul>"
#                     for task in tasks_for_day:
#                         html_calendar += f"<li>{task.name}</li>"
#                     html_calendar += "</ul>"
                
#                 html_calendar += "</td>"
#         html_calendar += "</tr>"
    
#     html_calendar += "</table>"
#     return html_calendar

