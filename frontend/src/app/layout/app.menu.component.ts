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

        // --- Definimos la estructura de nuestro nuevo menú ---

        const dashboardMenu = {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: ['/dashboard'],
            // Usamos la propiedad 'visible' para controlar el acceso por rol
            visible: ['admin', 'manager', 'receptionist'].includes(user.role)
        };

        const membershipsMenu = {
            label: 'Membresías',
            icon: 'pi pi-fw pi-id-card',
            // Este elemento principal es visible para todo el personal
            visible: ['admin', 'manager', 'receptionist'].includes(user.role),
            items: [
                {
                    label: 'Ver Planes',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/memberships'],
                    // Visible para todo el personal
                    visible: true
                },
                {
                    label: 'Registrar Miembro',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['/memberships/onboarding'],
                    // Visible para todo el personal (admin, manager, receptionist)
                    visible: true
                },
                {
                    label: 'Administrar Planes',
                    icon: 'pi pi-fw pi-cog',
                    routerLink: ['/memberships/admin'], // Suponiendo una futura ruta
                    // Visible solo para el admin
                    visible: user.role === 'admin'
                }
            ]
        };

        // ... Aquí podrías añadir más secciones del menú de la misma forma ...
        const bookingsMenu = {
            label: 'Reservas',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['/bookings'], // Suponiendo una futura ruta
            // Visible para todos los roles, incluyendo 'user'
            visible: true
        };

        const resourcesMenu = {
            label: 'Recursos',
            icon: 'pi pi-fw pi-box',
            routerLink: ['/resources/admin'],
            visible: ['admin', 'manager'].includes(user.role)
        };


        // 5. Devolvemos el array final del menú.
        //    Filtramos los elementos que no sean visibles para no enviar objetos vacíos.
        return [
            dashboardMenu,
            membershipsMenu,
            resourcesMenu,
            bookingsMenu
        ].filter(item => item.visible);
    }
}
