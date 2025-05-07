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
  date_joined: string;
}

interface AuthResponse {
  success?: boolean;
  user?: User;
  access_token?: string;
  refresh_token?: string;
  message?: string;
  token: string;
  user_id: string;
  username: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  is_admin?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private tokenExpiryTimer: any;

  constructor(private http: HttpClient) {
    // Load user from local storage on initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        // Parse JWT token to get user data (simplified - in real app we'd validate token)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        if (payload.user_id) {
          this.currentUserSubject.next({
            id: payload.user_id,
            username: payload.username,
            email: payload.email || '',
            is_admin: payload.is_admin || false,
            date_joined: payload.date_joined || ''
          });
        }
      } catch (e) {
        console.error('Error parsing auth token', e);
        this.logout();
      }
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
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);

    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }
  }

  /**
   * Get the current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }


  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.is_admin : false;
  }

  /**
   * Get current user details
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
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
 * Mock Auth Service for development use
 */
@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      is_admin: true,
      date_joined: new Date().toISOString()
    },
    {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      is_admin: false,
      date_joined: new Date().toISOString()
    }
  ];

  constructor() {
    // Simulate already logged-in user for development
    this.currentUserSubject.next(this.mockUsers[1]);
  }

  /**
   * Register a new mock user
   */
  async register(userData: RegisterRequest): Promise<User> {
    await UtilityService.simulateDelay();

    // Check if username already exists
    if (this.mockUsers.some(u => u.username === userData.username)) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      id: UtilityService.generateId(),
      username: userData.username,
      email: userData.email,
      is_admin: userData.is_admin || false,
      date_joined: new Date().toISOString()
    };

    this.mockUsers.push(newUser);
    return newUser;
  }

  /**
   * Login mock user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await UtilityService.simulateDelay();

    const user = this.mockUsers.find(u =>
      u.username === credentials.username && credentials.password === 'password'
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    this.currentUserSubject.next(user);

    return {
      token: 'mock-jwt-token',
      user_id: user.id,
      username: user.username
    };
  }

  /**
   * Logout mock user
   */
  logout(): void {
    this.currentUserSubject.next(null);
  }

  /**
   * Get the current auth token
   */
  getToken(): string | null {
    return this.currentUserSubject.value ? 'mock-jwt-token' : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.is_admin : false;
  }

  /**
   * Get current user details
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
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
