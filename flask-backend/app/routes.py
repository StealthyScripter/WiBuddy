from flask import render_template, redirect, request
from app import app, db
from app.models import Task
import calendar


@app.route('/',methods=['GET','POST'])
def home():
    tasks=Task.query.order_by(Task.id).all()
    return render_template('index.html',tasks=tasks)
    

@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Task.query.get_or_404(id)

    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was a problem deleting the task'

@app.route('/update/<int:id>',methods=['GET','POST'])
def update(id):
    task = Task.query.get_or_404(id)
    if request.method == 'POST':
        task.content=request.form['content']

        try:
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue updating your task'
    else:
        return render_template("update.html", task=task)
    
@app.route('/add_task/', methods=['GET', 'POST'])
def add_task():
    if request.method == 'POST':
        task_content = request.form['content']
        new_task = Task(content=task_content)

        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue adding your task'
    else:
        return render_template('add_task.html')  # Render the add task form
  

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
    
    


def projects():
    new_projects = ['python','c','java']
    count = sum(1 for project in new_projects)
    return count


def get_tasks(sorting_metric='id', position='all'):
    # Validate sorting metric
    sorting_metrics = {'id': Task.id, 'date_created': Task.date_created, 'content': Task.content}
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

def project_list():
    project_lists = []
    return project_list

def my_progress():
    my_progress = {}
    return my_progress

def daily_affirmation():
    affirmations = []
    return affirmations


def create_monthly_calendar_with_tasks(year, month, all_tasks):
    cal = calendar.HTMLCalendar()
    
    html_calendar = "<table border='0' cellpadding='0' cellspacing='0' class='calendar'>"
    html_calendar += "<tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>"
    
    for week in cal.monthdayscalendar(year, month):
        html_calendar += "<tr>"
        for day in week:
            if day == 0:
                html_calendar += "<td class='noday'>&nbsp;</td>"
            else:
                date_str = f"{year}-{month:02d}-{day:02d}"
                html_calendar += f"<td><strong>{day}</strong>"
                
                # Fetch tasks for that specific day
                tasks_for_day = [task for task in all_tasks if task['date_created'] == date_str and not task['completed']]
                if tasks_for_day:
                    html_calendar += "<ul>"
                    for task in tasks_for_day:
                        html_calendar += f"<li>{task['content']}</li>"
                    html_calendar += "</ul>"
                
                html_calendar += "</td>"
        html_calendar += "</tr>"
    
    html_calendar += "</table>"
    return html_calendar