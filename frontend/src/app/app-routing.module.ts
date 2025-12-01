import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './auth/guards/auth.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    // La ruta raíz ahora verifica autenticación:
    // - Si tiene sesión, va a 'dashboard' (child route)
    // - Si NO tiene sesión, el AuthGuard lo manda a login
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '', component: AppLayoutComponent,
        children: [
            {
                path: 'dashboard',
                data: { breadcrumb: 'Dashboard', expectedRoles: ['admin', 'manager', 'user'] },
                loadChildren: () => import('./demo/components/dashboards/dashboards.module').then(m => m.DashboardsModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'memberships',
                data: { breadcrumb: 'Membresías' },
                loadChildren: () => import('./components/memberships/memberships.module').then(m => m.MembershipsModule)
            },
            {
                path: 'resources',
                data: { breadcrumb: 'Recursos', expectedRoles: ['admin', 'manager'] },
                loadChildren: () => import('./components/resources/resources.module').then(m => m.ResourcesModule),
                canActivate: [AuthGuard],
            },
            {
                path: 'resourcetypes',
                data: { breadcrumb: 'Recursos', expectedRoles: ['admin', 'manager'] },
                loadChildren: () => import('./components/resourcetypes/resourcetypes.module').then(m => m.ResourcetypesModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'bookings',
                data: { breadcrumb: 'Reservas' },
                loadChildren: () => import('./components/bookings/bookings.module').then(m => m.BookingsModule),
                canActivate: [AuthGuard]
            },
            // ---------------------------------------------
            { path: 'uikit', data: { breadcrumb: 'UI Kit', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule), canActivate: [AuthGuard] },
            { path: 'utilities', data: { breadcrumb: 'Utilities', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule), canActivate: [AuthGuard] },
            { path: 'pages', data: { breadcrumb: 'Pages', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
            {
                path: 'profile',
                data: { breadcrumb: 'Usuarios' }, // Changed from 'Mi Perfil' to 'Usuarios'
                loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule),
                canActivate: [AuthGuard]
            },
            { path: 'documentation', data: { breadcrumb: 'Documentation', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule), canActivate: [AuthGuard] },
            { path: 'blocks', data: { breadcrumb: 'Prime Blocks', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule), canActivate: [AuthGuard] },
            { path: 'ecommerce', data: { breadcrumb: 'E-Commerce', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/ecommerce/ecommerce.module').then(m => m.EcommerceModule), canActivate: [AuthGuard] },
            { path: 'apps', data: { breadcrumb: 'Apps', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/apps/apps.module').then(m => m.AppsModule), canActivate: [AuthGuard] }
        ]
    },
    // Mantener acceso público al módulo de Auth
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
    // Landing page opcionalmente movida a otra ruta o eliminada si ya no se usa como home
    {
        path: 'landing',
        loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule)
    },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
