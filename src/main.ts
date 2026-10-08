/**
 * Punto de entrada de la aplicación: arranca Angular en modo standalone
 * con la configuración definida en {@link appConfig}.
 *
 * @author adrianpmdev
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
