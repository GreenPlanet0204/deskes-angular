import {Injectable} from '@angular/core';
import {KeycloakEventType, KeycloakService} from 'keycloak-angular';
import {AppInjector} from "../utils/app.injector";
import {CommonUtils} from "../utils/common.utils";
import {environment} from "../../environments/environment";
import {MessageHub} from "../data-buses/message.hub";
import Keycloak, {KeycloakProfile} from "keycloak-js";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalStorageService} from "../session/storage/local-storage.service";
import {LocalStorageKeys} from "../session/storage/local-storage-keys";
import {RoleService} from "../session/role.service";

@Injectable({
  providedIn: 'root',
  deps: [RoleService]
})
export class AuthService {
  private keycloakService: KeycloakService;
  private readonly messageHub: MessageHub = new MessageHub();
  private loggingOut = false;

  private userDetails: KeycloakProfile | undefined;
  private userRoles: string[] | undefined;
  private accessToken: string | undefined;

  constructor(private localStorageService: LocalStorageService) {
    const appInjector = AppInjector.getInjector();
    this.keycloakService = appInjector.get<KeycloakService>(KeycloakService);
    this.keycloakService.keycloakEvents$.subscribe(async event => {
      switch (event.type) {
        case KeycloakEventType.OnTokenExpired:
          if (!environment.production) {
            console.log("Access token expired.");
          }
          this.updateToken();
          break;
        case KeycloakEventType.OnAuthError:
          throw new Error("Session could not be established.");
          break;
        case KeycloakEventType.OnAuthLogout:
          if (!environment.production) {
            console.log("User logged out.");
          }
          break;
        case KeycloakEventType.OnAuthRefreshError:
          throw new Error("Session could not be automatically renewed.");
          break;
        case KeycloakEventType.OnAuthSuccess:
          if (!environment.production) {
            console.log("User logged in.");
          }
          await this.logIn();
          this.messageHub.postMessage(null, MessageHub.MESSAGE_USER_LOGIN);
          break;
        case KeycloakEventType.OnAuthRefreshSuccess:
          if (!environment.production) {
            console.log("Access token refreshed.");
          }
          await this.loadUserData();
          break;
        case KeycloakEventType.OnReady:
          this.messageHub.postMessage(null, MessageHub.MESSAGE_AUTH_SERVICE_READY);
          break;
      }
    });
  }

  async loadUserData() {
    this.userDetails = await this.keycloakService.loadUserProfile();

    // @ts-ignore
    const realmAccess = this.keycloakService.getKeycloakInstance().tokenParsed.realm_access;
    // @ts-ignore
    let realmRoles = realmAccess.roles;

    // @ts-ignore
    const resourceAccess = this.keycloakService.getKeycloakInstance().tokenParsed.resource_access;
    // @ts-ignore
    this.userRoles = resourceAccess[environment.keycloakConfig.clientId].roles.concat(realmRoles);

    // @ts-ignore
    this.accessToken = await this.keycloakService.getToken();

    // Set the user roles for the roles service.
    const appInjector = AppInjector.getInjector();
    const roleService = appInjector.get<RoleService>(RoleService);
    roleService.setUserRoles(this.userRoles.filter(role => role === role.toUpperCase()));

    console.log('User roles found: ' + roleService.getUserRoles());
  }

  private async logIn(): Promise<void> {
    let isGloballyLoggedIn = await this.keycloakService.isLoggedIn();
    if (!isGloballyLoggedIn) {
      await this.redirectToLogOutPage();
      return;
    }

    /*
     * Check if the session has been established before and we only need to record the login event once
     */
    let userSession = this.localStorageService.getItem(LocalStorageKeys.USER_SESSION_KEY);

    // Only send the login event to the server once for the multiple tab session.
    if (!userSession['isAuthenticated']) {
      if (!environment.production) {
        console.log('Sent login event to the server.');
      }

      // @ts-ignore
      userSession['isAuthenticated'] = true;
      this.localStorageService.saveItem(LocalStorageKeys.USER_SESSION_KEY, userSession);

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
      };
      const httpClient = AppInjector.getInjector().get<HttpClient>(HttpClient);
      let url = environment.api.securityEndpoint + '/login';
      httpClient.post<any>(url, {}, httpOptions).subscribe();
    }
  }

  logOut(redirectUrl?: string): Promise<void> {
    // Send the logout event to the server
    if (!environment.production) {
      console.log('Send logout event to the server.');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    const httpClient = AppInjector.getInjector().get<HttpClient>(HttpClient);
    let url = environment.api.securityEndpoint + '/logout';
    httpClient.post<any>(url, {}, httpOptions).subscribe();

    // Clear all the session data in the local storage
    this.localStorageService.removeAllItems();

    // Remove all authentication data
    delete this.userDetails;
    delete this.userRoles;
    delete this.accessToken;

    // Broadcast the logout event to other components
    this.messageHub.postMessage(null, MessageHub.MESSAGE_USER_LOGOUT);

    // Globally logout the application
    return CommonUtils.delay(500).then(() => {
      this.loggingOut = true;
      return this.redirectToLogOutPage();
    });
  }

  redirectToLogOutPage(redirectUrl?: string): Promise<void> {
    let url = redirectUrl ? redirectUrl : (environment.defaultLogoutUrl ? environment.defaultLogoutUrl : undefined);
    if (!url?.startsWith(window.origin)) {
      url = window.origin + url;
    }
    return this.keycloakService.logout(url);
  }

  getAccountLink(): string {
    // @ts-ignore
    const url = environment.keycloakConfig.url;
    // @ts-ignore
    const realm = environment.keycloakConfig.realm;

    return `${url}/realms/${realm}/account`;
  }

  get getUserDetails(): Keycloak.KeycloakProfile | undefined {
    return this.userDetails;
  }

  get getUserRoles(): string[] | undefined {
    return this.userRoles;
  }

  get getAccessToken(): string | undefined {
    return this.accessToken;
  }

  private updateToken() {
    this.keycloakService.updateToken(20);
  }
}
