import { Component, OnInit } from '@angular/core';
import { Membership, MembershipService } from '../../services/membership.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-admin-membership',
    templateUrl: './admin-membership.component.html',
    providers: [MessageService, ConfirmationService] // Necesarios para toasts y diálogos de confirmación
})
export class AdminMembershipComponent implements OnInit {

    memberships: Membership[] = [];
    membershipDialog: boolean = false; // Controla la visibilidad del diálogo de crear/editar
    submitted: boolean = false;

    // Objeto para manejar la membresía que se está creando o editando
    membership: Partial<Membership> = {};

    constructor(
        private membershipService: MembershipService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadMemberships();
    }

    loadMemberships(): void {
        this.membershipService.getMemberships().subscribe(data => this.memberships = data);
    }

    openNew(): void {
        this.membership = {}; // Limpiamos el objeto para una nueva entrada
        this.submitted = false;
        this.membershipDialog = true;
    }

    editMembership(membership: Membership): void {
        this.membership = { ...membership }; // Copiamos el objeto para no modificar el original directamente
        this.membershipDialog = true;
    }

    deleteMembership(membership: Membership): void {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + membership.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.membershipService.deleteMembership(membership._id).subscribe(() => {
                    this.memberships = this.memberships.filter(val => val._id !== membership._id);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Membresía Eliminada' });
                });
            }
        });
    }

    hideDialog(): void {
        this.membershipDialog = false;
        this.submitted = false;
    }

    saveMembership(): void {
        this.submitted = true;

        // Validación simple
        if (!this.membership.name?.trim() || !this.membership.price || !this.membership.duration) {
            return;
        }

        if (this.membership._id) {
            // Estamos editando
            this.membershipService.updateMembership(this.membership._id, this.membership).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Membresía Actualizada' });
                this.loadMemberships(); // Recargamos la lista
            });
        } else {
            // Estamos creando
            this.membershipService.createMembership(this.membership as Membership).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Membresía Creada' });
                this.loadMemberships(); // Recargamos la lista
            });
        }

        this.membershipDialog = false;
        this.membership = {};
    }
}
