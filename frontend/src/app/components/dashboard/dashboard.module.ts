import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './services/dashboard.service';
import { BookingService } from 'src/app/components/bookings/services/booking.service';

// --- PrimeNG Modules ---
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DashboardRoutingModule,

        // --- PrimeNG ---
        ButtonModule,
        TableModule,
        CalendarModule,
        SkeletonModule,
        TagModule,
        PaginatorModule,
        InputTextModule,
        RippleModule
    ],
    providers: [
        DashboardService,
        BookingService
    ]
})
export class DashboardModule { }

