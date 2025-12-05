import { Component, OnInit } from '@angular/core';
import { MembershipService } from '../../services/membership.service';

export interface ResourceUsage {
    resourceType: {
        _id: string;
        name: string;
    };
    limit: number;
    used: number;
    available: number | string;
    percentage: number;
    isUnlimited: boolean;
}

export interface MyMembershipData {
    membership: {
        _id: string;
        name: string;
        description: string;
        price: number;
        duration: number;
        amenities: string[];
        resourceLimits: any[];
    };
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    startDate: string;
    endDate: string;
    usage: ResourceUsage[];
    hasMembership: boolean;
}

@Component({
    selector: 'app-my-membership',
    templateUrl: './my-membership.component.html',
    styleUrls: ['./my-membership.component.scss']
})
export class MyMembershipComponent implements OnInit {

    membershipData: MyMembershipData | null = null;
    loading: boolean = true;
    hasMembership: boolean = false;

    constructor(private membershipService: MembershipService) { }

    ngOnInit(): void {
        this.loadMyMembership();
    }

    loadMyMembership(): void {
        this.loading = true;
        this.membershipService.getMyMembership().subscribe({
            next: (data) => {
                this.membershipData = data;
                this.hasMembership = data.hasMembership;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading membership:', err);
                this.hasMembership = false;
                this.loading = false;
            }
        });
    }

    getStatusSeverity(status: string): "success" | "warning" | "danger" | "info" {
        switch (status) {
            case 'active': return 'success';
            case 'pending': return 'warning';
            case 'expired': return 'danger';
            case 'cancelled': return 'danger';
            default: return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'active': return 'Activa';
            case 'pending': return 'Pendiente';
            case 'expired': return 'Expirada';
            case 'cancelled': return 'Cancelada';
            default: return 'Desconocido';
        }
    }

    getProgressBarClass(percentage: number): string {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 70) return 'bg-orange-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    }

    getUsageIcon(percentage: number): string {
        if (percentage >= 90) return 'pi-exclamation-triangle';
        if (percentage >= 70) return 'pi-info-circle';
        return 'pi-check-circle';
    }

    getUsageIconColor(percentage: number): string {
        if (percentage >= 90) return 'text-red-500';
        if (percentage >= 70) return 'text-orange-500';
        return 'text-green-500';
    }

    getDaysRemaining(): number | null {
        if (!this.membershipData?.endDate) return null;
        const end = new Date(this.membershipData.endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    getCurrentMonth(): string {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const now = new Date();
        return `${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    // Helper function to check for number type in template
    isNumber(value: any): value is number {
        return typeof value === 'number';
    }
}

