import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideApollo } from 'apollo-angular';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { HttpLink, InMemoryCache } from '@apollo/client/core';
import { environment } from '../environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = new HttpLink({
        uri: environment.takeshapeGraphqlEndpoint,
        headers: {
          Authorization: `Bearer ${environment.takeshapeApiKey}`,
        },
      });
      return {
        link: httpLink,
        cache: new InMemoryCache(),
      };
    }),
  ],
};
