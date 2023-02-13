import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class ToastService {
  constructor(private snackBar: MatSnackBar) {
  }

  public error(message: string) {
    this.snackBar.open(message, 'Error', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 2000,
    });
  }

  public success(message: string) {
    this.snackBar.open(message, 'Success', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 2000,
    });
  }
}
