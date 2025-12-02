import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResourcetypesRoutingModule } from './resourcetypes-routing.module';
import { AdminResourceTypeComponent } from './components/admin-resource-type/admin-resource-type.component';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    declarations: [
        AdminResourceTypeComponent
    ],
    imports: [
        CommonModule,
        ResourcetypesRoutingModule,
        FormsModule,
        // PrimeNG
        TableModule,
        ToastModule,
        ToolbarModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        ConfirmDialogModule,
    ]
})
export class ResourcetypesModule { }
