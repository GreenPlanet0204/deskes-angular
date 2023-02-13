import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Injectable({ providedIn: "root" })
export class LocalStorageReferenceService {
  // @ts-ignore
  constructor(@Inject(PLATFORM_ID) private platformId) {}

  get localStorage() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage;
    } else {
      throw new Error("Platform is not supported.");
    }
  }
}
