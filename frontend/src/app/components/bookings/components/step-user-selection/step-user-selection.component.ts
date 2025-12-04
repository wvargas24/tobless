import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from 'src/app/components/profile/services/user.service';

@Component({
    selector: 'app-step-user-selection',
    templateUrl: './step-user-selection.component.html'
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

