import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
    // Admin Stats
    totalUsers?: number;
    activeBookings?: number;
    todayBookingsCount?: number;
    todayBookingsList?: any[]; // Can be refined with Booking interface
    occupiedResourcesCount?: number;

    // User Stats
    membershipStatus?: {
        status: string;
        endDate: string;
        planName: string;
    };
    myNextBooking?: any;
    myActiveBookingsCount?: number;
    myBookingsOnDate?: any[]; // New: bookings for the selected date
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private apiUrl = `${environment.API_URL}/dashboard`;

    constructor(private http: HttpClient) { }

    getStats(date?: Date): Observable<DashboardStats> {
        let url = this.apiUrl;
        if (date) {
            // Convert date to ISO string YYYY-MM-DD or full ISO
            const dateString = date.toISOString();
            url += `?date=${dateString}`;
        }
        return this.http.get<DashboardStats>(url);
    }
}

