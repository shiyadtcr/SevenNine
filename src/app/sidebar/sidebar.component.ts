import {
  AfterContentInit,
  AnimationTransitionEvent,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  QueryList,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { CloseSidebar } from './close.directive';

export const SIDEBAR_POSITION = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom'
};

@Component({
  selector: 'app-sidebar',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('visibleSidebarState', [
      state('expanded', style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
      state('expanded--animate', style({ transform: 'none', pointerEvents: 'auto', willChange: 'initial' })),
      state('collapsed--left', style({ transform: 'translateX(-110%)' })),
      state('collapsed--right', style({ transform: 'translateX(110%)' })),
      state('collapsed--top', style({ transform: 'translateY(-110%)' })),
      state('collapsed--bottom', style({ transform: 'translateY(110%)' })),
      transition('expanded--animate <=> *', animate('0.4s cubic-bezier(.25,.8,.25,1)'))
    ]),
    trigger('visibleOverlayState', [
      state('visible', style({ pointerEvents: 'auto','opacity':0.6})),
      state('hidden', style({ pointerEvents: 'none','opacity':0})),
	  transition('visible <=> hidden', animate('0.4s ease-out'))
    ])
  ]
})
export class Sidebar implements AfterContentInit, OnChanges, OnDestroy {
  // `openChange` allows for 2-way data binding
  @Input() open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() keyClose: boolean = false;
  @Input() keyCode: number = 27;

  @Input() position: string = SIDEBAR_POSITION.Left;
  @Input() closeOnClickOutside: boolean = false;
  @Input() showOverlay: boolean = false;
  @Input() animate: boolean = true;

  @Input() defaultStyles: boolean = false;

  @Input() sidebarClass: string;
  @Input() overlayClass: string;

  @Input() ariaLabel: string;
  @Input() trapFocus: boolean = true;
  @Input() autoFocus: boolean = true;

  @Output() onOpen: EventEmitter<null> = new EventEmitter<null>();
  @Output() onClose: EventEmitter<null> = new EventEmitter<null>();

  @Output() onAnimationStarted: EventEmitter<AnimationTransitionEvent> =
    new EventEmitter<AnimationTransitionEvent>();
  @Output() onAnimationDone: EventEmitter<AnimationTransitionEvent> =
    new EventEmitter<AnimationTransitionEvent>();

  /** @internal */
  _visibleSidebarState: string;

  /** @internal */
  _visibleOverlayState: string;

  @ViewChild('sidebar')
  private _elSidebar: ElementRef;

  @ContentChildren(CloseSidebar)
  private _closeDirectives: QueryList<CloseSidebar>;

  private _onClickOutsideAttached: boolean = false;
  private _onKeyDownAttached: boolean = false;

  private _focusableElementsString: string = 'a[href], area[href], input:not([disabled]), select:not([disabled]),' +
    'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
  private _focusableElements: Array<HTMLElement>;
  private _focusedBeforeOpen: HTMLElement;

