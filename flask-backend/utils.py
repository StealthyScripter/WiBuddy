from app import db
from app.models import Task

class TaskService:
    @staticmethod
    def add_task(name):
        new_task = Task(name=name)
        try:
            db.session.add(new_task)
            db.session.commit()
            return True, new_task
        except Exception as e:
            db.session.rollback()
            return False, str(e)

    @staticmethod
    def update_task(id, name):
        task = Task.query.get_or_404(id)
        task.name = name
        try:
            db.session.commit()
            return True, task
        except Exception as e:
            db.session.rollback()
            return False, str(e)

    @staticmethod
    def delete_task(id):
        task = Task.query.get_or_404(id)
        try:
            db.session.delete(task)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False, str(e)
