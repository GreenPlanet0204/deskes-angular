import {Injectable} from "@angular/core";
import {Role} from "./role";
import {ApplicationRoles} from "./application.roles";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public static readonly ROLE_DESKES_USER: Role = new Role("DESKES_USER", 1);
  public static readonly ROLE_DESKES_APPROVER: Role = new Role("DESKES_APPROVER", 2);
  public static readonly ROLE_DESKES_ADMIN: Role = new Role("DESKES_ADMIN", 1000);
  public static readonly ROLE_DDESB_ADMIN: Role = new Role("DDESB_ADMIN", 10000);

  public static readonly ROLE_JHCS_BASIC: Role = new Role("JHCS_BASIC", 1);
  public static readonly ROLE_JHCS_LOGISTICS: Role = new Role("JHCS_LOGISTICS", 2);
  public static readonly ROLE_JHCS_HC: Role = new Role("JHCS_HC", 3);
  public static readonly ROLE_JHCS_HC_EDIT: Role = new Role("JHCS_HC_EDIT", 4);
  public static readonly ROLE_JHCS_ADMIN: Role = new Role("JHCS_ADMIN", 1000);

  public static readonly ROLE_ESMAM_VIEWER: Role = new Role("ESMAM_VIEWER", 1);
  public static readonly ROLE_ESMAM_POWER_USER: Role = new Role("ESMAM_POWER_USER", 2);
  public static readonly ROLE_ESMAM_ADMIN: Role = new Role("ESMAM_ADMIN", 1000);

  private readonly definedApplicationRoles: ApplicationRoles = {
    deskesRoles: [
      RoleService.ROLE_DESKES_USER,
      RoleService.ROLE_DESKES_APPROVER,
      RoleService.ROLE_DESKES_ADMIN,
      RoleService.ROLE_DDESB_ADMIN
    ],
    jhcsRoles: [
      RoleService.ROLE_JHCS_BASIC,
      RoleService.ROLE_JHCS_LOGISTICS,
      RoleService.ROLE_JHCS_HC,
      RoleService.ROLE_JHCS_HC_EDIT,
      RoleService.ROLE_JHCS_ADMIN
    ],
    esmamRoles: [
      RoleService.ROLE_ESMAM_VIEWER,
      RoleService.ROLE_ESMAM_POWER_USER,
      RoleService.ROLE_ESMAM_ADMIN
    ]
  }

  private userRoles: string[] = [];

  constructor() {
  }

  setUserRoles(userRoles: string[]): void {
    if (this.validateRoles(userRoles, true)) {
      this.userRoles = userRoles;
    }
  }

  getUserRoles(): string[] {
    return this.userRoles;
  }

  hasRole(role: string): boolean {
    return this.validateRole(role) && this.userRoles.some(r => r === role);
  }

  hasAnyUserRole(roles: string[]): boolean {
    return this.validateRoles(roles, true) && this.userRoles.some(r => roles.includes(r));
  }

  isDeskesAdmin(): boolean {
    return this.hasRole('DESKES_ADMIN');
  }

  isJhcsAdmin(): boolean {
    return this.hasRole('JHCS_ADMIN');
  }

  isEsmamAdmin(): boolean {
    return this.hasRole('ESMAM_ADMIN');
  }

  getHighestDeskesRole(): Role | null {
    let roles =  this.userRoles.filter(role => role.startsWith("DESKES"));

    for (let i = this.definedApplicationRoles.deskesRoles.length - 1; i >= 0; i--) {
      let highestRole = this.definedApplicationRoles.deskesRoles[i];
      let foundRole = roles.find(role => role === highestRole.role);

      if (foundRole) {
        return highestRole;
      }
    }

    return null;
  }

  getHighestJhcsRole(): Role | null {
    let roles =  this.userRoles.filter(role => role.startsWith("JHCS"));

    for (let i = this.definedApplicationRoles.jhcsRoles.length - 1; i >= 0; i--) {
      let highestRole = this.definedApplicationRoles.jhcsRoles[i];
      let foundRole = roles.find(role => role === highestRole.role);

      if (foundRole) {
        return highestRole;
      }
    }

    return null;
  }

  getHighestEsmamRole(): Role | null {
    let roles =  this.userRoles.filter(role => role.startsWith("ESMAM"));

    for (let i = this.definedApplicationRoles.esmamRoles.length - 1; i >= 0; i--) {
      let highestRole = this.definedApplicationRoles.esmamRoles[i];
      let foundRole = roles.find(role => role === highestRole.role);

      if (foundRole) {
        return highestRole;
      }
    }

    return null;
  }

  private validateRole(role: string, throwError: boolean = false): boolean {
    return this.validateRoles([role], throwError);
  }

  private validateRoles(roles: string[], logError: boolean = false): boolean {
    let isValid = roles.every(role => {
      return this.hasRoleIn([role], this.definedApplicationRoles.deskesRoles)
            || this.hasRoleIn([role], this.definedApplicationRoles.jhcsRoles)
            || this.hasRoleIn([role], this.definedApplicationRoles.esmamRoles);
    });

    if (!isValid && logError) {
      if (!environment.production) {
        console.log('User roles contain invalid roles. Found roles: ' + roles);
      }
    }

    return isValid;
  }

  private hasRoleIn(roles: string[], definedRoles: Role[]) {
    return roles.every(role => {
      return definedRoles.some(definedRole => definedRole.role === role);
    });
  }
}
