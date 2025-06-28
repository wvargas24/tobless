import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Resource } from 'src/app/components/resources/services/resource.service';

@Component({
    selector: 'app-booking-wizard',
    templateUrl: './booking-wizard.component.html'
})
export class BookingWizardComponent implements OnInit {

    steps: MenuItem[] = [];
    activeIndex: number = 0; // Controla el paso actual

    // Objeto para guardar los datos de la reserva a medida que avanzamos
    bookingState = {
        resource: null as Resource | null,
        startTime: null as Date | null,
        endTime: null as Date | null
    };

    ngOnInit(): void {
        this.steps = [
            { label: 'Seleccionar Espacio' },
            { label: 'Elegir Fecha y Hora' },
            { label: 'Confirmación' }
        ];
    }

    // Este método se activa cuando el hijo (Step 1) emite un evento
    onResourceSelected(resource: Resource): void {
        this.bookingState.resource = resource;
        this.activeIndex = 1; // Avanzamos al siguiente paso
    }

    // ... Aquí irían los métodos para los siguientes pasos ...
}
