import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resource } from '../../resources/services/resource.service';

// Interfaz para una reserva
export interface Booking {
    _id: string;
    user: { _id: string; name: string; }; // Poblado desde el backend
    resource: Resource; // Poblado desde el backend
    startTime: string; // Se recibirán como string en formato ISO
    endTime: string;
    status: 'confirmada' | 'cancelada';
    notes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private apiUrl = `${environment.API_URL}/bookings`;

    constructor(private http: HttpClient) { }

    // Para el personal: obtiene todas las reservas
    getAllBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(this.apiUrl);
    }

    // Para usuarios normales: obtiene solo sus propias reservas
    getMyBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/mybookings`);
    }

    // Para crear una nueva reserva
    createBooking(bookingData: any): Observable<Booking> {
        return this.http.post<Booking>(this.apiUrl, bookingData);
    }

    // Obtiene una reserva específica por su ID
    getBookingById(id: string): Observable<Booking> {
        return this.http.get<Booking>(`${this.apiUrl}/${id}`);
    }

    // Cambia el estado de una reserva a 'cancelada'
    cancelBooking(id: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, {});
    }
}