  constructor(@Inject(DOCUMENT) private _document /*: HTMLDocument */) {
    this._manualClose = this._manualClose.bind(this);
    this._trapFocus = this._trapFocus.bind(this);
    this._onClickOutside = this._onClickOutside.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  ngAfterContentInit() {
    if (this._closeDirectives) {
      this._closeDirectives.forEach((dir: CloseSidebar) => {
        dir.clicked.subscribe(this._manualClose);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      if (this.open) {
        this._open();
      } else {
        this._close();
      }

      this._setVisibleSidebarState();
    }

    if (changes['closeOnClickOutside'] || changes['keyClose']) {
      this._initCloseListeners();
    }

    if (changes['position']) {
      this._setVisibleSidebarState();
    }
  }

  ngOnDestroy() {
    this._destroyCloseListeners();

    if (this._closeDirectives) {
      this._closeDirectives.forEach((dir: CloseSidebar) => {
        dir.clicked.unsubscribe();
      });
    }
  }

  // Animation callbacks
  // ==============================================================================================

  /** @internal */
  _animationStarted(e: AnimationTransitionEvent) {
    this.onAnimationStarted.emit(e);
  }

  /** @internal */
  _animationDone(e: AnimationTransitionEvent) {
    this.onAnimationDone.emit(e);
  }


  // Sidebar toggling
  // ==============================================================================================

  private _setVisibleSidebarState() {
    this._visibleSidebarState = this.open ?
      (this.animate ? 'expanded--animate' : 'expanded') :
      `collapsed--${this.position}`;

    this._visibleOverlayState = this.open ? 'visible' : 'hidden';
  }

  private _open() {
    this._setFocused(true);

    this._initCloseListeners();

    this.onOpen.emit(null);
  }

  private _close() {
    this._setFocused(false);

    this._destroyCloseListeners();

    this.onClose.emit(null);
  }

  private _manualClose() {
    this.open = false;
    this.openChange.emit(false);

    this._close();
  }


  // Focus on open/close
  // ==============================================================================================

  private _setFocusToFirstItem() {
    if (this.autoFocus && this._focusableElements && this._focusableElements.length) {
      this._focusableElements[0].focus();
    }
  }

  private _trapFocus(e: FocusEvent) {
    if (this.open && this.trapFocus && !this._elSidebar.nativeElement.contains(e.target)) {
      this._setFocusToFirstItem();
    }
  }

  // Handles the ability to focus sidebar elements when it's open/closed
  private _setFocused(open: boolean) {
    this._focusableElements = Array.from(
      this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString)) as Array<HTMLElement>;

    if (open) {
      this._focusedBeforeOpen = this._document.activeElement as HTMLElement;

      // Restore focusability, with previous tabindex attributes
      for (let el of this._focusableElements) {
        const prevTabIndex = el.getAttribute('__tabindex__');
        if (prevTabIndex) {
          el.setAttribute('tabindex', prevTabIndex);
          el.removeAttribute('__tabindex__');
        } else {
          el.removeAttribute('tabindex');
        }
      }

      this._setFocusToFirstItem();

      this._document.body.addEventListener('focus', this._trapFocus, true);
    } else {
      // Manually make all focusable elements unfocusable, saving existing tabindex attributes
      for (let el of this._focusableElements) {
        const existingTabIndex = el.getAttribute('tabindex');
        if (existingTabIndex) {
          el.setAttribute('__tabindex__', existingTabIndex);
        }

        el.setAttribute('tabindex', '-1');
      }

      if (this._focusedBeforeOpen) {
        this._focusedBeforeOpen.focus();
      }

      this._document.body.removeEventListener('focus', this._trapFocus, true);
    }
  }


  // On click outside
  // ==============================================================================================

  private _initCloseListeners() {
    if (this.open && (this.closeOnClickOutside || this.keyClose)) {
      // In a timeout so that things render first
      setTimeout(() => {
        if (this.closeOnClickOutside && !this._onClickOutsideAttached) {
          this._document.body.addEventListener('click', this._onClickOutside);
          this._onClickOutsideAttached = true;
        }

        if (this.keyClose && !this._onKeyDownAttached) {
          this._document.body.addEventListener('keydown', this._onKeyDown);
          this._onKeyDownAttached = true;
        }
      });
    }
  }

  private _destroyCloseListeners() {
    if (this._onClickOutsideAttached) {
      this._document.body.removeEventListener('click', this._onClickOutside);
      this._onClickOutsideAttached = false;
    }

    if (this._onKeyDownAttached) {
      this._document.body.removeEventListener('keydown', this._onKeyDown);
      this._onKeyDownAttached = false;
    }
  }

  private _onClickOutside(e: MouseEvent) {
    if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
      this._manualClose();
    }
  }

  private _onKeyDown(e: KeyboardEvent | Event) {
    e = e || window.event;

    if ((e as KeyboardEvent).keyCode === this.keyCode) {
      this._manualClose();
    }
  }
}
