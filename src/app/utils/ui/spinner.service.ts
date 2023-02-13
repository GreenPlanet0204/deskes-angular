import {Injectable} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AppInjector} from "../app.injector";
import {MessageHub} from "../../data-buses/message.hub";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private readonly ngxSpinnerService: NgxSpinnerService;
  private readonly messageHub: MessageHub;

  constructor() {
    const appInjector = AppInjector.getInjector();
    this.ngxSpinnerService = appInjector.get<NgxSpinnerService>(NgxSpinnerService);
    this.messageHub = new MessageHub();
  }

  private loadingCount = 0;
  private processingCount = 0;
  private isProcessingData = false;
  private lazyLoadingCount = 0;
  private spinnerMessage = '';

  hideSpinner(): void {
    if (--this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.spinnerMessage = '';
      this.ngxSpinnerService.hide();
      this.messageHub.postMessage(false, MessageHub.MESSAGE_KEEP_ALIVE);
    }
  }

  showSpinner(message = ''): void {
    if (++this.loadingCount > 0) {
      this.spinnerMessage = message;
      this.ngxSpinnerService.show();
      this.messageHub.postMessage(true, MessageHub.MESSAGE_KEEP_ALIVE);
    }
  }

  isShowing(): boolean {
    return this.loadingCount > 0;
  }

  resetSpinner(): void {
    this.loadingCount = 0;
    this.spinnerMessage = '';
    this.ngxSpinnerService.hide();
  }

  getSpinnerMessage(): string {
    return this.spinnerMessage;
  }

  setSpinnerMessage(message: string): void {
    this.spinnerMessage = message;
  }

  unmarkProcessing(): void {
    if (--this.processingCount <= 0) {
      this.processingCount = 0;
      this.isProcessingData = false;

      this.messageHub.postMessage(false, MessageHub.MESSAGE_KEEP_ALIVE);
    }
  }

  markProcessing(): void {
    if (++this.processingCount > 0) {
      this.isProcessingData = true;

      this.messageHub.postMessage(true, MessageHub.MESSAGE_KEEP_ALIVE);
    }
  }

  resetProcessingCount(): void {
    this.processingCount = 0;
    this.isProcessingData = false;

    this.messageHub.postMessage(false, MessageHub.MESSAGE_KEEP_ALIVE);
  }

  tryShowLazyLoadingSpinner(): boolean {
    if (this.lazyLoadingCount > 0) {
      this.ngxSpinnerService.show();
      return true;
    }

    return false;
  }

  tryHideLazyLoadingSpinner(): boolean {
    if (this.lazyLoadingCount <= 0) {
      this.ngxSpinnerService.hide();
      return true;
    }

    return false;
  }
}
