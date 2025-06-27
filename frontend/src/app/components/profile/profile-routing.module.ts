import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { UserListComponent } from './components/user-list/user-list.component'; // 1. Importar
import { AuthGuard } from 'src/app/auth/guards/auth.guard';

const routes: Routes = [
    { path: '', component: MyProfileComponent },
    {
        path: 'list',
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['admin', 'manager'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
