import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // <-- 1. IMPORTAR BROWSERMODULE
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- 2. IMPORTAR BROWSERANIMATIONSMODULE
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/guards/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule, // <-- 3. AÑADIR AQUÍ
        BrowserAnimationsModule, // <-- 4. AÑADIR AQUÍ
        AppRoutingModule,
        AppLayoutModule,
        HttpClientModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
