# HTML Component Refactoring Guide

## Overview

This guide provides templates and patterns for refactoring all remaining HTML components to use the new design system.

---

## Status

### ✅ Completed
- Design System (CSS variables, components, utilities)
- App Layout (navigation, header)

### 🔄 In Progress
- Home Page
- Tasks Page
- Projects Page
- LMS Page
- Calendar Page
- Trends Page
- Profile Page
- All detail/form pages

---

## General Refactoring Principles

### 1. Replace Old Classes with New Design System

**Old Pattern:**
```html
<div class="custom-card" style="padding: 20px;">
  <h3 style="font-size: 18px; font-weight: 600;">Title</h3>
  <div class="custom-status">Active</div>
</div>
```

**New Pattern:**
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
    <span class="badge badge-status badge-in-progress">Active</span>
  </div>
</div>
```

### 2. Use Utility Classes for Spacing

**Old:**
```css
.custom-class {
  margin-top: 16px;
  margin-bottom: 24px;
  padding: 12px 16px;
}
```

**New:**
```html
<div class="mt-4 mb-6 px-4 py-3">...</div>
```

### 3. Use Semantic HTML

**Old:**
```html
<div class="container-wrapper">
  <div class="section-title">Tasks</div>
</div>
```

**New:**
```html
<div class="container">
  <h1 class="text-3xl font-bold mb-6">Tasks</h1>
</div>
```

---

## Component Templates

### Page Layout Template

```html
<div class="container py-8">
  <!-- Page Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold mb-2">Page Title</h1>
      <p class="text-secondary">Page description</p>
    </div>
    <button class="btn btn-primary">
      + New Item
    </button>
  </div>

  <!-- Filters/Search -->
  <div class="flex flex-wrap items-center gap-4 mb-6">
    <input
      type="search"
      class="form-input flex-1"
      placeholder="Search...">
    <select class="form-select w-auto">
      <option>All</option>
    </select>
  </div>

  <!-- Content Grid -->
  <div class="grid-auto-fit">
    <!-- Cards go here -->
  </div>
</div>
```

### Card Template

```html
<div class="card card-interactive">
  <div class="card-header">
    <h3 class="card-title truncate">Item Title</h3>
    <span class="badge badge-status badge-in-progress">In Progress</span>
  </div>

  <div class="card-content">
    <p class="text-sm text-secondary line-clamp-2 mb-4">
      Description text that will be limited to 2 lines with ellipsis.
    </p>

    <!-- Meta Information -->
    <div class="flex items-center gap-3 text-xs text-tertiary">
      <span class="flex items-center gap-1">
        <svg>...</svg>
        Due: Jan 15
      </span>
      <span class="badge badge-priority badge-high">High</span>
    </div>
  </div>

  <div class="card-footer">
    <div class="avatar avatar-sm">
      <img src="user.jpg" alt="User">
    </div>
    <button class="btn btn-sm btn-ghost ml-auto">View</button>
  </div>
</div>
```

### Form Template

```html
<div class="max-w-2xl mx-auto py-8">
  <h1 class="text-3xl font-bold mb-8">Create New Item</h1>

  <form class="card">
    <div class="form-group">
      <label class="form-label">Item Name</label>
      <input
        type="text"
        class="form-input"
        placeholder="Enter name">
      <small class="form-help">Helper text here</small>
    </div>

    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea
        class="form-textarea"
        placeholder="Enter description"></textarea>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Due Date</label>
        <input type="date" class="form-input">
      </div>
    </div>

    <div class="flex gap-3 justify-end mt-6">
      <button type="button" class="btn btn-secondary">Cancel</button>
      <button type="submit" class="btn btn-primary">Create</button>
    </div>
  </form>
</div>
```

### Empty State Template

```html
<div class="empty-state">
  <div class="empty-state-icon">📭</div>
  <h3 class="empty-state-title">No items found</h3>
  <p class="empty-state-description">
    Get started by creating your first item
  </p>
  <button class="btn btn-primary">+ Create Item</button>
