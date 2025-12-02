import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipListComponent } from './components/membership-list/membership-list.component';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminMembershipComponent } from './components/admin-membership/admin-membership.component';

const routes: Routes = [
    // Ruta pública para ver los planes
    { path: '', component: MembershipListComponent },

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
