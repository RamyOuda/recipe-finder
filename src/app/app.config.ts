import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/cache';
import { provideStore } from '@ngrx/store';
import { provideApollo } from 'apollo-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideStore(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideApollo(() => ({
      cache: new InMemoryCache(),
      uri: '/graphql',
    })),
  ],
};
