// src/services/auth_service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { UtilityService } from './utility_service';

interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  access_token?: string;
  refresh_token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private tokenExpiryTimer: any;

  constructor(private http: HttpClient) {
    // Load user from local storage on initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    const token = localStorage.getItem('access_token');

    if (userData && token) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
      this.scheduleTokenRefresh();
    }
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!localStorage.getItem('access_token');
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username,
      email,
      password
    }).pipe(
      catchError(error => UtilityService.handleError(error, 'Registration failed') as Observable<AuthResponse>)
    );
  }

  login(usernameOrEmail: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      username_or_email: usernameOrEmail,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.user && response.access_token) {
          // Store user details and tokens in local storage
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('access_token', response.access_token);

          if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
          }

          this.currentUserSubject.next(response.user);
          this.scheduleTokenRefresh();
        }
      }),
      catchError(error => UtilityService.handleError(error, 'Login failed') as Observable<AuthResponse>)
    );
  }

  logout(): void {
    // Remove user from local storage and reset current user
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);

    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      // Create a properly typed observable
      return of({
        success: false,
        message: 'No refresh token available'
      } as AuthResponse).pipe(delay(300));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {
      refresh_token: refreshToken
    }).pipe(
      tap(response => {
        if (response.success && response.access_token) {
          localStorage.setItem('access_token', response.access_token);

          if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
          }

          this.scheduleTokenRefresh();
        }
      }),
      catchError(error => {
        // If refresh fails, log the user out
        this.logout();
        return UtilityService.handleError(error, 'Token refresh failed') as Observable<AuthResponse>;
      })
    );
  }

  private scheduleTokenRefresh(): void {
    // Calculate time to refresh (e.g., 55 minutes if token expires in 60)
    const refreshTime = 55 * 60 * 1000; // 55 minutes in milliseconds

    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }

    this.tokenExpiryTimer = setTimeout(() => {
      this.refreshToken().subscribe();
    }, refreshTime);
  }

  /**
   * Get current user's profile
   */
  getUserProfile(): Observable<{user: User}> {
    return this.http.get<{user: User}>(`${this.apiUrl}/profile`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch user profile') as Observable<{user: User}>));
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Observable<{success: boolean, user: User}> {
    return this.http.put<{success: boolean, user: User}>(`${this.apiUrl}/profile`, updates)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            // Update stored user data
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => UtilityService.handleError(error, 'Failed to update profile') as Observable<{success: boolean, user: User}>)
      );
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword
    }).pipe(catchError(error => UtilityService.handleError(error, 'Failed to change password') as Observable<{success: boolean, message: string}>));
  }
}

/**
 * Mock Auth Service for testing
 */
@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  // Mock user for testing
  private mockUser: User = {
    id: 'mock-user-1',
    username: 'testuser',
    email: 'test@example.com',
    is_admin: false
  };

  constructor() {}

  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return of({
      success: true,
      message: 'Registration successful'
    } as AuthResponse).pipe(delay(300));
  }

  login(usernameOrEmail: string, password: string): Observable<AuthResponse> {
    // Simulate successful login
    this.currentUserSubject.next(this.mockUser);

    return of({
      success: true,
      user: this.mockUser,
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    } as AuthResponse).pipe(delay(300));
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<AuthResponse> {
    return of({
      success: true,
      access_token: 'new-mock-access-token',
      refresh_token: 'new-mock-refresh-token'
    } as AuthResponse).pipe(delay(300));
  }

  getUserProfile(): Observable<{user: User}> {
    return of({
      user: this.mockUser
    }).pipe(delay(300));
  }

  updateProfile(updates: Partial<User>): Observable<{success: boolean, user: User}> {
    const updatedUser = {
      ...this.mockUser,
      ...updates
    };
    this.currentUserSubject.next(updatedUser);

    return of({
      success: true,
      user: updatedUser
    }).pipe(delay(300));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{success: boolean, message: string}> {
    return of({
      success: true,
      message: 'Password changed successfully'
    }).pipe(delay(300));
  }
}

/**
 * Auth Service Factory - returns appropriate service based on environment
 */
@Injectable({
  providedIn: 'root'
})
export class AuthServiceFactory {
  static getService(http?: HttpClient): AuthService | MockAuthService {
    if (environment.production && http) {
      return new AuthService(http);
    } else {
      return new MockAuthService();
    }
  }
}
