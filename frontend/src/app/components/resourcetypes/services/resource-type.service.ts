import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResourceType {
    _id: string;
    name: string;
    description?: string;
}

@Injectable({ providedIn: 'root' })
export class ResourceTypeService {
    private apiUrl = `${environment.API_URL}/resourcetypes`;

    constructor(private http: HttpClient) { }

    getResourceTypes(): Observable<ResourceType[]> { return this.http.get<ResourceType[]>(this.apiUrl); }
    createResourceType(data: Omit<ResourceType, '_id'>): Observable<ResourceType> { return this.http.post<ResourceType>(this.apiUrl, data); }
    updateResourceType(id: string, data: Partial<ResourceType>): Observable<ResourceType> { return this.http.put<ResourceType>(`<span class="math-inline">\{this\.apiUrl\}/</span>{id}`, data); }
    deleteResourceType(id: string): Observable<any> { return this.http.delete<any>(`<span class="math-inline">\{this\.apiUrl\}/</span>{id}`); }
}
