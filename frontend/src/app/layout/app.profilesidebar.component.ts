import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { DashboardService, DashboardStats } from '../demo/components/dashboards/service/dashboard.service';
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
        this.todayDateString = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        this.subscription.add(
            this.authService.currentUser$.subscribe(user => {
                this.user = user;
                if (this.visible) {
                    this.loadData();
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
            this.loadData();
        }
    }

    loadData() {
        this.loading = true;
        this.dashboardService.getStats().subscribe({
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
            // Para Admin: Mostrar 'todayBookingsList'
            if (data.todayBookingsList && data.todayBookingsList.length > 0) {
                this.events = data.todayBookingsList.map(booking => ({
                    time: `${new Date(booking.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(booking.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
                    topic: `${booking.user?.name} en ${booking.resource?.name}`,
                    color: '#0BD18A' // Verde para confirmado
                }));
            } else {
                this.events.push({ time: 'N/A', topic: 'No hay más reservas hoy', color: '#FC6161' });
            }
        } else {
            // Para User: Mostrar 'myNextBooking' si es hoy, o un mensaje
            if (data.myNextBooking) {
                const bookingDate = new Date(data.myNextBooking.startDate);
                const today = new Date();
                
                // Si la próxima reserva es HOY
                if (bookingDate.toDateString() === today.toDateString()) {
                    this.events.push({
                        time: `${new Date(data.myNextBooking.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
                        topic: `Reserva en ${data.myNextBooking.resource?.name}`,
                        color: '#0F8BFD' // Azul para el usuario
                    });
                } else {
                     this.events.push({ time: 'Hoy', topic: 'Sin reservas para hoy', color: '#64748B' });
                     // Podríamos mostrar la próxima fecha
                     this.events.push({ 
                         time: 'Próxima:', 
                         topic: `${bookingDate.toLocaleDateString()} en ${data.myNextBooking.resource?.name}`,
                         color: '#0F8BFD'
                     });
                }
            } else {
                this.events.push({ time: '', topic: 'No tienes reservas futuras', color: '#64748B' });
            }
        }
    }

    isAdminOrManager(): boolean {
        return this.user ? ['admin', 'manager'].includes(this.user.role) : false;
    }
}
