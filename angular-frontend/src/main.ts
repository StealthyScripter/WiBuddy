import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import routeConfig from './app/app.routes';
import { appProviders } from './app/providers';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers:[
    provideHttpClient(),
    provideRouter(routeConfig),
    ...appProviders,
    ...(appConfig.providers || []),
  ]
}).catch((err: Error) => console.error(err));
