import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { DashboardService } from './service/dashboard.service';
import { BookingService } from 'src/app/components/bookings/services/booking.service'; // Importar BookingService

// --- PrimeNG Modules ---
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';

// NOTA: EcommerceDashboardComponent NO se declara aquí
// Se declara en su propio módulo (EcommerceDashboardModule) que se carga de forma diferida.

@NgModule({
    imports: [
        CommonModule,
        FormsModule, // Importar FormsModule
        DashboardsRoutingModule,

        // --- PrimeNG --- (Necesarios para los componentes usados en el dashboard)
        ButtonModule,
        TableModule,
        CalendarModule,
        SkeletonModule,
        TagModule,
        PaginatorModule
    ],
    providers: [
        DashboardService,
        BookingService // Proveer BookingService para que esté disponible en los componentes hijos
    ]
})
export class DashboardsModule { }
