import {ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, ErrorHandler, Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FullySharedComponent} from './components/fully-shared/fully-shared.component';
import {AppRoutingModule} from "./app-routing.module";
import {JhcsComponent} from "./components/jhcs/jhcs.component";
import {JhcsModule} from "./components/jhcs/jhcs.module";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {MaterialModule} from './material-components';
import {SidenavService} from './core/services/sidenav.service'
import {LeftMenuComponent} from './components/left-menu/left-menu.component';
import {KeycloakAngularModule, KeycloakBearerInterceptor, KeycloakOptions, KeycloakService} from "keycloak-angular";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {DEFAULT_TIMEOUT, TimeoutInterceptor} from "./utils/timeout.interceptor";
import {environment} from "../environments/environment";
import {HttpInterceptorService} from "./utils/http.interceptor.service";
import {ConfirmDialogComponent} from "./components/dialogs/confirm-dialog/confirm-dialog.component";
import {MessageDialogComponent} from "./components/dialogs/message-dialog/message-dialog.component";
import {DodWarningDialogComponent} from "./components/dialogs/dod-warning-dialog/dod-warning-dialog.component";
import {SessionDialogComponent} from "./components/dialogs/session-dialog/session-dialog.component";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {NgIdleKeepaliveModule} from "@ng-idle/keepalive";
import {AppErrorService} from "./utils/error-handling/app.error.service";
import {SessionService} from "./session/session.service";
import {AppErrorHandler} from "./utils/error-handling/app.error.handler";
import {AppInjector} from "./utils/app.injector";
import {AccessDeniedComponent} from "./components/access-denied/access-denied.component";
import {PartiallySharedComponent} from "./components/partially-shared/partially-shared.component";
import {AuthService} from "./auth/auth.service";

const keycloakService: KeycloakService = new KeycloakService();

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedComponent,
    PartiallySharedComponent,
    FullySharedComponent,
    JhcsComponent,
    DashboardComponent,
    LeftMenuComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    DodWarningDialogComponent,
    SessionDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    KeycloakAngularModule,
    MaterialModule,
    FlexLayoutModule,
    JhcsModule,
    NgxSpinnerModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  entryComponents: [
    FullySharedComponent,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    },
    {
      provide: AppErrorService,
      useValue: new AppErrorService()
    },
    {
      provide: KeycloakService,
      useValue: keycloakService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimeoutInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    },
    {
      provide: DEFAULT_TIMEOUT,
      useValue: environment.api.options.timeout
    },
    {
      provide: SidenavService
    },
    NgxSpinnerService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule implements DoBootstrap {
  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
    injector.get<SessionService>(SessionService);
  }

  async ngDoBootstrap(appRef: ApplicationRef): Promise<void> {
    const {keycloakConfig} = environment;
        
    if (environment.local) {
      return new Promise(resolve => {
        appRef.bootstrap(AppComponent);
        resolve();
      });      
    }

    try {
      const keycloakOptions: KeycloakOptions = {
        config: keycloakConfig,
        initOptions: {
          // onLoad: 'login-required', // DO NOT SET onLoad to login-required to avoid the initial login for all routes
          onLoad: 'check-sso',
          checkLoginIframe: true,
          checkLoginIframeInterval: 1,
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
        },
        enableBearerInterceptor: true,
        loadUserProfileAtStartUp: true,
        bearerExcludedUrls: ['/unprotected']
      };

      await keycloakService.init(keycloakOptions).then(async () => {
        if (!environment.production) {
          console.log('KeyCloak initialization completed!');
        }

        appRef.bootstrap(AppComponent);
      });
    } catch (error) {
      if (environment.production) {
        console.error('Could not load the authentication module.');
        // Show error dialog here
      } else {
        console.error('Keycloak init failed: ' + error);
      }
    }
  }
}