</div>
```

### Stats/Dashboard Cards Template

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <!-- Stat Card -->
  <div class="card">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-tertiary">Total Tasks</span>
      <svg class="text-primary-600">...</svg>
    </div>
    <div class="text-3xl font-bold mb-1">24</div>
    <div class="text-xs text-success flex items-center gap-1">
      <span>↑ 12%</span>
      <span class="text-tertiary">from last week</span>
    </div>
  </div>
</div>
```

---

## Component-Specific Patterns

### Tasks Page

**Structure:**
```
Container
├── Header (Title + "New Task" button)
├── Filters (Search + Status + Priority)
└── Grid of Task Cards
```

**Task Card:**
```html
<div class="card card-interactive" [routerLink]="['/tasks', task.id]">
  <div class="card-header">
    <h3 class="card-title truncate">{{task.name}}</h3>
    <span class="badge badge-status"
          [ngClass]="{
            'badge-not-started': task.status === 'NOT_STARTED',
            'badge-in-progress': task.status === 'IN_PROGRESS',
            'badge-completed': task.status === 'COMPLETED',
            'badge-overdue': task.status === 'OVERDUE'
          }">
      {{task.status}}
    </span>
  </div>

  <div class="card-content">
    <p class="text-sm text-secondary line-clamp-2 mb-4">
      {{task.description}}
    </p>
    <div class="flex items-center gap-3 flex-wrap">
      <span class="badge badge-priority badge-{{task.priority.toLowerCase()}}">
        {{task.priority}}
      </span>
      <span class="text-xs text-tertiary" *ngIf="task.dueDate">
        Due: {{task.dueDate | date:'MMM d'}}
      </span>
    </div>
  </div>

  <div class="card-footer" *ngIf="task.assigneeId">
    <div class="avatar avatar-sm">
      <img [src]="getAssigneeAvatar(task.assigneeId)" alt="Assignee">
    </div>
    <span class="text-xs text-secondary ml-auto">
      {{task.estimatedDuration}}h
    </span>
  </div>
</div>
```

### Projects Page

**Structure:**
```
Container
├── Header (Title + "New Project" button)
├── Stats Cards (Total, Active, Completed)
├── Filters (Search + Department + Status)
└── Grid of Project Cards
```

**Project Card:**
```html
<div class="card card-interactive" [routerLink]="['/projects', project.id]">
  <div class="card-header">
    <h3 class="card-title">{{project.name}}</h3>
    <span class="badge badge-{{project.completionStatus.toLowerCase()}}">
      {{project.completionStatus}}
    </span>
  </div>

  <div class="card-content">
    <p class="text-sm text-secondary line-clamp-2 mb-4">
      {{project.description}}
    </p>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2 text-xs">
        <span class="text-tertiary">Progress</span>
        <span class="font-semibold">{{project.progress}}%</span>
      </div>
      <div class="progress">
        <div class="progress-bar"
             [class.progress-bar-success]="project.progress === 100"
             [style.width.%]="project.progress"></div>
      </div>
    </div>

    <!-- Meta Info -->
    <div class="flex items-center gap-4 text-xs text-tertiary">
      <span>{{project.tasks?.length || 0}} tasks</span>
      <span *ngIf="project.dueDate">Due: {{project.dueDate | date:'MMM d'}}</span>
    </div>
  </div>
</div>
```

### LMS/Learning Page

**Structure:**
```
Container
├── Header (Title + Stats)
├── Tabs (Courses, Resources, Skills)
└── Content Area (Grid of Course Cards)
```

