import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from 'src/app/auth/models/user.model'; // Reutilizamos la interfaz User

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private adminApiUrl = `${environment.API_URL}/admin/users`;

    constructor(private http: HttpClient) { }

    // Obtiene todos los usuarios (para el admin)
    getUsers(type?: 'customer' | 'staff'): Observable<User[]> {
        let url = this.adminApiUrl;
        if (type) {
            url += `?type=${type}`;
        }
        return this.http.get<User[]>(url);
    }

    // Crea un nuevo usuario
    createUser(userData: Partial<User>): Observable<User> {
        return this.http.post<User>(this.adminApiUrl, userData);
    }

    // Actualiza un usuario por su ID (para el admin)
    updateUser(id: string, userData: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.adminApiUrl}/${id}`, userData);
    }

    // Desactiva (soft delete) un usuario por su ID
    deactivateUser(id: string): Observable<any> {
        return this.http.delete<any>(`${this.adminApiUrl}/${id}`);
    }
}
