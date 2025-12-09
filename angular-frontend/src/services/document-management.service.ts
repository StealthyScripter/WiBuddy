import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { Document, Annotation, UUID, DocumentStatus, ContentType, AnnotationReply } from '../models.interface';

// ============= Store Classes =============

class DocumentStore {
  private documents: Map<UUID, Document> = new Map();
  private documentsList: Document[] = [];

  add(document: Document): void {
    this.documents.set(document.id, document);
    this.documentsList.push(document);
  }

  update(id: UUID, document: Partial<Document>): void {
    const existing = this.documents.get(id);
    if (existing) {
      const updated = { ...existing, ...document, lastModified: new Date().toISOString() };
      this.documents.set(id, updated);
      const index = this.documentsList.findIndex(d => d.id === id);
      if (index !== -1) {
        this.documentsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.documents.delete(id);
    this.documentsList = this.documentsList.filter(d => d.id !== id);
  }

  get(id: UUID): Document | undefined {
    return this.documents.get(id);
  }

  getAll(): Document[] {
    return [...this.documentsList];
  }

  clear(): void {
    this.documents.clear();
    this.documentsList = [];
  }
}

// ============= Logger =============

interface ILogger {
  log(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
}

class ConsoleLogger implements ILogger {
  log(message: string, ...args: any[]): void {
    console.log(`[DocumentManagementService] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[DocumentManagementService] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[DocumentManagementService] ${message}`, ...args);
  }
}

// ============= Date Provider =============

class DateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

// ============= Document Processor =============

class DocumentProcessor {
  async convertPPTToPDF(pptUrl: string): Promise<string> {
    // TODO: Integrate with actual conversion API (LibreOffice, Aspose, etc.)
    // This is a placeholder that would be replaced with actual API call
    console.log('Converting PPT to PDF:', pptUrl);

    // Simulate API call delay
    await this.delay(2000);

    // Return mock PDF URL
    return pptUrl.replace('.ppt', '.pdf').replace('.pptx', '.pdf');
  }

  async extractTextFromPDF(pdfUrl: string): Promise<string> {
    // TODO: Integrate with PDF text extraction API (pdf.js, pdfplumber, etc.)
    console.log('Extracting text from PDF:', pdfUrl);

    await this.delay(1500);

    return 'Extracted text content from PDF...';
  }

  async performOCR(imageUrl: string): Promise<string> {
    // TODO: Integrate with OCR API (Tesseract, Google Vision, Azure OCR, etc.)
    console.log('Performing OCR on image:', imageUrl);

    await this.delay(2000);

    return 'OCR extracted text...';
  }

  async generateThumbnail(fileUrl: string, type: ContentType): Promise<string> {
    // TODO: Integrate with thumbnail generation service
    console.log('Generating thumbnail for:', fileUrl);

    await this.delay(500);

    return fileUrl + '-thumb.jpg';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============= Main Service =============

@Injectable({
  providedIn: 'root'
})
export class DocumentManagementService {
  private documentStore = new DocumentStore();
  private logger: ILogger = new ConsoleLogger();
  private dateProvider = new DateProvider();
  private processor = new DocumentProcessor();

  // Observables
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  public documents$ = this.documentsSubject.asObservable().pipe(distinctUntilChanged());

  // Error subject
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.logger.log('DocumentManagementService initialized');
  }

  // ============= Document Management =============

  async uploadDocument(
    name: string,
    fileUrl: string,
    type: ContentType,
    fileSize: number,
    uploadedBy?: UUID
  ): Promise<Document> {
    try {
      const document: Document = {
        id: this.generateId(),
        name,
        originalName: name,
        type,
        fileUrl,
        fileSize,
        annotations: [],
        status: DocumentStatus.PENDING,
        uploadedBy,
        isShared: false,
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      this.documentStore.add(document);
      this.documentsSubject.next(this.documentStore.getAll());
      this.logger.log('Document uploaded:', document.name);

      // Process document asynchronously
      this.processDocument(document.id);

      return document;
    } catch (error) {
      this.handleError('Failed to upload document', error);
      throw error;
    }
  }

  async processDocument(documentId: UUID): Promise<void> {
    try {
      const document = this.documentStore.get(documentId);
      if (!document) {
        throw new Error(`Document with id ${documentId} not found`);
      }

      this.documentStore.update(documentId, { status: DocumentStatus.PROCESSING });
      this.documentsSubject.next(this.documentStore.getAll());

      // Generate thumbnail
      const thumbnailUrl = await this.processor.generateThumbnail(document.fileUrl, document.type);

      // Process based on type
      let extractedText: string | undefined;
      let processedPdfUrl: string | undefined;

      if (document.type === ContentType.PDF) {
        extractedText = await this.processor.extractTextFromPDF(document.fileUrl);
      } else if (document.type === ContentType.PPT) {
        processedPdfUrl = await this.processor.convertPPTToPDF(document.fileUrl);
        extractedText = await this.processor.extractTextFromPDF(processedPdfUrl);
      }

      this.documentStore.update(documentId, {
        status: DocumentStatus.COMPLETED,
        thumbnailUrl,
        extractedText,
        processedPdfUrl
      });

      this.documentsSubject.next(this.documentStore.getAll());
      this.logger.log('Document processed:', documentId);
    } catch (error) {
      this.documentStore.update(documentId, { status: DocumentStatus.FAILED });
      this.documentsSubject.next(this.documentStore.getAll());
      this.handleError('Failed to process document', error);
      throw error;
    }
  }

  updateDocument(id: UUID, updates: Partial<Document>): void {
    this.documentStore.update(id, updates);
    this.documentsSubject.next(this.documentStore.getAll());
  }

  deleteDocument(id: UUID): void {
    this.documentStore.delete(id);
    this.documentsSubject.next(this.documentStore.getAll());
    this.logger.log('Document deleted:', id);
  }

  getDocumentById(id: UUID): Document | undefined {
    return this.documentStore.get(id);
  }

  getAllDocuments(): Document[] {
    return this.documentStore.getAll();
  }

  getDocumentsByType(type: ContentType): Document[] {
    return this.documentStore.getAll().filter(d => d.type === type);
  }

  getDocumentsByStatus(status: DocumentStatus): Document[] {
    return this.documentStore.getAll().filter(d => d.status === status);
  }

  // ============= PPT to PDF Conversion =============

  async convertPPTToPDF(documentId: UUID): Promise<string> {
    try {
      const document = this.documentStore.get(documentId);
      if (!document) {
        throw new Error(`Document with id ${documentId} not found`);
      }

      if (document.type !== ContentType.PPT) {
        throw new Error('Document is not a PPT file');
      }

      this.documentStore.update(documentId, { status: DocumentStatus.PROCESSING });
      this.documentsSubject.next(this.documentStore.getAll());

      const pdfUrl = await this.processor.convertPPTToPDF(document.fileUrl);

      this.documentStore.update(documentId, {
        status: DocumentStatus.COMPLETED,
        processedPdfUrl: pdfUrl
      });

      this.documentsSubject.next(this.documentStore.getAll());
      this.logger.log('PPT converted to PDF:', documentId);

      return pdfUrl;
    } catch (error) {
      this.handleError('Failed to convert PPT to PDF', error);
      throw error;
    }
  }

  // ============= Annotation Management =============

  addAnnotation(
    documentId: UUID,
    annotation: Omit<Annotation, 'id' | 'dateCreated' | 'documentId'>
  ): Annotation {
    try {
      const document = this.documentStore.get(documentId);
      if (!document) {
        throw new Error(`Document with id ${documentId} not found`);
      }

      const newAnnotation: Annotation = {
        ...annotation,
        id: this.generateId(),
        documentId,
        dateCreated: this.dateProvider.now(),
        replies: annotation.replies || []
      };

      document.annotations.push(newAnnotation);
      this.documentStore.update(documentId, { annotations: document.annotations });
      this.documentsSubject.next(this.documentStore.getAll());
      this.logger.log('Annotation added to document:', documentId);

      return newAnnotation;
    } catch (error) {
      this.handleError('Failed to add annotation', error);
      throw error;
    }
  }

  updateAnnotation(
    documentId: UUID,
    annotationId: UUID,
    updates: Partial<Annotation>
  ): void {
    const document = this.documentStore.get(documentId);
    if (!document) {
      throw new Error(`Document with id ${documentId} not found`);
    }

    const annotationIndex = document.annotations.findIndex(a => a.id === annotationId);
    if (annotationIndex !== -1) {
      document.annotations[annotationIndex] = {
        ...document.annotations[annotationIndex],
        ...updates,
        lastModified: this.dateProvider.now()
      };

      this.documentStore.update(documentId, { annotations: document.annotations });
      this.documentsSubject.next(this.documentStore.getAll());
    }
  }

  deleteAnnotation(documentId: UUID, annotationId: UUID): void {
    const document = this.documentStore.get(documentId);
    if (!document) {
      throw new Error(`Document with id ${documentId} not found`);
    }

    document.annotations = document.annotations.filter(a => a.id !== annotationId);
    this.documentStore.update(documentId, { annotations: document.annotations });
    this.documentsSubject.next(this.documentStore.getAll());
    this.logger.log('Annotation deleted:', annotationId);
  }

  getAnnotationsByDocument(documentId: UUID): Annotation[] {
    const document = this.documentStore.get(documentId);
    return document?.annotations || [];
  }

  getAnnotationsByPage(documentId: UUID, page: number): Annotation[] {
    const document = this.documentStore.get(documentId);
    if (!document) return [];

    return document.annotations.filter(a => a.page === page);
  }

  addReplyToAnnotation(
    documentId: UUID,
    annotationId: UUID,
    reply: Omit<AnnotationReply, 'id' | 'dateCreated'>
  ): void {
    const document = this.documentStore.get(documentId);
    if (!document) {
      throw new Error(`Document with id ${documentId} not found`);
    }

    const annotation = document.annotations.find(a => a.id === annotationId);
    if (!annotation) {
      throw new Error(`Annotation with id ${annotationId} not found`);
    }

    const newReply: AnnotationReply = {
      ...reply,
      id: this.generateId(),
      dateCreated: this.dateProvider.now()
    };

    if (!annotation.replies) {
      annotation.replies = [];
    }

    annotation.replies.push(newReply);
    this.documentStore.update(documentId, { annotations: document.annotations });
    this.documentsSubject.next(this.documentStore.getAll());
    this.logger.log('Reply added to annotation:', annotationId);
  }

  resolveAnnotation(documentId: UUID, annotationId: UUID): void {
    this.updateAnnotation(documentId, annotationId, { isResolved: true });
    this.logger.log('Annotation resolved:', annotationId);
  }

  // ============= Sharing =============

  shareDocument(documentId: UUID, userIds: UUID[]): void {
    const document = this.documentStore.get(documentId);
    if (!document) {
      throw new Error(`Document with id ${documentId} not found`);
    }

    const sharedWith = document.sharedWith || [];
    const updatedSharedWith = [...new Set([...sharedWith, ...userIds])];

    this.documentStore.update(documentId, {
      isShared: true,
      sharedWith: updatedSharedWith
    });

    this.documentsSubject.next(this.documentStore.getAll());
    this.logger.log('Document shared:', documentId);
  }

  unshareDocument(documentId: UUID, userId?: UUID): void {
    const document = this.documentStore.get(documentId);
    if (!document) {
      throw new Error(`Document with id ${documentId} not found`);
    }

    if (userId) {
      const sharedWith = (document.sharedWith || []).filter(id => id !== userId);
      this.documentStore.update(documentId, {
        sharedWith,
        isShared: sharedWith.length > 0
      });
    } else {
      this.documentStore.update(documentId, {
        isShared: false,
        sharedWith: []
      });
    }

    this.documentsSubject.next(this.documentStore.getAll());
    this.logger.log('Document unshared:', documentId);
  }

  getSharedDocuments(userId: UUID): Document[] {
    return this.documentStore.getAll().filter(d =>
      d.isShared && d.sharedWith?.includes(userId)
    );
  }

  // ============= Search & Filter =============

  searchDocuments(query: string): Document[] {
    const lowerQuery = query.toLowerCase();
    return this.documentStore.getAll().filter(document =>
      document.name.toLowerCase().includes(lowerQuery) ||
      document.extractedText?.toLowerCase().includes(lowerQuery) ||
      document.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // ============= Statistics =============

  getDocumentStatistics() {
    const documents = this.documentStore.getAll();

    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, d) => sum + d.fileSize, 0);

    const documentsByType = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const documentsByStatus = documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAnnotations = documents.reduce((sum, d) => sum + d.annotations.length, 0);

    return {
      totalDocuments,
      totalSize,
      documentsByType,
      documentsByStatus,
      totalAnnotations,
      sharedDocuments: documents.filter(d => d.isShared).length
    };
  }

  // ============= Utility Methods =============

  private generateId(): UUID {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleError(message: string, error: any): void {
    this.logger.error(message, error);
    this.errorSubject.next(message);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // ============= Data Management =============

  setInitialData(documents: Document[]): void {
    this.documentStore.clear();
    documents.forEach(document => this.documentStore.add(document));
    this.documentsSubject.next(this.documentStore.getAll());
    this.logger.log(`Initialized with ${documents.length} documents`);
  }

  clearAllData(): void {
    this.documentStore.clear();
    this.documentsSubject.next([]);
    this.logger.log('All data cleared');
  }
}
