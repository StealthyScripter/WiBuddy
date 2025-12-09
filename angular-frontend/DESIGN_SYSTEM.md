# WiBuddy Design System

## Overview

A modern, minimalist design system ensuring proper contrast ratios (WCAG AA compliant) for both light and dark modes.

## Architecture

```
styles/
├── design-system.css  # CSS variables, color palette, spacing
├── base.css          # Resets, typography, base element styles
├── components.css    # Reusable component styles
└── utilities.css     # Utility classes for quick styling
```

## Color Palette

### Primary Colors (Indigo)
- `--color-primary-500`: #6366f1 (Primary brand color)
- `--color-primary-600`: #4f46e5 (Primary interactive elements)
- Range: 50-900 for all variations

### Semantic Colors
- **Success** (Green): `--color-success-*` (#22c55e base)
- **Warning** (Amber): `--color-warning-*` (#f59e0b base)
- **Danger** (Red): `--color-danger-*` (#ef4444 base)
- **Info** (Blue): `--color-info-*` (#3b82f6 base)

### Neutral Colors (Slate)
- Light mode background: `--color-neutral-50` (#f8fafc)
- Dark mode background: `--color-neutral-900` (#0f172a)
- Text hierarchy: `--text-primary`, `--text-secondary`, `--text-tertiary`

## Typography

### Font Family
- Primary: `Inter` (fallback: system fonts)
- Monospace: `JetBrains Mono`

### Font Sizes
```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px */
--font-size-lg: 1.125rem   /* 18px */
--font-size-xl: 1.25rem    /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.875rem  /* 30px */
--font-size-4xl: 2.25rem   /* 36px */
```

### Font Weights
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing Scale

Consistent spacing using a scale:
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
```

## Components

### Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
    <p class="card-description">Description</p>
  </div>
  <div class="card-content">
    Content goes here
  </div>
  <div class="card-footer">
    Footer content
  </div>
</div>
```

Modifiers:
- `.card-compact` - Reduced padding
- `.card-interactive` - Hover effects with transform

### Button
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-danger">Danger</button>
```

Sizes:
- `.btn-sm` - Small button
- `.btn` - Default size
- `.btn-lg` - Large button
- `.btn-icon` - Square icon button

### Badge
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
```

Status badges:
```html
<span class="badge badge-status badge-not-started">Not Started</span>
<span class="badge badge-status badge-in-progress">In Progress</span>
<span class="badge badge-status badge-completed">Completed</span>
<span class="badge badge-status badge-overdue">Overdue</span>
```

Priority badges:
```html
<span class="badge badge-priority badge-low">Low</span>
<span class="badge badge-priority badge-medium">Medium</span>
<span class="badge badge-priority badge-high">High</span>
<span class="badge badge-priority badge-critical">Critical</span>
```

### Form Elements
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input type="text" class="form-input" placeholder="Enter text">
  <small class="form-help">Help text</small>
</div>
```

### Progress Bar
```html
<div class="progress">
  <div class="progress-bar" style="width: 75%"></div>
</div>
```

### Avatar
```html
<div class="avatar avatar-md">
  <img src="avatar.jpg" alt="User">
</div>
```

Sizes: `.avatar-sm`, `.avatar-md`, `.avatar-lg`, `.avatar-xl`

### Empty State
```html
<div class="empty-state">
  <div class="empty-state-icon">📭</div>
  <h3 class="empty-state-title">No items found</h3>
  <p class="empty-state-description">Get started by creating your first item</p>
  <button class="btn btn-primary">Create Item</button>
</div>
```

### Loading Spinner
```html
<div class="spinner"></div>
<div class="spinner spinner-lg"></div>
```

### Alert
```html
<div class="alert alert-success">
  Success message
</div>
<div class="alert alert-warning">
  Warning message
</div>
<div class="alert alert-danger">
  Error message
</div>
<div class="alert alert-info">
  Info message
</div>
```

## Utility Classes

### Layout
```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  ...
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-6">
  ...
</div>

<!-- Auto-fit grid -->
<div class="grid-auto-fit">
  ...
</div>
```

### Spacing
```html
<!-- Margin -->
<div class="mt-4 mb-6">...</div>
<div class="mx-auto">Centered</div>

<!-- Padding -->
<div class="p-6">...</div>
<div class="px-4 py-2">...</div>
```

### Typography
```html
<h1 class="text-3xl font-bold text-primary">Heading</h1>
<p class="text-sm text-secondary">Small text</p>
<p class="truncate">Long text that will be truncated...</p>
<p class="line-clamp-2">Text limited to 2 lines</p>
```

### Colors
```html
<div class="text-primary">Primary text</div>
<div class="text-success">Success text</div>
<div class="bg-secondary">Secondary background</div>
```

### Borders & Shadows
```html
<div class="border rounded-lg shadow-md">...</div>
<div class="rounded-full">...</div>
```

### Responsive Design
```html
<!-- Hidden on mobile -->
<div class="md:hidden">...</div>

<!-- Flex column on mobile, row on desktop -->
<div class="flex md:flex-col">...</div>

<!-- Grid responsive columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">...</div>
```

## Dark Mode

Dark mode is automatically handled through CSS variables. The theme is controlled by the `data-theme="dark"` attribute on the root element or `.dark` class.

### Theme Toggle
```typescript
// In Angular component
export class ThemeToggleComponent {
  toggleTheme() {
    document.documentElement.setAttribute('data-theme',
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
  }
}
```

## Contrast Ratios

All color combinations meet WCAG AA standards:
- **Large text** (18px+): minimum 3:1
- **Normal text**: minimum 4.5:1
- **UI components**: minimum 3:1

### Light Mode Contrast
- Primary text on white: 16:1
- Secondary text on white: 7:1
- Primary button text on primary bg: 8:1

### Dark Mode Contrast
- Primary text on dark bg: 15:1
- Secondary text on dark bg: 6:1
- Interactive elements: Enhanced visibility with higher opacity

## Best Practices

### Do's ✅
- Use semantic color variables (`--text-primary`, `--bg-secondary`)
- Use spacing scale variables (`--space-4`, `--space-6`)
- Use utility classes for simple styling
- Use component classes for complex, reusable patterns
- Test both light and dark modes
- Use appropriate heading hierarchy (h1 → h6)

### Don'ts ❌
- Don't use hardcoded colors (use CSS variables)
- Don't use inline styles when utility classes exist
- Don't create custom margin/padding values (use spacing scale)
- Don't skip heading levels in HTML
- Don't use colors that don't meet contrast requirements

## Migration Guide

### From Old System to New

1. **Colors**: Replace old color variables
   ```css
   /* Old */
   color: var(--primary-color);

   /* New */
   color: var(--color-primary-600);
   ```

2. **Spacing**: Use spacing scale
   ```css
   /* Old */
   margin: 16px;

   /* New */
   margin: var(--space-4);
   /* Or use utility */
   class="m-4"
   ```

3. **Components**: Use component classes
   ```html
   <!-- Old -->
   <div class="custom-card">...</div>

   <!-- New -->
   <div class="card">...</div>
   ```

4. **Typography**: Use utility classes
   ```html
   <!-- Old -->
   <h2 style="font-size: 24px; font-weight: 600;">Title</h2>

   <!-- New -->
   <h2 class="text-2xl font-semibold">Title</h2>
   ```

## Examples

### Task Card
```html
<div class="card card-interactive">
  <div class="card-header">
    <h3 class="card-title truncate">Task Title</h3>
    <span class="badge badge-status badge-in-progress">In Progress</span>
  </div>
  <div class="card-content">
    <p class="text-sm text-secondary line-clamp-2">
      Task description goes here...
    </p>
    <div class="flex items-center gap-2 mt-4">
      <span class="badge badge-priority badge-high">High</span>
      <span class="text-xs text-tertiary">Due: Jan 15, 2025</span>
    </div>
  </div>
  <div class="card-footer">
    <div class="avatar avatar-sm">
      <img src="user.jpg" alt="Assigned to">
    </div>
    <button class="btn btn-sm btn-primary ml-auto">View Details</button>
  </div>
</div>
```

### Form Layout
```html
<form class="max-w-md mx-auto">
  <div class="form-group">
    <label class="form-label">Task Name</label>
    <input type="text" class="form-input" placeholder="Enter task name">
  </div>

  <div class="form-group">
    <label class="form-label">Description</label>
    <textarea class="form-textarea" placeholder="Enter description"></textarea>
  </div>

  <div class="form-group">
    <label class="form-label">Priority</label>
    <select class="form-select">
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
      <option>Critical</option>
    </select>
  </div>

  <div class="flex gap-3 justify-end">
    <button type="button" class="btn btn-secondary">Cancel</button>
    <button type="submit" class="btn btn-primary">Create Task</button>
  </div>
</form>
```

### Grid Layout
```html
<div class="container py-8">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold">Tasks</h1>
    <button class="btn btn-primary">+ New Task</button>
  </div>

  <div class="grid-auto-fit">
    <!-- Task cards go here -->
  </div>
</div>
```

## Resources

- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Inter Font**: https://fonts.google.com/specimen/Inter
