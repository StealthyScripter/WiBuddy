// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, of, throwError } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';
// import { Note } from '../models.interface';
// // import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class NoteService {
// //   private apiUrl = `${environment.apiBaseUrl}/notes`;
  
//   // For development/testing without a backend
//   private mockNotes: Note[] = [
//     {
//       id: '1',
//       name: 'Make measurements of the model',
//       content: ['Calipers will be provided by the dean'],
//       dateCreated: new Date('2025-02-01').toISOString(),
//       lastModified: new Date('2025-02-01').toISOString(),
//       type: 'text'
//     },
//     {
//       id: '2',
//       name: 'Shopping List',
//       content: ['Milk', 'Eggs', 'Bread', 'Coffee'],
//       dateCreated: new Date('2025-02-03').toISOString(),
//       lastModified: new Date('2025-02-03').toISOString(),
//       type: 'list',
//       items: ['Milk', 'Eggs', 'Bread', 'Coffee'],
//       tags: ['shopping', 'groceries']
//     },
//     {
//       id: '3',
//       name: 'Project Ideas',
//       content: 'Start working on the new mobile app design. Research competitors and create initial wireframes.',
//       dateCreated: new Date('2025-01-15').toISOString(),
//       lastModified: new Date('2025-01-15').toISOString(),
//       type: 'text',
//       tags: ['work', 'design']
//     },
//     {
//       id: '4',
//       name: 'Vacation Photos',
//       content: 'Photos from our trip to the mountains last weekend.',
//       dateCreated: new Date('2025-01-20').toISOString(),
//       lastModified: new Date('2025-01-20').toISOString(),
//       type: 'media',
//       imageUrl: 'assets/images/mountain-thumbnail.jpg',
//       images: [
//         { url: 'assets/images/vacation1.jpg', alt: 'Mountain view from the cabin' },
//         { url: 'assets/images/vacation2.jpg', alt: 'Hiking trail' },
//         { url: 'assets/images/vacation3.jpg', alt: 'Sunset over the lake' }
//       ],
//       tags: ['personal', 'vacation', 'photos']
//     }
//   ];

//   constructor(private http: HttpClient) { }

//   // Get all notes
//   getNotes(): Observable<Note[]> {
//     // For production with real API
//     if (!environment.useMockData) {
//       return this.http.get<Note[]>(this.apiUrl).pipe(
//         tap(notes => console.log('Fetched notes')),
//         catchError(this.handleError<Note[]>('getNotes', []))
//       );
//     }
    
//     // For development with mock data
//     return of(this.mockNotes).pipe(
//       tap(notes => console.log('Fetched mock notes')),
//       delay(300) // Simulate network delay
//     );
//   }

//   // Get a single note by ID
//   getNoteById(id: string): Observable<Note> {
//     if (!environment.useMockData) {
//       const url = `${this.apiUrl}/${id}`;
//       return this.http.get<Note>(url).pipe(
//         tap(note => console.log(`Fetched note id=${id}`)),
//         catchError(this.handleError<Note>(`getNoteById id=${id}`))
//       );
//     }
    
//     // For development with mock data
//     const note = this.mockNotes.find(note => note.id === id);
//     if (!note) {
//       return throwError(() => new Error(`Note with id ${id} not found`));
//     }
//     return of(note).pipe(
//       tap(note => console.log(`Fetched mock note id=${id}`)),
//       delay(300) // Simulate network delay
//     );
//   }

//   // Create a new note
//   createNote(note: Omit<Note, 'id'>): Observable<Note> {
//     if (!environment.useMockData) {
//       return this.http.post<Note>(this.apiUrl, note).pipe(
//         tap(newNote => console.log(`Created note id=${newNote.id}`)),
//         catchError(this.handleError<Note>('createNote'))
//       );
//     }
    
//     // For development with mock data
//     const newNote: Note = {
//       ...note,
//       id: Date.now().toString(), // Generate a unique ID
//       dateCreated: new Date().toISOString(),
//       lastModified: new Date().toISOString()
//     };
//     this.mockNotes.push(newNote);
//     return of(newNote).pipe(
//       tap(note => console.log(`Created mock note id=${note.id}`)),
//       delay(300) // Simulate network delay
//     );
//   }

//   // Update an existing note
//   updateNote(note: Note): Observable<Note> {
//     if (!environment.useMockData) {
//       const url = `${this.apiUrl}/${note.id}`;
//       return this.http.put<Note>(url, note).pipe(
//         tap(_ => console.log(`Updated note id=${note.id}`)),
//         catchError(this.handleError<Note>('updateNote'))
//       );
//     }
    
