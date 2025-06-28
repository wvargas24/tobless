import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminResourceTypeComponent } from './components/admin-resource-type/admin-resource-type.component';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
const routes: Routes = [
    {
        path: '',
        component: AdminResourceTypeComponent,
        canActivate: [AuthGuard],
        data: {
            breadcrumb: 'Administrar Tipos de Recursos', // Opcional, para el breadcrumb
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourcetypesRoutingModule { }
