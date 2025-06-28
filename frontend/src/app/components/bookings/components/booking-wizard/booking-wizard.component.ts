import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api'; // Importamos MessageService
import { Resource } from 'src/app/components/resources/services/resource.service';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-booking-wizard',
    templateUrl: './booking-wizard.component.html',
    styleUrls: ['./booking-wizard.component.scss'],
    providers: [MessageService]
})
export class BookingWizardComponent implements OnInit {

    // Modelo para los encabezados de los pasos
    steps: MenuItem[] = [];
    isStep2Valid: boolean = false;

    // Objeto que guardará los datos de nuestra reserva a medida que avanzamos
    bookingState: {
        resource?: Resource | null;
        startTime?: Date | null;
        endTime?: Date | null;
        notes?: string;
    } = { resource: null, startTime: null, endTime: null, notes: '' };

    constructor(
        private bookingService: BookingService,
        private messageService: MessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.steps = [
            { label: 'Seleccionar Espacio' },
            { label: 'Elegir Fecha y Hora' },
            { label: 'Confirmación' }
        ];
    }

    // Este método se activa cuando el componente hijo (Paso 1) emite un evento
    onResourceSelected(resource: Resource): void {
        this.bookingState.resource = resource;
    }

    // Futuro método para el Paso 2
    onDateTimeSelected(event: { startTime: Date, endTime: Date }): void {
        this.bookingState.startTime = event.startTime;
        this.bookingState.endTime = event.endTime;
    }

    // Nuevo método para que el hijo nos diga si es válido
    onStep2ValidityChange(isValid: boolean): void {
        this.isStep2Valid = isValid;
    }

    // Futuro método para confirmar y guardar la reserva en el Paso 3
    confirmBooking(): void {
        const payload = {
            resourceId: this.bookingState.resource?._id,
            startTime: this.bookingState.startTime,
            endTime: this.bookingState.endTime,
            notes: this.bookingState.notes
        };

        this.bookingService.createBooking(payload).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: '¡Reserva Confirmada!', detail: 'Tu espacio ha sido reservado con éxito.' });
                // Esperamos un par de segundos y redirigimos al calendario principal
                setTimeout(() => this.router.navigate(['/bookings']), 2000);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo crear la reserva' });
            }
        });
    }
}
