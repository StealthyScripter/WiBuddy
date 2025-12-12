from app import db
from app.models import Note, Folder, Course, Module
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

class NoteService:
    @staticmethod
    def add_note(name, content=None, type='text', tags=None, items=None,
                 user_id=None, folder_id=None, module_id=None, image_url=None,
                 images=None, ai_summary=None):
        """Create a new note"""
        new_note = Note(
            name=name,
            content=content or [],
            type=type,
            tags=tags or [],
            items=items or [],
            user_id=user_id,
            folder_id=folder_id,
            module_id=module_id,
            image_url=image_url,
            images=images or [],
            ai_summary=ai_summary,
            date_created=datetime.utcnow(),
            last_modified=datetime.utcnow()
        )
        try:
            db.session.add(new_note)
            db.session.commit()
            return new_note
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error adding note: {str(e)}")

    @staticmethod
    def get_all_notes(user_id=None, folder_id=None, module_id=None, tags=None):
        """Get all notes with optional filters"""
        query = Note.query

        if user_id:
            query = query.filter_by(user_id=user_id)
        if folder_id:
            query = query.filter_by(folder_id=folder_id)
        if module_id:
            query = query.filter_by(module_id=module_id)
        if tags:
            # Filter by tags (JSON contains)
            for tag in tags:
                query = query.filter(Note.tags.contains([tag]))

        return query.order_by(Note.last_modified.desc()).all()

    @staticmethod
    def get_note(note_id):
        """Get a note by ID"""
        return Note.query.get_or_404(note_id)

    @staticmethod
    def update_note(note_id, **kwargs):
        """Update a note"""
        note = Note.query.get_or_404(note_id)

        # Update fields if provided
        allowed_fields = ['name', 'content', 'type', 'tags', 'items',
                         'folder_id', 'module_id', 'image_url', 'images', 'ai_summary']

        for field in allowed_fields:
            if field in kwargs:
                setattr(note, field, kwargs[field])

        note.last_modified = datetime.utcnow()

        try:
            db.session.commit()
            return note
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error updating note: {str(e)}")

    @staticmethod
    def delete_note(note_id):
        """Delete a note"""
        note = Note.query.get_or_404(note_id)
        try:
            db.session.delete(note)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error deleting note: {str(e)}")

    @staticmethod
    def search_notes(query_string, user_id=None):
        """Search notes by name or content"""
        query = Note.query

        if user_id:
            query = query.filter_by(user_id=user_id)

        # Search in name or content (if content is text)
        query = query.filter(
            db.or_(
                Note.name.ilike(f'%{query_string}%'),
                Note.ai_summary.ilike(f'%{query_string}%')
            )
        )

        return query.order_by(Note.last_modified.desc()).all()


class FolderService:
    @staticmethod
    def add_folder(name, description=None, parent_id=None, user_id=None, color=None):
        """Create a new folder"""
        new_folder = Folder(
            name=name,
            description=description,
            parent_id=parent_id,
            user_id=user_id,
            color=color,
            date_created=datetime.utcnow(),
            last_modified=datetime.utcnow()
        )
        try:
            db.session.add(new_folder)
            db.session.commit()
            return new_folder
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error adding folder: {str(e)}")

    @staticmethod
    def get_all_folders(user_id=None, parent_id=None):
        """Get all folders with optional filters"""
        query = Folder.query

        if user_id:
            query = query.filter_by(user_id=user_id)
        if parent_id is not None:
            query = query.filter_by(parent_id=parent_id)

        return query.order_by(Folder.name).all()

    @staticmethod
    def get_folder(folder_id):
        """Get a folder by ID"""
        return Folder.query.get_or_404(folder_id)

    @staticmethod
    def update_folder(folder_id, **kwargs):
        """Update a folder"""
        folder = Folder.query.get_or_404(folder_id)

        allowed_fields = ['name', 'description', 'parent_id', 'color']

        for field in allowed_fields:
            if field in kwargs:
                setattr(folder, field, kwargs[field])

        folder.last_modified = datetime.utcnow()

        try:
            db.session.commit()
            return folder
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error updating folder: {str(e)}")

    @staticmethod
    def delete_folder(folder_id):
        """Delete a folder"""
        folder = Folder.query.get_or_404(folder_id)
        try:
            db.session.delete(folder)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error deleting folder: {str(e)}")


