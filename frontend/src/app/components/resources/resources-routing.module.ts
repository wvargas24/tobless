import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminResourceComponent } from './components/admin-resource/admin-resource.component';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';

const routes: Routes = [
    {
        path: 'admin',
        component: AdminResourceComponent,
        canActivate: [AuthGuard],
    },
    // Si no se especifica 'admin', redirigimos ahí por defecto
    { path: '', redirectTo: 'admin', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourcesRoutingModule { }
