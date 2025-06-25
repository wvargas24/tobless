import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaz que define la estructura de un Recurso
export interface Resource {
    _id: string;
    name: string;
    type: 'sala_reuniones' | 'oficina_privada' | 'escritorio_flexible' | 'cabina_telefonica';
    capacity: number;
    description?: string;
    amenities?: string[];
    isActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ResourceService {

    private apiUrl = `${environment.API_URL}/resources`;

    constructor(private http: HttpClient) { }

    getResources(): Observable<Resource[]> {
        return this.http.get<Resource[]>(this.apiUrl);
    }

    createResource(resource: Omit<Resource, '_id'>): Observable<Resource> {
        return this.http.post<Resource>(this.apiUrl, resource);
    }

    updateResource(id: string, resource: Partial<Resource>): Observable<Resource> {
        return this.http.put<Resource>(`${this.apiUrl}/${id}`, resource);
    }

    deleteResource(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
