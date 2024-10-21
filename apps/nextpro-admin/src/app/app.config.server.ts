import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';

const config: ApplicationConfig = {
    providers: [provideClientHydration(), provideServerRendering()],
};

export const serverConfig = mergeApplicationConfig(appConfig, config);
