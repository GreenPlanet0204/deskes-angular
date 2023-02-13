import {Injectable} from "@angular/core";
import {LocalStorageService} from "./storage/local-storage.service";
import {AuthService} from "../auth/auth.service";
import {environment} from "../../environments/environment";
import {LocalStorageKeys} from "./storage/local-storage-keys";

@Injectable({
  providedIn: 'root',
  deps: [AuthService]
})
export class UserService {
  constructor(private localStorageService: LocalStorageService,
              private authService: AuthService) {
  }

  getUserSessionDataChangeEvent() {
    return this.localStorageService.userSessionDataChangeEvent$;
  }

  isAuthenticated(): boolean {
    if (environment.local) {
      return true;
    }

    let userSession = this.localStorageService.getItem(LocalStorageKeys.USER_SESSION_KEY);
    return userSession['isAuthenticated'];
  }

  getUserDetails(): any {
      if (!this.isAuthenticated()) {
        return null;
      }

      return this.authService.getUserDetails;
  }

  getUserRoles(): any {
    if (!this.isAuthenticated()) {
      return null;
    }

    return this.authService.getUserRoles;
  }

  getAccessToken(): any {
    if (!this.isAuthenticated()) {
      this.logOut();
    } else {
      return <string>this.authService.getAccessToken;
    }
  }

  getUserFullName(firstLastOrder: boolean = true): string {
    let userDetails = this.getUserDetails();

    if (!userDetails) {
      return 'Anonymous User';
    }

    if (firstLastOrder) {
      return userDetails.firstName + ' ' + userDetails.lastName;
    } else {
      return userDetails.lastName + ', ' + userDetails.firstName;
    }
  }

  async logOut() {
    if (!this.isAuthenticated()) {
      await this.authService.redirectToLogOutPage();
    } else {
      await this.authService.logOut();
    }
  }

  manageUserAccount() {
    let link = this.authService.getAccountLink();
    window.open(link, '_blank');
  }

  // Idle and KeepAlive
  getLastPingTime(): Date {
    return this.localStorageService.getItem(LocalStorageKeys.LAST_PING_TIME_KEY);
  }

  setLastPingTime(lastPingTime: Date): void {
    this.localStorageService.saveItem(LocalStorageKeys.LAST_PING_TIME_KEY, lastPingTime);
  }

  getUsername() {
    return this.authService.getUserDetails?.username;
  }
}
