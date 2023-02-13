import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {AppInjector} from "../utils/app.injector";
import {RoleService} from "../session/role.service";

@Injectable({
  providedIn: 'root'
})
export class AppAuthGuard extends KeycloakAuthGuard implements CanActivate {

  constructor(protected override router: Router,
              protected override keycloakAngular: KeycloakService) {
    super(router, keycloakAngular);
  }

  async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>{
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloakAngular.login({
        redirectUri: window.location.origin + state.url
      });
    }

    const roleService = AppInjector.getInjector().get<RoleService>(RoleService);
    roleService.setUserRoles(this.roles.filter(r => r === r.toUpperCase()));

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    if(requiredRoles.some((role) => roleService.getUserRoles().includes(role.role))) {
      return true;
    }

    this.router.navigate([`/access-denied`]).then(r => {
      if (!environment.production) {
        console.log('Navigated to access denied page.');
      }
    });
    return false;
  }
}
