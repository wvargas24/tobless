import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserCreateComponent } from './components/user-create/user-create.component'; // <-- 1. IMPORTAR el nuevo componente
import { AuthGuard } from '../../auth/guards/auth.guard';

const routes: Routes = [
    // La ruta para el perfil del propio usuario
    { path: '', component: MyProfileComponent },

    // La ruta para que el admin/manager vea la lista de usuarios
    {
        path: 'list',
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['admin', 'manager'] }
    },

    // La ruta para que el admin acceda al formulario de creación
    {
        path: 'create',
        component: UserCreateComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['admin'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
