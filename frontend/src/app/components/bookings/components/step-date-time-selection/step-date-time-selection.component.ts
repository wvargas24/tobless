import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core'; // Importamos DateSelectArg
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AvailabilitySlot, BookingService } from '../../services/booking.service';
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

    // Ya no necesitamos 'selectedDate'. startTime y endTime contendrán la fecha completa.
    startTime: Date | null = null;
    endTime: Date | null = null;

    minTime!: Date;
    maxTime!: Date;

    constructor(
        private bookingService: BookingService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.minTime = new Date();
        this.minTime.setHours(8, 0, 0, 0);
        this.maxTime = new Date();
        this.maxTime.setHours(20, 0, 0, 0);
        this.initCalendar();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['resource'] && changes['resource'].currentValue) {
            this.loadBookingsForResource();
        }
    }

    initCalendar(): void {
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek', // La vista de semana es mejor para seleccionar horas
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            locale: 'es',
            allDaySlot: false,
            selectable: true, // Habilitamos la selección de rangos
            selectMirror: true, // Muestra un "placeholder" mientras arrastras
            select: this.handleDateSelect.bind(this), // <-- USAMOS 'select' EN LUGAR DE 'dateClick'
        };
    }

    loadBookingsForResource(): void {
        if (!this.resource) return;
        this.bookingService.getBookingsForResource(this.resource._id).subscribe(slots => {
            const events = slots.map((slot: AvailabilitySlot) => ({
                title: 'Ocupado',
                start: slot.startTime,
                end: slot.endTime,
                backgroundColor: '#64748B',
                borderColor: '#64748B',
                editable: false,
            }));
            this.calendarOptions = { ...this.calendarOptions, events };
        });
    }

    // REEMPLAZAMOS handleDateClick con handleDateSelect
    handleDateSelect(selectInfo: DateSelectArg): void {
        // El evento 'select' ya nos da la fecha/hora de inicio y fin
        this.startTime = selectInfo.start;
        this.endTime = selectInfo.end;

        // Validamos y emitimos inmediatamente
        this.onTimeChange();
        this.cdr.detectChanges();

        // Limpiamos la selección visual del calendario
        const calendarApi = selectInfo.view.calendar;
        // calendarApi.unselect();
    }

    onTimeChange(): void {
        // Este método ahora sirve para validar y emitir
        if (this.startTime && this.endTime && this.endTime > this.startTime) {
            this.dateTimeSelected.emit({ startTime: this.startTime, endTime: this.endTime });
            this.stepValid.emit(true);
        } else {
            this.stepValid.emit(false);
        }
    }
}
