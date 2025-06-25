import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// 1. Definimos la 'forma' de una membresía para que TypeScript nos ayude
export interface Membership {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // Duración en días
}
export interface OnboardingData {
    name: string;
    email: string;
    password: string;
    membershipId: string;
}
@Injectable({
    providedIn: 'root' // Lo hacemos un singleton disponible en toda la app
})
export class MembershipService {

    private membershipsApiUrl = `${environment.API_URL}/memberships`;
    private staffApiUrl = `${environment.API_URL}/staff`;

    constructor(private http: HttpClient) { }
    /**
     * Obtiene la lista de membresías desde el backend.
     * @returns Un Observable que emite un array de Memberships.
     */
    getMemberships(): Observable<Membership[]> {
        return this.http.get<Membership[]>(this.membershipsApiUrl);
    }

    /**
     * Crea una nueva membresía.
     * Este método envía una solicitud POST al backend para crear una nueva membresía.
     * @param membership
     * @returns
     */
    createMembership(membership: Omit<Membership, '_id'>): Observable<Membership> {
        return this.http.post<Membership>(this.membershipsApiUrl, membership);
    }
    /**
     * Actualiza una membresía existente.
     * @param id El ID de la membresía a actualizar.
     * @param membership Los datos actualizados de la membresía.
     * @returns Un Observable que emite la membresía actualizada.
     */
    updateMembership(id: string, membership: Partial<Membership>): Observable<Membership> {
        return this.http.put<Membership>(`${this.membershipsApiUrl}/${id}`, membership);
    }

    /**
     * Elimina una membresía por su ID.
     * @param id El ID de la membresía a eliminar.
     * @returns Un Observable que emite la respuesta del servidor.
     */
    deleteMembership(id: string): Observable<any> {
        return this.http.delete<any>(`${this.membershipsApiUrl}/${id}`);
    }

    /**
     * Registra un nuevo usuario con una membresía.
     * @param data Datos del usuario y la membresía.
     * @returns Un Observable que emite la respuesta del servidor.
     */
    onboardUser(data: OnboardingData): Observable<any> {
        return this.http.post<any>(`${this.staffApiUrl}/onboard-user`, data);
    }

    // Aquí añadiremos más métodos en el futuro (ej. getMembershipById, updateMembership, etc.)
}
