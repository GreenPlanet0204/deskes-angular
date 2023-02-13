import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'messge-dlg',
  templateUrl: 'message-dialog.component.html',
})
export class MessageDialogComponent {
  title: string | undefined;
  message: string | undefined;

  constructor(
    private dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    this.title = data.title;
    this.message = data.message;
    dialogRef.disableClose = true;
  }

  onCloseClick(): void {
    this.dialogRef.close(null);
  }
}
