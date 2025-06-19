// src/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/app/environments/environment';
import { AuthResponse, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private API_URL = `${environment.API_URL}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp > currentTime) {
                    const user: User = {
                        id: decodedToken.sub,
                        name: decodedToken.name,
                        email: decodedToken.email,
                        role: decodedToken.role
                    };
                    this.currentUserSubject.next(user);
                } else {
                    this.logout();
                }
            } catch (e) {
                this.logout();
            }
        }
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password }).pipe(
            tap(response => {
                const decodedToken: any = jwtDecode(response.token);
                const user: User = {
                    id: decodedToken.sub,
                    name: decodedToken.name,
                    email: decodedToken.email,
                    role: decodedToken.role
                };
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(user);
            }),
            catchError(this.handleError)
        );
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    private handleError(error: any) {
        const backendErrorMessage = error.error?.message || 'Error desconocido. Intente de nuevo.';
        return throwError(() => new Error(backendErrorMessage));
    }
}
