import { Component, OnInit } from '@angular/core';
import { Membership, MembershipService } from '../../services/membership.service';

@Component({
    selector: 'app-membership-list',
    templateUrl: './membership-list.component.html',
    styleUrls: ['./membership-list.component.scss']
})
export class MembershipListComponent implements OnInit {

    memberships: Membership[] = [];

    constructor(private membershipService: MembershipService) { }

    ngOnInit(): void {
        this.membershipService.getMemberships().subscribe({
            next: (data) => {
                this.memberships = data;
                console.log('Membresías cargadas:', this.memberships);
            },
            error: (err) => {
                console.error('Error al cargar las membresías:', err);
                // Aquí podrías usar el MessageService de PrimeNG para mostrar un toast de error
            }
        });
    }
}
