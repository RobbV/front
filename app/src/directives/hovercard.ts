import { Directive,  EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { HovercardService } from '../services/hovercard';

@Directive({
  selector: '[hovercard]',
  inputs: ['_hovercard: hovercard', '_hovercardAnchor: hovercardAnchor'],
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(click)': 'hideForcefully()'
  }
})
export class Hovercard implements OnDestroy {
  guid: any = '';
  anchor: any = ['right', 'top'];
  _element: any;

  constructor(public hovercardService: HovercardService, element: ElementRef) {
    this._element = element.nativeElement;
  }

  set _hovercard(value: any) {
    if (!value) {
      return;
    }

    if (typeof value.guid !== 'undefined') {
      this.guid = value.guid;
      return;
    }

    this.guid = value;
  }

  set _hovercardAnchor(value: any) {
    if (!value) {
      return;
    }

    if (typeof value === 'string' || value.length !== 2) {
      return;
    }

    this.anchor = value;
  }

  show() {
    if (!this.guid) {
      return;
    }

    setTimeout(() => {
      this.hovercardService.show(this.guid, this._element, this.anchor);
    }, 250);
  }

  hide() {
    if (!this.guid) {
      return;
    }

    setTimeout(() => {
      this.hovercardService.hide(this.guid);
    }, 250);
  }

  hideForcefully() {
    if (!this.guid) {
      return;
    }

    this.hovercardService.unstick();
    this.hovercardService.hide(this.guid);
  }

  ngOnDestroy() {
    this.hideForcefully();
  }
}
