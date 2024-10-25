from flask import Flask, render_template
from utils import *
import math

app = Flask(__name__)

class Todo:
    def __init__(self, task):
        self.id = task['id']
        self.content = task['content']
        self.completed = task['completed']
        self.date = task['date']

@app.route('/')
def home():
    year,month=2024,10
    todo_objects = [Todo(task) for task in tasks]
    affirmation_text = affirmations
    curr_progress = myprogress
    all_tasks = tasks
    projects = ongoing_projects

    cal_html = create_monthly_calendar_with_tasks(year, month, all_tasks)
    
    
    return render_template('index.html', tasks=todo_objects, projects=projects, affirmations=affirmation_text, myprogress=curr_progress, all_tasks=all_tasks,calendar=cal_html)

@app.route('/tasks')
def task_list():
    todo_objects = [Todo(task) for task in tasks]
    return render_template('tasks.html', tasks=todo_objects)

@app.route('/projects')
def project_list():
    return render_template('projects.html', projects=ongoing_projects)

@app.route('/progress')
def my_progress():
    return render_template('progress.html', myprogress=myprogress)

@app.route('/calendar')
def calendar_view(year,month):
    all_tasks = tasks
    
    cal_html = create_monthly_calendar_with_tasks(year, month, all_tasks)
    return render_template('calendar.html', calendar=cal_html)

def create_monthly_calendar_with_tasks(year, month, all_tasks):
    import calendar
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
                tasks_for_day = [task for task in tasks if task['date'] == date_str]
                if tasks_for_day:
                    html_calendar += "<ul>"
                    for task in tasks_for_day:
                        html_calendar += f"<li>{task['content']}</li>"
                    html_calendar += "</ul>"
                
                html_calendar += "</td>"
        html_calendar += "</tr>"
    
    html_calendar += "</table>"
    return html_calendar

if __name__ == "__main__":
    app.run(debug=True)
