import {InjectableRxStompConfig} from '@stomp/ng2-stompjs';
import {environment} from "../environments/environment";
import {AppInjector} from "./utils/app.injector";
import {UserService} from "./session/user.service";

export const RxStompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: environment.websocket_url,

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 200,

  beforeConnect: (rxStomp): Promise<void> => {
      return injectAuthorizationHeader(rxStomp);
  }
};

const injectAuthorizationHeader = (rxStomp: any) => {
  return new Promise<void>(async (resolve, _) => {
    const appInjector = AppInjector.getInjector();
    const userService = appInjector.get<UserService>(UserService);

    rxStomp.stompClient.connectHeaders = {
      'Authorization': 'Bearer ' + userService.getAccessToken()
    };

    resolve();
  });
};
