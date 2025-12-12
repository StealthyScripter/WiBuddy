from flask_restful import Resource
from flask import request
from app.services.ai_service import get_ai_service
from app.services.notes_service import NoteService, ModuleService
from app.models import Flashcard, Question, CheatSheet
from app import db
from marshmallow import ValidationError
from app.resources.auth_resource import token_required
from datetime import datetime


class AISummarizeResource(Resource):
    @token_required
    def post(self):
        """Generate AI summary of content"""
        try:
            data = request.get_json()
            if not data or 'content' not in data:
                return {"message": "Content is required"}, 400

            content = data['content']
            content_type = data.get('content_type', 'note')
            max_length = data.get('max_length', 200)

            ai_service = get_ai_service()
            summary = ai_service.generate_summary(content, content_type, max_length)

            # Optionally update note/module with summary
            note_id = data.get('note_id')
            module_id = data.get('module_id')

            if note_id:
                NoteService.update_note(note_id, ai_summary=summary)
            elif module_id:
                module = ModuleService.get_module(module_id)
                # Could add ai_summary field to Module model

            return {
                "summary": summary,
                "word_count": len(summary.split())
            }, 200

        except Exception as e:
            return {"message": f"Error generating summary: {str(e)}"}, 500


class AIFlashcardsResource(Resource):
    @token_required
    def post(self):
        """Generate flashcards from content"""
        try:
            data = request.get_json()
            if not data or 'content' not in data:
                return {"message": "Content is required"}, 400

            content = data['content']
            num_cards = data.get('num_cards', 10)
            difficulty = data.get('difficulty', 'MEDIUM')
            module_id = data.get('module_id')
            note_id = data.get('note_id')
            user_id = data.get('user_id')
            save_to_db = data.get('save_to_db', True)

            ai_service = get_ai_service()
            flashcards_data = ai_service.generate_flashcards(content, num_cards, difficulty)

            result_flashcards = []

            if save_to_db and flashcards_data:
                # Save flashcards to database
                for card_data in flashcards_data:
                    flashcard = Flashcard(
                        module_id=module_id,
                        note_id=note_id,
                        front=card_data.get('front', ''),
                        back=card_data.get('back', ''),
                        difficulty=card_data.get('difficulty', difficulty),
                        tags=card_data.get('tags', []),
                        user_id=user_id,
                        date_created=datetime.utcnow()
                    )
                    db.session.add(flashcard)

                db.session.commit()

                # Get saved flashcards with IDs
                result_flashcards = [{
                    'id': fc.id,
                    'front': fc.front,
                    'back': fc.back,
                    'difficulty': fc.difficulty.value if fc.difficulty else 'MEDIUM',
                    'tags': fc.tags
                } for fc in Flashcard.query.filter_by(module_id=module_id, user_id=user_id).all()]
            else:
                result_flashcards = flashcards_data

            return {
                "flashcards": result_flashcards,
                "count": len(result_flashcards)
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error generating flashcards: {str(e)}"}, 500


class AIQuestionsResource(Resource):
    @token_required
    def post(self):
        """Generate quiz questions from content"""
        try:
            data = request.get_json()
            if not data or 'content' not in data:
                return {"message": "Content is required"}, 400

            content = data['content']
            num_questions = data.get('num_questions', 5)
            question_types = data.get('question_types', ['MULTIPLE_CHOICE', 'SHORT_ANSWER'])
            module_id = data.get('module_id')
            note_id = data.get('note_id')
            user_id = data.get('user_id')
            save_to_db = data.get('save_to_db', True)

            ai_service = get_ai_service()
            questions_data = ai_service.generate_questions(content, num_questions, question_types)

            result_questions = []

            if save_to_db and questions_data:
                # Save questions to database
                for q_data in questions_data:
                    question = Question(
                        module_id=module_id,
                        note_id=note_id,
                        question=q_data.get('question', ''),
                        type=q_data.get('type', 'SHORT_ANSWER'),
                        options=q_data.get('options'),
                        correct_answer=q_data.get('correct_answer', ''),
                        explanation=q_data.get('explanation', ''),
                        difficulty=q_data.get('difficulty', 'MEDIUM'),
                        tags=q_data.get('tags', []),
                        user_id=user_id,
                        date_created=datetime.utcnow()
                    )
                    db.session.add(question)

                db.session.commit()

                # Get saved questions
                result_questions = [{
                    'id': q.id,
                    'question': q.question,
                    'type': q.type.value if q.type else 'SHORT_ANSWER',
                    'options': q.options,
                    'correct_answer': q.correct_answer,
                    'explanation': q.explanation,
                    'difficulty': q.difficulty.value if q.difficulty else 'MEDIUM',
                    'tags': q.tags
                } for q in Question.query.filter_by(module_id=module_id, user_id=user_id).all()]
            else:
                result_questions = questions_data

            return {
                "questions": result_questions,
                "count": len(result_questions)
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error generating questions: {str(e)}"}, 500


class AICheatSheetResource(Resource):
    @token_required
    def post(self):
        """Generate structured cheat sheet"""
        try:
            data = request.get_json()
            if not data or 'content' not in data:
                return {"message": "Content is required"}, 400

            content = data['content']
            title = data.get('title', 'Study Guide')
            module_id = data.get('module_id')
            course_id = data.get('course_id')
            user_id = data.get('user_id')
            save_to_db = data.get('save_to_db', True)

            ai_service = get_ai_service()
            cheatsheet_data = ai_service.generate_cheatsheet(content, title)

            if save_to_db:
                # Save cheat sheet to database
                cheatsheet = CheatSheet(
                    module_id=module_id,
                    course_id=course_id,
                    title=cheatsheet_data.get('title', title),
                    content=cheatsheet_data.get('sections', []),
                    tags=cheatsheet_data.get('tags', []),
                    user_id=user_id,
                    date_created=datetime.utcnow()
                )
                db.session.add(cheatsheet)
                db.session.commit()

                return {
                    "id": cheatsheet.id,
                    "title": cheatsheet.title,
                    "content": cheatsheet.content,
                    "tags": cheatsheet.tags
                }, 200
            else:
                return cheatsheet_data, 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error generating cheat sheet: {str(e)}"}, 500
