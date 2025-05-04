import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { AuthGuard } from './core/auth/services/auth-guard.service';
import { loggingInterceptor, urlInterceptor } from './core/interceptors/api.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,),
    provideHttpClient(
      withInterceptors([loggingInterceptor, tokenInterceptor, urlInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    AuthGuard
  ],

};
