import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {AppInjector} from "../utils/app.injector";
import {MessageData, MessageHub} from "../data-buses/message.hub";
import {DialogService} from "../utils/ui/dialog.service";
import {UserService} from "./user.service";
import {SpinnerService} from "../utils/ui/spinner.service";
import {LocalStorageKeys} from "./storage/local-storage-keys";

@Injectable({
  providedIn: 'root',
  deps: [Idle, UserService]
})
export class SessionService {
  private lastPingTimeStamp?: Date | undefined;
  private readonly PING_INTERVAL_IN_SECONDS = environment.session.pingIntervalInSeconds;
  private readonly IDLE_TIME_IN_SECONDS = environment.session.idleTimeInSeconds;
  private readonly TIMEOUT_IN_SECONDS = environment.session.timeoutInSeconds;
  private readonly securityServiceBaseUrl = environment.api.securityEndpoint;

  private readonly idle: Idle;
  private readonly keepalive: Keepalive;
  private userService: UserService;
  private messageHub: MessageHub;
  private httpClient: HttpClient;
  private dialogService: DialogService;
  private spinnerService: SpinnerService;

  constructor() {
    const appInjector = AppInjector.getInjector();
    this.idle = appInjector.get<Idle>(Idle);
    this.keepalive = appInjector.get<Keepalive>(Keepalive);
    this.userService = appInjector.get<UserService>(UserService);
    this.httpClient = appInjector.get<HttpClient>(HttpClient);
    this.dialogService = appInjector.get<DialogService>(DialogService);
    this.spinnerService = appInjector.get<SpinnerService>(SpinnerService);

    this.messageHub = new MessageHub();
    this.messageHub.subscribeDirectMessages<void>(MessageHub.MESSAGE_AUTH_SERVICE_READY);
    this.messageHub.subscribeDirectMessages<void>(MessageHub.MESSAGE_USER_LOGIN);
    this.messageHub.subscribeDirectMessages<void>(MessageHub.MESSAGE_RESET_IDLE_STATUS);
    this.messageHub.subscribeDirectMessages<void>(MessageHub.MESSAGE_KEEP_ALIVE);
    this.messageHub.subscribeDirectMessages<void>(MessageHub.MESSAGE_SHOW_IDLE_DIALOG);
    this.messageHub.subscribeDirectMessages<void>(MessageHub.MESSAGE_HIDE_IDLE_DIALOG);

    this.handleAuthServiceStartup();

    // @ts-ignore
    this.messageHub.directMessageObserver.subscribe((messageData: MessageData<any>) => {
      switch (messageData.groupId) {
        case MessageHub.MESSAGE_AUTH_SERVICE_READY:
          this.handleAuthServiceReady();
          break;
        case MessageHub.MESSAGE_USER_LOGIN:
          this.handleUserLoginEvent();
          break;
        case MessageHub.MESSAGE_RESET_IDLE_STATUS:
          this.reset();
          break;
        case MessageHub.MESSAGE_KEEP_ALIVE:
          this.handleKeepAliveEvent(messageData.data);
          break;
        case MessageHub.MESSAGE_SHOW_IDLE_DIALOG:
          this.handleShowIdleDialog(messageData.data);
          break;
        case MessageHub.MESSAGE_HIDE_IDLE_DIALOG:
          this.handleHideIdleDialog(messageData.data);
          break;
      }
    });

    /**
     * Multiple tab session management here
     */
    // Wake up if other tabs are active while this tab is idling.
    this.userService.getUserSessionDataChangeEvent().subscribe(key => {
      if (key === LocalStorageKeys.LAST_PING_TIME_KEY) {
        if (!environment.production) {
          console.log('User activity has been detected in another tab.');
        }
        this.handleUserInterruptionEvent();
      }
    });
  }

  private handleUserLoginEvent(): void {
    this.idle.setIdle(this.IDLE_TIME_IN_SECONDS);
    this.idle.setTimeout(this.TIMEOUT_IN_SECONDS);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.setKeepaliveEnabled(false);

    this.idle.onIdleEnd.subscribe(() => {
      this.ping();
    });

    // Additional user interruption sources to the default interruption sources
    document.addEventListener('mousemove', this.handleUserInterruptionEvent.bind(this));
    document.addEventListener('keydown', this.handleUserInterruptionEvent.bind(this));

    this.idle.onInterrupt.subscribe(() => {
      this.ping();
    });

    this.idle.onTimeout.subscribe(() => {
      this.messageHub.postMessage(null, MessageHub.MESSAGE_USER_LOGOUT);
      this.userService.logOut();
    });
    this.idle.onIdleStart.subscribe(() => {
      this.keepalive.stop();

      this.messageHub.postMessage(this.idle.onTimeoutWarning, MessageHub.MESSAGE_SHOW_IDLE_DIALOG);
    });

    this.keepalive.interval(this.PING_INTERVAL_IN_SECONDS);
    this.keepalive.request(this.securityServiceBaseUrl + '/keepAlive');
    this.keepalive.onPing.subscribe((r) => {
      this.lastPingTimeStamp = new Date();
      this.userService.setLastPingTime(this.lastPingTimeStamp);
      console.log('Keep-alive.');
    });

    this.reset();
  }

  private handleUserInterruptionEvent(): void {
    // Check authentication status
    if (!this.userService.isAuthenticated()) {
      this.userService.logOut();
    }

    if (this.idle) {
      this.idle.interrupt(true);
      this.messageHub.postMessage(null, MessageHub.MESSAGE_HIDE_IDLE_DIALOG);
    }
  }

  private handleKeepAliveEvent(keepAlive: boolean): void {
    this.keepAlive(keepAlive);
  }

  private ping(): void {
    if (this.keepalive.isRunning()) {
      return;
    }

    if (!this.lastPingTimeStamp) {
      if (this.keepalive) {
        this.keepalive.ping();
      }
    } else {
      const now = new Date();
      if (now.getTime() - this.lastPingTimeStamp.getTime() > this.PING_INTERVAL_IN_SECONDS * 1000) {
        this.keepalive.ping();
      }
    }
  }

  private reset(): void {
    if (this.idle) {
      this.idle.watch();
      this.lastPingTimeStamp = new Date();
    }
  }

  private keepAlive(flag: boolean = true): void {
    if (flag) {
      this.keepalive.start();
      this.idle.stop();
    } else {
      this.keepalive.stop();
      this.idle.watch();
    }
  }

  private handleShowIdleDialog(idleTimer: EventEmitter<number>): void {
    this.dialogService.showSessionDialog(idleTimer).subscribe(result => {
      if (result && result.action !== 'reset') {
        console.log('Session expired.');
        this.userService.logOut();
      } else {
        this.messageHub.postMessage(null, MessageHub.MESSAGE_RESET_IDLE_STATUS);
        console.log('Session restored.');
      }
    });
  }

  private handleHideIdleDialog(messageData: any): void {
    this.dialogService.hideSessionDialog();
  }

  private handleAuthServiceReady() {
    this.spinnerService.hideSpinner();
  }

  private handleAuthServiceStartup() {
    this.spinnerService.showSpinner("Application is loading.  Please wait...");
  }
}
