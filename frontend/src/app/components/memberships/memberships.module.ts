import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MembershipsRoutingModule } from './memberships-routing.module';
import { MembershipListComponent } from './components/membership-list/membership-list.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { AdminMembershipComponent } from './components/admin-membership/admin-membership.component'; // <-- 1. Importar

// Importaciones de PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table'; // <-- 2. Añadir nuevos módulos
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
    declarations: [
        MembershipListComponent,
        OnboardingComponent,
        AdminMembershipComponent // <-- 1. Declarar
    ],
    imports: [
        CommonModule,
        MembershipsRoutingModule,
        FormsModule,
        // Módulos de PrimeNG
        CardModule,
        ButtonModule,
        DataViewModule,
        InputTextModule,
        PasswordModule,
        DropdownModule,
        ToastModule,
        TableModule, // <-- 3. Añadir a la lista de imports
        ToolbarModule,
        DialogModule,
        InputNumberModule,
        ConfirmDialogModule,
        InputTextareaModule
    ]
})
export class MembershipsModule { }
