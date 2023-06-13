import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

const GAP = 50;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnChanges {
  imageSrc = '/assets/img/pic3.jpg';
  brightness: number = 1;
  contrast: number = 1;
  zoom: number = 1;
  left: number = 0;
  top: number = 0;
  imageBouding: DOMRect;

  clickPositionX: number = 0;
  clickPositionY: number = 0;

  constructor(image: ElementRef<HTMLImageElement>) {
    this.image = image;
    this.imageBouding = image.nativeElement.getBoundingClientRect();
  }

  @ViewChild('image', { static: false }) image: ElementRef<HTMLImageElement>;

  ngAfterViewInit(): void {
    this.image.nativeElement.ondragstart = () => false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.image.nativeElement.ondragstart = () => false;
    if (this.zoom == 1) {
      this.left = 0;
      this.top = 0;
      this.clickPositionX = -1;
      this.clickPositionY = -1;
    }
  }

  onWheelScroll = (event: WheelEvent) => {
    const newzoom = this.zoom - event.deltaY * 0.001;
    const y = event.clientY;
    const x = event.clientX;
    if (this.isWithinImageBoundary(x, y)) {
      if (newzoom < 2.6) {
        this.zoom = Math.max(newzoom, 1);
        this.top = this.getTopPosition(y);
        this.left = this.getLeftPosition(x);
      }
    }
  };

  onMouseInImage(event: MouseEvent) {
    this.imageBouding = this.image.nativeElement.getBoundingClientRect();
    document.addEventListener('wheel', this.onWheelScroll);
  }

  onMouseOutImage(event: MouseEvent) {
    document.removeEventListener('wheel', this.onWheelScroll);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMousedown(event: MouseEvent) {
    this.clickPositionX = event.clientX;
    this.clickPositionY = event.clientY;

    if (this.zoom > 1) {
      document.addEventListener('mousemove', this.onMouseMove);

      this.image.nativeElement.onmouseup = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.onMouseMove);
        this.image.nativeElement.onmouseup = null;
      };
    } else {
      this.clickPositionX = 0;
      this.clickPositionY = 0;
      this.left = 0;
      this.top = 0;
    }
  }

  onMouseMove = (event: MouseEvent) => {
    const y = this.top + (event.clientY - this.clickPositionY);
    this.top = y > this.imageBouding.bottom ? this.top : y; //this.getPicLeftPosition(event.offsetX);
    // this.top = this.getPicTopPosition(event.offsetY);

    const x = this.left + (event.clientX - this.clickPositionX);
    this.left = x > this.imageBouding.right ? this.left : x; //this.getPicLeftPosition(event.offsetX);
  };

  isWithinImageBoundary(x: number, y: number): boolean {
    const isWithin =
      x > this.imageBouding.left + GAP &&
      x < this.imageBouding.right - GAP &&
      y > this.imageBouding.top + GAP &&
      y < this.imageBouding.bottom - GAP;
    console.log(isWithin);

    return isWithin;
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
    const left =
      x > this.imageBouding.right
        ? x - this.zoom / 2
        : x - this.zoom / 2 - 2 * GAP;

    return Math.min(left, x);
  }

  getTopPosition(y: number) {
    const top =
      y > this.imageBouding.bottom
        ? y - this.zoom / 2
        : y - this.zoom / 2 - 5 * GAP;

    return Math.min(top, y);
  }

  getPicLeftPosition(x: number): number {
    const left = x > this.imageBouding.right ? this.imageBouding.right : x;

    return left;
  }

  getPicTopPosition(y: number): number {
    const top = y < this.imageBouding.bottom ? this.imageBouding.bottom : y;

    return top;
  }

  getValue(value: number): string {
    return `${Math.floor(value * 100)}%`;
  }

  getStyle() {
    return {
      filter: 'brigthness(0.1)',
    };
  }
}
