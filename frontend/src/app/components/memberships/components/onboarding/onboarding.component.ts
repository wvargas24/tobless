import { Component, OnInit } from '@angular/core';
import { Membership, MembershipService, OnboardingData } from '../../services/membership.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    providers: [MessageService] // Toast necesita este provider
})
export class OnboardingComponent implements OnInit {

    // Para el dropdown de membresías
    memberships: Membership[] = [];

    // Modelo para los datos del formulario (usaremos ngModel)
    onboardingData: OnboardingData = {
        name: '',
        email: '',
        password: '',
        membershipId: ''
    };

    submitting: boolean = false; // Para deshabilitar el botón al enviar

    constructor(
        private membershipService: MembershipService,
        private messageService: MessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Al iniciar, cargamos las membresías para llenar el dropdown
        this.membershipService.getMemberships().subscribe(data => {
            this.memberships = data;
        });
    }

    onSubmit(): void {
        if (!this.onboardingData.name || !this.onboardingData.email || !this.onboardingData.password || !this.onboardingData.membershipId) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son obligatorios' });
            return;
        }

        this.submitting = true;

        this.membershipService.onboardUser(this.onboardingData).subscribe({
            next: (response) => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado y asignado correctamente' });
                // Opcional: redirigir a otra página tras el éxito
                // this.router.navigate(['/dashboard']);
                this.submitting = false;
            },
            error: (err) => {
                const errorMessage = err.error?.message || 'Ocurrió un error en el servidor';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
                this.submitting = false;
            }
        });
    }
}
