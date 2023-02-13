import {Component, EventEmitter, HostListener, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {SearchService} from 'src/app/core';
import {SearchComponent} from "../search.component";
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

export function isNonNull(value: string): value is NonNullable<string> {
  return value != null && value.length > 0;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']

})
export class SearchBarComponent {
  inputControl = new FormControl();
  liveSearchItems$: Observable<any> | undefined;
  keyword: any;
  isOpen = false;

  componentPortal: ComponentPortal<any> | undefined;
  overlayRef: OverlayRef | undefined;

  @Output() itemClicked:EventEmitter<any> =new EventEmitter<any>();

  constructor(
    private searchService: SearchService,
    private overlay: Overlay
  ) {
    this.liveSearchItems$ = this.inputControl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      filter(isNonNull),
      switchMap(value => this.searchService.search(value))
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    try {
      this.overlayRef?.updatePositionStrategy(this.createPositionStrategy());
      this.overlayRef?.updatePosition();
    } catch (e) {
      // ignored if failed
    }
  }

  onclickItemDetail(event: Event, item: any) {
    event.preventDefault();
    this.itemClicked?.emit(item);
  }

  createPositionStrategy() {
    const target = document.querySelector('#btn') as HTMLElement;
    let xOffset = (target.offsetLeft + target.offsetWidth) - (window.innerWidth / 2);

    return this.overlay
      .position()
      .flexibleConnectedTo(target)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX: -xOffset
        },
      ]);
  }

  displayOverlay(event: Event) {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'mat-elevation-z8',
      positionStrategy: this.createPositionStrategy()
    });

    this.componentPortal = new ComponentPortal(SearchComponent);
    this.overlayRef.attach(this.componentPortal);

    this.overlayRef.backdropClick().subscribe(() => this.overlayRef?.detach());
  }
}
