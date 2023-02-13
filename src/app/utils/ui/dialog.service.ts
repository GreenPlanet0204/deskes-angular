import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MatDialog, MatDialogConfig, MatDialogRef, MatDialogState} from '@angular/material/dialog';
import {CommonUtils} from '../../utils/common.utils';
import {AppInjector} from "../app.injector";
import {environment} from "../../../environments/environment";
import {SessionDialogComponent} from "../../components/dialogs/session-dialog/session-dialog.component";
import {MessageDialogComponent} from "../../components/dialogs/message-dialog/message-dialog.component";
import {ConfirmDialogComponent} from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import {DodWarningDialogComponent} from "../../components/dialogs/dod-warning-dialog/dod-warning-dialog.component";
import {AlertMessageDialogComponent} from "../../components/dialogs/alert-message-dialog/alert-message-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  sessionDialog: MatDialogRef<SessionDialogComponent> | undefined;

  public dialog: MatDialog;

  constructor() {
    const appInjector = AppInjector.getInjector();
    this.dialog = appInjector.get<MatDialog>(MatDialog);
  }

  showErrorMessageDialog(title: string, message: string): void {
    this.showAlertMessageDialog(title, message, true, false).subscribe();
  }

  showWarningMessageDialog(title: string, message: string): void {
    this.showAlertMessageDialog(title, message, false, true).subscribe();
  }

  showMessageDialog(title: string, message: string, toastMode: boolean = false): void {
    let observable$ = this._showMessageDialog(title, message, toastMode);
    if (toastMode) {
      observable$.subscribe();
    }
  }

  showConfirm(title: string, message: string, customOkText = 'Yes', customCancelText = 'No'): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      title: title,
      message: message,
      okText: customOkText,
      cancelText: customCancelText
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  showSessionDialog(idleTimer: EventEmitter<any>, ): Observable<any> {
    this.sessionDialog = this.dialog.open(SessionDialogComponent);
    this.sessionDialog.componentInstance.setSubscription(idleTimer);
    return this.sessionDialog.afterClosed();
  }

  hideSessionDialog(): void {
    if (this.sessionDialog && this.sessionDialog.getState() === MatDialogState.OPEN) {
      this.sessionDialog.close(null);
    }
  }

  showDodWarningDialog(): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      title: environment.dodWarning.title,
      message: environment.dodWarning.message,
      okText: environment.dodWarning.okText,
      cancelText: environment.dodWarning.cancelText
    };
    const dialogRef = this.dialog.open(DodWarningDialogComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  private showAlertMessageDialog(title: string, message: string, isError: boolean = false, toastMode: boolean = false): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      title: title,
      message: message,
      isError: isError
    };
    const dialogRef = this.dialog.open(AlertMessageDialogComponent, dialogConfig);

    if (toastMode) {
      return new Observable<boolean>((subscriber) => {
        CommonUtils.delay(5000).then(() => {
          dialogRef.close();
          subscriber.next(true);
        });
      });
    } else {
      return dialogRef.afterClosed();
    }
  }

  // @ts-ignore
  private _showMessageDialog(title: string, message: string, toastMode: boolean = false): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      title: title,
      message: message
    };
    const dialogRef = this.dialog.open(MessageDialogComponent, dialogConfig);

    if (toastMode) {
      return new Observable<boolean>((subscriber) => {
        CommonUtils.delay(5000).then(() => {
          dialogRef.close();
          subscriber.next(true);
        });
      });
    } else {
      return dialogRef.afterClosed();
    }
  }
}
