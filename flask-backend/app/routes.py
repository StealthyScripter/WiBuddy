from flask import render_template, redirect, request
from app import app, db
from app.models import Task,Project,Affirmation,Technology
from app.services.task_service import TaskService
from app.services.project_service import ProjectService
import calendar
from sqlalchemy.orm import joinedload
from datetime import datetime

#default route to render the home page
@app.route('/', methods=['GET', 'POST'])
def home():
    tasks = TaskService.get_all_tasks()
    projects = ProjectService.get_ongoing_projects()
    affirmations = Affirmation.get_affirmations()
    progress = TaskService.get_completion_stats()
    
    # Set a default project ID for demonstration, or retrieve from a query parameter
    project_id = request.args.get('project_id', 1)  # Use 1 or any default project ID
    project = ProjectService.get_project(int(project_id))
    
    return render_template('index.html', tasks=tasks, projects=projects, affirmations=affirmations, myprogress=progress, project=project)

    
#Task management 
#Add task Route   
@app.route('/add_task/', methods=['GET', 'POST'])
def add_task():
    if request.method == 'POST':
        name = request.form['name']
        description=request.form['description']
        due_date=request.form['due_date']

        TaskService.add_task(name=name,description=description,due_date=due_date)
        return redirect('/')
    else:
        return render_template('task_manager/add_task.html')  # Render the add task form


#update task route
@app.route('/update/<int:id>',methods=['GET','POST'])
def update(id):
    task = Task.query.get_or_404(id)
    if request.method == 'POST':
        TaskService.update_task(id)
    else:
        return render_template("task_manager/update.html", task=task)

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


@app.route('/display_task/')
def display_task():
    task=TaskService.get_incomplete_tasks()
    return render_template('task_manager/display_task.html', task=task)

#sort task route   
def sort_tasks(sorting_metric='id', position='all'):
    #returns a query of items pre-sorted
    tasks=sort_tasks('name','last')
    return
    
    

#Ongoing projects section
@app.route('/project/<int:id>')
def projects():
    project = ProjectService.get_ongoing_projects()
    return render_template("ongoing_projects/projectpage.html", project=project)

@app.route('/add_project/',methods=['POST','GET'])
def addProjects():
    if request.method == 'POST':
        return ProjectService.add_projects()
    else:
        return render_template('ongoing_projects/add_project.html')
    
@app.route('/update_project/<int:id>', methods=['POST','GET'])
def updateProject(id):
    if request.method == 'POST':
        return ProjectService.update_project()
    else:
        return render_template('ongoing_projects/update_project.html')





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
