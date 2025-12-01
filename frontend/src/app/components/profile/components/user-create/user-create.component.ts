import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from '../../services/user.service'; // Reutilizaremos el servicio de admin
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    providers: [MessageService]
})
export class UserCreateComponent implements OnInit {

    // Modelo para el nuevo usuario
    newUser: Partial<User> = { role: 'user' }; // Rol 'user' por defecto

    // Opciones para los dropdowns
    roles: SelectItem[] = [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Receptionist', value: 'receptionist' },
        { label: 'User', value: 'user' }
    ];
    countries: any[] = [];

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private http: HttpClient,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Cargamos la lista de países desde el archivo JSON local
        this.http.get<any>('assets/demo/data/countries.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => { this.countries = data; });
    }

    createUser(): void {
        if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.role) {
            this.messageService.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Por favor, llena todos los campos obligatorios.' });
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
