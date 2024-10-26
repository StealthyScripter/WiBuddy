from flask import render_template, redirect
from app import app
from app.models import Task
import calendar


class Todo:
    def __init__(self, task):
        self.id = task['id']
        self.content = task['content']
        self.completed = task['completed']
        self.date = task['date']

@app.route('/')
def home():
    count=projects()
    cal = create_monthly_calendar_with_tasks(2024,10,task_list())
    return render_template('index.html', count=count, calendar=cal)

@app.route('/projects')
def projects():
    new_projects = ['python','c','java']
    count = sum(1 for project in new_projects)
    return count

def task_list():
    ongoing_tasks = [{"id": 1, "content": "Learn Python basics", "completed": False, "date": "2024-10-01"},
    {"id": 2, "content": "Build a Flask API", "completed": False, "date": "2024-10-02"}]
    return ongoing_tasks

def project_list():
    project_lists = []
    return project_list

def my_progress():
    my_progress = {}
    return my_progress


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
                tasks_for_day = [task for task in all_tasks if task['date'] == date_str and not task['completed']]
                if tasks_for_day:
                    html_calendar += "<ul>"
                    for task in tasks_for_day:
                        html_calendar += f"<li>{task['content']}</li>"
                    html_calendar += "</ul>"
                
                html_calendar += "</td>"
        html_calendar += "</tr>"
    
    html_calendar += "</table>"
    return html_calendar