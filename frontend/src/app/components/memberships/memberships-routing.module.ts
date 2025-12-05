import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipListComponent } from './components/membership-list/membership-list.component';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminMembershipComponent } from './components/admin-membership/admin-membership.component';
import { MyMembershipComponent } from './components/my-membership/my-membership.component';

const routes: Routes = [
    // Ruta pública para ver los planes
    { path: '', component: MembershipListComponent },

    // --- RUTA PARA VER MI MEMBRESÍA (USUARIOS) ---
    {
        path: 'my-membership',
        component: MyMembershipComponent,
        canActivate: [AuthGuard],
        data: {
            breadcrumb: 'Mi Membresía',
            expectedRoles: ['user', 'admin', 'manager'] // Cualquier usuario autenticado
        }
    },

    // --- RUTA SOLO PARA ADMIN ---
    {
        path: 'admin',
        component: AdminMembershipComponent,
        canActivate: [AuthGuard],
        data: {
            breadcrumb: 'Administrar Planes',
            expectedRoles: ['admin']
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MembershipsRoutingModule { }
