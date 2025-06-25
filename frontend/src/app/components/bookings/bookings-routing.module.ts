import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingCalendarComponent } from './components/booking-calendar/booking-calendar.component';

const routes: Routes = [
    { path: '', component: BookingCalendarComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookingsRoutingModule { }
