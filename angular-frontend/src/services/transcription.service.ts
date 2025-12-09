import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { Transcript, TranscriptSegment, Speaker, UUID, DocumentStatus } from '../models.interface';

// ============= Store Class =============

class TranscriptStore {
  private transcripts: Map<UUID, Transcript> = new Map();
  private transcriptsList: Transcript[] = [];

  add(transcript: Transcript): void {
    this.transcripts.set(transcript.id, transcript);
    this.transcriptsList.push(transcript);
  }

  update(id: UUID, transcript: Partial<Transcript>): void {
    const existing = this.transcripts.get(id);
    if (existing) {
      const updated = { ...existing, ...transcript, lastModified: new Date().toISOString() };
      this.transcripts.set(id, updated);
      const index = this.transcriptsList.findIndex(t => t.id === id);
      if (index !== -1) {
        this.transcriptsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.transcripts.delete(id);
    this.transcriptsList = this.transcriptsList.filter(t => t.id !== id);
  }

  get(id: UUID): Transcript | undefined {
    return this.transcripts.get(id);
  }

  getByContentId(contentId: UUID): Transcript | undefined {
    return this.transcriptsList.find(t => t.contentId === contentId);
  }

  getAll(): Transcript[] {
    return [...this.transcriptsList];
  }

  clear(): void {
    this.transcripts.clear();
    this.transcriptsList = [];
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
    console.log(`[TranscriptionService] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[TranscriptionService] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[TranscriptionService] ${message}`, ...args);
  }
}

// ============= Date Provider =============

class DateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

// ============= Transcription Engine =============

class TranscriptionEngine {
  async transcribeAudio(audioUrl: string, language?: string): Promise<TranscriptionResult> {
    // TODO: Integrate with actual transcription API (Whisper, Google Speech-to-Text, AWS Transcribe, etc.)
    console.log('Transcribing audio:', audioUrl, 'Language:', language);

    // Simulate API call delay
    await this.delay(3000);

    // Mock transcription result
    const segments: TranscriptSegment[] = [
      {
        id: this.generateId(),
        text: 'This is the first segment of the transcription.',
        startTime: 0,
        endTime: 5,
        confidence: 95
      },
      {
        id: this.generateId(),
        text: 'Here is another segment discussing key concepts.',
        startTime: 5,
        endTime: 12,
        confidence: 92
      },
      {
        id: this.generateId(),
        text: 'And finally, the conclusion of the audio content.',
        startTime: 12,
        endTime: 18,
        confidence: 97
      }
    ];

    const text = segments.map(s => s.text).join(' ');

    return {
      text,
      segments,
      duration: 18,
      language: language || 'en'
    };
  }

  async generateSummary(text: string): Promise<string> {
    // TODO: Integrate with AI API for summarization
    console.log('Generating summary for transcript');

    await this.delay(1500);

    return 'This is an AI-generated summary of the transcript covering the main points discussed.';
  }

  async extractKeyPoints(text: string): Promise<string[]> {
    // TODO: Integrate with AI API for key point extraction
    console.log('Extracting key points from transcript');

    await this.delay(1000);

    return [
      'Key point 1: Introduction to the topic',
      'Key point 2: Main concept explanation',
      'Key point 3: Practical applications',
      'Key point 4: Conclusion and summary'
    ];
  }

  async identifySpeakers(segments: TranscriptSegment[]): Promise<Speaker[]> {
    // TODO: Integrate with speaker diarization API
    console.log('Identifying speakers in transcript');

    await this.delay(2000);

    return [
      {
        id: this.generateId(),
        label: 'Speaker 1',
        name: 'Instructor'
      },
      {
        id: this.generateId(),
        label: 'Speaker 2',
        name: 'Student'
      }
    ];
  }

  private generateId(): UUID {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

interface TranscriptionResult {
  text: string;
  segments: TranscriptSegment[];
  duration: number;
  language: string;
}

// ============= Main Service =============

@Injectable({
  providedIn: 'root'
})
export class TranscriptionService {
  private transcriptStore = new TranscriptStore();
  private logger: ILogger = new ConsoleLogger();
  private dateProvider = new DateProvider();
  private engine = new TranscriptionEngine();

  // Observables
  private transcriptsSubject = new BehaviorSubject<Transcript[]>([]);
  public transcripts$ = this.transcriptsSubject.asObservable().pipe(distinctUntilChanged());

  // Error subject
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.logger.log('TranscriptionService initialized');
  }

  // ============= Transcription Management =============

  async createTranscription(
    contentId: UUID,
    audioUrl: string,
    language?: string
  ): Promise<Transcript> {
    try {
      // Create initial transcript with pending status
      const transcript: Transcript = {
        id: this.generateId(),
        contentId,
        audioUrl,
        text: '',
        segments: [],
        language: language || 'en',
        status: DocumentStatus.PENDING,
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      this.transcriptStore.add(transcript);
      this.transcriptsSubject.next(this.transcriptStore.getAll());
      this.logger.log('Transcription created:', transcript.id);

      // Process transcription asynchronously
      this.processTranscription(transcript.id);

      return transcript;
    } catch (error) {
      this.handleError('Failed to create transcription', error);
      throw error;
    }
  }

  async processTranscription(transcriptId: UUID): Promise<void> {
    try {
      const transcript = this.transcriptStore.get(transcriptId);
      if (!transcript) {
        throw new Error(`Transcript with id ${transcriptId} not found`);
      }

      // Update status to processing
      this.transcriptStore.update(transcriptId, { status: DocumentStatus.PROCESSING });
      this.transcriptsSubject.next(this.transcriptStore.getAll());

      // Perform transcription
      const result = await this.engine.transcribeAudio(transcript.audioUrl, transcript.language);

      // Identify speakers
      const speakers = await this.engine.identifySpeakers(result.segments);

      // Assign speakers to segments (mock logic - would be more sophisticated in production)
      const segmentsWithSpeakers = result.segments.map((segment, index) => ({
        ...segment,
        speakerId: speakers[index % speakers.length].id
      }));

      // Generate AI summary
      const aiSummary = await this.engine.generateSummary(result.text);

      // Extract key points
      const keyPoints = await this.engine.extractKeyPoints(result.text);

      // Update transcript with results
      this.transcriptStore.update(transcriptId, {
        text: result.text,
        segments: segmentsWithSpeakers,
        duration: result.duration,
        speakers,
        aiSummary,
        keyPoints,
        status: DocumentStatus.COMPLETED
      });

      this.transcriptsSubject.next(this.transcriptStore.getAll());
      this.logger.log('Transcription processed:', transcriptId);
    } catch (error) {
      this.transcriptStore.update(transcriptId, { status: DocumentStatus.FAILED });
      this.transcriptsSubject.next(this.transcriptStore.getAll());
      this.handleError('Failed to process transcription', error);
      throw error;
    }
  }

  updateTranscript(id: UUID, updates: Partial<Transcript>): void {
    this.transcriptStore.update(id, updates);
    this.transcriptsSubject.next(this.transcriptStore.getAll());
  }

  deleteTranscript(id: UUID): void {
    this.transcriptStore.delete(id);
    this.transcriptsSubject.next(this.transcriptStore.getAll());
    this.logger.log('Transcript deleted:', id);
  }

  getTranscriptById(id: UUID): Transcript | undefined {
    return this.transcriptStore.get(id);
  }

  getTranscriptByContentId(contentId: UUID): Transcript | undefined {
    return this.transcriptStore.getByContentId(contentId);
  }

  getAllTranscripts(): Transcript[] {
    return this.transcriptStore.getAll();
  }

  getTranscriptsByStatus(status: DocumentStatus): Transcript[] {
    return this.transcriptStore.getAll().filter(t => t.status === status);
  }

  // ============= Segment Management =============

  updateSegment(transcriptId: UUID, segmentId: UUID, updates: Partial<TranscriptSegment>): void {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) {
      throw new Error(`Transcript with id ${transcriptId} not found`);
    }

    const segmentIndex = transcript.segments.findIndex(s => s.id === segmentId);
    if (segmentIndex !== -1) {
      transcript.segments[segmentIndex] = {
        ...transcript.segments[segmentIndex],
        ...updates
      };

      // Update full text
      const updatedText = transcript.segments.map(s => s.text).join(' ');

      this.transcriptStore.update(transcriptId, {
        segments: transcript.segments,
        text: updatedText
      });

      this.transcriptsSubject.next(this.transcriptStore.getAll());
      this.logger.log('Segment updated:', segmentId);
    }
  }

  getSegmentsByTimeRange(transcriptId: UUID, startTime: number, endTime: number): TranscriptSegment[] {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) return [];

    return transcript.segments.filter(
      s => s.startTime >= startTime && s.endTime <= endTime
    );
  }

  getSegmentAtTime(transcriptId: UUID, time: number): TranscriptSegment | undefined {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) return undefined;

    return transcript.segments.find(
      s => time >= s.startTime && time <= s.endTime
    );
  }

  // ============= Speaker Management =============

  updateSpeaker(transcriptId: UUID, speakerId: UUID, name: string): void {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript || !transcript.speakers) return;

    const speakerIndex = transcript.speakers.findIndex(s => s.id === speakerId);
    if (speakerIndex !== -1) {
      transcript.speakers[speakerIndex].name = name;
      this.transcriptStore.update(transcriptId, { speakers: transcript.speakers });
      this.transcriptsSubject.next(this.transcriptStore.getAll());
      this.logger.log('Speaker updated:', speakerId);
    }
  }

