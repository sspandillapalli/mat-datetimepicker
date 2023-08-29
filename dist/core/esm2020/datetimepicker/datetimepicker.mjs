import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  Optional,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MatDatetimepickerCalendarComponent } from './calendar';
import { createMissingDateImplError } from './datetimepicker-errors';
import * as i0 from '@angular/core';
import * as i1 from '@angular/cdk/a11y';
import * as i2 from './calendar';
import * as i3 from '@angular/material/dialog';
import * as i4 from '@angular/cdk/overlay';
import * as i5 from '../adapter/datetime-adapter';
import * as i6 from '@angular/cdk/bidi';
/** Used to generate a unique ID for each datepicker instance. */
let datetimepickerUid = 0;
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export class MatDatetimepickerContentComponent {
  constructor() {
    this.changedDate = null;
  }
  ngAfterContentInit() {
    this._calendar._focusActiveCell();
  }
  onSelectionChange(date) {
    this.changedDate = date;
  }
  onSelectionConfirm(date) {
    this.datetimepicker._select(date);
  }
  handleClose(val) {
    let newValue = this.changedDate ?? val;
    if ((val && this.changedDate) || val) {
      this.onSelectionConfirm(newValue);
      this.datetimepicker.close();
      this.changedDate = null;
    } else if (val === null) this.datetimepicker.close();
  }
  /**
   * Handles keydown event on datepicker content.
   * @param event The event.
   */
  _handleKeydown(event) {
    if (event.keyCode === ESCAPE) {
      this.datetimepicker.close();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
/** @nocollapse */ MatDatetimepickerContentComponent.ɵfac =
  i0.ɵɵngDeclareFactory({
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerContentComponent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component,
  });
/** @nocollapse */ MatDatetimepickerContentComponent.ɵcmp =
  i0.ɵɵngDeclareComponent({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerContentComponent,
    selector: 'mat-datetimepicker-content',
    host: {
      listeners: { keydown: '_handleKeydown($event)' },
      properties: {
        'class.mat-datetimepicker-content-touch': 'datetimepicker?.touchUi',
      },
      classAttribute: 'mat-datetimepicker-content',
    },
    viewQueries: [
      {
        propertyName: '_calendar',
        first: true,
        predicate: MatDatetimepickerCalendarComponent,
        descendants: true,
        static: true,
      },
    ],
    ngImport: i0,
    template:
      '<mat-datetimepicker-calendar\n  (closeDateTimePicker)="handleClose($event)"\n  (selectedChange)="onSelectionChange($event)"\n  (viewChanged)="datetimepicker._viewChanged($event)"\n  [ariaNextMonthLabel]="datetimepicker.ariaNextMonthLabel"\n  [ariaNextYearLabel]="datetimepicker.ariaNextYearLabel"\n  [ariaPrevMonthLabel]="datetimepicker.ariaPrevMonthLabel"\n  [ariaPrevYearLabel]="datetimepicker.ariaPrevYearLabel"\n  [preventSameDateTimeSelection]="datetimepicker.preventSameDateTimeSelection"\n  [attr.mode]="datetimepicker.mode"\n  [dateFilter]="datetimepicker._dateFilter"\n  [id]="datetimepicker.id"\n  [maxDate]="datetimepicker._maxDate"\n  [minDate]="datetimepicker._minDate"\n  [multiYearSelector]="datetimepicker.multiYearSelector"\n  [selected]="datetimepicker._selected"\n  [startAt]="datetimepicker.startAt"\n  [startView]="datetimepicker.startView"\n  [timeInterval]="datetimepicker.timeInterval"\n  [twelvehour]="datetimepicker.twelvehour"\n  [type]="datetimepicker.type"\n  [cancelLabel]="datetimepicker.cancelLabel"\n  [confirmLabel]="datetimepicker.confirmLabel"\n  cdkTrapFocus\n  class="mat-typography"\n>\n</mat-datetimepicker-calendar>\n',
    styles: [
      '.mat-datetimepicker-content{box-shadow:0 5px 5px -3px #0003,0 8px 10px 1px #00000024,0 3px 14px 2px #0000001f;display:block;background-color:#fff;border-radius:2px;overflow:hidden}.mat-datetimepicker-calendar{width:296px;height:465px}.mat-datetimepicker-calendar[mode=landscape]{width:446px;height:377px}@media (min-width: 480px){.mat-datetimepicker-calendar[mode=auto]{width:446px;height:377px}}.mat-datetimepicker-content-touch{box-shadow:0 0 #0003,0 0 #00000024,0 0 #0000001f;display:block;box-shadow:0 11px 15px -7px #0003,0 24px 38px 3px #00000024,0 9px 46px 8px #0000001f}.cdk-overlay-container,.cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed;z-index:1000}.cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000}.cdk-overlay-backdrop{position:absolute;inset:0;z-index:1000;pointer-events:auto;transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.48}.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.6)}.mat-datetimepicker-dialog .mat-dialog-container{padding:0}\n',
    ],
    dependencies: [
      {
        kind: 'directive',
        type: i1.CdkTrapFocus,
        selector: '[cdkTrapFocus]',
        inputs: ['cdkTrapFocus', 'cdkTrapFocusAutoCapture'],
        exportAs: ['cdkTrapFocus'],
      },
      {
        kind: 'component',
        type: i2.MatDatetimepickerCalendarComponent,
        selector: 'mat-datetimepicker-calendar',
        inputs: [
          'multiYearSelector',
          'startView',
          'twelvehour',
          'timeInterval',
          'dateFilter',
          'ariaLabel',
          'ariaNextMonthLabel',
          'ariaPrevMonthLabel',
          'ariaNextYearLabel',
          'ariaPrevYearLabel',
          'ariaNextMultiYearLabel',
          'ariaPrevMultiYearLabel',
          'confirmLabel',
          'cancelLabel',
          'preventSameDateTimeSelection',
          'type',
          'startAt',
          'selected',
          'minDate',
          'maxDate',
        ],
        outputs: ['closeDateTimePicker', 'selectedChange', 'viewChanged'],
      },
    ],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None,
  });
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerContentComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-datetimepicker-content',
          host: {
            class: 'mat-datetimepicker-content',
            '[class.mat-datetimepicker-content-touch]':
              'datetimepicker?.touchUi',
            '(keydown)': '_handleKeydown($event)',
          },
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<mat-datetimepicker-calendar\n  (closeDateTimePicker)="handleClose($event)"\n  (selectedChange)="onSelectionChange($event)"\n  (viewChanged)="datetimepicker._viewChanged($event)"\n  [ariaNextMonthLabel]="datetimepicker.ariaNextMonthLabel"\n  [ariaNextYearLabel]="datetimepicker.ariaNextYearLabel"\n  [ariaPrevMonthLabel]="datetimepicker.ariaPrevMonthLabel"\n  [ariaPrevYearLabel]="datetimepicker.ariaPrevYearLabel"\n  [preventSameDateTimeSelection]="datetimepicker.preventSameDateTimeSelection"\n  [attr.mode]="datetimepicker.mode"\n  [dateFilter]="datetimepicker._dateFilter"\n  [id]="datetimepicker.id"\n  [maxDate]="datetimepicker._maxDate"\n  [minDate]="datetimepicker._minDate"\n  [multiYearSelector]="datetimepicker.multiYearSelector"\n  [selected]="datetimepicker._selected"\n  [startAt]="datetimepicker.startAt"\n  [startView]="datetimepicker.startView"\n  [timeInterval]="datetimepicker.timeInterval"\n  [twelvehour]="datetimepicker.twelvehour"\n  [type]="datetimepicker.type"\n  [cancelLabel]="datetimepicker.cancelLabel"\n  [confirmLabel]="datetimepicker.confirmLabel"\n  cdkTrapFocus\n  class="mat-typography"\n>\n</mat-datetimepicker-calendar>\n',
          styles: [
            '.mat-datetimepicker-content{box-shadow:0 5px 5px -3px #0003,0 8px 10px 1px #00000024,0 3px 14px 2px #0000001f;display:block;background-color:#fff;border-radius:2px;overflow:hidden}.mat-datetimepicker-calendar{width:296px;height:465px}.mat-datetimepicker-calendar[mode=landscape]{width:446px;height:377px}@media (min-width: 480px){.mat-datetimepicker-calendar[mode=auto]{width:446px;height:377px}}.mat-datetimepicker-content-touch{box-shadow:0 0 #0003,0 0 #00000024,0 0 #0000001f;display:block;box-shadow:0 11px 15px -7px #0003,0 24px 38px 3px #00000024,0 9px 46px 8px #0000001f}.cdk-overlay-container,.cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed;z-index:1000}.cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000}.cdk-overlay-backdrop{position:absolute;inset:0;z-index:1000;pointer-events:auto;transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.48}.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.6)}.mat-datetimepicker-dialog .mat-dialog-container{padding:0}\n',
          ],
        },
      ],
    },
  ],
  propDecorators: {
    _calendar: [
      {
        type: ViewChild,
        args: [MatDatetimepickerCalendarComponent, { static: true }],
      },
    ],
  },
});
export class MatDatetimepickerComponent {
  constructor(
    _dialog,
    _overlay,
    _ngZone,
    _viewContainerRef,
    _scrollStrategy,
    _dateAdapter,
    _dir,
    _document
  ) {
    this._dialog = _dialog;
    this._overlay = _overlay;
    this._ngZone = _ngZone;
    this._viewContainerRef = _viewContainerRef;
    this._scrollStrategy = _scrollStrategy;
    this._dateAdapter = _dateAdapter;
    this._dir = _dir;
    this._document = _document;
    /** Active multi year view when click on year. */
    this.multiYearSelector = false;
    /** if true change the clock to 12 hour format. */
    this.twelvehour = false;
    /** The view that the calendar should start in. */
    this.startView = 'month';
    this.mode = 'auto';
    this.timeInterval = 1;
    this.ariaNextMonthLabel = 'Next month';
    this.ariaPrevMonthLabel = 'Previous month';
    this.ariaNextYearLabel = 'Next year';
    this.ariaPrevYearLabel = 'Previous year';
    this.confirmLabel = 'Ok';
    this.cancelLabel = 'Cancel';
    /** Prevent user to select same date time */
    this.preventSameDateTimeSelection = false;
    /**
     * Emits new selected date when selected date changes.
     * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
     */
    this.selectedChanged = new EventEmitter();
    /** Emits when the datepicker has been opened. */
    // eslint-disable-next-line @angular-eslint/no-output-rename
    this.openedStream = new EventEmitter();
    /** Emits when the datepicker has been closed. */
    // eslint-disable-next-line @angular-eslint/no-output-rename
    this.closedStream = new EventEmitter();
    /** Emits when the view has been changed. **/
    this.viewChanged = new EventEmitter();
    /** Whether the calendar is open. */
    this.opened = false;
    /** The id for the datepicker calendar. */
    this.id = `mat-datetimepicker-${datetimepickerUid++}`;
    /** Emits when the datepicker is disabled. */
    this._disabledChange = new Subject();
    this._validSelected = null;
    /** The element that was focused before the datepicker was opened. */
    this._focusedElementBeforeOpen = null;
    this._inputSubscription = Subscription.EMPTY;
    this._type = 'date';
    this._touchUi = false;
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
  }
  /** The date to open the calendar to initially. */
  get startAt() {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return (
      this._startAt ||
      (this._datepickerInput ? this._datepickerInput.value : null)
    );
  }
  set startAt(date) {
    this._startAt = this._dateAdapter.getValidDateOrNull(date);
  }
  get openOnFocus() {
    return this._openOnFocus;
  }
  set openOnFocus(value) {
    this._openOnFocus = coerceBooleanProperty(value);
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value || 'date';
  }
  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
  get touchUi() {
    return this._touchUi;
  }
  set touchUi(value) {
    this._touchUi = coerceBooleanProperty(value);
  }
  /** Whether the datepicker pop-up should be disabled. */
  get disabled() {
    return this._disabled === undefined && this._datepickerInput
      ? this._datepickerInput.disabled
      : !!this._disabled;
  }
  set disabled(value) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._disabledChange.next(newValue);
    }
  }
  /** The currently selected date. */
  get _selected() {
    return this._validSelected;
  }
  set _selected(value) {
    this._validSelected = value;
  }
  /** The minimum selectable date. */
  get _minDate() {
    return this._datepickerInput && this._datepickerInput.min;
  }
  /** The maximum selectable date. */
  get _maxDate() {
    return this._datepickerInput && this._datepickerInput.max;
  }
  get _dateFilter() {
    return this._datepickerInput && this._datepickerInput._dateFilter;
  }
  _handleFocus() {
    if (!this.opened && this.openOnFocus) {
      this.open();
    }
  }
  _viewChanged(type) {
    this.viewChanged.emit(type);
  }
  ngOnDestroy() {
    this.close();
    this._inputSubscription.unsubscribe();
    this._disabledChange.complete();
    if (this._popupRef) {
      this._popupRef.dispose();
    }
  }
  /** Selects the given date */
  _select(date) {
    const oldValue = this._selected;
    this._selected = date;
    if (!this._dateAdapter.sameDatetime(oldValue, this._selected)) {
      this.selectedChanged.emit(date);
    }
  }
  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  _registerInput(input) {
    if (this._datepickerInput) {
      throw Error(
        'A MatDatepicker can only be associated with a single input.'
      );
    }
    this._datepickerInput = input;
    this._inputSubscription = this._datepickerInput._valueChange.subscribe(
      (value) => (this._selected = value)
    );
  }
  /** Open the calendar. */
  open() {
    if (this.opened || this.disabled) {
      return;
    }
    if (!this._datepickerInput) {
      throw Error(
        'Attempted to open an MatDatepicker with no associated input.'
      );
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }
    this.touchUi ? this._openAsDialog() : this._openAsPopup();
    this.opened = true;
    this.openedStream.emit();
  }
  /** Close the calendar. */
  close() {
    if (!this.opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }
    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }
    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this.opened) {
        this.opened = false;
        this.closedStream.emit();
        this._focusedElementBeforeOpen = null;
      }
    };
    if (
      this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function'
    ) {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }
  /** Open the calendar as a dialog. */
  _openAsDialog() {
    this._dialogRef = this._dialog.open(MatDatetimepickerContentComponent, {
      direction: this._dir ? this._dir.value : 'ltr',
      viewContainerRef: this._viewContainerRef,
      panelClass: 'mat-datetimepicker-dialog',
    });
    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.datetimepicker = this;
  }
  /** Open the calendar as a popup. */
  _openAsPopup() {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal(
        MatDatetimepickerContentComponent,
        this._viewContainerRef
      );
    }
    if (!this._popupRef) {
      this._createPopup();
    }
    if (!this._popupRef.hasAttached()) {
      const componentRef = this._popupRef.attach(this._calendarPortal);
      componentRef.instance.datetimepicker = this;
      // Update the position once the calendar has rendered.
      this._ngZone.onStable
        .asObservable()
        .pipe(first())
        .subscribe(() => {
          this._popupRef.updatePosition();
        });
    }
    this._popupRef.backdropClick().subscribe(() => this.close());
  }
  /** Create the popup. */
  _createPopup() {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      direction: this._dir ? this._dir.value : 'ltr',
      scrollStrategy: this._scrollStrategy(),
      panelClass: 'mat-datetimepicker-popup',
    });
    this._popupRef = this._overlay.create(overlayConfig);
  }
  /** Create the popup PositionStrategy. */
  _createPopupPositionStrategy() {
    return this._overlay
      .position()
      .flexibleConnectedTo(this._datepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.mat-datetimepicker-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);
  }
}
/** @nocollapse */ MatDatetimepickerComponent.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerComponent,
  deps: [
    { token: i3.MatDialog },
    { token: i4.Overlay },
    { token: i0.NgZone },
    { token: i0.ViewContainerRef },
    { token: MAT_DATEPICKER_SCROLL_STRATEGY },
    { token: i5.DatetimeAdapter, optional: true },
    { token: i6.Directionality, optional: true },
    { token: DOCUMENT, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
/** @nocollapse */ MatDatetimepickerComponent.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.5',
  type: MatDatetimepickerComponent,
  selector: 'mat-datetimepicker',
  inputs: {
    multiYearSelector: 'multiYearSelector',
    twelvehour: 'twelvehour',
    startView: 'startView',
    mode: 'mode',
    timeInterval: 'timeInterval',
    ariaNextMonthLabel: 'ariaNextMonthLabel',
    ariaPrevMonthLabel: 'ariaPrevMonthLabel',
    ariaNextYearLabel: 'ariaNextYearLabel',
    ariaPrevYearLabel: 'ariaPrevYearLabel',
    confirmLabel: 'confirmLabel',
    cancelLabel: 'cancelLabel',
    preventSameDateTimeSelection: 'preventSameDateTimeSelection',
    panelClass: 'panelClass',
    startAt: 'startAt',
    openOnFocus: 'openOnFocus',
    type: 'type',
    touchUi: 'touchUi',
    disabled: 'disabled',
  },
  outputs: {
    selectedChanged: 'selectedChanged',
    openedStream: 'opened',
    closedStream: 'closed',
    viewChanged: 'viewChanged',
  },
  exportAs: ['matDatetimepicker'],
  ngImport: i0,
  template: '',
  isInline: true,
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-datetimepicker',
          exportAs: 'matDatetimepicker',
          template: '',
          changeDetection: ChangeDetectionStrategy.OnPush,
          encapsulation: ViewEncapsulation.None,
          preserveWhitespaces: false,
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i3.MatDialog },
      { type: i4.Overlay },
      { type: i0.NgZone },
      { type: i0.ViewContainerRef },
      {
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: [MAT_DATEPICKER_SCROLL_STRATEGY],
          },
        ],
      },
      {
        type: i5.DatetimeAdapter,
        decorators: [
          {
            type: Optional,
          },
        ],
      },
      {
        type: i6.Directionality,
        decorators: [
          {
            type: Optional,
          },
        ],
      },
      {
        type: undefined,
        decorators: [
          {
            type: Optional,
          },
          {
            type: Inject,
            args: [DOCUMENT],
          },
        ],
      },
    ];
  },
  propDecorators: {
    multiYearSelector: [
      {
        type: Input,
      },
    ],
    twelvehour: [
      {
        type: Input,
      },
    ],
    startView: [
      {
        type: Input,
      },
    ],
    mode: [
      {
        type: Input,
      },
    ],
    timeInterval: [
      {
        type: Input,
      },
    ],
    ariaNextMonthLabel: [
      {
        type: Input,
      },
    ],
    ariaPrevMonthLabel: [
      {
        type: Input,
      },
    ],
    ariaNextYearLabel: [
      {
        type: Input,
      },
    ],
    ariaPrevYearLabel: [
      {
        type: Input,
      },
    ],
    confirmLabel: [
      {
        type: Input,
      },
    ],
    cancelLabel: [
      {
        type: Input,
      },
    ],
    preventSameDateTimeSelection: [
      {
        type: Input,
      },
    ],
    selectedChanged: [
      {
        type: Output,
      },
    ],
    panelClass: [
      {
        type: Input,
      },
    ],
    openedStream: [
      {
        type: Output,
        args: ['opened'],
      },
    ],
    closedStream: [
      {
        type: Output,
        args: ['closed'],
      },
    ],
    viewChanged: [
      {
        type: Output,
      },
    ],
    startAt: [
      {
        type: Input,
      },
    ],
    openOnFocus: [
      {
        type: Input,
      },
    ],
    type: [
      {
        type: Input,
      },
    ],
    touchUi: [
      {
        type: Input,
      },
    ],
    disabled: [
      {
        type: Input,
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmUvc3JjL2RhdGV0aW1lcGlja2VyL2RhdGV0aW1lcGlja2VyLWNvbnRlbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFDTCxPQUFPLEVBQ1AsYUFBYSxHQUdkLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsU0FBUyxFQUFnQixNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUVMLGtDQUFrQyxHQUNuQyxNQUFNLFlBQVksQ0FBQztBQUNwQixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7Ozs7Ozs7QUFPckUsaUVBQWlFO0FBQ2pFLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0FBRTFCOzs7Ozs7R0FNRztBQWFILE1BQU0sT0FBTyxpQ0FBaUM7SUFaOUM7UUFrQkUsZ0JBQVcsR0FBTSxJQUFJLENBQUM7S0FrQ3ZCO0lBaENDLGtCQUFrQjtRQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELGlCQUFpQixDQUFDLElBQU87UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELGtCQUFrQixDQUFDLElBQU87UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFRO1FBQ2xCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsRUFBRTtZQUNwQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUN6QjthQUFNLElBQUksR0FBRyxLQUFLLElBQUk7WUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7O09BR0c7SUFDSCxjQUFjLENBQUMsS0FBb0I7UUFDakMsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRTtZQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzVCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDOztpSkF2Q1UsaUNBQWlDO3FJQUFqQyxpQ0FBaUMsOFNBR2pDLGtDQUFrQyw4RENwRS9DLHNyQ0EyQkE7MkZEc0NhLGlDQUFpQztrQkFaN0MsU0FBUzsrQkFDRSw0QkFBNEIsUUFHaEM7d0JBQ0osS0FBSyxFQUFFLDRCQUE0Qjt3QkFDbkMsMENBQTBDLEVBQUUseUJBQXlCO3dCQUNyRSxXQUFXLEVBQUUsd0JBQXdCO3FCQUN0QyxpQkFDYyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNOzhCQU0vQyxTQUFTO3NCQURSLFNBQVM7dUJBQUMsa0NBQWtDLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztBQStDakUsTUFBTSxPQUFPLDBCQUEwQjtJQXNEckMsWUFDVSxPQUFrQixFQUNsQixRQUFpQixFQUNqQixPQUFlLEVBQ2YsaUJBQW1DLEVBQ0ssZUFBZSxFQUMzQyxZQUFnQyxFQUNoQyxJQUFvQixFQUNGLFNBQWM7UUFQNUMsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQUNsQixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ0ssb0JBQWUsR0FBZixlQUFlLENBQUE7UUFDM0MsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQ2hDLFNBQUksR0FBSixJQUFJLENBQWdCO1FBQ0YsY0FBUyxHQUFULFNBQVMsQ0FBSztRQTdEdEQsaURBQWlEO1FBQ3hDLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUM1QyxrREFBa0Q7UUFDekMsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUNyQyxrREFBa0Q7UUFDekMsY0FBUyxHQUFvQixPQUFPLENBQUM7UUFDckMsU0FBSSxHQUEwQixNQUFNLENBQUM7UUFDckMsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsdUJBQWtCLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLHVCQUFrQixHQUFHLGdCQUFnQixDQUFDO1FBQ3RDLHNCQUFpQixHQUFHLFdBQVcsQ0FBQztRQUNoQyxzQkFBaUIsR0FBRyxlQUFlLENBQUM7UUFDcEMsaUJBQVksR0FBVyxJQUFJLENBQUM7UUFDNUIsZ0JBQVcsR0FBVyxRQUFRLENBQUM7UUFDeEMsNENBQTRDO1FBQ25DLGlDQUE0QixHQUFHLEtBQUssQ0FBQztRQUM5Qzs7O1dBR0c7UUFDTyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFLLENBQUM7UUFHbEQsaURBQWlEO1FBQ2pELDREQUE0RDtRQUMxQyxpQkFBWSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBQzlFLGlEQUFpRDtRQUNqRCw0REFBNEQ7UUFDMUMsaUJBQVksR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUM5RSw2Q0FBNkM7UUFDbkMsZ0JBQVcsR0FDbkIsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFDdEMsb0NBQW9DO1FBQ3BDLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZiwwQ0FBMEM7UUFDMUMsT0FBRSxHQUFHLHNCQUFzQixpQkFBaUIsRUFBRSxFQUFFLENBQUM7UUFHakQsNkNBQTZDO1FBQzdDLG9CQUFlLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUNqQyxtQkFBYyxHQUFhLElBQUksQ0FBQztRQVN4QyxxRUFBcUU7UUFDN0QsOEJBQXlCLEdBQXVCLElBQUksQ0FBQztRQUNyRCx1QkFBa0IsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBNkN4QyxVQUFLLEdBQTBCLE1BQU0sQ0FBQztRQVd0QyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBNUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixNQUFNLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQztJQUlELGtEQUFrRDtJQUNsRCxJQUNJLE9BQU87UUFDVCw2RkFBNkY7UUFDN0YscUJBQXFCO1FBQ3JCLE9BQU8sQ0FDTCxJQUFJLENBQUMsUUFBUTtZQUNiLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDN0QsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFjO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBSUQsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLFdBQVcsQ0FBQyxLQUFjO1FBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUlELElBQ0ksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsS0FBNEI7UUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksTUFBTSxDQUFDO0lBQy9CLENBQUM7SUFJRDs7O09BR0c7SUFDSCxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLEtBQWM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBSUQsd0RBQXdEO0lBQ3hELElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGdCQUFnQjtZQUMxRCxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVE7WUFDaEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLFFBQVEsQ0FBQyxLQUFjO1FBQ3pCLE1BQU0sUUFBUSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTlDLElBQUksUUFBUSxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBSSxTQUFTLENBQUMsS0FBZTtRQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7SUFDNUQsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO0lBQzVELENBQUM7SUFFRCxJQUFJLFdBQVc7UUFJYixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRCxZQUFZLENBQUMsSUFBcUI7UUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFRCw2QkFBNkI7SUFDN0IsT0FBTyxDQUFDLElBQU87UUFDYixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzdELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILGNBQWMsQ0FBQyxLQUF5QztRQUN0RCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixNQUFNLEtBQUssQ0FDVCw2REFBNkQsQ0FDOUQsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ3BFLENBQUMsS0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQzlDLENBQUM7SUFDSixDQUFDO0lBRUQseUJBQXlCO0lBQ3pCLElBQUk7UUFDRixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLE1BQU0sS0FBSyxDQUNULDhEQUE4RCxDQUMvRCxDQUFDO1NBQ0g7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1NBQy9EO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsMEJBQTBCO0lBQzFCLEtBQUs7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNsRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7UUFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUU7WUFDM0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUMvQjtRQUVELE1BQU0sYUFBYSxHQUFHLEdBQUcsRUFBRTtZQUN6QiwrQ0FBK0M7WUFDL0MseUNBQXlDO1lBQ3pDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQzthQUN2QztRQUNILENBQUMsQ0FBQztRQUVGLElBQ0UsSUFBSSxDQUFDLHlCQUF5QjtZQUM5QixPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUMxRDtZQUNBLDBGQUEwRjtZQUMxRiwyRkFBMkY7WUFDM0YseUZBQXlGO1lBQ3pGLHVGQUF1RjtZQUN2RiwyQ0FBMkM7WUFDM0MsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3ZDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsYUFBYSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQscUNBQXFDO0lBQzdCLGFBQWE7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRTtZQUNyRSxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUs7WUFDOUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtZQUN4QyxVQUFVLEVBQUUsMkJBQTJCO1NBQ3hDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUMxRCxDQUFDO0lBRUQsb0NBQW9DO0lBQzVCLFlBQVk7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FFeEMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDOUQ7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNqQyxNQUFNLFlBQVksR0FDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzlDLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUU1QyxzREFBc0Q7WUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2lCQUNsQixZQUFZLEVBQUU7aUJBQ2QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNiLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztTQUNOO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELHdCQUF3QjtJQUNoQixZQUFZO1FBQ2xCLE1BQU0sYUFBYSxHQUFHLElBQUksYUFBYSxDQUFDO1lBQ3RDLGdCQUFnQixFQUFFLElBQUksQ0FBQyw0QkFBNEIsRUFBRTtZQUNyRCxXQUFXLEVBQUUsSUFBSTtZQUNqQixhQUFhLEVBQUUsa0NBQWtDO1lBQ2pELFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSztZQUM5QyxjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QyxVQUFVLEVBQUUsMEJBQTBCO1NBQ3ZDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHlDQUF5QztJQUNqQyw0QkFBNEI7UUFDbEMsT0FBTyxJQUFJLENBQUMsUUFBUTthQUNqQixRQUFRLEVBQUU7YUFDVixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsQ0FBQzthQUN0RSxxQkFBcUIsQ0FBQyw2QkFBNkIsQ0FBQzthQUNwRCxzQkFBc0IsQ0FBQyxLQUFLLENBQUM7YUFDN0Isa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2FBQ3JCLGtCQUFrQixFQUFFO2FBQ3BCLGFBQWEsQ0FBQztZQUNiO2dCQUNFLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixPQUFPLEVBQUUsUUFBUTtnQkFDakIsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixRQUFRLEVBQUUsS0FBSztnQkFDZixRQUFRLEVBQUUsS0FBSzthQUNoQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFFBQVEsRUFBRSxRQUFRO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7MElBM1dVLDBCQUEwQix3SEEyRDNCLDhCQUE4QiwwR0FHbEIsUUFBUTs4SEE5RG5CLDBCQUEwQix3d0JBTDNCLEVBQUU7MkZBS0QsMEJBQTBCO2tCQVJ0QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSxFQUFFO29CQUNaLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsbUJBQW1CLEVBQUUsS0FBSztpQkFDM0I7OzBCQTRESSxNQUFNOzJCQUFDLDhCQUE4Qjs7MEJBQ3JDLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsUUFBUTs0Q0E1RHJCLGlCQUFpQjtzQkFBekIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csSUFBSTtzQkFBWixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ0csa0JBQWtCO3NCQUExQixLQUFLO2dCQUNHLGtCQUFrQjtzQkFBMUIsS0FBSztnQkFDRyxpQkFBaUI7c0JBQXpCLEtBQUs7Z0JBQ0csaUJBQWlCO3NCQUF6QixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFFRyw0QkFBNEI7c0JBQXBDLEtBQUs7Z0JBS0ksZUFBZTtzQkFBeEIsTUFBTTtnQkFFRSxVQUFVO3NCQUFsQixLQUFLO2dCQUdZLFlBQVk7c0JBQTdCLE1BQU07dUJBQUMsUUFBUTtnQkFHRSxZQUFZO3NCQUE3QixNQUFNO3VCQUFDLFFBQVE7Z0JBRU4sV0FBVztzQkFBcEIsTUFBTTtnQkEwQ0gsT0FBTztzQkFEVixLQUFLO2dCQWlCRixXQUFXO3NCQURkLEtBQUs7Z0JBWUYsSUFBSTtzQkFEUCxLQUFLO2dCQWdCRixPQUFPO3NCQURWLEtBQUs7Z0JBYUYsUUFBUTtzQkFEWCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgRVNDQVBFIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFBvc2l0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RhdGVwaWNrZXInO1xuaW1wb3J0IHsgTWF0RGlhbG9nLCBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERhdGV0aW1lQWRhcHRlciB9IGZyb20gJy4uL2FkYXB0ZXIvZGF0ZXRpbWUtYWRhcHRlcic7XG5pbXBvcnQge1xuICBNYXRDYWxlbmRhclZpZXcsXG4gIE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDb21wb25lbnQsXG59IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWVycm9ycyc7XG5pbXBvcnQgeyBNYXREYXRldGltZXBpY2tlckZpbHRlclR5cGUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWZpbHRlcnR5cGUnO1xuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJJbnB1dERpcmVjdGl2ZSB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItaW5wdXQnO1xuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci10eXBlJztcblxuZXhwb3J0IHR5cGUgTWF0RGF0ZXRpbWVwaWNrZXJNb2RlID0gJ2F1dG8nIHwgJ3BvcnRyYWl0JyB8ICdsYW5kc2NhcGUnO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgZWFjaCBkYXRlcGlja2VyIGluc3RhbmNlLiAqL1xubGV0IGRhdGV0aW1lcGlja2VyVWlkID0gMDtcblxuLyoqXG4gKiBDb21wb25lbnQgdXNlZCBhcyB0aGUgY29udGVudCBmb3IgdGhlIGRhdGVwaWNrZXIgZGlhbG9nIGFuZCBwb3B1cC4gV2UgdXNlIHRoaXMgaW5zdGVhZCBvZiB1c2luZ1xuICogTWF0Q2FsZW5kYXIgZGlyZWN0bHkgYXMgdGhlIGNvbnRlbnQgc28gd2UgY2FuIGNvbnRyb2wgdGhlIGluaXRpYWwgZm9jdXMuIFRoaXMgYWxzbyBnaXZlcyB1cyBhXG4gKiBwbGFjZSB0byBwdXQgYWRkaXRpb25hbCBmZWF0dXJlcyBvZiB0aGUgcG9wdXAgdGhhdCBhcmUgbm90IHBhcnQgb2YgdGhlIGNhbGVuZGFyIGl0c2VsZiBpbiB0aGVcbiAqIGZ1dHVyZS4gKGUuZy4gY29uZmlybWF0aW9uIGJ1dHRvbnMpLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZXRpbWVwaWNrZXItY29udGVudCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZXRpbWVwaWNrZXItY29udGVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGV0aW1lcGlja2VyLWNvbnRlbnQuc2NzcyddLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZGF0ZXRpbWVwaWNrZXItY29udGVudCcsXG4gICAgJ1tjbGFzcy5tYXQtZGF0ZXRpbWVwaWNrZXItY29udGVudC10b3VjaF0nOiAnZGF0ZXRpbWVwaWNrZXI/LnRvdWNoVWknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRldGltZXBpY2tlckNvbnRlbnRDb21wb25lbnQ8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgZGF0ZXRpbWVwaWNrZXI6IE1hdERhdGV0aW1lcGlja2VyQ29tcG9uZW50PEQ+O1xuXG4gIEBWaWV3Q2hpbGQoTWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckNvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUgfSlcbiAgX2NhbGVuZGFyOiBNYXREYXRldGltZXBpY2tlckNhbGVuZGFyQ29tcG9uZW50PEQ+O1xuXG4gIGNoYW5nZWREYXRlOiBEID0gbnVsbDtcblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fY2FsZW5kYXIuX2ZvY3VzQWN0aXZlQ2VsbCgpO1xuICB9XG5cbiAgb25TZWxlY3Rpb25DaGFuZ2UoZGF0ZTogRCkge1xuICAgIHRoaXMuY2hhbmdlZERhdGUgPSBkYXRlO1xuICB9XG5cbiAgb25TZWxlY3Rpb25Db25maXJtKGRhdGU6IEQpIHtcbiAgICB0aGlzLmRhdGV0aW1lcGlja2VyLl9zZWxlY3QoZGF0ZSk7XG4gIH1cblxuICBoYW5kbGVDbG9zZSh2YWw6IGFueSkge1xuICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMuY2hhbmdlZERhdGUgPz8gdmFsO1xuICAgIGlmICgodmFsICYmIHRoaXMuY2hhbmdlZERhdGUpIHx8IHZhbCkge1xuICAgICAgdGhpcy5vblNlbGVjdGlvbkNvbmZpcm0obmV3VmFsdWUpO1xuICAgICAgdGhpcy5kYXRldGltZXBpY2tlci5jbG9zZSgpO1xuICAgICAgdGhpcy5jaGFuZ2VkRGF0ZSA9IG51bGw7XG4gICAgfSBlbHNlIGlmICh2YWwgPT09IG51bGwpIHRoaXMuZGF0ZXRpbWVwaWNrZXIuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGtleWRvd24gZXZlbnQgb24gZGF0ZXBpY2tlciBjb250ZW50LlxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50LlxuICAgKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFKSB7XG4gICAgICB0aGlzLmRhdGV0aW1lcGlja2VyLmNsb3NlKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kYXRldGltZXBpY2tlcicsXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXRpbWVwaWNrZXInLFxuICB0ZW1wbGF0ZTogJycsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXRpbWVwaWNrZXJDb21wb25lbnQ8RD4gaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogQWN0aXZlIG11bHRpIHllYXIgdmlldyB3aGVuIGNsaWNrIG9uIHllYXIuICovXG4gIEBJbnB1dCgpIG11bHRpWWVhclNlbGVjdG9yOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKiBpZiB0cnVlIGNoYW5nZSB0aGUgY2xvY2sgdG8gMTIgaG91ciBmb3JtYXQuICovXG4gIEBJbnB1dCgpIHR3ZWx2ZWhvdXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqIFRoZSB2aWV3IHRoYXQgdGhlIGNhbGVuZGFyIHNob3VsZCBzdGFydCBpbi4gKi9cbiAgQElucHV0KCkgc3RhcnRWaWV3OiBNYXRDYWxlbmRhclZpZXcgPSAnbW9udGgnO1xuICBASW5wdXQoKSBtb2RlOiBNYXREYXRldGltZXBpY2tlck1vZGUgPSAnYXV0byc7XG4gIEBJbnB1dCgpIHRpbWVJbnRlcnZhbDogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgYXJpYU5leHRNb250aExhYmVsID0gJ05leHQgbW9udGgnO1xuICBASW5wdXQoKSBhcmlhUHJldk1vbnRoTGFiZWwgPSAnUHJldmlvdXMgbW9udGgnO1xuICBASW5wdXQoKSBhcmlhTmV4dFllYXJMYWJlbCA9ICdOZXh0IHllYXInO1xuICBASW5wdXQoKSBhcmlhUHJldlllYXJMYWJlbCA9ICdQcmV2aW91cyB5ZWFyJztcbiAgQElucHV0KCkgY29uZmlybUxhYmVsOiBzdHJpbmcgPSAnT2snO1xuICBASW5wdXQoKSBjYW5jZWxMYWJlbDogc3RyaW5nID0gJ0NhbmNlbCc7XG4gIC8qKiBQcmV2ZW50IHVzZXIgdG8gc2VsZWN0IHNhbWUgZGF0ZSB0aW1lICovXG4gIEBJbnB1dCgpIHByZXZlbnRTYW1lRGF0ZVRpbWVTZWxlY3Rpb24gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEVtaXRzIG5ldyBzZWxlY3RlZCBkYXRlIHdoZW4gc2VsZWN0ZWQgZGF0ZSBjaGFuZ2VzLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gdGhlIGBkYXRlQ2hhbmdlYCBhbmQgYGRhdGVJbnB1dGAgYmluZGluZyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICovXG4gIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG4gIC8qKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgZGF0ZSBwaWNrZXIgcGFuZWwuIFN1cHBvcnRzIHRoZSBzYW1lIHN5bnRheCBhcyBgbmdDbGFzc2AuICovXG4gIEBJbnB1dCgpIHBhbmVsQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdO1xuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8tb3V0cHV0LXJlbmFtZVxuICBAT3V0cHV0KCdvcGVuZWQnKSBvcGVuZWRTdHJlYW06IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L25vLW91dHB1dC1yZW5hbWVcbiAgQE91dHB1dCgnY2xvc2VkJykgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSB2aWV3IGhhcyBiZWVuIGNoYW5nZWQuICoqL1xuICBAT3V0cHV0KCkgdmlld0NoYW5nZWQ6IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclZpZXc+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVmlldz4oKTtcbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIGlzIG9wZW4uICovXG4gIG9wZW5lZCA9IGZhbHNlO1xuICAvKiogVGhlIGlkIGZvciB0aGUgZGF0ZXBpY2tlciBjYWxlbmRhci4gKi9cbiAgaWQgPSBgbWF0LWRhdGV0aW1lcGlja2VyLSR7ZGF0ZXRpbWVwaWNrZXJVaWQrK31gO1xuICAvKiogVGhlIGlucHV0IGVsZW1lbnQgdGhpcyBkYXRlcGlja2VyIGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgX2RhdGVwaWNrZXJJbnB1dDogTWF0RGF0ZXRpbWVwaWNrZXJJbnB1dERpcmVjdGl2ZTxEPjtcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIgaXMgZGlzYWJsZWQuICovXG4gIF9kaXNhYmxlZENoYW5nZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgX3ZhbGlkU2VsZWN0ZWQ6IEQgfCBudWxsID0gbnVsbDtcbiAgLyoqIEEgcmVmZXJlbmNlIHRvIHRoZSBvdmVybGF5IHdoZW4gdGhlIGNhbGVuZGFyIGlzIG9wZW5lZCBhcyBhIHBvcHVwLiAqL1xuICBwcml2YXRlIF9wb3B1cFJlZjogT3ZlcmxheVJlZjtcbiAgLyoqIEEgcmVmZXJlbmNlIHRvIHRoZSBkaWFsb2cgd2hlbiB0aGUgY2FsZW5kYXIgaXMgb3BlbmVkIGFzIGEgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9kaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+IHwgbnVsbDtcbiAgLyoqIEEgcG9ydGFsIGNvbnRhaW5pbmcgdGhlIGNhbGVuZGFyIGZvciB0aGlzIGRhdGVwaWNrZXIuICovXG4gIHByaXZhdGUgX2NhbGVuZGFyUG9ydGFsOiBDb21wb25lbnRQb3J0YWw8XG4gICAgTWF0RGF0ZXRpbWVwaWNrZXJDb250ZW50Q29tcG9uZW50PEQ+XG4gID47XG4gIC8qKiBUaGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGF0ZXBpY2tlciB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2lucHV0U3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nLFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSkgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3ksXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGV0aW1lQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnlcbiAgKSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc3RhcnRBdDogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBkYXRlIHRvIG9wZW4gdGhlIGNhbGVuZGFyIHRvIGluaXRpYWxseS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0YXJ0QXQoKTogRCB8IG51bGwge1xuICAgIC8vIElmIGFuIGV4cGxpY2l0IHN0YXJ0QXQgaXMgc2V0IHdlIHN0YXJ0IHRoZXJlLCBvdGhlcndpc2Ugd2Ugc3RhcnQgYXQgd2hhdGV2ZXIgdGhlIGN1cnJlbnRseVxuICAgIC8vIHNlbGVjdGVkIHZhbHVlIGlzLlxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9zdGFydEF0IHx8XG4gICAgICAodGhpcy5fZGF0ZXBpY2tlcklucHV0ID8gdGhpcy5fZGF0ZXBpY2tlcklucHV0LnZhbHVlIDogbnVsbClcbiAgICApO1xuICB9XG5cbiAgc2V0IHN0YXJ0QXQoZGF0ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9zdGFydEF0ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKGRhdGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfb3Blbk9uRm9jdXM6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5PbkZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vcGVuT25Gb2N1cztcbiAgfVxuXG4gIHNldCBvcGVuT25Gb2N1cyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX29wZW5PbkZvY3VzID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3R5cGU6IE1hdERhdGV0aW1lcGlja2VyVHlwZSA9ICdkYXRlJztcblxuICBASW5wdXQoKVxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuXG4gIHNldCB0eXBlKHZhbHVlOiBNYXREYXRldGltZXBpY2tlclR5cGUpIHtcbiAgICB0aGlzLl90eXBlID0gdmFsdWUgfHwgJ2RhdGUnO1xuICB9XG5cbiAgcHJpdmF0ZSBfdG91Y2hVaSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBVSSBpcyBpbiB0b3VjaCBtb2RlLiBJbiB0b3VjaCBtb2RlIHRoZSBjYWxlbmRhciBvcGVucyBpbiBhIGRpYWxvZyByYXRoZXJcbiAgICogdGhhbiBhIHBvcHVwIGFuZCBlbGVtZW50cyBoYXZlIG1vcmUgcGFkZGluZyB0byBhbGxvdyBmb3IgYmlnZ2VyIHRvdWNoIHRhcmdldHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdG91Y2hVaSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdG91Y2hVaTtcbiAgfVxuXG4gIHNldCB0b3VjaFVpKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdG91Y2hVaSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBwb3AtdXAgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkID09PSB1bmRlZmluZWQgJiYgdGhpcy5fZGF0ZXBpY2tlcklucHV0XG4gICAgICA/IHRoaXMuX2RhdGVwaWNrZXJJbnB1dC5kaXNhYmxlZFxuICAgICAgOiAhIXRoaXMuX2Rpc2FibGVkO1xuICB9XG5cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLm5leHQobmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gIGdldCBfc2VsZWN0ZWQoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl92YWxpZFNlbGVjdGVkO1xuICB9XG5cbiAgc2V0IF9zZWxlY3RlZCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl92YWxpZFNlbGVjdGVkID0gdmFsdWU7XG4gIH1cblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBnZXQgX21pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9kYXRlcGlja2VySW5wdXQgJiYgdGhpcy5fZGF0ZXBpY2tlcklucHV0Lm1pbjtcbiAgfVxuXG4gIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIGdldCBfbWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVwaWNrZXJJbnB1dCAmJiB0aGlzLl9kYXRlcGlja2VySW5wdXQubWF4O1xuICB9XG5cbiAgZ2V0IF9kYXRlRmlsdGVyKCk6IChcbiAgICBkYXRlOiBEIHwgbnVsbCxcbiAgICB0eXBlOiBNYXREYXRldGltZXBpY2tlckZpbHRlclR5cGVcbiAgKSA9PiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuX2RhdGVwaWNrZXJJbnB1dC5fZGF0ZUZpbHRlcjtcbiAgfVxuXG4gIF9oYW5kbGVGb2N1cygpIHtcbiAgICBpZiAoIXRoaXMub3BlbmVkICYmIHRoaXMub3Blbk9uRm9jdXMpIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIF92aWV3Q2hhbmdlZCh0eXBlOiBNYXRDYWxlbmRhclZpZXcpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdDaGFuZ2VkLmVtaXQodHlwZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5faW5wdXRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9kaXNhYmxlZENoYW5nZS5jb21wbGV0ZSgpO1xuXG4gICAgaWYgKHRoaXMuX3BvcHVwUmVmKSB7XG4gICAgICB0aGlzLl9wb3B1cFJlZi5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGdpdmVuIGRhdGUgKi9cbiAgX3NlbGVjdChkYXRlOiBEKTogdm9pZCB7XG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl9zZWxlY3RlZDtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IGRhdGU7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZXRpbWUob2xkVmFsdWUsIHRoaXMuX3NlbGVjdGVkKSkge1xuICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZWQuZW1pdChkYXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gaW5wdXQgd2l0aCB0aGlzIGRhdGVwaWNrZXIuXG4gICAqIEBwYXJhbSBpbnB1dCBUaGUgZGF0ZXBpY2tlciBpbnB1dCB0byByZWdpc3RlciB3aXRoIHRoaXMgZGF0ZXBpY2tlci5cbiAgICovXG4gIF9yZWdpc3RlcklucHV0KGlucHV0OiBNYXREYXRldGltZXBpY2tlcklucHV0RGlyZWN0aXZlPEQ+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2RhdGVwaWNrZXJJbnB1dCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdBIE1hdERhdGVwaWNrZXIgY2FuIG9ubHkgYmUgYXNzb2NpYXRlZCB3aXRoIGEgc2luZ2xlIGlucHV0LidcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuX2RhdGVwaWNrZXJJbnB1dCA9IGlucHV0O1xuICAgIHRoaXMuX2lucHV0U3Vic2NyaXB0aW9uID0gdGhpcy5fZGF0ZXBpY2tlcklucHV0Ll92YWx1ZUNoYW5nZS5zdWJzY3JpYmUoXG4gICAgICAodmFsdWU6IEQgfCBudWxsKSA9PiAodGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZSlcbiAgICApO1xuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wZW5lZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5fZGF0ZXBpY2tlcklucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0F0dGVtcHRlZCB0byBvcGVuIGFuIE1hdERhdGVwaWNrZXIgd2l0aCBubyBhc3NvY2lhdGVkIGlucHV0LidcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9kb2N1bWVudCkge1xuICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICB0aGlzLnRvdWNoVWkgPyB0aGlzLl9vcGVuQXNEaWFsb2coKSA6IHRoaXMuX29wZW5Bc1BvcHVwKCk7XG4gICAgdGhpcy5vcGVuZWQgPSB0cnVlO1xuICAgIHRoaXMub3BlbmVkU3RyZWFtLmVtaXQoKTtcbiAgfVxuXG4gIC8qKiBDbG9zZSB0aGUgY2FsZW5kYXIuICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5vcGVuZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3BvcHVwUmVmICYmIHRoaXMuX3BvcHVwUmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX3BvcHVwUmVmLmRldGFjaCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICB0aGlzLl9kaWFsb2dSZWYuY2xvc2UoKTtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZiA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jYWxlbmRhclBvcnRhbCAmJiB0aGlzLl9jYWxlbmRhclBvcnRhbC5pc0F0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9jYWxlbmRhclBvcnRhbC5kZXRhY2goKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb21wbGV0ZUNsb3NlID0gKCkgPT4ge1xuICAgICAgLy8gVGhlIGBfb3BlbmVkYCBjb3VsZCd2ZSBiZWVuIHJlc2V0IGFscmVhZHkgaWZcbiAgICAgIC8vIHdlIGdvdCB0d28gZXZlbnRzIGluIHF1aWNrIHN1Y2Nlc3Npb24uXG4gICAgICBpZiAodGhpcy5vcGVuZWQpIHtcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbG9zZWRTdHJlYW0uZW1pdCgpO1xuICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gJiZcbiAgICAgIHR5cGVvZiB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4uZm9jdXMgPT09ICdmdW5jdGlvbidcbiAgICApIHtcbiAgICAgIC8vIEJlY2F1c2UgSUUgbW92ZXMgZm9jdXMgYXN5bmNocm9ub3VzbHksIHdlIGNhbid0IGNvdW50IG9uIGl0IGJlaW5nIHJlc3RvcmVkIGJlZm9yZSB3ZSd2ZVxuICAgICAgLy8gbWFya2VkIHRoZSBkYXRlcGlja2VyIGFzIGNsb3NlZC4gSWYgdGhlIGV2ZW50IGZpcmVzIG91dCBvZiBzZXF1ZW5jZSBhbmQgdGhlIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2UncmUgcmVmb2N1c2luZyBvcGVucyB0aGUgZGF0ZXBpY2tlciBvbiBmb2N1cywgdGhlIHVzZXIgY291bGQgYmUgc3R1Y2sgd2l0aCBub3QgYmVpbmdcbiAgICAgIC8vIGFibGUgdG8gY2xvc2UgdGhlIGNhbGVuZGFyIGF0IGFsbC4gV2Ugd29yayBhcm91bmQgaXQgYnkgbWFraW5nIHRoZSBsb2dpYywgdGhhdCBtYXJrc1xuICAgICAgLy8gdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLCBhc3luYyBhcyB3ZWxsLlxuICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuLmZvY3VzKCk7XG4gICAgICBzZXRUaW1lb3V0KGNvbXBsZXRlQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wbGV0ZUNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9vcGVuQXNEaWFsb2coKTogdm9pZCB7XG4gICAgdGhpcy5fZGlhbG9nUmVmID0gdGhpcy5fZGlhbG9nLm9wZW4oTWF0RGF0ZXRpbWVwaWNrZXJDb250ZW50Q29tcG9uZW50LCB7XG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA6ICdsdHInLFxuICAgICAgdmlld0NvbnRhaW5lclJlZjogdGhpcy5fdmlld0NvbnRhaW5lclJlZixcbiAgICAgIHBhbmVsQ2xhc3M6ICdtYXQtZGF0ZXRpbWVwaWNrZXItZGlhbG9nJyxcbiAgICB9KTtcbiAgICB0aGlzLl9kaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICB0aGlzLl9kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZGF0ZXRpbWVwaWNrZXIgPSB0aGlzO1xuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgcG9wdXAuICovXG4gIHByaXZhdGUgX29wZW5Bc1BvcHVwKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY2FsZW5kYXJQb3J0YWwpIHtcbiAgICAgIHRoaXMuX2NhbGVuZGFyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbDxcbiAgICAgICAgTWF0RGF0ZXRpbWVwaWNrZXJDb250ZW50Q29tcG9uZW50PEQ+XG4gICAgICA+KE1hdERhdGV0aW1lcGlja2VyQ29udGVudENvbXBvbmVudCwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9wb3B1cFJlZikge1xuICAgICAgdGhpcy5fY3JlYXRlUG9wdXAoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3BvcHVwUmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPE1hdERhdGV0aW1lcGlja2VyQ29udGVudENvbXBvbmVudDxEPj4gPVxuICAgICAgICB0aGlzLl9wb3B1cFJlZi5hdHRhY2godGhpcy5fY2FsZW5kYXJQb3J0YWwpO1xuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmRhdGV0aW1lcGlja2VyID0gdGhpcztcblxuICAgICAgLy8gVXBkYXRlIHRoZSBwb3NpdGlvbiBvbmNlIHRoZSBjYWxlbmRhciBoYXMgcmVuZGVyZWQuXG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGVcbiAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3BvcHVwUmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX3BvcHVwUmVmLmJhY2tkcm9wQ2xpY2soKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIHBvcHVwLiAqL1xuICBwcml2YXRlIF9jcmVhdGVQb3B1cCgpOiB2b2lkIHtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fY3JlYXRlUG9wdXBQb3NpdGlvblN0cmF0ZWd5KCksXG4gICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6ICdtYXQtb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA6ICdsdHInLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgICBwYW5lbENsYXNzOiAnbWF0LWRhdGV0aW1lcGlja2VyLXBvcHVwJyxcbiAgICB9KTtcblxuICAgIHRoaXMuX3BvcHVwUmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBwb3B1cCBQb3NpdGlvblN0cmF0ZWd5LiAqL1xuICBwcml2YXRlIF9jcmVhdGVQb3B1cFBvc2l0aW9uU3RyYXRlZ3koKTogUG9zaXRpb25TdHJhdGVneSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9kYXRlcGlja2VySW5wdXQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpKVxuICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm1hdC1kYXRldGltZXBpY2tlci1jb250ZW50JylcbiAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgLndpdGhWaWV3cG9ydE1hcmdpbig4KVxuICAgICAgLndpdGhMb2NrZWRQb3NpdGlvbigpXG4gICAgICAud2l0aFBvc2l0aW9ucyhbXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiAnc3RhcnQnLFxuICAgICAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgICAgIG92ZXJsYXlYOiAnc3RhcnQnLFxuICAgICAgICAgIG92ZXJsYXlZOiAndG9wJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICAgICAgb3ZlcmxheVk6ICdib3R0b20nLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogJ2VuZCcsXG4gICAgICAgICAgb3JpZ2luWTogJ2JvdHRvbScsXG4gICAgICAgICAgb3ZlcmxheVg6ICdlbmQnLFxuICAgICAgICAgIG92ZXJsYXlZOiAndG9wJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6ICdlbmQnLFxuICAgICAgICAgIG9yaWdpblk6ICd0b3AnLFxuICAgICAgICAgIG92ZXJsYXlYOiAnZW5kJyxcbiAgICAgICAgICBvdmVybGF5WTogJ2JvdHRvbScsXG4gICAgICAgIH0sXG4gICAgICBdKTtcbiAgfVxufVxuIiwiPG1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhclxuICAoY2xvc2VEYXRlVGltZVBpY2tlcik9XCJoYW5kbGVDbG9zZSgkZXZlbnQpXCJcbiAgKHNlbGVjdGVkQ2hhbmdlKT1cIm9uU2VsZWN0aW9uQ2hhbmdlKCRldmVudClcIlxuICAodmlld0NoYW5nZWQpPVwiZGF0ZXRpbWVwaWNrZXIuX3ZpZXdDaGFuZ2VkKCRldmVudClcIlxuICBbYXJpYU5leHRNb250aExhYmVsXT1cImRhdGV0aW1lcGlja2VyLmFyaWFOZXh0TW9udGhMYWJlbFwiXG4gIFthcmlhTmV4dFllYXJMYWJlbF09XCJkYXRldGltZXBpY2tlci5hcmlhTmV4dFllYXJMYWJlbFwiXG4gIFthcmlhUHJldk1vbnRoTGFiZWxdPVwiZGF0ZXRpbWVwaWNrZXIuYXJpYVByZXZNb250aExhYmVsXCJcbiAgW2FyaWFQcmV2WWVhckxhYmVsXT1cImRhdGV0aW1lcGlja2VyLmFyaWFQcmV2WWVhckxhYmVsXCJcbiAgW3ByZXZlbnRTYW1lRGF0ZVRpbWVTZWxlY3Rpb25dPVwiZGF0ZXRpbWVwaWNrZXIucHJldmVudFNhbWVEYXRlVGltZVNlbGVjdGlvblwiXG4gIFthdHRyLm1vZGVdPVwiZGF0ZXRpbWVwaWNrZXIubW9kZVwiXG4gIFtkYXRlRmlsdGVyXT1cImRhdGV0aW1lcGlja2VyLl9kYXRlRmlsdGVyXCJcbiAgW2lkXT1cImRhdGV0aW1lcGlja2VyLmlkXCJcbiAgW21heERhdGVdPVwiZGF0ZXRpbWVwaWNrZXIuX21heERhdGVcIlxuICBbbWluRGF0ZV09XCJkYXRldGltZXBpY2tlci5fbWluRGF0ZVwiXG4gIFttdWx0aVllYXJTZWxlY3Rvcl09XCJkYXRldGltZXBpY2tlci5tdWx0aVllYXJTZWxlY3RvclwiXG4gIFtzZWxlY3RlZF09XCJkYXRldGltZXBpY2tlci5fc2VsZWN0ZWRcIlxuICBbc3RhcnRBdF09XCJkYXRldGltZXBpY2tlci5zdGFydEF0XCJcbiAgW3N0YXJ0Vmlld109XCJkYXRldGltZXBpY2tlci5zdGFydFZpZXdcIlxuICBbdGltZUludGVydmFsXT1cImRhdGV0aW1lcGlja2VyLnRpbWVJbnRlcnZhbFwiXG4gIFt0d2VsdmVob3VyXT1cImRhdGV0aW1lcGlja2VyLnR3ZWx2ZWhvdXJcIlxuICBbdHlwZV09XCJkYXRldGltZXBpY2tlci50eXBlXCJcbiAgW2NhbmNlbExhYmVsXT1cImRhdGV0aW1lcGlja2VyLmNhbmNlbExhYmVsXCJcbiAgW2NvbmZpcm1MYWJlbF09XCJkYXRldGltZXBpY2tlci5jb25maXJtTGFiZWxcIlxuICBjZGtUcmFwRm9jdXNcbiAgY2xhc3M9XCJtYXQtdHlwb2dyYXBoeVwiXG4+XG48L21hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhcj5cbiJdfQ==
