import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // Importar tipos de FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Booking, BookingService } from '../../services/booking.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Resource, ResourceService } from 'src/app/components/resources/services/resource.service';
import { User } from 'src/app/auth/models/user.model';
import { Router } from '@angular/router'; // Importar Router

@Component({
    selector: 'app-booking-calendar',
    templateUrl: './booking-calendar.component.html',
    providers: [MessageService, ConfirmationService]
})
export class BookingCalendarComponent implements OnInit {

    calendarOptions!: CalendarOptions;
    events: EventInput[] = [];

    // bookingDialog: boolean = false; // Ya no usamos el diálogo simple para crear
    resources: Resource[] = [];
    // newBooking: { resource?: string, startDate?: Date, endDate?: Date } = {};

    viewBookingDialog: boolean = false;
    selectedBooking: Booking | null = null;
    currentUser: User | null = null;

    constructor(
        private bookingService: BookingService,
        private authService: AuthService,
        private messageService: MessageService,
        private resourceService: ResourceService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
        private router: Router // Inyectar Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.currentUserValue;
        this.initCalendar();
        this.loadBookings();
        this.loadResources();
    }

    initCalendar(): void {
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true,
            selectable: true,
            select: this.handleDateSelect.bind(this),
            eventClick: this.handleEventClick.bind(this),
            events: this.events,
            slotMinTime: '09:00:00',
            slotMaxTime: '18:00:00',
            allDaySlot: false,
            businessHours: {
                daysOfWeek: [ 1, 2, 3, 4, 5 ],
                startTime: '09:00',
                endTime: '18:00',
            },
            eventConstraint: 'businessHours', 
            selectConstraint: 'businessHours'
        };
    }

    loadBookings(): void {
        this.bookingService.getBookings().subscribe(bookings => {
            this.events = bookings
                .filter(b => b.status !== 'cancelled')
                .map((booking: Booking) => ({
                id: booking._id,
                title: `${booking.resource.name} - ${booking.user.name}`,
                start: booking.startDate,
                end: booking.endDate,
                backgroundColor: this.getColorForStatus(booking.status) === 'success' ? '#22c55e' : '#ef4444',
                borderColor: this.getColorForStatus(booking.status) === 'success' ? '#22c55e' : '#ef4444',
                extendedProps: {
                    booking: booking
                }
            }));
            this.calendarOptions = { ...this.calendarOptions, events: this.events };
        });
    }

    loadResources(): void {
        this.resourceService.getBookableResources().subscribe(data => {
            this.resources = data;
        });
    }

    handleDateSelect(selectInfo: any): void {
        // Al seleccionar una fecha en el calendario, redirigimos al Wizard
        // Podríamos pasar la fecha seleccionada como queryParams si quisiéramos pre-llenarla
        // Por ahora, simplemente vamos al Wizard para empezar el flujo completo
        this.router.navigate(['/bookings/new']);
        
        /* 
        // Lógica antigua del diálogo simple
        this.newBooking = {
            startDate: selectInfo.start,
            endDate: selectInfo.end
        };
        this.bookingDialog = true; 
        */
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
    }

    handleEventClick(clickInfo: any): void {
        const bookingId = clickInfo.event.id;
        this.bookingService.getBookingById(bookingId).subscribe(booking => {
            console.log('Booking details:', booking);
            this.selectedBooking = booking;
            this.viewBookingDialog = true;
            this.cdr.detectChanges();
        });
    }

    /* 
    // Métodos del diálogo simple ya no necesarios para creación
    hideDialog(): void {
        this.bookingDialog = false;
    }

    saveBooking(): void { ... }
    */

    cancelBooking(): void {
        if (!this.selectedBooking) return;

        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres cancelar esta reserva?',
            header: 'Confirmar Cancelación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, cancelar',
            rejectLabel: 'No',
            accept: () => {
                this.bookingService.cancelBooking(this.selectedBooking!._id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva cancelada' });
                        this.viewBookingDialog = false;
                        this.loadBookings();
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo cancelar' });
                    }
                });
            }
        });
    }

    getColorForStatus(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
        switch (status) {
            case 'confirmed': return 'success';
            case 'completed': return 'info';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    }

    openNewBookingDialog(): void {
        // En lugar de abrir el diálogo, navegamos al Wizard
        this.router.navigate(['/bookings/new']);
    }
}
