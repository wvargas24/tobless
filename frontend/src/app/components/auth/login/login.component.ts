import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';

@Component({
    templateUrl: './login.component.html',
    providers: [MessageService]
})
export class LoginComponent {

    email: string = '';
    password: string = '';
    rememberMe: boolean = false;
    private API_URL = `${environment.API_URL}/auth/login`;

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient,
        private router: Router,
        private messageService: MessageService
    ) { }

    onLogin() {
        const loginData = {
            email: this.email,
            password: this.password
        };

        this.http.post<{ token: string, name: string, email: string }>(this.API_URL, loginData)
            .subscribe({
                next: (response) => {
                    const decodedToken: any = jwtDecode(response.token);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', response.name);
                    localStorage.setItem('email', response.email);
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    // Extrae el mensaje de error del backend
                    const backendErrorMessage = error.error?.message || 'Error desconocido al iniciar sesión';

                    // Muestra el mensaje con PrimeNG (o tu servicio de mensajes)
                    this.messageService.add({
                        key: 'tst',
                        severity: 'error',
                        summary: 'Error',
                        detail: backendErrorMessage
                    });

                    // Opcional: Log para depuración
                    // console.error('Error completo:', error);
                }
            });
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

}
