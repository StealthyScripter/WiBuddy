import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

export class UtilityService {
  /**
   * Simulate API delay for mock services
   * @param ms Delay in milliseconds
   * @returns Promise that resolves after specified delay
   */
  static async simulateDelay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a random ID for new entities
   * @returns Random string ID
   */
  static generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  /**
   * Format date to localized string
   * @param dateString ISO date string
   * @param options Date formatting options
   * @returns Formatted date string
   */
  static formatDate(dateString: string | undefined, options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  /**
   * Handle HTTP errors in a consistent way
   * @param error The error object
   * @param errorMessage Custom error message
   * @returns Observable with error response
   */
  static handleError<T>(error: any, errorMessage: string = 'Operation failed'): Observable<T> {
    console.error('Service error:', error);
    return of({ success: false, message: errorMessage } as unknown as T);
  }

  /**
   * Create a simulated observable delay for mock services
   * @param data The data to return
   * @param delayTime Delay time in milliseconds
   * @returns Observable that emits after delay
   */
  static createDelayedObservable<T>(data: T, delayTime: number = 300): Observable<T> {
    return of(data).pipe(delay(delayTime));
  }

  /**
   * Filter an array of objects by a search query against multiple fields
   * @param items Array of items to filter
   * @param query Search query string
   * @param fields Fields to search in
   * @returns Filtered array
   */
  static filterBySearchQuery<T>(items: T[], query: string, fields: (keyof T)[]): T[] {
    if (!query.trim()) return items;

    const lowerCaseQuery = query.toLowerCase();

    return items.filter(item => {
      return fields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerCaseQuery);
        }
        return false;
      });
    });
  }
}
