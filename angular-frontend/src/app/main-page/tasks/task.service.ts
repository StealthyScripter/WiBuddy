import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://your-api-url.com/tasks'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch tasks
  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Complete a task
  completeTask(taskId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/complete/${taskId}`, {});
  }

  // Delete a task
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${taskId}`);
  }

  // Update a task (optional)
  updateTask(taskId: number, taskData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${taskId}`, taskData);
  }
}
