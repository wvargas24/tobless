import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Resource } from 'src/app/components/resources/services/resource.service';
import { ResourceType } from 'src/app/components/resourcetypes/services/resource-type.service';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service'; // Importar AuthService
import { User } from 'src/app/auth/models/user.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-booking-wizard',
    templateUrl: './booking-wizard.component.html',
    styleUrls: ['./booking-wizard.component.scss'],
    providers: [MessageService]
})
export class BookingWizardComponent implements OnInit, OnDestroy {

    steps: MenuItem[] = [];
    isStep2Valid: boolean = false;
    submitting: boolean = false;
    isAdminOrManager: boolean = false; // Flag para saber si mostrar el paso de usuario

    bookingState: {
        user?: User | null; // Usuario seleccionado
        resource?: Resource | null;
        startTime?: Date | null;
        endTime?: Date | null;
        notes?: string;
    } = { user: null, resource: null, startTime: null, endTime: null, notes: '' };

    private userSubscription: Subscription = new Subscription();

    constructor(
        private bookingService: BookingService,
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService // Inyectar
    ) { }

    ngOnInit(): void {
        // Suscribirse para asegurar que tenemos el usuario cargado
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            console.log('BookingWizard: Usuario actual recibido:', user);
            
            if (user) {
                console.log('BookingWizard: Rol del usuario:', user.role);
                this.isAdminOrManager = ['admin', 'manager'].includes(user.role);
                console.log('BookingWizard: ¿Es Admin/Manager?', this.isAdminOrManager);
            } else {
                this.isAdminOrManager = false;
            }

            this.initSteps();
        });
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    initSteps() {
        this.steps = [];
        
        // Agregar paso de usuario solo si es admin/manager
        if (this.isAdminOrManager) {
            this.steps.push({ label: 'Seleccionar Usuario' });
        }

        this.steps.push(
            { label: 'Seleccionar Espacio' },
            { label: 'Elegir Fecha y Hora' },
            { label: 'Confirmación' }
        );
        
        console.log('BookingWizard: Pasos inicializados:', this.steps);
    }

    // Nuevo método para manejar la selección de usuario
    onUserSelected(user: User | null): void {
        this.bookingState.user = user;
    }

    onResourceSelected(resource: Resource): void {
        this.bookingState.resource = resource;
    }

    onDateTimeSelected(event: { startTime: Date, endTime: Date }): void {
        this.bookingState.startTime = event.startTime;
        this.bookingState.endTime = event.endTime;
    }

    onStep2ValidityChange(isValid: boolean): void {
        this.isStep2Valid = isValid;
    }

    confirmBooking(): void {
        if (!this.bookingState.resource || !this.bookingState.startTime || !this.bookingState.endTime) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Faltan datos para completar la reserva.' });
            return;
        }

        this.submitting = true;

        const payload: any = {
            resource: this.bookingState.resource._id,
            startDate: this.bookingState.startTime,
            endDate: this.bookingState.endTime,
        };

        // Si se seleccionó un usuario específico, lo enviamos
        if (this.isAdminOrManager && this.bookingState.user) {
            payload.userId = this.bookingState.user._id;
        }

        this.bookingService.createBooking(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: '¡Reserva Confirmada!',
                    detail: 'Tu espacio ha sido reservado con éxito. Serás redirigido.',
                    life: 3000
                });
                setTimeout(() => this.router.navigate(['/bookings']), 3000);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error al Reservar', detail: err.error.message || 'No se pudo crear la reserva' });
                this.submitting = false;
            }
        });
    }

    getResourceTypeName(): string {
        const type = this.bookingState.resource?.type;
        if (type && typeof type === 'object' && 'name' in type) {
            return (type as ResourceType).name;
        }
        return 'No especificado';
    }
}
