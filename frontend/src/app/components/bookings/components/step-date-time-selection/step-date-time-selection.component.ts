import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Booking, BookingService } from '../../services/booking.service';
import { Resource } from 'src/app/components/resources/services/resource.service';

@Component({
    selector: 'app-step-date-time-selection',
    templateUrl: './step-date-time-selection.component.html',
})
export class StepDateTimeSelectionComponent implements OnInit, OnChanges {

    @Input() resource: Resource | null = null;
    @Output() dateTimeSelected = new EventEmitter<{ startTime: Date, endTime: Date }>();
    @Output() stepValid = new EventEmitter<boolean>();

    calendarOptions!: CalendarOptions;

    selectedDate: Date | null = null;
    startTime: Date | null = null;
    endTime: Date | null = null;

    minTime!: Date;
    maxTime!: Date;

    constructor(private bookingService: BookingService) { }

    ngOnInit(): void {
        // Definimos el horario de apertura de 8am a 8pm
        this.minTime = new Date();
        this.minTime.setHours(8, 0, 0, 0);
        this.maxTime = new Date();
        this.maxTime.setHours(20, 0, 0, 0);

        this.initCalendar();
    }

    // Usamos ngOnChanges para reaccionar cuando el componente padre nos pasa el recurso
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['resource'] && changes['resource'].currentValue) {
            this.loadBookingsForResource();
        }
    }

    initCalendar(): void {
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            locale: 'es',
            dateClick: this.handleDateClick.bind(this),
            allDaySlot: false
        };
    }

    loadBookingsForResource(): void {
        if (!this.resource) return;

        this.bookingService.getBookingsForResource(this.resource._id).subscribe(bookings => {
            const events = bookings.map(booking => ({
                title: 'Ocupado',
                start: booking.startTime,
                end: booking.endTime,
                backgroundColor: '#64748B', // Un color neutral para los eventos existentes
                borderColor: '#64748B'
            }));
            // Actualizamos el calendario con los eventos de este recurso
            this.calendarOptions = { ...this.calendarOptions, events };
        });
    }

    handleDateClick(arg: any): void {
        this.selectedDate = arg.date;
        // Reseteamos las horas cada vez que se selecciona un nuevo día
        this.startTime = null;
        this.endTime = null;
        this.stepValid.emit(false); // Deshabilitamos el botón "Siguiente"
    }

    onTimeChange(): void {
        if (this.selectedDate && this.startTime && this.endTime && this.endTime > this.startTime) {
            const finalStartTime = new Date(this.selectedDate);
            finalStartTime.setHours(this.startTime.getHours(), this.startTime.getMinutes(), 0, 0);

            const finalEndTime = new Date(this.selectedDate);
            finalEndTime.setHours(this.endTime.getHours(), this.endTime.getMinutes(), 0, 0);

            this.dateTimeSelected.emit({ startTime: finalStartTime, endTime: finalEndTime });
            this.stepValid.emit(true); // Habilitamos el botón "Siguiente"
        } else {
            this.stepValid.emit(false); // Si falta algo, el paso no es válido
        }
    }
}
