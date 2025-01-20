import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({"projectId":"beat-app-92d36","appId":"1:183586841467:web:7a771074e46d9ea5b493de","storageBucket":"beat-app-92d36.firebasestorage.app","apiKey":"AIzaSyC0kkjYrDIhEYEPMNFPHR2hKv5UNxRbVGU","authDomain":"beat-app-92d36.firebaseapp.com","messagingSenderId":"183586841467","measurementId":"G-YY6SJ6RGL4"})),
    provideFirestore(() => getFirestore())]
};
