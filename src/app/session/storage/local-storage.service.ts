import {Injectable, OnDestroy} from "@angular/core";
import {LocalStorageReferenceService} from "./local-storage-reference.service";
import {BehaviorSubject} from "rxjs";
import {LocalStorageKeys} from "./local-storage-keys";

@Injectable({ providedIn: 'root' })
export class LocalStorageService implements OnDestroy {
  private readonly localStorage: Storage;
  readonly userSessionDataChangeEvent$: BehaviorSubject<string>;

  constructor(private _localStorageRefService: LocalStorageReferenceService) {
    this.localStorage = _localStorageRefService.localStorage;
    this.userSessionDataChangeEvent$ = new BehaviorSubject<any>(null);
    this.startEventListener();
  }

  private startEventListener(): void {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      if (typeof event.key === "string") {
        this.userSessionDataChangeEvent$.next(this.denormalizeKey(event.key));
      }
    }
  }

  private normalizeKey(key: string): string {
    return LocalStorageKeys.SESSION_KEY_PREFIX + key;
  }

  private denormalizeKey(key: string): string {
    return key.replace(LocalStorageKeys.SESSION_KEY_PREFIX, '');
  }

  /*
  ** Public methods
   */
  getItem(key: string): any {
    let normalizedKey = this.normalizeKey(key);
    let data = this.localStorage.getItem(normalizedKey);

    if (!data) {
      return {};
    }

    return JSON.parse(data);
  }

  saveItem(key: string, data: any): void {
    let normalizedKey = this.normalizeKey(key);

    this.localStorage.setItem(normalizedKey, JSON.stringify(data));
    this.userSessionDataChangeEvent$.next(key);
  }

  removeItem(key: string): void {
    let normalizedKey = this.normalizeKey(key);

    this.localStorage.removeItem(normalizedKey);
    this.userSessionDataChangeEvent$.next(key);
  }

  removeAllItems(): void {
    for (let key in this.localStorage) {
      if (key.startsWith(LocalStorageKeys.SESSION_KEY_PREFIX)) {
        this.removeItem(this.denormalizeKey(key));
      }
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
    this.userSessionDataChangeEvent$.complete();
  }
}
