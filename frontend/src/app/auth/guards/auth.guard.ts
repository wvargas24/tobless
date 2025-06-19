// src/auth/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ¡Importante! Inyectaremos nuestro servicio

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService, // 1. Inyectamos nuestro AuthService
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        // Obtenemos el usuario actual desde nuestro servicio.
        // Esto es más seguro porque el servicio ya ha validado la expiración del token.
        const currentUser = this.authService.currentUserValue;

        // --- LÓGICA PRINCIPAL ---

        // A. ¿Hay un usuario autenticado?
        if (currentUser) {
            // Sí, hay un usuario. Ahora revisemos el rol.

            // B. ¿La ruta que intentamos activar requiere un rol específico?
            //    Esto lo leemos de la propiedad 'data' en la configuración de la ruta.
            const expectedRole = route.data['expectedRole'];

            // Si la ruta NO requiere un rol, y el usuario está logueado, damos acceso.
            if (!expectedRole) {
                return true;
            }

            // Si la ruta SÍ requiere un rol, comprobamos si el usuario lo tiene.
            if (currentUser.role === expectedRole) {
                // El rol coincide, damos acceso.
                return true;
            } else {
                // El rol no coincide. No damos acceso y redirigimos.
                console.error(`Acceso denegado. Se requiere el rol: '${expectedRole}', pero el usuario tiene el rol: '${currentUser.role}'`);
                this.router.navigate(['/auth/access']); // Redirigimos a la página de "Acceso Denegado"
                return false;
            }
        }

        // C. No hay un usuario autenticado.
        // Redirigimos a la página de login.
        console.log('Usuario no autenticado. Redirigiendo al login...');
        this.router.navigate(['/auth/login']);
        return false;
    }
}
