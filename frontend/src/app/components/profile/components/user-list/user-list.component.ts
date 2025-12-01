import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from '../../services/user.service';
import { Membership, MembershipService } from 'src/app/components/memberships/services/membership.service';
import { Router } from '@angular/router';
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
    user: Partial<User> & { newPassword?: string; confirmPassword?: string } = {};

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
        this.userService.getUsers('customer').subscribe(data => this.customers = data);
        this.userService.getUsers('staff').subscribe(data => this.staff = data);
    }

    loadMemberships(): void {
        this.membershipService.getMemberships().subscribe(data => {
            this.memberships = data.map(m => ({ label: m.name, value: m._id }));
        });
    }

    editUser(user: User): void {
        this.user = { 
            ...user, 
            membership: (user.membership as any)?._id,
            newPassword: '',
            confirmPassword: ''
        };
        this.userDialog = true;
    }

    generateRandomPassword(): void {
        // Generate a secure random password
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        let password = 'ToBless';
        for (let i = 0; i < 6; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.user.newPassword = password;
        this.user.confirmPassword = password;
        
        // Show message so admin can copy it
        this.messageService.add({ 
            severity: 'info', 
            summary: 'Contraseña Generada', 
            detail: `Contraseña temporal: ${password}`,
            life: 10000 // Show for 10 seconds
        });
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
        // Reset password fields
        this.user.newPassword = '';
        this.user.confirmPassword = '';
    }

    saveUser(): void {
        this.submitted = true;
        
        if (!this.user.name?.trim() || !this.user._id) {
            this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'El nombre es obligatorio.' });
            return;
        }

        // Validate passwords match if provided
        if (this.user.newPassword || this.user.confirmPassword) {
            if (this.user.newPassword !== this.user.confirmPassword) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden.' });
                return;
            }
        }

        // Prepare payload
        const payload: any = { ...this.user };
        
        // If new password provided, send it as 'password' to backend
        if (this.user.newPassword && this.user.newPassword.trim().length > 0) {
            payload.password = this.user.newPassword;
        }
        
        // Remove temp fields
        delete payload.newPassword;
        delete payload.confirmPassword;

        this.userService.updateUser(this.user._id, payload).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente' });
                this.loadAllUsers();
                this.hideDialog();
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo actualizar' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    navigateToCreateUser(): void {
        this.router.navigate(['/profile/create']);
    }
}