  getSegmentsBySpeaker(transcriptId: UUID, speakerId: UUID): TranscriptSegment[] {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) return [];

    return transcript.segments.filter(s => s.speakerId === speakerId);
  }

  // ============= Export & Search =============

  exportTranscriptAsText(transcriptId: UUID): string {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) return '';

    let output = `Transcript: ${transcript.id}\n`;
    output += `Duration: ${transcript.duration} seconds\n`;
    output += `Language: ${transcript.language}\n\n`;

    if (transcript.speakers && transcript.speakers.length > 0) {
      transcript.segments.forEach(segment => {
        const speaker = transcript.speakers?.find(s => s.id === segment.speakerId);
        const speakerName = speaker?.name || speaker?.label || 'Unknown';
        const timestamp = this.formatTime(segment.startTime);
        output += `[${timestamp}] ${speakerName}: ${segment.text}\n`;
      });
    } else {
      transcript.segments.forEach(segment => {
        const timestamp = this.formatTime(segment.startTime);
        output += `[${timestamp}] ${segment.text}\n`;
      });
    }

    if (transcript.aiSummary) {
      output += `\n\nSummary:\n${transcript.aiSummary}\n`;
    }

    if (transcript.keyPoints && transcript.keyPoints.length > 0) {
      output += `\n\nKey Points:\n`;
      transcript.keyPoints.forEach((point, index) => {
        output += `${index + 1}. ${point}\n`;
      });
    }

    return output;
  }

  exportTranscriptAsJSON(transcriptId: UUID): string {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) return '{}';

    return JSON.stringify(transcript, null, 2);
  }

  searchTranscript(transcriptId: UUID, query: string): TranscriptSegment[] {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) return [];

    const lowerQuery = query.toLowerCase();
    return transcript.segments.filter(segment =>
      segment.text.toLowerCase().includes(lowerQuery)
    );
  }

  searchAllTranscripts(query: string): Array<{ transcript: Transcript; segments: TranscriptSegment[] }> {
    const lowerQuery = query.toLowerCase();
    const results: Array<{ transcript: Transcript; segments: TranscriptSegment[] }> = [];

    this.transcriptStore.getAll().forEach(transcript => {
      const matchingSegments = transcript.segments.filter(segment =>
        segment.text.toLowerCase().includes(lowerQuery)
      );

      if (matchingSegments.length > 0) {
        results.push({ transcript, segments: matchingSegments });
      }
    });

    return results;
  }

  // ============= Regenerate AI Content =============

  async regenerateSummary(transcriptId: UUID): Promise<string> {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) {
      throw new Error(`Transcript with id ${transcriptId} not found`);
    }

    const summary = await this.engine.generateSummary(transcript.text);
    this.transcriptStore.update(transcriptId, { aiSummary: summary });
    this.transcriptsSubject.next(this.transcriptStore.getAll());

    return summary;
  }

  async regenerateKeyPoints(transcriptId: UUID): Promise<string[]> {
    const transcript = this.transcriptStore.get(transcriptId);
    if (!transcript) {
      throw new Error(`Transcript with id ${transcriptId} not found`);
    }

    const keyPoints = await this.engine.extractKeyPoints(transcript.text);
    this.transcriptStore.update(transcriptId, { keyPoints });
    this.transcriptsSubject.next(this.transcriptStore.getAll());

    return keyPoints;
  }

  // ============= Statistics =============

  getTranscriptionStatistics() {
    const transcripts = this.transcriptStore.getAll();

    const totalTranscripts = transcripts.length;
    const completedTranscripts = transcripts.filter(t => t.status === DocumentStatus.COMPLETED).length;
    const processingTranscripts = transcripts.filter(t => t.status === DocumentStatus.PROCESSING).length;
    const failedTranscripts = transcripts.filter(t => t.status === DocumentStatus.FAILED).length;

    const totalDuration = transcripts.reduce((sum, t) => sum + (t.duration || 0), 0);
    const averageDuration = transcripts.length > 0 ? Math.round(totalDuration / transcripts.length) : 0;

    const languageDistribution = transcripts.reduce((acc, t) => {
      acc[t.language || 'unknown'] = (acc[t.language || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTranscripts,
      completedTranscripts,
      processingTranscripts,
      failedTranscripts,
      totalDuration,
      averageDuration,
      languageDistribution
    };
  }

  // ============= Utility Methods =============

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

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

  setInitialData(transcripts: Transcript[]): void {
    this.transcriptStore.clear();
    transcripts.forEach(transcript => this.transcriptStore.add(transcript));
    this.transcriptsSubject.next(this.transcriptStore.getAll());
    this.logger.log(`Initialized with ${transcripts.length} transcripts`);
  }

  clearAllData(): void {
    this.transcriptStore.clear();
    this.transcriptsSubject.next([]);
    this.logger.log('All data cleared');
  }
}
