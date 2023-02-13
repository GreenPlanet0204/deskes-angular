import {Connection, ErrorHandlingEnum, Message, MessageBus} from 'ngx-message-bus';
import {Subject} from 'rxjs';
import {RandomString} from "../utils/random.string";
import {CommonData} from './common.data';
import {AppInjector} from "../utils/app.injector";

export class MessageHub extends CommonData {
  static readonly hubName = 'FileManagerComm';
  static eventTypeId = 1;

  // Login and Logout event
  static readonly MESSAGE_AUTH_SERVICE_READY = `EventType_${MessageHub.eventTypeId++}`;
  static readonly MESSAGE_USER_LOGIN = `EventType_${MessageHub.eventTypeId++}`;
  static readonly MESSAGE_USER_LOGOUT = `EventType_${MessageHub.eventTypeId++}`;
  static readonly MESSAGE_SHOW_IDLE_DIALOG = `EventType_${MessageHub.eventTypeId++}`;
  static readonly MESSAGE_HIDE_IDLE_DIALOG = `EventType_${MessageHub.eventTypeId++}`;
  static readonly MESSAGE_RESET_IDLE_STATUS = `EventType_${MessageHub.eventTypeId++}`;
  static readonly MESSAGE_KEEP_ALIVE = `EventType_${MessageHub.eventTypeId++}`;
  static readonly MESSAGE_ERROR_LOGGING = `EventType_${MessageHub.eventTypeId++}`;

  // @ts-ignore
  readonly hubId: string = RandomString.generate(30);
  private messageBus: MessageBus;
  private subscriptions: any[] = [];
  private readonly hubConnection: Connection;
  private directMessageSubject = new Subject();
  public directMessageObserver = this.directMessageSubject.asObservable();
  private broadcastMessageSubject = new Subject();
  public broadcastMessageObserver = this.broadcastMessageSubject.asObservable();

  constructor() {
    super();
    const appInjector = AppInjector.getInjector();
    this.messageBus = appInjector.get<MessageBus>(MessageBus);
    this.messageBus.setLogLevel(ErrorHandlingEnum.Throw);

    this.hubConnection = this.messageBus.connect(MessageHub.hubName, this.hubId);
    this.hubConnection.onBroadcast((data: any) => {
      this.broadcastMessageSubject.next(data);
    });
  }

  destroy(): void {
    if (this.hubConnection) {
      this.subscriptions.forEach(subscription => {
        this.hubConnection.off(subscription);
      });
      this.hubConnection.offBroadcast();

      this.messageBus.disconnect(this.hubConnection);
    }
  }

  subscribeDirectMessages<T>(groupId: string): void {
    const subscription = {
      groupId, callback: (data: T) => {
        this.directMessageSubject.next(new MessageData<T>(groupId, data));
      }
    };
    this.hubConnection.on(subscription);
    this.subscriptions.push(subscription);
  }

  broadcastMessage<T>(payload: T): void {
    this.hubConnection.broadcast(payload);
  }

  postMessage<T>(payload: T, groupId: string, recipientIds?: string[]): void {
    const message: Message<T> = {
      // @ts-ignore
      recipientIds: recipientIds?.filter(recipientId => recipientId !== this.hubId),
      payload,
      groupId
    };

    this.hubConnection.post(message);
  }

  selfPostMessage<T>(payload: T, groupId: string): void {
    const message: Message<T> = {
      // @ts-ignore
      recipientIds: [this.hubId],
      payload,
      groupId
    };

    this.hubConnection.post(message);
  }
}

export class MessageData<T> {
  constructor(public groupId: string, public data: T) {
  }
}
