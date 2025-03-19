import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import {provideAnimations} from '@angular/platform-browser/animations'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './authentication/auth.interceptor';



export const appConfig: ApplicationConfig = {
  providers: 
  [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
    provideRouter(routes), 
    provideAnimationsAsync(), 
    provideAnimations(), 
    importProvidersFrom(HttpClientModule)
  ]
};
