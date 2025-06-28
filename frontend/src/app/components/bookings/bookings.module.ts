import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingsRoutingModule } from './bookings-routing.module';

// --- COMPONENTES DEL MÓDULO ---
import { BookingCalendarComponent } from './components/booking-calendar/booking-calendar.component';
import { BookingWizardComponent } from './components/booking-wizard/booking-wizard.component'; // 1. Importar
import { StepResourceSelectionComponent } from './components/step-resource-selection/step-resource-selection.component'; // 2. Importar

// --- MÓDULOS DE PRIMENG Y FULLCALENDAR ---
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
import { StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';

@NgModule({
    declarations: [
        BookingCalendarComponent,
        BookingWizardComponent,
        StepResourceSelectionComponent,
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
        ToolbarModule,
        StepperModule,
        CardModule,
    ]
})
export class BookingsModule { }
