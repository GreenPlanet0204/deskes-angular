import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../environments/environment';
import {AppInjector} from "../app.injector";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackBar: MatSnackBar;

  constructor() {
    const appInjector = AppInjector.getInjector();
    this.snackBar = appInjector.get<MatSnackBar>(MatSnackBar);
  }

  showSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: environment.ui.snackBar.duration
    });
  }
}
