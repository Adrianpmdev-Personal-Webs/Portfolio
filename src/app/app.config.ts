import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';

/**
 * Configuración raíz de la aplicación standalone: enrutado (con fundido
 * cruzado nativo vía View Transitions API), HTTP con el interceptor de
 * errores y el servicio de traducción (ngx-translate, con los JSON de
 * `assets/i18n/` como fuente).
 *
 * @author adrianpmdev
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideTranslateService({
      fallbackLang: 'es',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