class CourseService:
    @staticmethod
    def add_course(name, code=None, description=None, field='OTHER', instructor=None,
                   semester=None, credits=None, start_date=None, end_date=None,
                   color=None, tags=None, user_id=None):
        """Create a new course"""
        new_course = Course(
            name=name,
            code=code,
            description=description,
            field=field,
            instructor=instructor,
            semester=semester,
            credits=credits,
            start_date=start_date,
            end_date=end_date,
            progress=0.0,
            color=color,
            tags=tags or [],
            user_id=user_id,
            date_created=datetime.utcnow(),
            last_modified=datetime.utcnow()
        )
        try:
            db.session.add(new_course)
            db.session.commit()
            return new_course
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error adding course: {str(e)}")

    @staticmethod
    def get_all_courses(user_id=None, field=None):
        """Get all courses with optional filters"""
        query = Course.query

        if user_id:
            query = query.filter_by(user_id=user_id)
        if field:
            query = query.filter_by(field=field)

        return query.order_by(Course.name).all()

    @staticmethod
    def get_course(course_id):
        """Get a course by ID"""
        return Course.query.get_or_404(course_id)

    @staticmethod
    def update_course(course_id, **kwargs):
        """Update a course"""
        course = Course.query.get_or_404(course_id)

        allowed_fields = ['name', 'code', 'description', 'field', 'instructor',
                         'semester', 'credits', 'start_date', 'end_date',
                         'progress', 'color', 'tags']

        for field in allowed_fields:
            if field in kwargs:
                setattr(course, field, kwargs[field])

        course.last_modified = datetime.utcnow()

        try:
            db.session.commit()
            return course
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error updating course: {str(e)}")

    @staticmethod
    def delete_course(course_id):
        """Delete a course"""
        course = Course.query.get_or_404(course_id)
        try:
            db.session.delete(course)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error deleting course: {str(e)}")

    @staticmethod
    def update_course_progress(course_id):
        """Recalculate and update course progress"""
        course = Course.query.get_or_404(course_id)
        course.progress = course.calculate_progress()
        try:
            db.session.commit()
            return course
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error updating course progress: {str(e)}")


class ModuleService:
    @staticmethod
    def add_module(course_id, name, description=None, order=0, learning_objectives=None,
                   estimated_hours=None, due_date=None):
        """Create a new module"""
        new_module = Module(
            course_id=course_id,
            name=name,
            description=description,
            order=order,
            learning_objectives=learning_objectives or [],
            progress=0.0,
            estimated_hours=estimated_hours,
            completed_hours=0,
            due_date=due_date,
            date_created=datetime.utcnow(),
            last_modified=datetime.utcnow()
        )
        try:
            db.session.add(new_module)
            db.session.commit()
            return new_module
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error adding module: {str(e)}")

    @staticmethod
    def get_all_modules(course_id=None):
        """Get all modules with optional course filter"""
        query = Module.query

        if course_id:
            query = query.filter_by(course_id=course_id)

        return query.order_by(Module.order, Module.name).all()

    @staticmethod
    def get_module(module_id):
        """Get a module by ID"""
        return Module.query.get_or_404(module_id)

    @staticmethod
    def update_module(module_id, **kwargs):
        """Update a module"""
        module = Module.query.get_or_404(module_id)

        allowed_fields = ['name', 'description', 'order', 'learning_objectives',
                         'progress', 'estimated_hours', 'completed_hours', 'due_date']

        for field in allowed_fields:
            if field in kwargs:
                setattr(module, field, kwargs[field])

        module.last_modified = datetime.utcnow()

        try:
            db.session.commit()

            # Update parent course progress
            if module.course_id:
                CourseService.update_course_progress(module.course_id)

            return module
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error updating module: {str(e)}")

    @staticmethod
    def delete_module(module_id):
        """Delete a module"""
        module = Module.query.get_or_404(module_id)
        course_id = module.course_id
        try:
            db.session.delete(module)
            db.session.commit()

            # Update parent course progress
            if course_id:
                CourseService.update_course_progress(course_id)
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error deleting module: {str(e)}")
