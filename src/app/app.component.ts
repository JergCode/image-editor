import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

const GAP = 50;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  imageSrc = '/assets/img/pic1.png';
  brightness: number = 1;
  contrast: number = 1;
  zoom: number = 1;
  left: number = 0;
  top: number = 0;
  imageBouding: DOMRect;

  constructor(image: ElementRef<HTMLImageElement>) {
    this.image = image;
    this.imageBouding = image.nativeElement.getBoundingClientRect();
  }

  @ViewChild('image', { static: false }) image: ElementRef<HTMLImageElement>;

  ngAfterViewInit(): void {
    this.image.nativeElement.ondragstart = () => false;
    this.imageBouding = this.image.nativeElement.getBoundingClientRect();
  }

  onMouseInImage(event: MouseEvent) {
    document.addEventListener('wheel', this.onWheelScroll);
  }

  onWheelScroll = (event: WheelEvent) => {
    const newzoom = this.zoom - event.deltaY * 0.001;
    const y = event.clientY;
    const x = event.clientX;
    if (this.isWithinImageBoundary(x, y))
      if (newzoom < 6) {
        this.zoom = Math.max(newzoom, 1);
        this.top = this.getTopPosition(y);
        this.left = this.getLeftPosition(x);
      }
  };

  onMouseOutImage(event: MouseEvent) {
    document.removeEventListener('wheel', this.onWheelScroll);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMousedown(event: MouseEvent) {
    if (this.zoom > 1) {
      document.addEventListener('mousemove', this.onMouseMove);

      this.image.nativeElement.onmouseup = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.onMouseMove);
        this.image.nativeElement.onmouseup = null;
      };
    }
  }

  onMouseMove = (event: MouseEvent) => {
    console.log('x', event.x - this.imageBouding.left);
    console.log('y', event.y - this.imageBouding.top);
    this.top = this.getTopPosition(event.y - this.imageBouding.top);
    this.left = this.getLeftPosition(event.x - this.imageBouding.left);
  };

  isWithinImageBoundary(x: number, y: number): boolean {
    return (
      x > this.imageBouding.left + GAP &&
      x < this.imageBouding.right - GAP &&
      y > this.imageBouding.top + GAP &&
      y < this.imageBouding.bottom - GAP
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
    const left =
      this.imageBouding == null
        ? x
        : x > this.imageBouding.right
        ? x - this.zoom / 2
        : x - this.zoom / 2 - 2 * GAP;

    return Math.min(left, x);
  }

  getPicTopPosition(y: number) {}

  getTopPosition(y: number) {
    const top =
      this.imageBouding == null
        ? y
        : y > this.imageBouding.bottom
        ? y - this.zoom / 2
        : y - this.zoom / 2 - 5 * GAP;

    return Math.min(top, y);
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