//     // For development with mock data
//     const index = this.mockNotes.findIndex(n => n.id === note.id);
//     if (index === -1) {
//       return throwError(() => new Error(`Note with id ${note.id} not found`));
//     }
    
//     const updatedNote: Note = {
//       ...note,
//       lastModified: new Date().toISOString()
//     };
    
//     this.mockNotes[index] = updatedNote;
//     return of(updatedNote).pipe(
//       tap(_ => console.log(`Updated mock note id=${note.id}`)),
//       delay(300) // Simulate network delay
//     );
//   }

//   // Delete a note
//   deleteNote(id: string): Observable<void> {
//     if (!environment.useMockData) {
//       const url = `${this.apiUrl}/${id}`;
//       return this.http.delete<void>(url).pipe(
//         tap(_ => console.log(`Deleted note id=${id}`)),
//         catchError(this.handleError<void>('deleteNote'))
//       );
//     }
    
//     // For development with mock data
//     const index = this.mockNotes.findIndex(note => note.id === id);
//     if (index === -1) {
//       return throwError(() => new Error(`Note with id ${id} not found`));
//     }
    
//     this.mockNotes.splice(index, 1);
//     return of(undefined).pipe(
//       tap(_ => console.log(`Deleted mock note id=${id}`)),
//       delay(300) // Simulate network delay
//     );
//   }

//   // Search notes by text
//   searchNotes(term: string): Observable<Note[]> {
//     if (!term.trim()) {
//       return this.getNotes();
//     }
    
//     if (!environment.useMockData) {
//       const url = `${this.apiUrl}/search?term=${term}`;
//       return this.http.get<Note[]>(url).pipe(
//         tap(notes => console.log(`Found notes matching "${term}"`)),
//         catchError(this.handleError<Note[]>('searchNotes', []))
//       );
//     }
    
//     // For development with mock data
//     const searchTerm = term.toLowerCase();
//     const results = this.mockNotes.filter(note => {
//       const nameMatch = note.name.toLowerCase().includes(searchTerm);
      
//       // Search in content based on type
//       let contentMatch = false;
//       if (typeof note.content === 'string') {
//         contentMatch = note.content.toLowerCase().includes(searchTerm);
//       } else if (Array.isArray(note.content)) {
//         contentMatch = note.content.some(text => 
//           text.toLowerCase().includes(searchTerm)
//         );
//       }
      
//       // Search in tags
//       const tagMatch = note.tags?.some(tag => 
//         tag.toLowerCase().includes(searchTerm)
//       ) || false;
      
//       return nameMatch || contentMatch || tagMatch;
//     });
    
//     return of(results).pipe(
//       tap(notes => console.log(`Found ${notes.length} mock notes matching "${term}"`)),
//       delay(300) // Simulate network delay
//     );
//   }
  
//   // Get notes by tag
//   getNotesByTag(tag: string): Observable<Note[]> {
//     if (!environment.useMockData) {
//       const url = `${this.apiUrl}/tags/${tag}`;
//       return this.http.get<Note[]>(url).pipe(
//         tap(notes => console.log(`Found notes with tag "${tag}"`)),
//         catchError(this.handleError<Note[]>('getNotesByTag', []))
//       );
//     }
    
//     // For development with mock data
//     const results = this.mockNotes.filter(note => 
//       note.tags?.includes(tag)
//     );
    
//     return of(results).pipe(
//       tap(notes => console.log(`Found ${notes.length} mock notes with tag "${tag}"`)),
//       delay(300) // Simulate network delay
//     );
//   }

//   // Handle Http operation errors
//   private handleError<T>(operation = 'operation', result?: T) {
//     return (error: HttpErrorResponse): Observable<T> => {
//       console.error(`${operation} failed: ${error.message}`);
      
//       // Let the app keep running by returning an empty result
//       return of(result as T);
//     };
//   }
// }

// // Helper function to simulate network delay
// function delay(ms: number) {
//   return (observable: Observable<any>) => new Observable(subscriber => {
//     const subscription = observable.subscribe({
//       next(value) {
//         setTimeout(() => subscriber.next(value), ms);
//       },
//       error(error) {
//         setTimeout(() => subscriber.error(error), ms);
//       },
//       complete() {
//         setTimeout(() => subscriber.complete(), ms);
//       }
//     });
    
//     return () => subscription.unsubscribe();
//   });
// }
