import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from '../../services/user.service';
import { Membership, MembershipService } from 'src/app/components/memberships/services/membership.service'; // 1. Importar
import { Router } from '@angular/router'; // 1. Importar Router
import { Table } from 'primeng/table';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class UserListComponent implements OnInit {

    customers: User[] = [];
    staff: User[] = [];

    userDialog: boolean = false;
    submitted: boolean = false;
    user: Partial<User> = {};

    // Opciones para los dropdowns del formulario de edición
    roles: SelectItem[] = [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Receptionist', value: 'receptionist' },
        { label: 'User', value: 'user' }
    ];

    statuses: SelectItem[] = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    memberships: SelectItem[] = [];

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private membershipService: MembershipService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAllUsers();
        this.loadMemberships();
    }

    loadAllUsers(): void {
        // Obtenemos la lista de clientes
        this.userService.getUsers('customer').subscribe(data => this.customers = data);
        // Obtenemos la lista del personal
        this.userService.getUsers('staff').subscribe(data => this.staff = data);
    }

    loadMemberships(): void {
        this.membershipService.getMemberships().subscribe(data => {
            this.memberships = data.map(m => ({ label: m.name, value: m._id }));
        });
    }

    editUser(user: User): void {
        this.user = { ...user, membership: (user.membership as any)?._id };
        this.userDialog = true;
    }

    deactivateUser(user: User): void {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que quieres desactivar a ${user.name}? El usuario no podrá iniciar sesión.`,
            header: 'Confirmar Desactivación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deactivateUser(user._id).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario desactivado' });
                    this.loadAllUsers();
                });
            }
        });
    }

    hideDialog(): void {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser(): void {
        this.submitted = true;
        console.log('Guardando usuario:', this.user);
        if (!this.user.name?.trim() || !this.user._id) {
            console.warn('Nombre o ID del usuario no proporcionados');
            return;
        }

        this.userService.updateUser(this.user._id, this.user).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado' });
                this.loadAllUsers();
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo actualizar' });
            }
        });

        this.userDialog = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    navigateToCreateUser(): void {
        this.router.navigate(['/profile/create']);
    }
}
