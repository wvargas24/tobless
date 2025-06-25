import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // Importar tipos de FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Booking, BookingService } from '../../services/booking.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { Resource, ResourceService } from 'src/app/components/resources/services/resource.service';


@Component({
    selector: 'app-booking-calendar',
    templateUrl: './booking-calendar.component.html',
    providers: [MessageService]
})
export class BookingCalendarComponent implements OnInit {

    calendarOptions!: CalendarOptions;
    events: EventInput[] = [];

    bookingDialog: boolean = false;
    resources: Resource[] = []; // Para llenar el dropdown
    newBooking: { resourceId?: string, startTime?: Date, endTime?: Date, notes?: string } = {};


    constructor(
        private bookingService: BookingService,
        private authService: AuthService,
        private messageService: MessageService, // 4. Inyectar los nuevos servicios
        private resourceService: ResourceService
    ) { }

    ngOnInit(): void {
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
        const currentUser = this.authService.currentUserValue;
        const isAdminOrStaff = currentUser && ['admin', 'manager', 'receptionist'].includes(currentUser.role);

        const bookingObservable = isAdminOrStaff
            ? this.bookingService.getAllBookings()
            : this.bookingService.getMyBookings();

        bookingObservable.subscribe(bookings => {
            // Transformamos nuestras reservas al formato que FullCalendar entiende
            this.events = bookings.map((booking: Booking) => ({
                id: booking._id,
                title: `${booking.resource.name} - ${booking.user.name}`,
                start: booking.startTime,
                end: booking.endTime,
                backgroundColor: this.getColorForStatus(booking.status),
                borderColor: this.getColorForStatus(booking.status)
            }));
            // Actualizamos las opciones del calendario con los nuevos eventos
            this.calendarOptions = { ...this.calendarOptions, events: this.events };
        });
    }

    loadResources(): void {
        this.resourceService.getResources().subscribe(data => this.resources = data);
    }

    handleDateSelect(selectInfo: any): void {
        this.newBooking = {
            startTime: selectInfo.start,
            endTime: selectInfo.end
        };
        this.bookingDialog = true; // Mostramos el diálogo
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
    }

    handleEventClick(clickInfo: any): void {
        alert('Has hecho clic en la reserva: ' + clickInfo.event.title + ' (ID: ' + clickInfo.event.id + ')');
        // En el futuro, aquí podríamos abrir un diálogo para ver/editar/cancelar
    }

    hideDialog(): void {
        this.bookingDialog = false;
    }

    saveBooking(): void {
        if (!this.newBooking.resourceId) {
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

    getColorForStatus(status: string): string {
        return status === 'confirmada' ? '#22c55e' : '#ef4444'; // verde para confirmada, rojo para cancelada
    }
}
