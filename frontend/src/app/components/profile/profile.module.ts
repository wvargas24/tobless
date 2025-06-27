import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';

// Importaciones de PrimeNG que necesitará la página de perfil
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password'; // Para el campo de contraseña
import { TableModule } from 'primeng/table'; // 2. Añadir nuevos módulos
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    declarations: [
        MyProfileComponent,
        UserListComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FormsModule,
        // Módulos de PrimeNG
        CardModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        TabViewModule,
        ToastModule,
        TagModule,
        PasswordModule,
        TableModule,
        ToolbarModule,
        DialogModule,
        DropdownModule,
        ConfirmDialogModule,
    ]
})
export class ProfileModule { }
