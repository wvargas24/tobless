import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; // Import Spanish locale directly for FullCalendar
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

    startTime: Date | null = null;
    endTime: Date | null = null;

    constructor(
        private bookingService: BookingService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
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
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today', // Navigation buttons enabled
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            locale: esLocale, // Use imported locale object
            allDaySlot: false,
            selectable: true,
            selectMirror: true,
            slotMinTime: '09:00:00', // Business hours start
            slotMaxTime: '18:00:00', // Business hours end
            businessHours: { // Visual highlighting
                daysOfWeek: [ 1, 2, 3, 4, 5 ], // Mon-Fri
                startTime: '09:00',
                endTime: '18:00',
            },
            selectConstraint: 'businessHours', // Restrict selection to business hours
            select: this.handleDateSelect.bind(this),
            validRange: { // Optional: Prevent selecting dates in the past
                start: new Date() 
            }
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
                display: 'background' // Show as background event to clearly indicate unavailability
            }));
            
            // Merge new events with existing options
            this.calendarOptions = { 
                ...this.calendarOptions, 
                events: events 
            };
        });
    }

    handleDateSelect(selectInfo: DateSelectArg): void {
        this.startTime = selectInfo.start;
        this.endTime = selectInfo.end;

        this.onTimeChange();
        this.cdr.detectChanges();
    }

    onTimeChange(): void {
        if (this.startTime && this.endTime && this.endTime > this.startTime) {
            this.dateTimeSelected.emit({ startTime: this.startTime, endTime: this.endTime });
            this.stepValid.emit(true);
        } else {
            this.stepValid.emit(false);
        }
    }
}
