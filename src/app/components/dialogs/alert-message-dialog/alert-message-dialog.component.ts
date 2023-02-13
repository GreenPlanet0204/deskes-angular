import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'alert-message-dlg',
  templateUrl: 'alert-message-dialog.component.html',
})
export class AlertMessageDialogComponent {
  title: string | undefined;
  message: string | undefined;
  iconName: string | 'warning';

  constructor(
    private dialogRef: MatDialogRef<AlertMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    this.title = data.title;
    this.message = data.message;
    this.iconName = data.isError ? 'error' : 'warning';
    dialogRef.disableClose = true;
  }

  onCloseClick(): void {
    this.dialogRef.close(null);
  }
}
