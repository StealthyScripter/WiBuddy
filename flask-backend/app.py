from flask import Flask, render_template
from utils import *

app = Flask(__name__)

class Todo:
    def __init__(self, task):
        self.id = task['id']
        self.content = task['content']
        self.completed = task['completed']
        self.date = task['date']

@app.route('/')
def home():
    # Creating instances for tasks and collecting projects
    todo_objects = [Todo(task) for task in tasks]
    project_objects = [project for project in projects]
    affirmation_text = [text for text in affirmations]
    curr_progress = myprogress
    
    return render_template('index.html', tasks=todo_objects, ongoing_projects=project_objects, affirmation_quotes=affirmation_text, myprogress=curr_progress)

@app.route('/tasks')
def task_list():
    todo_objects = [Todo(task) for task in tasks]
    return render_template('tasks.html', tasks=todo_objects)

@app.route('/projects')
def project_list():
    return render_template('ongoing_projects.html', ongoing_projects=projects)

@app.route('/progress')
def my_progress():
    curr_progress = [progress for progress in myprogress]

    return render_template('myprogress.html', myprogress=curr_progress)

if __name__ == "__main__":
    app.run(debug=True)
