import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';

interface WindowEventMap {
  wheel: CustomEvent;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  viewer: any;
  imageSrc =
    'https://www.motortrend.com/uploads/2022/08/008-gm-electromotive-history-rocky-rotella.jpg';
  brightness: number = 1;
  zoom: number = 1;
  left: number = 0;
  top: number = 0;

  @ViewChild('image', { static: false }) image:
    | ElementRef<HTMLImageElement>
    | undefined;

  ngAfterViewInit(): void {
    fromEvent(window, 'wheel').subscribe((ev: Event) => {
      if (this.isWheelEvent(ev)) {
        let wheelEvent = ev as WheelEvent;
        const newzoom = this.zoom - wheelEvent.deltaY * 0.01;
        
        if (newzoom < 21) {
          this.zoom = Math.max(newzoom, 1);
          this.top = wheelEvent.clientY - this.zoom / 2;
          this.left = wheelEvent.clientX - this.zoom / 2;
        }
      }
    });
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
