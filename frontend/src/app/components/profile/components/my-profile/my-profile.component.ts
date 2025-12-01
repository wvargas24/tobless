import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    providers: [MessageService]
})
export class MyProfileComponent implements OnInit {

    // Usamos Partial<User> para poder manejar el formulario fácilmente
    user: Partial<User> = {};

    constructor(
        private authService: AuthService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.authService.getMyProfile().subscribe(data => {
            this.user = data;
        });
    }

    saveProfile(): void {
        if (!this.user.name || !this.user.email) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Nombre y Email son obligatorios' });
            return;
        }

        this.authService.updateMyProfile(this.user).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente' });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo actualizar el perfil' });
            }
        });
    }
}
