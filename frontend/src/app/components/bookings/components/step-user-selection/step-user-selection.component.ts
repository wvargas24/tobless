import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from 'src/app/components/profile/services/user.service';

@Component({
    selector: 'app-step-user-selection',
    template: `
        <div class="card">
            <h5>Seleccionar Usuario (Opcional)</h5>
            <p class="text-secondary">Si estás realizando esta reserva para otra persona, selecciónala aquí. Si es para ti, puedes omitir este paso.</p>
            
            <div class="field p-fluid">
                <label for="user">Buscar Usuario</label>
                <p-dropdown [options]="users" [(ngModel)]="selectedUser" optionLabel="name" [filter]="true" filterBy="name,email" 
                            [showClear]="true" placeholder="Selecciona un usuario" (onChange)="onUserSelect()">
                    <ng-template let-user pTemplate="item">
                        <div class="flex align-items-center">
                            <i class="pi pi-user mr-2"></i>
                            <div class="flex flex-column">
                                <span class="font-bold">{{user.name}}</span>
                                <span class="text-sm text-500">{{user.email}}</span>
                            </div>
                        </div>
                    </ng-template>
                </p-dropdown>
            </div>
        </div>
    `
})
export class StepUserSelectionComponent implements OnInit {

    users: User[] = [];
    selectedUser: User | null = null;

    @Output() userSelected = new EventEmitter<User | null>();

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        // Cargamos solo los clientes ('user') aunque podríamos cargar todos
        this.userService.getUsers('customer').subscribe(data => {
            this.users = data;
        });
    }

    onUserSelect(): void {
        this.userSelected.emit(this.selectedUser);
    }
}

