import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

const GAP = 50;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  viewer: any;
  imageSrc = '/assets/img/pic1.png';
  brightness: number = 1;
  contrast: number = 1;
  zoom: number = 1;
  left: number = 0;
  top: number = 0;
  weelSubscription?: Subscription;

  @ViewChild('image', { static: false }) image?: ElementRef<HTMLImageElement>;

  ngAfterViewInit(): void {
    this.weelSubscription = fromEvent(window, 'wheel').subscribe(
      (ev: Event) => {
        if (this.isWheelEvent(ev)) {
          let wheelEvent = ev as WheelEvent;
          const newzoom = this.zoom - wheelEvent.deltaY * 0.001;

          const y = wheelEvent.clientY;
          const x = wheelEvent.clientX;
          if (this.isWithinImageBoundary(x, y))
            if (newzoom < 6) {
              this.zoom = Math.max(newzoom, 1);
              this.top = this.getTopPosition(y);
              this.left = this.getLeftPosition(x);
            }
        }
      }
    );
  }

  isWithinImageBoundary(x: number, y: number): boolean {
    const domRect = this.image?.nativeElement.getBoundingClientRect();
    if (domRect == null) return false;

    return (
      x > domRect.left + GAP &&
      x < domRect.right - GAP &&
      y > domRect.top + GAP &&
      y < domRect.bottom - GAP
    );
  }

  getImageAttributes(): object {
    return {
      filter:
        'brightness(' + this.brightness + ') contrast(' + this.contrast + ')',
      transform: 'scale(' + this.zoom + ')',
      'transform-origin': this.left + 'px ' + this.top + 'px',
    };
  }

  getLeftPosition(x: number): number {
    const domRect = this.image?.nativeElement.getBoundingClientRect();
    const left =
      domRect == null
        ? x
        : x > domRect.right
        ? x - this.zoom / 2
        : x - this.zoom / 2 - 2 * GAP;

    return Math.min(left, x);
  }

  getTopPosition(y: number) {
    const domRect = this.image?.nativeElement.getBoundingClientRect();
    const top =
      domRect == null
        ? y
        : y > domRect.bottom
        ? y - this.zoom / 2
        : y - this.zoom / 2 - 5 * GAP;

    return Math.min(top, y);
  }

  ngOnDestroy(): void {
    this.weelSubscription?.unsubscribe();
  }

  getValue(value: number): string {
    return `${Math.floor(value * 100)}%`;
  }

  isWheelEvent(ev: Event): Boolean {
    return ev instanceof WheelEvent;
  }

  getStyle() {
    return {
      filter: 'brigthness(0.1)',
    };
  }
}
