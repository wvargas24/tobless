import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // Verificar si hay un token en el localStorage
        const token = localStorage.getItem('token');

        if (token) {
            // Si hay token, el usuario puede acceder a la ruta
            return true;
        } else {
            // Si no hay token, redirigir al usuario a la página de login
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
}