**Course Card:**
```html
<div class="card card-interactive">
  <div class="card-header">
    <h3 class="card-title">{{course.name}}</h3>
    <span class="badge badge-primary">{{course.modules.length}} modules</span>
  </div>

  <div class="card-content">
    <p class="text-sm text-secondary line-clamp-2 mb-4">
      {{course.description}}
    </p>

    <div class="progress mb-4">
      <div class="progress-bar progress-bar-success"
           [style.width.%]="course.progress"></div>
    </div>

    <div class="flex items-center justify-between text-sm">
      <span class="text-tertiary">{{course.progress}}% complete</span>
      <span class="badge badge-neutral">{{course.field}}</span>
    </div>
  </div>

  <div class="card-footer">
    <button class="btn btn-sm btn-primary w-full">Continue Learning</button>
  </div>
</div>
```

### Calendar Page

**Structure:**
```
Container
├── Header (Month Navigator)
├── Calendar Grid
└── Upcoming Events List
```

**Calendar Day Cell:**
```html
<div class="calendar-day" [class.today]="isToday">
  <span class="day-number">{{day.date | date:'d'}}</span>
  <div class="day-events">
    <div *ngFor="let event of day.items"
         class="event-dot"
         [style.background-color]="event.color"></div>
  </div>
</div>
```

### Trends Page

**Structure:**
```
Container
├── Header (Title + Filters)
├── Hot Skills Section (Grid)
├── Latest Releases Section (List)
└── Recommended Learning Patterns
```

**Trend Card:**
```html
<div class="card">
  <div class="card-header">
    <div class="flex items-center gap-2">
      <span class="badge badge-danger">HOT</span>
      <h3 class="card-title m-0">{{trend.title}}</h3>
    </div>
    <button class="btn-icon btn-ghost">
      <svg>★</svg>
    </button>
  </div>

  <div class="card-content">
    <p class="text-sm text-secondary mb-4">{{trend.description}}</p>

    <div class="flex items-center gap-3 flex-wrap">
      <span *ngFor="let skill of trend.relatedSkills"
            class="badge badge-neutral text-xs">
        {{skill}}
      </span>
    </div>
  </div>

  <div class="card-footer">
    <span class="text-xs text-tertiary">{{trend.publishedDate | date:'MMM d, yyyy'}}</span>
    <div class="flex items-center gap-1 ml-auto">
      <div class="progress" style="width: 100px;">
        <div class="progress-bar" [style.width.%]="trend.relevanceScore"></div>
      </div>
      <span class="text-xs font-semibold">{{trend.relevanceScore}}%</span>
    </div>
  </div>
</div>
```

---

## CSS Cleanup Checklist

For each component CSS file, remove:

1. ❌ Custom color definitions (use CSS variables)
2. ❌ Custom spacing values (use utility classes or spacing variables)
3. ❌ Redundant card/button styles (use component classes)
4. ❌ Duplicate responsive breakpoints (use utility responsive classes)
5. ❌ Inline styles in HTML (move to classes)

Keep only:
- ✅ Component-specific layouts
- ✅ Animation keyframes
- ✅ Complex grid layouts
- ✅ Special hover/interaction states

---

## Migration Checklist

### Per Component:

- [ ] Read current HTML/CSS
- [ ] Identify card-like elements → use `.card`
- [ ] Identify buttons → use `.btn` with variants
- [ ] Identify badges/status → use `.badge` with variants
- [ ] Identify forms → use `.form-*` classes
- [ ] Replace custom spacing with utility classes
- [ ] Replace grid layouts with `.grid-auto-fit` or `.grid-cols-*`
- [ ] Update responsive classes to use utility responsive prefixes
- [ ] Test light mode
- [ ] Test dark mode
- [ ] Test mobile responsiveness

---

## Common Replacements

### Colors
```
var(--primary-color) → var(--color-primary-600)
var(--text-primary) → var(--text-primary) ✓ (keep)
var(--card-background) → var(--bg-secondary)
var(--border-color) → var(--border-primary)
```

### Spacing
```
padding: 20px → p-5 or px-5 py-5
margin-bottom: 24px → mb-6
gap: 16px → gap-4
```

