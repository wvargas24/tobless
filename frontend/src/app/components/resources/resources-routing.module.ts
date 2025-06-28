import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminResourceComponent } from './components/admin-resource/admin-resource.component';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: AdminResourceComponent,
        canActivate: [AuthGuard],
        data: {
            breadcrumb: 'Administrar Recursos', // Opcional, para el breadcrumb
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourcesRoutingModule { }
