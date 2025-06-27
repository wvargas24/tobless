import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class UserListComponent implements OnInit {

    users: User[] = [];
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

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe(data => this.users = data);
    }

    editUser(user: User): void {
        this.user = { ...user };
        this.userDialog = true;
    }

    deactivateUser(user: User): void {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que quieres desactivar a ${user.name}? El usuario no podrá iniciar sesión.`,
            header: 'Confirmar Desactivación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deactivateUser(user.id).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario desactivado' });
                    this.loadUsers();
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
        if (!this.user.name?.trim() || !this.user.id) {
            return;
        }

        this.userService.updateUser(this.user.id, this.user).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado' });
                this.loadUsers();
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo actualizar' });
            }
        });

        this.userDialog = false;
    }
}
