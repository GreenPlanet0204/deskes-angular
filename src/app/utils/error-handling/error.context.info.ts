import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {AppInjector} from "../app.injector";
import * as StackTraceParser from 'error-stack-parser';
import {UserService} from "../../session/user.service";

export class ErrorContextInfo {
  id: string | undefined;
  appId: string | undefined;
  name: string | undefined;
  user: string | undefined;
  userFullName: string | undefined;
  time: number | undefined;
  url: string | undefined;
  status: string | undefined;
  message: string | undefined;
  stackTrace: StackTraceParser.StackFrame[] | undefined;
  fatal: boolean | undefined;

  static get(error: any): any {
    const userDetails = AppInjector.getInjector().get<UserService>(UserService).getUserDetails();
    const location = AppInjector.getInjector().get<LocationStrategy>(LocationStrategy);
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    const name = error.name || null;
    const user = userDetails?.username;
    const userFullName = `${userDetails?.firstName} ${userDetails?.lastName}`;
    const time = new Date().getTime();
    const appId = 'JHCS';
    const id = `${appId}-${user}-${time}`;
    const status = error.status || null;
    const message = error.message || error.toString();
    const stackTrace = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
    const fatal = error.statusCode >= 500;

    return {
      id,
      appId,
      name,
      user,
      userFullName,
      time,
      url,
      status,
      message,
      stackTrace,
      fatal
    };
  }
}
