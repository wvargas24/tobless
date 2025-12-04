import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent, data: { breadcrumb: 'Panel Principal' } }
    ])],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }

