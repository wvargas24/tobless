import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceDashboardComponent } from './ecommerce.dashboard.component';
import { EcommerceDashboardRoutigModule } from './ecommerce.dashboard-routing.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { CarouselModule } from 'primeng/carousel';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { TimelineModule } from 'primeng/timeline';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar'; // <-- AÑADIDO

@NgModule({
    imports: [
        CommonModule,
        FormsModule, // <-- AÑADIDO
        EcommerceDashboardRoutigModule,
        ButtonModule,
        RippleModule,
        DropdownModule,
        TableModule,
        InputTextModule,
        InputTextareaModule,
        ChartModule,
        RatingModule,
        KnobModule,
        CarouselModule,
        ProgressBarModule,
        AvatarModule,
        TimelineModule,
        BadgeModule,
        ProgressSpinnerModule,
        SkeletonModule,
        TagModule,
        CalendarModule // <-- AÑADIDO
    ],
    declarations: [EcommerceDashboardComponent]
})
export class EcommerceDashboardModule { }
