import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Booking, BookingService } from 'src/app/components/bookings/services/booking.service';
import { DashboardService, DashboardStats } from './services/dashboard.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    stats: DashboardStats | null = null;
    currentUser: User | null = null;
    loading: boolean = true;

    allBookings: Booking[] = [];
    displayBookings: Booking[] = [];
    bookedDates = new Set<string>();
    selectedDate: Date | null = null;

    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService,
        private bookingService: BookingService
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.currentUserValue;
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.loading = true;
        const isPrivilegedUser = this.isAdminOrManager();

        const bookingsObservable = isPrivilegedUser
            ? this.bookingService.getBookings()
            : this.bookingService.getMyBookings();

        forkJoin({
            stats: this.dashboardService.getStats(),
            bookings: bookingsObservable
        }).subscribe({
            next: ({ stats, bookings }) => {
                this.stats = stats;

                // Tipamos correctamente el array de bookings
                this.allBookings = bookings as Booking[];
                this.displayBookings = bookings as Booking[];

                this.processBookedDates();

                // La API ya devuelve `todayBookingsList` en el objeto de stats
                // por lo que no necesitamos calcularlo aquí.

                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching dashboard data', err);
                this.loading = false;
            }
        });
    }

    processBookedDates(): void {
        this.bookedDates.clear();
        for (const booking of this.allBookings) {
            const date = new Date(booking.startDate);
            const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            this.bookedDates.add(dateString);
        }
    }

    isBooked(date: { day: number, month: number, year: number }): boolean {
        const dateString = `${date.year}-${date.month}-${date.day}`;
        return this.bookedDates.has(dateString);
    }

    onDateSelect(event: Date): void {
        const selected = new Date(event);
        this.selectedDate = selected;

        selected.setHours(0, 0, 0, 0);

        this.displayBookings = this.allBookings.filter(b => {
            const bookingDate = new Date(b.startDate);
            bookingDate.setHours(0, 0, 0, 0);
            return bookingDate.getTime() === selected.getTime();
        });
    }

    clearFilter(): void {
        this.displayBookings = this.allBookings;
        this.selectedDate = null;
    }

    isAdminOrManager(): boolean {
        return this.currentUser ? ['admin', 'manager'].includes(this.currentUser.role) : false;
    }

    // Helper para el template, para acceder al target de un evento
    getEventTargetValue(event: Event): string {
        return (event.target as HTMLInputElement).value;
    }

    // Métodos para estadísticas de usuarios regulares
    getUpcomingBookingsCount(): number {
        const now = new Date();
        return this.allBookings.filter(b => {
            const bookingDate = new Date(b.startDate);
            return bookingDate > now && b.status !== 'cancelled';
        }).length;
    }

    getThisMonthBookingsCount(): number {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return this.allBookings.filter(b => {
            const bookingDate = new Date(b.startDate);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear &&
                   b.status !== 'cancelled';
        }).length;
    }

    getMembershipStatus(): string {
        if (this.stats?.membershipStatus) {
            const status = this.stats.membershipStatus.status;
            return status === 'active' ? 'Activa' : 
                   status === 'expired' ? 'Expirada' : 
                   status === 'pending' ? 'Pendiente' : 'Inactiva';
        }
        return 'Sin membresía';
    }
}

