import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dod-warning-dlg',
  templateUrl: 'dod-warning-dialog.component.html',
})
export class DodWarningDialogComponent {
  title: string | undefined;
  message: string | undefined;
  okText: string | undefined;
  cancelText: string | undefined;

  constructor(public dialogRef: MatDialogRef<DodWarningDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.title = data.title;
    this.message = data.message;
    this.okText = data.okText;
    this.cancelText = data.cancelText;

    dialogRef.disableClose = true;
  }
}
