import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { DashboardService, DashboardStats } from '../components/dashboard/services/dashboard.service';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/models/user.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent implements OnInit, OnDestroy {
    date: Date = new Date();
    user: User | null = null;
    stats: DashboardStats | null = null;
    loading: boolean = false;
    
    // Para mostrar la lista de eventos en el sidebar
    events: any[] = []; 
    todayDateString: string = '';

    private subscription: Subscription = new Subscription();

    constructor(
        public layoutService: LayoutService,
        private dashboardService: DashboardService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.updateDateString(); // Initial date string
        
        this.subscription.add(
            this.authService.currentUser$.subscribe(user => {
                this.user = user;
                if (this.visible) {
                    this.loadData(this.date);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get visible(): boolean {
        return this.layoutService.state.rightMenuActive;
    }

    set visible(_val: boolean) {
        this.layoutService.state.rightMenuActive = _val;
        if (_val) {
            this.loadData(this.date);
        }
    }

    onDateSelect(): void {
        this.updateDateString();
        this.loadData(this.date);
    }

    updateDateString(): void {
        this.todayDateString = this.date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    loadData(date?: Date) {
        this.loading = true;
        this.dashboardService.getStats(date).subscribe({
            next: (data) => {
                this.stats = data;
                this.processEvents(data);
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading sidebar data', err);
                this.loading = false;
            }
        });
    }

    processEvents(data: DashboardStats) {
        this.events = [];
        
        if (this.isAdminOrManager()) {
            // Para Admin: Mostrar 'todayBookingsList' (que ahora trae la fecha seleccionada)
            if (data.todayBookingsList && data.todayBookingsList.length > 0) {
                this.events = data.todayBookingsList.map(booking => ({
                    time: `${new Date(booking.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(booking.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
                    topic: `${booking.user?.name} en ${booking.resource?.name}`,
                    color: '#0BD18A' // Verde para confirmado
                }));
            } else {
                this.events.push({ time: 'N/A', topic: 'No hay más reservas para esta fecha', color: '#FC6161' });
            }
        } else {
            // Para User: Mostrar 'myBookingsOnDate' (nuevo campo del backend)
            // o 'myNextBooking' si no hay nada específico y la fecha es hoy/futuro
            if (data.myBookingsOnDate && data.myBookingsOnDate.length > 0) {
                 this.events = data.myBookingsOnDate.map(booking => ({
                    time: `${new Date(booking.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(booking.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
                    topic: `Reserva en ${booking.resource?.name}`,
                    color: '#0F8BFD'
                }));
            } else {
                // Si no hay reservas en la fecha seleccionada
                this.events.push({ time: '', topic: 'No tienes reservas para esta fecha', color: '#64748B' });
                
                // Opcional: Mostrar la próxima reserva real si estamos viendo hoy y está vacía
                /* if (data.myNextBooking) { ... } */
            }
        }
    }

    isAdminOrManager(): boolean {
        return this.user ? ['admin', 'manager'].includes(this.user.role) : false;
    }
}
