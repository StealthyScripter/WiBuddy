from app import db
from app.models import Task, Project, Technology, task_technologies
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from flask import abort

class TaskService:
    @staticmethod
    def add_task(name, estimated_duration=5, due_date=None, description=None,
                 is_completed=False, project_id=None, technology_id=None,
                 is_milestone=False, hierarchy=2, completion_date=None):

        due_date = datetime.strptime(due_date, '%Y-%m-%d') if due_date else None

        new_task = Task(
            name=name,
            estimated_duration=estimated_duration,
            due_date=due_date,
            description=description,
            is_completed=is_completed,
            project_id=project_id,
            technology_id=technology_id,
            is_milestone=is_milestone,
            date_created=datetime.utcnow(),
            hierarchy=hierarchy,
            completion_date=completion_date
        )
        try:
            db.session.add(new_task)
            db.session.commit()
            return new_task
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            raise Exception(f"Error adding task: {str(e)}")



    @staticmethod
    def update_task(task_id, name=None, description=None, is_completed=None,
                    due_date=None, estimated_duration=None, project_id=None,
                    technology_id=None, is_milestone=None):

        task = Task.query.get_or_404(task_id)

        # Only check for name and due_date if they're explicitly provided
        if name is not None:
            task.name = name
        if description is not None:
            task.description = description
        if is_completed is not None:
            task.is_completed = is_completed
        if due_date is not None:
            task.due_date = datetime.strptime(due_date, '%Y-%m-%d')
        if estimated_duration is not None:
            task.estimated_duration = estimated_duration
        if project_id is not None:
            task.project_id = project_id
        if technology_id is not None:
            task.technology_id = technology_id
        if is_milestone is not None:
            task.is_milestone = is_milestone

        # Update completion date if the task is marked as completed
        if task.is_completed:
            task.completion_date = datetime.utcnow()
        else:
            task.completion_date = None  # Reset if not completed

        try:
            db.session.commit()
            return task
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            raise Exception(f"Error updating task: {str(e)}")



    @staticmethod
    def complete_task(task_id,task_complete):
        task = Task.query.get_or_404(task_id)
        task.is_completed = task_complete
        if task_complete:
            task.completion_date = datetime.utcnow()
        else:
            task.completion_date = None

        try:
            db.session.commit()
            return
        except:
            return "Unable to mark your task complete"

    @staticmethod
    def delete_task(task_id):
        task_to_delete = Task.query.get_or_404(task_id)
        try:
            db.session.delete(task_to_delete)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            raise Exception(f"Error deleting task: {str(e)}")
            return e

    @staticmethod
    def get_all_tasks():
        # Retrieves all tasks
        return Task.query.order_by(Task.id).all()


    @staticmethod
    def get_task(id): #display_task()
        #retrieves a task by id.
        return Task.query.get_or_404(id)


    @staticmethod
    def get_incomplete_tasks(is_completed=False):
        try:
            return Task.query.filter_by(is_completed=False).order_by(Task.id).all()
        except SQLAlchemyError as e:
            return "There was an error returning the page. Try again"

    @staticmethod
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



    @staticmethod
    def get_completion_stats(group_by="both"):
        """
        Returns completion stats grouped by:
            - "project"
            - "technology"
            - "both" (project + technology)
        """

        # Base M2M join query
        query = (
            db.session.query(
                Task.project_id,
                task_technologies.c.technology_id.label("tech_id"),
                func.count(Task.id).label("total_tasks"),
                func.sum(Task.is_completed.cast(db.Integer)).label("completed_tasks")
            )
            .join(task_technologies, task_technologies.c.task_id == Task.id)
            .group_by(Task.project_id, task_technologies.c.technology_id)
        )

        # Keep raw counts instead of percentages
        stats = {}

        for row in query.all():

            # Lookup names
            project = Project.query.get(row.project_id) if row.project_id else None
            tech = Technology.query.get(row.tech_id) if row.tech_id else None

            project_name = project.name if project else "Unknown Project"
            tech_name = tech.name if tech else "Unknown Technology"

            # Generate group key depending on mode
            if group_by == "project":
                key = project_name
            elif group_by == "technology":
                key = tech_name
            else:  # both
                key = f"{project_name} - {tech_name}"

            # Initialize
            if key not in stats:
                stats[key] = {"total": 0, "completed": 0}

            # Aggregate raw task counts
            stats[key]["total"] += row.total_tasks
            stats[key]["completed"] += row.completed_tasks or 0

        # Convert aggregate counts → percentages
        results = {
            key: (value["completed"] / value["total"]) * 100 if value["total"] > 0 else 0
            for key, value in stats.items()
        }

        return results
