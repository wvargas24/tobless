import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaz para una reserva
export interface Booking {
    _id: string;
    user: { _id: string; name: string; }; // Poblado desde el backend
    resource: { _id: string; name: string; }; // Poblado desde el backend
    startTime: string; // Se recibirán como string en formato ISO
    endTime: string;
    status: 'confirmada' | 'cancelada';
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
}
