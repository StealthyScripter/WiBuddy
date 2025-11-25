import { Observable } from 'rxjs';
import { UtilityService } from './utility_service';

/**
 * Base service class with common CRUD operations
 * Can be used with both mock data and HTTP services
 */
export abstract class BaseService<T> {
  protected abstract apiUrl: string;

  /**
   * Get all items
   * @returns Promise or Observable with all items
   */
  abstract getAll(): Promise<T[]> | Observable<any>;

  /**
   * Get item by ID
   * @param id Item ID
   * @returns Promise or Observable with the item
   */
  abstract getById(id: string): Promise<T | undefined> | Observable<any>;

  /**
   * Create a new item
   * @param item Item data without ID
   * @returns Promise or Observable with the created item
   */
  abstract create(item: Partial<T>): Promise<T> | Observable<any>;

  /**
   * Update an existing item
   * @param id Item ID
   * @param updates Partial item data
   * @returns Promise or Observable with the updated item
   */
  abstract update(id: string, updates: Partial<T>): Promise<T | undefined> | Observable<any>;

  /**
   * Delete an item
   * @param id Item ID
   * @returns Promise or Observable with success status
   */
  abstract delete(id: string): Promise<boolean> | Observable<any>;
}

/**
 * Base mock service using in-memory data
 */
export class BaseMockService<T extends { id: string | number }> extends BaseService<T> {
  protected apiUrl: string = '';
  protected data: T[];

  constructor(mockData: T[]) {
    super();
    this.data = [...mockData];
  }

  async getAll(): Promise<T[]> {
    await UtilityService.simulateDelay();
    return [...this.data];
  }

  async getById(id: string): Promise<T | undefined> {
    await UtilityService.simulateDelay();
    return this.data.find(item => String(item.id) === id);
  }

  async create(item: Partial<T>): Promise<T> {
    await UtilityService.simulateDelay();
    const newItem = {
      ...item,
      id: item.id || UtilityService.generateId(),
    } as T;

    this.data.push(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    await UtilityService.simulateDelay();
    const index = this.data.findIndex(item => String(item.id) === id);

    if (index === -1) return undefined;

    const updatedItem = {
      ...this.data[index],
      ...updates,
    } as T;

    this.data[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    await UtilityService.simulateDelay();
    const index = this.data.findIndex(item => String(item.id) === id);

    if (index === -1) return false;

    this.data.splice(index, 1);
    return true;
  }
}

/**
 * Base HTTP service using API endpoints
 */
export class BaseHttpService<T, ResponseType = any> extends BaseService<T> {
  constructor(protected apiUrl: string, protected http: any) {
    super();
  }

  getAll(): Observable<ResponseType> {
    return this.http.get(this.apiUrl);
  }

  getById(id: string): Observable<ResponseType> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(item: Partial<T>): Observable<ResponseType> {
    return this.http.post(this.apiUrl, item);
  }

  update(id: string, updates: Partial<T>): Observable<ResponseType> {
    return this.http.put(`${this.apiUrl}/${id}`, updates);
  }

  delete(id: string): Observable<ResponseType> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
