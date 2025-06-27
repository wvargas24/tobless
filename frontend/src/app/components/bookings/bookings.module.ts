import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingCalendarComponent } from './components/booking-calendar/booking-calendar.component';

// Módulos de PrimeNG y FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
    declarations: [
        BookingCalendarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BookingsRoutingModule,
        FullCalendarModule,
        DialogModule,
        DropdownModule,
        InputTextareaModule,
        CalendarModule,
        ToastModule,
        ButtonModule,
        ConfirmDialogModule,
        TagModule,
        ToolbarModule
    ]
})
export class BookingsModule { }
