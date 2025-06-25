import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './auth/guards/auth.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule)
    },
    {
        path: '', component: AppLayoutComponent,
        children: [
            {
                path: 'dashboard',
                data: { breadcrumb: 'Dashboard', expectedRoles: ['admin', 'manager'] },
                loadChildren: () => import('./demo/components/dashboards/dashboards.module').then(m => m.DashboardsModule),
                canActivate: [AuthGuard]
            },
            // --- INICIO DE LA CORRECCIÓN ---
            // Movemos la ruta de memberships aquí dentro
            {
                path: 'memberships',
                data: { breadcrumb: 'Membresías' }, // <-- Le añadimos un breadcrumb
                loadChildren: () => import('./components/memberships/memberships.module').then(m => m.MembershipsModule)
                // Nota: No ponemos AuthGuard aquí para que la lista sea pública,
                // pero las rutas *dentro* de memberships (como 'onboarding') sí lo tienen.
            },
            // --- FIN DE LA CORRECCIÓN ---
            { path: 'uikit', data: { breadcrumb: 'UI Kit', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule), canActivate: [AuthGuard] },
            { path: 'utilities', data: { breadcrumb: 'Utilities', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule), canActivate: [AuthGuard] },
            { path: 'pages', data: { breadcrumb: 'Pages', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
            { path: 'profile', data: { breadcrumb: 'User Management', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
            { path: 'documentation', data: { breadcrumb: 'Documentation', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule), canActivate: [AuthGuard] },
            { path: 'blocks', data: { breadcrumb: 'Prime Blocks', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule), canActivate: [AuthGuard] },
            { path: 'ecommerce', data: { breadcrumb: 'E-Commerce', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/ecommerce/ecommerce.module').then(m => m.EcommerceModule), canActivate: [AuthGuard] },
            { path: 'apps', data: { breadcrumb: 'Apps', expectedRoles: ['admin', 'manager', 'receptionist'] }, loadChildren: () => import('./demo/components/apps/apps.module').then(m => m.AppsModule), canActivate: [AuthGuard] }
        ]
    },
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    // La ruta de 'memberships' ya no está aquí
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
