import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResourcesRoutingModule } from './resources-routing.module';
import { AdminResourceComponent } from './components/admin-resource/admin-resource.component';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';

@NgModule({
    declarations: [
        AdminResourceComponent
    ],
    imports: [
        CommonModule,
        ResourcesRoutingModule,
        FormsModule,
        // PrimeNG
        TableModule,
        ToastModule,
        ToolbarModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        InputNumberModule,
        ChipsModule,
        ConfirmDialogModule,
        TagModule,
        ChipModule
    ]
})
export class ResourcesModule { }
