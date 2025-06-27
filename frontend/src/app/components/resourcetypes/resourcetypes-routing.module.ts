import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminResourceTypeComponent } from './components/admin-resource-type/admin-resource-type.component';

const routes: Routes = [
    { path: '', component: AdminResourceTypeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourcetypesRoutingModule { }
