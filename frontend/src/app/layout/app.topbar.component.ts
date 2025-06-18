import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('searchinput') searchInput!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    searchActive: boolean = false;

    user: any = {};
    initialsUser: string = '';
    validImage: boolean = true;

    constructor(public layoutService: LayoutService, public el: ElementRef, private router: Router) { }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        const user = localStorage.getItem('user');
        console.log('User from localStorage:', user);
        if (user) {
            this.user.name = user;
            this.user.email = localStorage.getItem('email') || '';
            this.user.image = localStorage.getItem('image') || 'assets/demo/images/avatar/square/avatar-m-1.jpg';
            this.initialsUser = this.generateInitials(this.user.name);
            this.validImage = !!this.user.image; // Verifica si hay una imagen válida
        } else {
            this.user = { name: 'Usuario', image: 'assets/demo/images/avatar/square/avatar-m-1.jpg' };
            this.initialsUser = 'NA';
            this.validImage = false;
        }
    }

    generateInitials(name: string): string {
        if (!name) return 'NA';
        return `${name.charAt(0)}`.toUpperCase();
    }

    logout() {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirigir a la página de login
        this.router.navigate(['/auth/login']);
    }

    imageFailed() {
        this.validImage = false;  // Cambia a mostrar las iniciales
    }

    activateSearch() {
        this.searchActive = true;
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 100);
    }

    deactivateSearch() {
        this.searchActive = false;
    }
    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }
}
