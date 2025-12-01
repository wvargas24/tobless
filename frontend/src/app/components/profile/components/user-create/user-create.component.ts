import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from '../../services/user.service';
import { MembershipService } from 'src/app/components/memberships/services/membership.service';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { debounceTime, Subject } from 'rxjs';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    providers: [MessageService]
})
export class UserCreateComponent implements OnInit {

    newUser: Partial<User> & { membership?: string } = { role: 'user' };

    roles: SelectItem[] = [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Receptionist', value: 'receptionist' },
        { label: 'User', value: 'user' }
    ];
    
    memberships: SelectItem[] = [];

    // Username availability
    usernameStatus: 'checking' | 'available' | 'taken' | null = null;
    private nameChange$ = new Subject<string>();

    constructor(
        private userService: UserService,
        private membershipService: MembershipService,
        private messageService: MessageService,
        private router: Router,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.loadMemberships();
        
        // Debounce name changes to auto-generate username
        this.nameChange$.pipe(
            debounceTime(500) // Wait 500ms after user stops typing
        ).subscribe(name => {
            this.generateUsername(name);
        });
    }

    loadMemberships(): void {
        this.membershipService.getMemberships().subscribe(data => {
            this.memberships = data.map(m => ({ label: m.name, value: m._id }));
        });
    }

    onNameChange(): void {
        if (this.newUser.name) {
            this.nameChange$.next(this.newUser.name);
        }
    }

    generateUsername(fullName: string): void {
        if (!fullName || fullName.trim().length === 0) return;

        // Generate username from name: "Juan Pérez" -> "juan.perez"
        const parts = fullName.trim().toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
            .split(/\s+/); // Split by spaces
        
        let suggestedUsername = '';
        
        if (parts.length >= 2) {
            // First name + last name
            suggestedUsername = `${parts[0]}.${parts[parts.length - 1]}`;
        } else {
            // Just one name
            suggestedUsername = parts[0];
        }

        // Clean special characters
        suggestedUsername = suggestedUsername.replace(/[^a-z0-9.]/g, '');

        // Set the username and check availability
        this.newUser.username = suggestedUsername;
        this.checkUsername(suggestedUsername);
    }

    checkUsername(username: string): void {
        if (!username || username.length < 3) {
            this.usernameStatus = null;
            return;
        }

        this.usernameStatus = 'checking';
        
        this.http.get<{available: boolean}>(`${environment.API_URL}/auth/check-username?username=${username}`)
            .subscribe({
                next: (response) => {
                    if (response.available) {
                        this.usernameStatus = 'available';
                    } else {
                        this.usernameStatus = 'taken';
                        // Auto-suggest with a number suffix
                        const withSuffix = `${username}${Math.floor(Math.random() * 99) + 1}`;
                        this.newUser.username = withSuffix;
                        this.checkUsername(withSuffix); // Re-check the new suggestion
                    }
                },
                error: (err) => {
                    console.error('Error checking username:', err);
                    this.usernameStatus = null;
                }
            });
    }

    onUsernameManualChange(): void {
        // If user manually edits username, check availability
        if (this.newUser.username) {
            this.checkUsername(this.newUser.username);
        }
    }

    createUser(): void {
        if (!this.newUser.name || !this.newUser.username || !this.newUser.email || !this.newUser.password || !this.newUser.role) {
            this.messageService.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Por favor, llena todos los campos obligatorios (incluyendo nombre de usuario).' });
            return;
        }

        if (this.usernameStatus === 'taken') {
            this.messageService.add({ severity: 'error', summary: 'Username no disponible', detail: 'El nombre de usuario ya está en uso. Por favor elige otro.' });
            return;
        }

        this.userService.createUser(this.newUser).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente' });
                this.router.navigate(['/profile/list']);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo crear el usuario' });
            }
        });
    }
}
