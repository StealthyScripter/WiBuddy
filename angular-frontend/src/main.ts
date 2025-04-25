import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import routeConfig from './app/app.routes';
import { appProviders } from './app/providers';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers:[

  provideRouter(routeConfig),
  ...appProviders,
  ...(appConfig.providers || [])
]
}).catch((err) => console.error(err));
