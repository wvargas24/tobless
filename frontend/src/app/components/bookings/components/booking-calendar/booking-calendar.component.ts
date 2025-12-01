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

@Component({
    selector: 'app-booking-calendar',
    templateUrl: './booking-calendar.component.html',
    providers: [MessageService, ConfirmationService]
})
export class BookingCalendarComponent implements OnInit {

    calendarOptions!: CalendarOptions;
    events: EventInput[] = [];

    bookingDialog: boolean = false;
    resources: Resource[] = []; // Para llenar el dropdown
    newBooking: { resource?: string, startDate?: Date, endDate?: Date } = {}; // Fixed type structure

    viewBookingDialog: boolean = false;
    selectedBooking: Booking | null = null;
    currentUser: User | null = null;

    constructor(
        private bookingService: BookingService,
        private authService: AuthService,
        private messageService: MessageService, // 4. Inyectar los nuevos servicios
        private resourceService: ResourceService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef
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
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true,       // Permite arrastrar y redimensionar eventos
            selectable: true,     // Permite seleccionar rangos de tiempo
            select: this.handleDateSelect.bind(this),       // Se dispara al seleccionar un rango
            eventClick: this.handleEventClick.bind(this), // Se dispara al hacer clic en un evento
            events: this.events // Enlazamos los eventos
        };
    }

    loadBookings(): void {
        // Use getBookings() which handles the logic (admin sees all, user sees theirs) based on backend response
        // The previous logic distinguishing isAdminOrStaff in frontend for method call was removed in service
        
        this.bookingService.getBookings().subscribe(bookings => {
            // Transformamos nuestras reservas al formato que FullCalendar entiende
            this.events = bookings
                .filter(b => b.status !== 'cancelled') // Optional: hide cancelled bookings in calendar
                .map((booking: Booking) => ({
                id: booking._id,
                title: `${booking.resource.name} - ${booking.user.name}`,
                start: booking.startDate, // Use startDate property
                end: booking.endDate,     // Use endDate property
                backgroundColor: this.getColorForStatus(booking.status) === 'success' ? '#22c55e' : '#ef4444',
                borderColor: this.getColorForStatus(booking.status) === 'success' ? '#22c55e' : '#ef4444',
                extendedProps: {
                    booking: booking // Store full booking object to retrieve later
                }
            }));
            // Actualizamos las opciones del calendario con los nuevos eventos
            this.calendarOptions = { ...this.calendarOptions, events: this.events };
        });
    }

    loadResources(): void {
        this.resourceService.getBookableResources().subscribe(data => {
            this.resources = data;
        });
    }

    handleDateSelect(selectInfo: any): void {
        this.newBooking = {
            startDate: selectInfo.start,
            endDate: selectInfo.end
        };
        this.bookingDialog = true; // Mostramos el diálogo
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
    }

    handleEventClick(clickInfo: any): void {
        const bookingId = clickInfo.event.id;
        this.bookingService.getBookingById(bookingId).subscribe(booking => {
            console.log('Booking details:', booking);
            this.selectedBooking = booking;
            this.viewBookingDialog = true;
            this.cdr.detectChanges(); // Aseguramos que los cambios se detecten
        });
    }

    hideDialog(): void {
        this.bookingDialog = false;
    }

    saveBooking(): void {
        if (!this.newBooking.resource) {
            this.messageService.add({ severity: 'warn', summary: 'Error de Validación', detail: 'Por favor, selecciona un recurso.' });
            return;
        }

        this.bookingService.createBooking(this.newBooking).subscribe({
            next: (response) => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva creada correctamente' });
                this.bookingDialog = false;
                this.newBooking = {};
                this.loadBookings(); // ¡MUY IMPORTANTE! Recargamos los eventos para que aparezca la nueva reserva
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error al Crear', detail: err.error.message || 'No se pudo crear la reserva' });
            }
        });
    }

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
                        this.loadBookings(); // Recargamos para que el calendario se actualice
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo cancelar' });
                    }
                });
            }
        });
    }

    getColorForStatus(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
        // Map backend statuses to PrimeNG severities
        switch (status) {
            case 'confirmed': return 'success';
            case 'completed': return 'info';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    }

    openNewBookingDialog(): void {
        this.newBooking = {};
        this.bookingDialog = true;
    }
}
