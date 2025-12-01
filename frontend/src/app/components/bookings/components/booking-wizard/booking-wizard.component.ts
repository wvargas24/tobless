import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api'; // Importamos MessageService
import { Resource } from 'src/app/components/resources/services/resource.service';
import { ResourceType } from 'src/app/components/resourcetypes/services/resource-type.service';
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
    submitting: boolean = false;

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
        if (!this.bookingState.resource || !this.bookingState.startTime || !this.bookingState.endTime) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Faltan datos para completar la reserva.' });
            return;
        }

        this.submitting = true; // Activamos el estado de carga

        // AJUSTADO: Payload con los nombres de campos que espera el Backend
        const payload = {
            resource: this.bookingState.resource._id, // 'resource' (el ID) en lugar de 'resourceId'
            startDate: this.bookingState.startTime,   // 'startDate' en lugar de 'startTime'
            endDate: this.bookingState.endTime,       // 'endDate' en lugar de 'endTime'
            // notes: this.bookingState.notes || ''   // El backend por ahora no guarda notas, pero no molesta enviarlo
        };

        this.bookingService.createBooking(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: '¡Reserva Confirmada!',
                    detail: 'Tu espacio ha sido reservado con éxito. Serás redirigido.',
                    life: 3000 // El mensaje dura 3 segundos
                });

                // Esperamos un momento para que el usuario lea el mensaje y luego lo redirigimos
                setTimeout(() => this.router.navigate(['/bookings']), 3000);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error al Reservar', detail: err.error.message || 'No se pudo crear la reserva' });
                this.submitting = false; // Reactivamos el botón si hay un error
            }
        });
    }

    getResourceTypeName(): string {
        const type = this.bookingState.resource?.type;
        // Verificamos si 'type' es un objeto y tiene la propiedad 'name'
        if (type && typeof type === 'object' && 'name' in type) {
            return (type as ResourceType).name;
        }
        return 'No especificado'; // Devolvemos un texto por defecto si no lo encuentra
    }
}
