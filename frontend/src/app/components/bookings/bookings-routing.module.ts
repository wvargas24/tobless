import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingCalendarComponent } from './components/booking-calendar/booking-calendar.component';
import { BookingWizardComponent } from './components/booking-wizard/booking-wizard.component';


const routes: Routes = [
    { path: '', component: BookingCalendarComponent },
    // La nueva ruta /bookings/new inicia el asistente para crear una reserva
    { path: 'new', component: BookingWizardComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookingsRoutingModule { }
