import {MatDialogRef} from '@angular/material/dialog';
import {Component, EventEmitter} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.scss']
})
export class SessionDialogComponent {

  restTime: any;

  constructor(public dialogRef: MatDialogRef<SessionDialogComponent>) {
    dialogRef.disableClose = true;
  }

  setSubscription(idleTimer: EventEmitter<any>): void {
    idleTimer.subscribe((countdown: any) => {
      this.restTime = this.mmss(countdown);
    });
  }

  private pad(num: string | number): string {
    return ('0' + num).slice(-2);
  }

  private mmss(secs: number): string {
    const minutes = Math.floor(secs / 60);
    secs = secs % 60;
    return this.pad(minutes) + ':' + this.pad(secs);
  }
}
