from flask import render_template, redirect, request
from app import app, db
from app.models import Task,Project,Affirmation,Technology
from app.services.task_service import TaskService
import calendar
from sqlalchemy.orm import joinedload
from datetime import datetime

#default route to render the home page
@app.route('/', methods=['GET', 'POST'])
def home():
    tasks = TaskService.get_all_tasks()
    projects = Project.get_ongoing_projects()
    affirmations = Affirmation.get_affirmations()
    progress= TaskService.get_completion_stats()
    project=Project.get_project(id)
    return render_template('index.html', tasks=tasks, projects=projects, affirmations=affirmations,myprogress=progress, project=project)

    
#Task management 
#Delete task route
@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Task.query.get_or_404(id)

    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was a problem deleting the task'
    
#update task route
@app.route('/update/<int:id>',methods=['GET','POST'])
def update(id):
    task = Task.query.get_or_404(id)
    if request.method == 'POST':
        task.name=request.form['name']

        try:
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue updating your task'
    else:
        return render_template("task_manager/update.html", task=task)
#Add task Route   
@app.route('/add_task/', methods=['GET', 'POST'])
def add_task():
    if request.method == 'POST':
        name = request.form['name']
        description=request.form['description']
        due_date_str=request.form['due_date']

        if due_date_str:
            due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        else:
            due_date = None 

        estimated_duration=request.form['estimated_duration']
        project_id=request.form['project_id']
        technology_id=request.form['technology_id']
        #is_milestone=request.form['is_milestone']

        try:
            task = TaskService.add_task(
                name=name,description=description,due_date=due_date,estimated_duration=estimated_duration,project_id=project_id,technology_id=technology_id,#is_milestone=is_milestone
                )
            return redirect('/')
        except Exception as e:
            return (f'There was an issue adding your task {str(e)}')
    else:
        return render_template('task_manager/add_task.html')  # Render the add task form
  
#complete task route
@app.route('/complete_task/', methods=['POST','GET'])
def completion_status():
    task_id = request.form.get('task_id')
    task_complete = request.form.get('task_complete') == '1'  

    task = Task.query.get_or_404(task_id)
    task.completed = task_complete 

    try:
        db.session.commit()
        return redirect('/') 
    except:
        return "Unable to mark your task complete"

#sort task route   
def sort_tasks(sorting_metric='id', position='all'):
    # Validate sorting metric
    sorting_metrics = {'id': Task.id, 'date_created': Task.date_created, 'name': Task.name}
    if sorting_metric not in sorting_metrics:
        sorting_metric = 'id'  # Default to 'id' if invalid metric is provided
    
    # Build the query with dynamic sorting
    query = Task.query.order_by(sorting_metrics[sorting_metric])

    # Return based on position
    if position == 'first':
        return query.first()
    elif position == 'last':
        return query.order_by(sorting_metrics[sorting_metric].desc()).first()
    else:
        return query.all()

@app.route('/todo/<int:id>')
def todo(id):
    task=Task.query.get_or_404(id)
    return render_template('task_manager/todo.html', task=task)
    
    

#Ongoing projects section
@app.route('/project/<int:id>')
def projects():
    project = Project.get_ongoing_projects()
    return render_template("ongoing_projects/projectpage.html", project=project)

@app.route('/add_project/',methods=['POST','GET'])
def addProjects():
    if request.method == 'POST':
        return '<p>Adding project logic/function</p>'
    else:
        return render_template('ongoing_projects/add_project.html')
    
@app.route('/update_project/<int:id>', methods=['POST','GET'])
def updateProject(id):
    if request.method == 'POST':
        return '<h2><update project logic</h2>'
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
