import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, retryWhen} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AppErrorHandler} from "./error-handling/app.error.handler";
import {AppInjector} from "./app.injector";
import {environment} from "../../environments/environment";
import {genericRetryStrategy} from './error-handling/generic.retry.strategy';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.toLocaleLowerCase().startsWith("http")) {
      req = req.clone({url: environment.api_url + req.url});
    }

    // @ts-ignore
    return next.handle(req)
      .pipe(
        retryWhen(genericRetryStrategy({
          requestMethod: req.method,
          excludedStatusCodes: [500]
        })),
        catchError(this.handleError.bind(this))
      );
  }

  handleError(error: HttpErrorResponse): any {
    const appInjector = AppInjector.getInjector();
    const errorHandler = appInjector.get<AppErrorHandler>(AppErrorHandler);
    errorHandler.handleHttpErrorResponse(error).then(() => {
      console.log("Handled the HTTP response error.");
    });
  }
}
