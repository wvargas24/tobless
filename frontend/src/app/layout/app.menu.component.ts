// src/app/layout/app.menu.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/models/user.model';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {

    model: any[] = [];
    userSubscription!: Subscription;

    // 1. Inyectamos nuestro AuthService
    constructor(private authService: AuthService) { }

    ngOnInit() {
        // 2. Nos suscribimos a los cambios del usuario.
        //    Cada vez que alguien inicie o cierre sesión, el menú se reconstruirá.
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            console.log('Construyendo menú para el usuario:', user);
            this.model = this.buildMenuForUser(user);
        });
    }

    ngOnDestroy() {
        // 3. Buena práctica: nos desuscribimos para evitar fugas de memoria.
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    // 4. La función principal que construye el menú según el rol.
    buildMenuForUser(user: User | null): any[] {
        // Si no hay usuario (nadie logueado), devolvemos un menú vacío.
        if (!user) {
            return [];
        }

        const dashboardMenu = {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: ['/dashboard'],
            visible: ['admin', 'manager'].includes(user.role)
        };

        const bookingsMenu = {
            label: 'Reservas',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['/bookings'],
            visible: true // Visible para todos los usuarios logueados
        };

        const publicMembershipsMenu = {
            label: 'Planes y Precios',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/memberships'],
            // Este enlace es para que un cliente vea los planes, no para gestionarlos.
            visible: user.role === 'user'
        };

        // --- SECCIÓN DE GESTIÓN DE MEMBRESÍAS (Para Staff) ---
        const membershipsManagementMenu = {
            label: 'Membresías',
            icon: 'pi pi-fw pi-id-card',
            visible: ['admin', 'manager', 'receptionist'].includes(user.role),
            items: [
                {
                    label: 'Registrar Miembro',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['/memberships/onboarding'],
                    visible: true
                },
                {
                    label: 'Administrar Planes',
                    icon: 'pi pi-fw pi-cog',
                    routerLink: ['/memberships/admin'],
                    visible: user.role === 'admin'
                }
            ]
        };

        // --- SECCIÓN DE GESTIÓN DE RECURSOS (Para Admin/Manager) ---
        const resourcesManagementMenu = {
            label: 'Recursos',
            icon: 'pi pi-fw pi-server',
            visible: ['admin', 'manager'].includes(user.role),
            items: [
                {
                    label: 'Gestionar Recursos',
                    icon: 'pi pi-fw pi-box',
                    routerLink: ['/resources']
                },
                {
                    label: 'Gestionar Tipos',
                    icon: 'pi pi-fw pi-tags',
                    routerLink: ['/resourcetypes']
                }
            ]
        };

        // --- SECCIÓN DE GESTIÓN DE USUARIOS (Para Admin/Manager) ---
        const usersManagementMenu = {
            label: 'Usuarios',
            icon: 'pi pi-fw pi-users',
            visible: ['admin', 'manager'].includes(user.role),
            items: [
                {
                    label: 'Lista de Usuarios',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/profile/list'],
                    visible: true // Visible para admin y manager
                },
                {
                    label: 'Crear Usuario',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['/profile/create'],
                    visible: user.role === 'admin' // Visible solo para admin
                }
            ]
        };

        // Devolvemos el array final del menú con todos los items de primer nivel
        return [
            dashboardMenu,
            bookingsMenu,
            publicMembershipsMenu,
            membershipsManagementMenu,
            resourcesManagementMenu,
            usersManagementMenu
        ].filter(item => item.visible);
    }
}
