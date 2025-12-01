import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats } from '../service/dashboard.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';

@Component({
    templateUrl: './ecommerce.dashboard.component.html',
})
export class EcommerceDashboardComponent implements OnInit {

    stats: DashboardStats | null = null;
    currentUser: User | null = null;
    loading: boolean = true;

    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.currentUserValue;
        this.loadStats();
    }

    loadStats() {
        this.loading = true;
        this.dashboardService.getStats().subscribe({
            next: (data: DashboardStats) => { // Explicit type for data
                this.stats = data;
                this.loading = false;
            },
            error: (err: any) => { // Explicit type for err
                console.error('Error fetching dashboard stats', err);
                this.loading = false;
            }
        });
    }

    isAdminOrManager(): boolean {
        return this.currentUser ? ['admin', 'manager'].includes(this.currentUser.role) : false;
    }
}
