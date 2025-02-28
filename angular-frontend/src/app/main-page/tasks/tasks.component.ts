import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DueDateComponent } from '../due-date/due-date.component';

@Component({
  selector: 'app-tasks',
  imports: [ DueDateComponent ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit{
  tasks = [
    {
      id: 1,
      name: 'Task 1',
      date_created: '2025-01-01',
      completed: false,
      due_date: '2025-02-01',
      estimated_duration: '2 hours'
    },
    {
      id: 2,
      name: 'Task 2',
      date_created: '2025-01-15',
      completed: true,
      due_date: '2025-02-10',
      estimated_duration: '3 hours'
    },
    {
      id: 3,
      name: 'Task 3',
      date_created: '2025-01-20',
      completed: false,
      due_date: '2025-03-01',
      estimated_duration: '1.5 hours'
    }
  ];

  constructor() { }

  ngOnInit(): void {}

  toggleTaskCompletion(task: any): void {
    task.completed = !task.completed;
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}