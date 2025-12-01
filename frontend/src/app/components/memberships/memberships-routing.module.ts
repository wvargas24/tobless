import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipListComponent } from './components/membership-list/membership-list.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component'; // <-- 1. Importa el nuevo componente
import { AuthGuard } from '../../auth/guards/auth.guard'; // <-- 2. Importa el guard
import { AdminMembershipComponent } from './components/admin-membership/admin-membership.component'; // <-- Importa el nuevo componente

const routes: Routes = [
    // Ruta pública para ver los planes
    { path: '', component: MembershipListComponent },

    // --- NUEVA RUTA PROTEGIDA ---
    // Ruta privada para el personal
    {
        path: 'onboarding',
        component: OnboardingComponent,
        canActivate: [AuthGuard], // 3. Usamos nuestro guard
        data: {
            breadcrumb: 'Agregar Usuario', // Opcional, para el breadcrumb
            // 4. Definimos los roles que tienen permiso
            expectedRoles: ['admin', 'manager', 'receptionist']
        }
    },
    // --- NUEVA RUTA SOLO PARA ADMIN ---
    {
        path: 'admin',
        component: AdminMembershipComponent,
        canActivate: [AuthGuard],
        data: {
            breadcrumb: 'Administrar Planes', // Opcional, para el breadcrumb
            expectedRoles: ['admin'] // Solo el admin puede acceder
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MembershipsRoutingModule { }
