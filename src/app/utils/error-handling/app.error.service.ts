import {environment} from '../../../environments/environment';
import {ErrorContextInfo} from './error.context.info';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppInjector} from "../app.injector";
import {MessageData, MessageHub} from "../../data-buses/message.hub";

@Injectable({
  providedIn: 'root'
})
export class AppErrorService {
  private readonly errorServiceBaseUrl = environment.api.clientErrorLoggerEndpoint;
  private httpClient: HttpClient | undefined;
  private messageHub: MessageHub | undefined;

  constructor() {
  }

  private lazyInit() {
    if (!this.httpClient) {
      const appInjector = AppInjector.getInjector();
      this.httpClient = appInjector.get<HttpClient>(HttpClient);
      this.messageHub = new MessageHub();
      this.messageHub.subscribeDirectMessages(MessageHub.MESSAGE_ERROR_LOGGING);

      // @ts-ignore
      this.messageHub.directMessageObserver.subscribe((messageData: MessageData<any>) => {
        switch (messageData.groupId) {
          case MessageHub.MESSAGE_ERROR_LOGGING:
            this.log(messageData.data);
            break;
        }
      });
    }
  }

  log(error: any){
    this.lazyInit();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const errorContextInfo = ErrorContextInfo.get(error);
    this.httpClient?.post<any>(this.errorServiceBaseUrl + '/log', errorContextInfo, httpOptions).subscribe();
  }
}
