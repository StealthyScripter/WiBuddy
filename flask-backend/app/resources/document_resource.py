from flask_restful import Resource
from flask import request
from werkzeug.utils import secure_filename
from app.services.file_service import get_file_service
from app.models import Document, DocumentStatus, ContentType
from app import db
from app.resources.auth_resource import token_required
from datetime import datetime
import os


class DocumentListResource(Resource):
    @token_required
    def get(self):
        """List all documents"""
        user_id = request.args.get('user_id', type=int)
        module_id = request.args.get('module_id', type=int)

        query = Document.query

        if user_id:
            query = query.filter_by(uploaded_by=user_id)
        if module_id:
            query = query.filter_by(module_id=module_id)

        documents = query.order_by(Document.date_created.desc()).all()

        return [{
            'id': doc.id,
            'name': doc.name,
            'type': doc.type.value if doc.type else None,
            'file_url': doc.file_url,
            'thumbnail_url': doc.thumbnail_url,
            'file_size': doc.file_size,
            'status': doc.status.value if doc.status else None,
            'page_count': doc.page_count,
            'tags': doc.tags,
            'module_id': doc.module_id,
            'date_created': doc.date_created.isoformat() if doc.date_created else None
        } for doc in documents]

    @token_required
    def post(self):
        """Upload a new document"""
        try:
            # Check if file is in request
            if 'file' not in request.files:
                return {"message": "No file provided"}, 400

            file = request.files['file']
            if file.filename == '':
                return {"message": "No file selected"}, 400

            # Get optional parameters
            module_id = request.form.get('module_id', type=int)
            user_id = request.form.get('user_id', type=int)
            tags = request.form.get('tags', '[]')

            # Import json to parse tags
            import json
            try:
                tags_list = json.loads(tags)
            except:
                tags_list = []

            # Determine file type
            file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
            if file_ext == 'pdf':
                content_type = ContentType.PDF
                subfolder = 'documents'
            elif file_ext in ['ppt', 'pptx']:
                content_type = ContentType.PPT
                subfolder = 'documents'
            elif file_ext in ['png', 'jpg', 'jpeg', 'gif', 'bmp']:
                content_type = ContentType.IMAGE
                subfolder = 'images'
            else:
                return {"message": f"Unsupported file type: {file_ext}"}, 400

            # Save file
            file_service = get_file_service()
            filename, file_path, file_size = file_service.save_file(file, subfolder)

            # Create document record
            document = Document(
                name=filename,
                original_name=file.filename,
                type=content_type,
                file_url=file_path,
                file_size=file_size,
                mime_type=file.content_type,
                status=DocumentStatus.PENDING,
                tags=tags_list,
                uploaded_by=user_id,
                module_id=module_id,
                date_created=datetime.utcnow()
            )

            db.session.add(document)
            db.session.commit()

            # Start processing in background (or immediately for MVP)
            try:
                result = file_service.process_document(file_path, content_type.value)

                # Update document with processing results
                document.extracted_text = result.get('extracted_text')
                document.ocr_text = result.get('ocr_text')
                document.page_count = result.get('page_count', 0)

                if result.get('thumbnail_url'):
                    document.thumbnail_url = f"/uploads/thumbnails/{result['thumbnail_url']}"

                document.status = DocumentStatus.COMPLETED
                db.session.commit()

            except Exception as e:
                document.status = DocumentStatus.FAILED
                db.session.commit()
                print(f"Error processing document: {str(e)}")

            return {
                'id': document.id,
                'name': document.name,
                'type': document.type.value,
                'file_url': document.file_url,
                'file_size': document.file_size,
                'status': document.status.value,
                'extracted_text': document.extracted_text,
                'page_count': document.page_count,
                'thumbnail_url': document.thumbnail_url
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error uploading document: {str(e)}"}, 500


class DocumentResource(Resource):
    @token_required
    def get(self, document_id):
        """Get document by ID"""
        try:
            document = Document.query.get_or_404(document_id)

            return {
                'id': document.id,
                'name': document.name,
                'original_name': document.original_name,
                'type': document.type.value if document.type else None,
                'file_url': document.file_url,
                'thumbnail_url': document.thumbnail_url,
                'file_size': document.file_size,
                'mime_type': document.mime_type,
                'page_count': document.page_count,
                'status': document.status.value if document.status else None,
                'extracted_text': document.extracted_text,
                'ocr_text': document.ocr_text,
                'tags': document.tags,
                'module_id': document.module_id,
                'uploaded_by': document.uploaded_by,
                'date_created': document.date_created.isoformat() if document.date_created else None
            }

        except Exception as e:
            return {"message": f"Error retrieving document: {str(e)}"}, 404

    @token_required
    def delete(self, document_id):
        """Delete document"""
        try:
            document = Document.query.get_or_404(document_id)

            # Delete physical file
            file_service = get_file_service()
            try:
                file_service.delete_file(document.file_url)
                if document.thumbnail_url:
                    # Extract filename from URL
                    thumb_filename = os.path.basename(document.thumbnail_url)
                    thumb_path = os.path.join(file_service.upload_folder, 'thumbnails', thumb_filename)
                    file_service.delete_file(thumb_path)
            except Exception as e:
                print(f"Error deleting files: {str(e)}")

            # Delete database record
            db.session.delete(document)
            db.session.commit()

            return {'message': 'Document deleted successfully'}, 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error deleting document: {str(e)}"}, 500


class DocumentProcessResource(Resource):
    @token_required
    def post(self, document_id):
        """Trigger document processing (reprocess)"""
        try:
            document = Document.query.get_or_404(document_id)

            if not os.path.exists(document.file_url):
                return {"message": "File not found"}, 404

            document.status = DocumentStatus.PROCESSING
            db.session.commit()

            # Process document
            file_service = get_file_service()
            result = file_service.process_document(document.file_url, document.type.value)

            # Update with results
            document.extracted_text = result.get('extracted_text')
            document.ocr_text = result.get('ocr_text')
            document.page_count = result.get('page_count', 0)

            if result.get('thumbnail_url'):
                document.thumbnail_url = f"/uploads/thumbnails/{result['thumbnail_url']}"

            document.status = DocumentStatus.COMPLETED
            document.last_modified = datetime.utcnow()
            db.session.commit()

            return {
                'id': document.id,
                'status': document.status.value,
                'extracted_text': document.extracted_text,
                'page_count': document.page_count
            }, 200

        except Exception as e:
            document.status = DocumentStatus.FAILED
            db.session.commit()
            return {"message": f"Error processing document: {str(e)}"}, 500
