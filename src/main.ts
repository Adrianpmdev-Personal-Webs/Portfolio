/**
 * main
 *
 * Application entry point: bootstraps the standalone App with appConfig.
 *
 * @author adrianpmdev
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
