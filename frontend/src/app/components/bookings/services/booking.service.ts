import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resource } from '../../resources/services/resource.service';

// Interfaz actualizada para coincidir con el Backend
export interface Booking {
    _id: string;
    user: { _id: string; name: string; email: string };
    resource: Resource;
    startDate: string; // ISO 8601
    endDate: string;   // ISO 8601
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    membership?: { _id: string; name: string; };
}

export interface AvailabilitySlot {
    startTime: string;
    endTime: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private apiUrl = `${environment.API_URL}/bookings`;

    constructor(private http: HttpClient) { }

    // Obtiene reservas (filtra por usuario automáticamente en backend si no es admin)
    getBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(this.apiUrl);
    }

    // Mantenemos este método por compatibilidad, pero llama al mismo endpoint
    getMyBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(this.apiUrl);
    }

    createBooking(bookingData: any): Observable<Booking> {
        return this.http.post<Booking>(this.apiUrl, bookingData);
    }

    getBookingById(id: string): Observable<Booking> {
        return this.http.get<Booking>(`${this.apiUrl}/${id}`);
    }

    updateBooking(id: string, data: Partial<Booking>): Observable<Booking> {
        return this.http.put<Booking>(`${this.apiUrl}/${id}`, data);
    }

    cancelBooking(id: string): Observable<Booking> {
        return this.http.put<Booking>(`${this.apiUrl}/${id}`, { status: 'cancelled' });
    }

    deleteBooking(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    // Obtiene las reservas para un único recurso para verificar disponibilidad.
    // Mapea el resultado de Booking[] a AvailabilitySlot[] para el calendario del frontend.
    getBookingsForResource(resourceId: string): Observable<AvailabilitySlot[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}?resource=${resourceId}`).pipe(
            map(bookings => bookings
                // Filtramos las canceladas para que no bloqueen el calendario
                .filter(b => b.status !== 'cancelled') 
                .map(b => ({
                    startTime: b.startDate,
                    endTime: b.endDate
                }))
            )
        );
    }
}
