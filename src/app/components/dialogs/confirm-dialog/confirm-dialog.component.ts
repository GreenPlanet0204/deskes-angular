import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  title: string | undefined;
  message: string | undefined;
  okText: string | undefined;
  cancelText: string | undefined;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {

    this.title = data.title;
    this.message = data.message;
    this.okText = data.okText;
    this.cancelText = data.cancelText;

    dialogRef.disableClose = true;
  }
}
