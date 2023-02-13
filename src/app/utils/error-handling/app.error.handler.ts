import {ErrorHandler, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpErrorResponse} from '@angular/common/http';
import {AppErrorService} from './app.error.service';
import {ErrorContextInfo} from './error.context.info';
import {AppError} from './app.error';
import {AppInjector} from "../app.injector";
import {DialogService} from "../ui/dialog.service";
import {SpinnerService} from "../ui/spinner.service";
import {MessageHub} from "../../data-buses/message.hub";
import {UserService} from "../../session/user.service";

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  private userService: UserService | undefined;
  private spinnerService: SpinnerService | undefined;
  private dialogService: DialogService | undefined;
  private messageHub: MessageHub | undefined;
  private readonly defaultErrorTitle = 'Unexpected Application Error';
  private readonly defaultErrorMessage = 'Something went wrong with the application.';

  constructor() {
  }

  private lazyInit(): void {
    if (!this.userService) {
      const appInjector = AppInjector.getInjector();
      this.userService = appInjector.get<UserService>(UserService);
      this.spinnerService = appInjector.get<SpinnerService>(SpinnerService);
      this.dialogService = appInjector.get<DialogService>(DialogService);
      this.messageHub = new MessageHub();
    }
  }

  async handleHttpErrorResponse(error: HttpErrorResponse): Promise<void> {
    this.lazyInit();

    this.spinnerService?.hideSpinner();

    let appError: AppError;

    if (!navigator.onLine) {
      // Handle offline error
      appError = new AppError('Internet Connection Error', 'Please check your internet connection and try again.', false, null, null);
    } else if (error.error instanceof ProgressEvent) {
      // Ignore
      return;
    } else if (error.error instanceof ErrorEvent) {
      // If error is client-side error
      appError = new AppError(this.defaultErrorTitle, `Error: ${error.message}`, false, null, null);
    } else if (error.error instanceof Blob) {
      const errorInfo = await (new Blob([error.error])).text();
      try {
        const jsonErrorInfo = JSON.parse(errorInfo);
        const errorContextInfo = Object.assign(new ErrorContextInfo(), jsonErrorInfo);
        appError = new AppError(errorContextInfo.name, errorContextInfo.message, true, error.status, null);
      } catch (e) {
        appError = new AppError(error.statusText, `Error: ${errorInfo}`, true, error.status, null);
      }
    } else {
      // If error is server-side error
      if (typeof error.error === 'string') {
        appError = new AppError(error.statusText, error.error.toString(), true, error.status, null);
      } else {
        const errorContextInfo = Object.assign(new ErrorContextInfo(), error.error);
        appError = new AppError(errorContextInfo.name, errorContextInfo.message, true, error.status, null);
      }
    }

    if (appError) {
      this.handleAppError(appError);
    }
  }

  handleError(error: any) {
    this.lazyInit();

    if (!environment.production) {
      console.log(error);
    }

    const appError = new AppError(this.defaultErrorTitle, this.defaultErrorMessage, false, null, error.stack);
    appError.isFatal = true;

    this.handleAppError(appError);
  }

  private handleAppError(appError: AppError) {
    this.lazyInit();

    const errorTitle = appError.name ? appError.name : this.defaultErrorTitle;
    let errorMessage = appError.message ? appError.message : this.defaultErrorMessage;
    const isServerError = appError.isServerError;
    let terminateAppRequired = appError.isFatal;

    // Send log to the logging server
    if (!isServerError) {
      try {
        let appErrorService = AppInjector.getInjector().get<AppErrorService>(AppErrorService);
        appErrorService.log(appError);
      } catch (e) {
        // STIG rule compliance: If logging fails, terminate application
        terminateAppRequired = true;
      }
    }

    // Show error
    if (this.spinnerService?.isShowing()) {
      this.spinnerService?.hideSpinner();
    }

    if (terminateAppRequired) {
      errorMessage += ' \nThe error will be reported to the system administrator.  \nDo you want to exit the application now?';

      this.dialogService?.showConfirm(errorTitle, errorMessage, 'Terminate', 'No')
        .subscribe((result: any) => {
          if (result) {
            if (this.userService?.isAuthenticated()) {
              this.userService.logOut();
            }
          }
        });
    } else {
      this.dialogService?.showErrorMessageDialog(errorTitle, errorMessage);
    }
  }
}
