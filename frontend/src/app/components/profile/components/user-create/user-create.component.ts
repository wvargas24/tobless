import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from '../../services/user.service';
import { MembershipService } from 'src/app/components/memberships/services/membership.service'; // Import MembershipService
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    providers: [MessageService]
})
export class UserCreateComponent implements OnInit {

    // Modelo para el nuevo usuario
    newUser: Partial<User> & { membership?: string } = { role: 'user' }; // Rol 'user' por defecto

    // Opciones para los dropdowns
    roles: SelectItem[] = [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Receptionist', value: 'receptionist' },
        { label: 'User', value: 'user' }
    ];
    
    memberships: SelectItem[] = []; // List of memberships

    constructor(
        private userService: UserService,
        private membershipService: MembershipService, // Inject MembershipService
        private messageService: MessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadMemberships();
    }

    loadMemberships(): void {
        this.membershipService.getMemberships().subscribe(data => {
            this.memberships = data.map(m => ({ label: m.name, value: m._id }));
        });
    }

    createUser(): void {
        // Validate username as well
        if (!this.newUser.name || !this.newUser.username || !this.newUser.email || !this.newUser.password || !this.newUser.role) {
            this.messageService.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Por favor, llena todos los campos obligatorios (incluyendo nombre de usuario).' });
            return;
        }

        this.userService.createUser(this.newUser).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente' });
                // Navegamos a la lista de usuarios tras el éxito
                this.router.navigate(['/profile/list']);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo crear el usuario' });
            }
        });
    }
}