### Typography
```
font-size: 18px → text-lg
font-weight: 600 → font-semibold
font-weight: 700 → font-bold
```

### Layout
```
display: flex; align-items: center; gap: 8px;
→
class="flex items-center gap-2"
```

---

## Example: Full Page Refactor

### Before:
```html
<div class="tasks-container">
  <div class="page-header">
    <h1 class="page-title">Tasks</h1>
    <button class="create-btn" (click)="createTask()">New Task</button>
  </div>

  <div class="filters-section">
    <input class="search-input" placeholder="Search tasks...">
    <select class="filter-select">
      <option>All</option>
    </select>
  </div>

  <div class="tasks-grid">
    <div class="task-card" *ngFor="let task of tasks">
      <div class="task-header">
        <span class="task-name">{{task.name}}</span>
        <span class="status-badge" [class]="'status-' + task.status">
          {{task.status}}
        </span>
      </div>
      <p class="task-description">{{task.description}}</p>
    </div>
  </div>
</div>
```

### After:
```html
<div class="container py-8">
  <div class="flex items-center justify-between mb-8">
    <h1 class="text-3xl font-bold">Tasks</h1>
    <button class="btn btn-primary" (click)="createTask()">
      + New Task
    </button>
  </div>

  <div class="flex gap-4 mb-6">
    <input
      type="search"
      class="form-input flex-1"
      placeholder="Search tasks...">
    <select class="form-select w-auto">
      <option>All</option>
    </select>
  </div>

  <div class="grid-auto-fit">
    <div class="card card-interactive" *ngFor="let task of tasks">
      <div class="card-header">
        <h3 class="card-title">{{task.name}}</h3>
        <span class="badge badge-status"
              [ngClass]="'badge-' + task.status.toLowerCase().replace('_', '-')">
          {{task.status}}
        </span>
      </div>
      <div class="card-content">
        <p class="text-sm text-secondary">{{task.description}}</p>
      </div>
    </div>
  </div>
</div>
```

---

## Testing Checklist

After refactoring each component:

### Visual
- [ ] Layout looks correct on desktop (1920px)
- [ ] Layout looks correct on tablet (768px)
- [ ] Layout looks correct on mobile (375px)
- [ ] Light mode colors are correct
- [ ] Dark mode colors are correct
- [ ] Hover states work
- [ ] Active/selected states work

### Functionality
- [ ] All click handlers work
- [ ] All form inputs work
- [ ] Navigation works
- [ ] Data binding works
- [ ] Conditional rendering works

### Accessibility
- [ ] Text contrast meets WCAG AA
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] Screen reader labels present

---

## Quick Reference

### Most Used Classes

**Layout:**
- `container` - Max-width centered container
- `flex items-center justify-between` - Horizontal layout
- `grid-auto-fit` - Responsive grid
- `gap-4`, `gap-6` - Spacing between items

**Cards:**
- `card` - Base card
- `card-interactive` - Clickable card with hover
- `card-header`, `card-content`, `card-footer` - Card sections

**Buttons:**
- `btn btn-primary` - Primary action
- `btn btn-secondary` - Secondary action
- `btn btn-ghost` - Subtle action
- `btn-sm`, `btn-lg` - Size variants

**Badges:**
- `badge badge-status badge-in-progress` - Status
- `badge badge-priority badge-high` - Priority
- `badge badge-success` - Semantic

**Typography:**
- `text-3xl font-bold` - Page title
- `text-lg font-semibold` - Section title
- `text-sm text-secondary` - Body text
- `text-xs text-tertiary` - Meta info

**Spacing:**
- `py-8` - Vertical page padding
- `mb-6` - Section margin bottom
- `gap-4` - Item spacing

---

## Support

Reference the full design system documentation in `DESIGN_SYSTEM.md` for:
- Complete component examples
- Full CSS variable reference
- Color palette
- Spacing scale
- Typography system
