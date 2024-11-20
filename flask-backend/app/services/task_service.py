from app import db
from app.models import Task, Project, Technology
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

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

        if name is None or due_date is None:
            raise ValueError("Name and due date are mandatory fields.")

        task.name = name if name else task.name
        task.due_date = due_date if due_date else task.due_date
        task.description = description if description is not None else task.description
        task.is_completed = is_completed if is_completed is not None else task.is_completed
        task.estimated_duration = estimated_duration if estimated_duration is not None else task.estimated_duration
        task.project_id = project_id if project_id is not None else task.project_id
        task.technology_id = technology_id if technology_id is not None else task.technology_id
        task.is_milestone = is_milestone if is_milestone is not None else task.is_milestone
        
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
    def get_all_tasks(): #display_task()
        """
        Retrieves all tasks filtered by completion status.
        
        Args:
            is_completed (bool): Filter for completed tasks.
        
        Returns:
            list: List of Task objects.
        """
        return Task.query.filter_by().order_by(Task.id).all()
    

    @staticmethod
    def get_task(id): #display_task()
        """
        Retrieves all tasks filtered by completion status.
        
        Args:
            is_completed (bool): Filter for completed tasks.
        
        Returns:
            list: List of Task objects.
        """
        return Task.query.get_or_404(id)

    
    @staticmethod
    def get_incomplete_tasks(is_completed=False):
        try:
            return Task.query.filter_by(is_completed=is_completed).order_by(Task.id).all()
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
        Calculates completion statistics grouped by project, technology, or both.
        
        Args:
            group_by (str): Grouping criterion. Can be 'project', 'technology', or 'both' (default).
        
        Returns:
            dict: Dictionary with keys as project/technology names and values as completion percentages.
        """
        query = db.session.query(
            Task.project_id,
            Task.technology_id,
            func.count(Task.id).label('total_tasks'),
            func.sum(Task.is_completed.cast(db.Integer)).label('completed_tasks')
        ).group_by(Task.project_id, Task.technology_id)

        results = {}
        
        for row in query.all():
            project_name = None
            technology_name = None
            
            if row.project_id:
                project = Project.query.get(row.project_id)
                project_name = project.name if project else "Unknown Project"

            if row.technology_id:
                technology = Technology.query.get(row.technology_id)
                technology_name = technology.name if technology else "Unknown Technology"

            completion_percentage = (row.completed_tasks / row.total_tasks) * 100 if row.total_tasks > 0 else 0

            if group_by == "project" and project_name:
                results[project_name] = completion_percentage
            elif group_by == "technology" and technology_name:
                results[technology_name] = completion_percentage
            elif group_by == "both" and project_name and technology_name:
                key = f"{project_name} - {technology_name}"
                results[key] = completion_percentage
        
        return results
    
