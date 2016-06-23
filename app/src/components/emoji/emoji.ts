import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { EmojiList } from '../../services/emoji-list';
import { Emoji as EmojiDirective } from '../../directives/emoji';

@Component({
  selector: 'minds-emoji',
  inputs: [ 'localDirective' ],
  template: `
    <div class="m-bubble-popup mdl-shadow--4dp"
    *ngIf="localDirective.shown"
    [ngStyle]="localDirective.style"
    >
      <div class="m-emoji-selector-title">
        Emoji
        <i class="material-icons m-emoji-selector-close"
        (click)="hide()"
        >close</i>
      </div>
      <div class="m-emoji-selector-list">
        <span *ngFor="let emoji of emojis"
        tabindex="0"
        class="m-emoji"
        [title]="emoji.name"
        (click)="select(emoji.codePoint, $event)"
        (keydown.enter)="select(emoji.codePoint, $event)"
        (keydown.space)="select(emoji.codePoint, $event)"
        (keydown.esc)="hide()"
        >{{ represent(emoji.codePoint) }}</span>
      </div>
    </div>
  `,
  directives: [ CORE_DIRECTIVES ]
})
export class MindsEmoji {
  private emojis = EmojiList;
  localDirective: EmojiDirective;

  constructor() {}

  hide() {
    if (!this.localDirective.shown) {
      return;
    }

    this.localDirective.close();
  }

  select(codePoint: number, $event: any) {
    if ($event) {
      $event.preventDefault();
    }

    this.localDirective.emoji.next({
      character: this.represent(codePoint)
    });
  }

  represent(codePoint: number) {
    return this.fromCodePoint(codePoint);
  }

  // Internal

  private fromCodePoint(...args: any[]) {
    if (typeof (<any>String).fromCodePoint !== 'undefined') {
      return (<any>String).fromCodePoint.apply(String, args);
    }

    var chars = [], point, offset, units, i;
    for (i = 0; i < args.length; ++i) {
      point = args[i];
      offset = point - 0x10000;
      units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
      chars.push(String.fromCharCode.apply(null, units));
    }
    return chars.join("");
  }
}
