import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private apiUrl = `${environment.API_URL}/dashboard`;

    constructor(private http: HttpClient) { }

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(this.apiUrl);
    }
}
