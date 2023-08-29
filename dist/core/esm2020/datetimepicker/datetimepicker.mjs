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
      '.mat-datetimepicker-content{box-shadow:0 5px 5px -3px #0003,0 8px 10px 1px #00000024,0 3px 14px 2px #0000001f;display:block;background-color:#fff;border-radius:2px;overflow:hidden}.mat-datetimepicker-calendar{width:296px;height:auto}.mat-datetimepicker-calendar[mode=landscape]{width:446px;height:auto}@media (min-width: 480px){.mat-datetimepicker-calendar[mode=auto]{width:446px;height:auto}}.mat-datetimepicker-content-touch{box-shadow:0 0 #0003,0 0 #00000024,0 0 #0000001f;display:block;box-shadow:0 11px 15px -7px #0003,0 24px 38px 3px #00000024,0 9px 46px 8px #0000001f}.cdk-overlay-container,.cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed;z-index:1000}.cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000}.cdk-overlay-backdrop{position:absolute;inset:0;z-index:1000;pointer-events:auto;transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.48}.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.6)}.mat-datetimepicker-dialog .mat-dialog-container{padding:0}\n',
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
            '.mat-datetimepicker-content{box-shadow:0 5px 5px -3px #0003,0 8px 10px 1px #00000024,0 3px 14px 2px #0000001f;display:block;background-color:#fff;border-radius:2px;overflow:hidden}.mat-datetimepicker-calendar{width:296px;height:auto}.mat-datetimepicker-calendar[mode=landscape]{width:446px;height:auto}@media (min-width: 480px){.mat-datetimepicker-calendar[mode=auto]{width:446px;height:auto}}.mat-datetimepicker-content-touch{box-shadow:0 0 #0003,0 0 #00000024,0 0 #0000001f;display:block;box-shadow:0 11px 15px -7px #0003,0 24px 38px 3px #00000024,0 9px 46px 8px #0000001f}.cdk-overlay-container,.cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed;z-index:1000}.cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000}.cdk-overlay-backdrop{position:absolute;inset:0;z-index:1000;pointer-events:auto;transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.48}.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.6)}.mat-datetimepicker-dialog .mat-dialog-container{padding:0}\n',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmUvc3JjL2RhdGV0aW1lcGlja2VyL2RhdGV0aW1lcGlja2VyLWNvbnRlbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFDTCxPQUFPLEVBQ1AsYUFBYSxHQUdkLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsU0FBUyxFQUFnQixNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUVMLGtDQUFrQyxH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QXpCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLGtCQUFrQjtzQkFBMUIsS0FBSztnQkFDRyxrQkFBa0I7c0JBQTFCLEtBQUs7Z0JBQ0csaUJBQWlCO3NCQUF6QixLQUFLO2dCQUNHLGlCQUFpQjtzQkFBekIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBRUcsNEJBQTRCO3NCQUFwQyxLQUFLO2dCQUtJLGVBQWU7c0JBQXhCLE1BQU07Z0JBRUUsVUFBVTtzQkFBbEIsS0FBSztnQkFHWSxZQUFZO3NCQUE3QixNQUFNO3VCQUFDLFFBQVE7Z0JBR0UsWUFBWTtzQkFBN0IsTUFBTTt1QkFBQyxRQUFRO2dCQUVOLFdBQVc7c0JBQXBCLE1BQU07Z0JBMENILE9BQU87c0JBRFYsS0FBSztnQkFpQkYsV0FBVztzQkFEZCxLQUFLO2dCQVlGLElBQUk7c0JBRFAsS0FBSztnQkFnQkYsT0FBTztzQkFEVixLQUFLO2dCQWFGLFFBQVE7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgY29lcmNlQm9vbGVhblByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IEVTQ0FQRSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBPdmVybGF5LFxuICBPdmVybGF5Q29uZmlnLFxuICBPdmVybGF5UmVmLFxuICBQb3NpdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1kgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kYXRlcGlja2VyJztcbmltcG9ydCB7IE1hdERpYWxvZywgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBEYXRldGltZUFkYXB0ZXIgfSBmcm9tICcuLi9hZGFwdGVyL2RhdGV0aW1lLWFkYXB0ZXInO1xuaW1wb3J0IHtcbiAgTWF0Q2FsZW5kYXJWaWV3LFxuICBNYXREYXRldGltZXBpY2tlckNhbGVuZGFyQ29tcG9uZW50LFxufSBmcm9tICcuL2NhbGVuZGFyJztcbmltcG9ydCB7IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1maWx0ZXJ0eXBlJztcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VySW5wdXREaXJlY3RpdmUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWlucHV0JztcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VyVHlwZSB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItdHlwZSc7XG5cbmV4cG9ydCB0eXBlIE1hdERhdGV0aW1lcGlja2VyTW9kZSA9ICdhdXRvJyB8ICdwb3J0cmFpdCcgfCAnbGFuZHNjYXBlJztcblxuLyoqIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgSUQgZm9yIGVhY2ggZGF0ZXBpY2tlciBpbnN0YW5jZS4gKi9cbmxldCBkYXRldGltZXBpY2tlclVpZCA9IDA7XG5cbi8qKlxuICogQ29tcG9uZW50IHVzZWQgYXMgdGhlIGNvbnRlbnQgZm9yIHRoZSBkYXRlcGlja2VyIGRpYWxvZyBhbmQgcG9wdXAuIFdlIHVzZSB0aGlzIGluc3RlYWQgb2YgdXNpbmdcbiAqIE1hdENhbGVuZGFyIGRpcmVjdGx5IGFzIHRoZSBjb250ZW50IHNvIHdlIGNhbiBjb250cm9sIHRoZSBpbml0aWFsIGZvY3VzLiBUaGlzIGFsc28gZ2l2ZXMgdXMgYVxuICogcGxhY2UgdG8gcHV0IGFkZGl0aW9uYWwgZmVhdHVyZXMgb2YgdGhlIHBvcHVwIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoZSBjYWxlbmRhciBpdHNlbGYgaW4gdGhlXG4gKiBmdXR1cmUuIChlLmcuIGNvbmZpcm1hdGlvbiBidXR0b25zKS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGV0aW1lcGlja2VyLWNvbnRlbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRldGltZXBpY2tlci1jb250ZW50LnNjc3MnXSxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbWF0LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQnLFxuICAgICdbY2xhc3MubWF0LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQtdG91Y2hdJzogJ2RhdGV0aW1lcGlja2VyPy50b3VjaFVpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXRpbWVwaWNrZXJDb250ZW50Q29tcG9uZW50PEQ+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIGRhdGV0aW1lcGlja2VyOiBNYXREYXRldGltZXBpY2tlckNvbXBvbmVudDxEPjtcblxuICBAVmlld0NoaWxkKE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDb21wb25lbnQsIHsgc3RhdGljOiB0cnVlIH0pXG4gIF9jYWxlbmRhcjogTWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckNvbXBvbmVudDxEPjtcblxuICBjaGFuZ2VkRGF0ZTogRCA9IG51bGw7XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2NhbGVuZGFyLl9mb2N1c0FjdGl2ZUNlbGwoKTtcbiAgfVxuXG4gIG9uU2VsZWN0aW9uQ2hhbmdlKGRhdGU6IEQpIHtcbiAgICB0aGlzLmNoYW5nZWREYXRlID0gZGF0ZTtcbiAgfVxuXG4gIG9uU2VsZWN0aW9uQ29uZmlybShkYXRlOiBEKSB7XG4gICAgdGhpcy5kYXRldGltZXBpY2tlci5fc2VsZWN0KGRhdGUpO1xuICB9XG5cbiAgaGFuZGxlQ2xvc2UodmFsOiBhbnkpIHtcbiAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLmNoYW5nZWREYXRlID8/IHZhbDtcbiAgICBpZiAoKHZhbCAmJiB0aGlzLmNoYW5nZWREYXRlKSB8fCB2YWwpIHtcbiAgICAgIHRoaXMub25TZWxlY3Rpb25Db25maXJtKG5ld1ZhbHVlKTtcbiAgICAgIHRoaXMuZGF0ZXRpbWVwaWNrZXIuY2xvc2UoKTtcbiAgICAgIHRoaXMuY2hhbmdlZERhdGUgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAodmFsID09PSBudWxsKVxuICAgICAgdGhpcy5kYXRldGltZXBpY2tlci5jbG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMga2V5ZG93biBldmVudCBvbiBkYXRlcGlja2VyIGNvbnRlbnQuXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQuXG4gICAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBFU0NBUEUpIHtcbiAgICAgIHRoaXMuZGF0ZXRpbWVwaWNrZXIuY2xvc2UoKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGV0aW1lcGlja2VyJyxcbiAgZXhwb3J0QXM6ICdtYXREYXRldGltZXBpY2tlcicsXG4gIHRlbXBsYXRlOiAnJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRldGltZXBpY2tlckNvbXBvbmVudDxEPiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBBY3RpdmUgbXVsdGkgeWVhciB2aWV3IHdoZW4gY2xpY2sgb24geWVhci4gKi9cbiAgQElucHV0KCkgbXVsdGlZZWFyU2VsZWN0b3I6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqIGlmIHRydWUgY2hhbmdlIHRoZSBjbG9jayB0byAxMiBob3VyIGZvcm1hdC4gKi9cbiAgQElucHV0KCkgdHdlbHZlaG91cjogYm9vbGVhbiA9IGZhbHNlO1xuICAvKiogVGhlIHZpZXcgdGhhdCB0aGUgY2FsZW5kYXIgc2hvdWxkIHN0YXJ0IGluLiAqL1xuICBASW5wdXQoKSBzdGFydFZpZXc6IE1hdENhbGVuZGFyVmlldyA9ICdtb250aCc7XG4gIEBJbnB1dCgpIG1vZGU6IE1hdERhdGV0aW1lcGlja2VyTW9kZSA9ICdhdXRvJztcbiAgQElucHV0KCkgdGltZUludGVydmFsOiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSBhcmlhTmV4dE1vbnRoTGFiZWwgPSAnTmV4dCBtb250aCc7XG4gIEBJbnB1dCgpIGFyaWFQcmV2TW9udGhMYWJlbCA9ICdQcmV2aW91cyBtb250aCc7XG4gIEBJbnB1dCgpIGFyaWFOZXh0WWVhckxhYmVsID0gJ05leHQgeWVhcic7XG4gIEBJbnB1dCgpIGFyaWFQcmV2WWVhckxhYmVsID0gJ1ByZXZpb3VzIHllYXInO1xuICBASW5wdXQoKSBjb25maXJtTGFiZWw6IHN0cmluZyA9ICdPayc7XG4gIEBJbnB1dCgpIGNhbmNlbExhYmVsOiBzdHJpbmcgPSAnQ2FuY2VsJztcbiAgLyoqIFByZXZlbnQgdXNlciB0byBzZWxlY3Qgc2FtZSBkYXRlIHRpbWUgKi9cbiAgQElucHV0KCkgcHJldmVudFNhbWVEYXRlVGltZVNlbGVjdGlvbiA9IGZhbHNlO1xuICAvKipcbiAgICogRW1pdHMgbmV3IHNlbGVjdGVkIGRhdGUgd2hlbiBzZWxlY3RlZCBkYXRlIGNoYW5nZXMuXG4gICAqIEBkZXByZWNhdGVkIFN3aXRjaCB0byB0aGUgYGRhdGVDaGFuZ2VgIGFuZCBgZGF0ZUlucHV0YCBiaW5kaW5nIG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKi9cbiAgQE91dHB1dCgpIHNlbGVjdGVkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcbiAgLyoqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSBkYXRlIHBpY2tlciBwYW5lbC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCkgcGFuZWxDbGFzczogc3RyaW5nIHwgc3RyaW5nW107XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9uby1vdXRwdXQtcmVuYW1lXG4gIEBPdXRwdXQoJ29wZW5lZCcpIG9wZW5lZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBoYXMgYmVlbiBjbG9zZWQuICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8tb3V0cHV0LXJlbmFtZVxuICBAT3V0cHV0KCdjbG9zZWQnKSBjbG9zZWRTdHJlYW06IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHZpZXcgaGFzIGJlZW4gY2hhbmdlZC4gKiovXG4gIEBPdXRwdXQoKSB2aWV3Q2hhbmdlZDogRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVmlldz4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJWaWV3PigpO1xuICAvKiogV2hldGhlciB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbiAgb3BlbmVkID0gZmFsc2U7XG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRlcGlja2VyIGNhbGVuZGFyLiAqL1xuICBpZCA9IGBtYXQtZGF0ZXRpbWVwaWNrZXItJHtkYXRldGltZXBpY2tlclVpZCsrfWA7XG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCB0aGlzIGRhdGVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBfZGF0ZXBpY2tlcklucHV0OiBNYXREYXRldGltZXBpY2tlcklucHV0RGlyZWN0aXZlPEQ+O1xuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBpcyBkaXNhYmxlZC4gKi9cbiAgX2Rpc2FibGVkQ2hhbmdlID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgcHJpdmF0ZSBfdmFsaWRTZWxlY3RlZDogRCB8IG51bGwgPSBudWxsO1xuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIG92ZXJsYXkgd2hlbiB0aGUgY2FsZW5kYXIgaXMgb3BlbmVkIGFzIGEgcG9wdXAuICovXG4gIHByaXZhdGUgX3BvcHVwUmVmOiBPdmVybGF5UmVmO1xuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIGRpYWxvZyB3aGVuIHRoZSBjYWxlbmRhciBpcyBvcGVuZWQgYXMgYSBkaWFsb2cuICovXG4gIHByaXZhdGUgX2RpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPGFueT4gfCBudWxsO1xuICAvKiogQSBwb3J0YWwgY29udGFpbmluZyB0aGUgY2FsZW5kYXIgZm9yIHRoaXMgZGF0ZXBpY2tlci4gKi9cbiAgcHJpdmF0ZSBfY2FsZW5kYXJQb3J0YWw6IENvbXBvbmVudFBvcnRhbDxcbiAgICBNYXREYXRldGltZXBpY2tlckNvbnRlbnRDb21wb25lbnQ8RD5cbiAgPjtcbiAgLyoqIFRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkYXRlcGlja2VyIHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfaW5wdXRTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZGlhbG9nOiBNYXREaWFsb2csXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZKSBwcml2YXRlIF9zY3JvbGxTdHJhdGVneSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueVxuICApIHtcbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignRGF0ZUFkYXB0ZXInKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zdGFydEF0OiBEIHwgbnVsbDtcblxuICAvKiogVGhlIGRhdGUgdG8gb3BlbiB0aGUgY2FsZW5kYXIgdG8gaW5pdGlhbGx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RhcnRBdCgpOiBEIHwgbnVsbCB7XG4gICAgLy8gSWYgYW4gZXhwbGljaXQgc3RhcnRBdCBpcyBzZXQgd2Ugc3RhcnQgdGhlcmUsIG90aGVyd2lzZSB3ZSBzdGFydCBhdCB3aGF0ZXZlciB0aGUgY3VycmVudGx5XG4gICAgLy8gc2VsZWN0ZWQgdmFsdWUgaXMuXG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX3N0YXJ0QXQgfHxcbiAgICAgICh0aGlzLl9kYXRlcGlja2VySW5wdXQgPyB0aGlzLl9kYXRlcGlja2VySW5wdXQudmFsdWUgOiBudWxsKVxuICAgICk7XG4gIH1cblxuICBzZXQgc3RhcnRBdChkYXRlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3N0YXJ0QXQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoZGF0ZSk7XG4gIH1cblxuICBwcml2YXRlIF9vcGVuT25Gb2N1czogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBnZXQgb3Blbk9uRm9jdXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX29wZW5PbkZvY3VzO1xuICB9XG5cbiAgc2V0IG9wZW5PbkZvY3VzKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fb3Blbk9uRm9jdXMgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdHlwZTogTWF0RGF0ZXRpbWVwaWNrZXJUeXBlID0gJ2RhdGUnO1xuXG4gIEBJbnB1dCgpXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlO1xuICB9XG5cbiAgc2V0IHR5cGUodmFsdWU6IE1hdERhdGV0aW1lcGlja2VyVHlwZSkge1xuICAgIHRoaXMuX3R5cGUgPSB2YWx1ZSB8fCAnZGF0ZSc7XG4gIH1cblxuICBwcml2YXRlIF90b3VjaFVpID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIFVJIGlzIGluIHRvdWNoIG1vZGUuIEluIHRvdWNoIG1vZGUgdGhlIGNhbGVuZGFyIG9wZW5zIGluIGEgZGlhbG9nIHJhdGhlclxuICAgKiB0aGFuIGEgcG9wdXAgYW5kIGVsZW1lbnRzIGhhdmUgbW9yZSBwYWRkaW5nIHRvIGFsbG93IGZvciBiaWdnZXIgdG91Y2ggdGFyZ2V0cy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB0b3VjaFVpKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90b3VjaFVpO1xuICB9XG5cbiAgc2V0IHRvdWNoVWkodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl90b3VjaFVpID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcC11cCBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLl9kYXRlcGlja2VySW5wdXRcbiAgICAgID8gdGhpcy5fZGF0ZXBpY2tlcklucHV0LmRpc2FibGVkXG4gICAgICA6ICEhdGhpcy5fZGlzYWJsZWQ7XG4gIH1cblxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UubmV4dChuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZS4gKi9cbiAgZ2V0IF9zZWxlY3RlZCgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbGlkU2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgX3NlbGVjdGVkKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3ZhbGlkU2VsZWN0ZWQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBUaGUgbWluaW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIGdldCBfbWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVwaWNrZXJJbnB1dCAmJiB0aGlzLl9kYXRlcGlja2VySW5wdXQubWluO1xuICB9XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgZ2V0IF9tYXhEYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuX2RhdGVwaWNrZXJJbnB1dC5tYXg7XG4gIH1cblxuICBnZXQgX2RhdGVGaWx0ZXIoKTogKFxuICAgIGRhdGU6IEQgfCBudWxsLFxuICAgIHR5cGU6IE1hdERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZVxuICApID0+IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kYXRlcGlja2VySW5wdXQgJiYgdGhpcy5fZGF0ZXBpY2tlcklucHV0Ll9kYXRlRmlsdGVyO1xuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCkge1xuICAgIGlmICghdGhpcy5vcGVuZWQgJiYgdGhpcy5vcGVuT25Gb2N1cykge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgX3ZpZXdDaGFuZ2VkKHR5cGU6IE1hdENhbGVuZGFyVmlldyk6IHZvaWQge1xuICAgIHRoaXMudmlld0NoYW5nZWQuZW1pdCh0eXBlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl9pbnB1dFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLmNvbXBsZXRlKCk7XG5cbiAgICBpZiAodGhpcy5fcG9wdXBSZWYpIHtcbiAgICAgIHRoaXMuX3BvcHVwUmVmLmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgZ2l2ZW4gZGF0ZSAqL1xuICBfc2VsZWN0KGRhdGU6IEQpOiB2b2lkIHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3NlbGVjdGVkO1xuICAgIHRoaXMuX3NlbGVjdGVkID0gZGF0ZTtcbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRldGltZShvbGRWYWx1ZSwgdGhpcy5fc2VsZWN0ZWQpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlZC5lbWl0KGRhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBpbnB1dCB3aXRoIHRoaXMgZGF0ZXBpY2tlci5cbiAgICogQHBhcmFtIGlucHV0IFRoZSBkYXRlcGlja2VyIGlucHV0IHRvIHJlZ2lzdGVyIHdpdGggdGhpcyBkYXRlcGlja2VyLlxuICAgKi9cbiAgX3JlZ2lzdGVySW5wdXQoaW5wdXQ6IE1hdERhdGV0aW1lcGlja2VySW5wdXREaXJlY3RpdmU8RD4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZGF0ZXBpY2tlcklucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0EgTWF0RGF0ZXBpY2tlciBjYW4gb25seSBiZSBhc3NvY2lhdGVkIHdpdGggYSBzaW5nbGUgaW5wdXQuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5fZGF0ZXBpY2tlcklucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5faW5wdXRTdWJzY3JpcHRpb24gPSB0aGlzLl9kYXRlcGlja2VySW5wdXQuX3ZhbHVlQ2hhbmdlLnN1YnNjcmliZShcbiAgICAgICh2YWx1ZTogRCB8IG51bGwpID0+ICh0aGlzLl9zZWxlY3RlZCA9IHZhbHVlKVxuICAgICk7XG4gIH1cblxuICAvKiogT3BlbiB0aGUgY2FsZW5kYXIuICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3BlbmVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9kYXRlcGlja2VySW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQXR0ZW1wdGVkIHRvIG9wZW4gYW4gTWF0RGF0ZXBpY2tlciB3aXRoIG5vIGFzc29jaWF0ZWQgaW5wdXQuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2RvY3VtZW50KSB7XG4gICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIHRoaXMudG91Y2hVaSA/IHRoaXMuX29wZW5Bc0RpYWxvZygpIDogdGhpcy5fb3BlbkFzUG9wdXAoKTtcbiAgICB0aGlzLm9wZW5lZCA9IHRydWU7XG4gICAgdGhpcy5vcGVuZWRTdHJlYW0uZW1pdCgpO1xuICB9XG5cbiAgLyoqIENsb3NlIHRoZSBjYWxlbmRhci4gKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm9wZW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcG9wdXBSZWYgJiYgdGhpcy5fcG9wdXBSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5fcG9wdXBSZWYuZGV0YWNoKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZi5jbG9zZSgpO1xuICAgICAgdGhpcy5fZGlhbG9nUmVmID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NhbGVuZGFyUG9ydGFsICYmIHRoaXMuX2NhbGVuZGFyUG9ydGFsLmlzQXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX2NhbGVuZGFyUG9ydGFsLmRldGFjaCgpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBsZXRlQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAvLyBUaGUgYF9vcGVuZWRgIGNvdWxkJ3ZlIGJlZW4gcmVzZXQgYWxyZWFkeSBpZlxuICAgICAgLy8gd2UgZ290IHR3byBldmVudHMgaW4gcXVpY2sgc3VjY2Vzc2lvbi5cbiAgICAgIGlmICh0aGlzLm9wZW5lZCkge1xuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3NlZFN0cmVhbS5lbWl0KCk7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiAmJlxuICAgICAgdHlwZW9mIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICkge1xuICAgICAgLy8gQmVjYXVzZSBJRSBtb3ZlcyBmb2N1cyBhc3luY2hyb25vdXNseSwgd2UgY2FuJ3QgY291bnQgb24gaXQgYmVpbmcgcmVzdG9yZWQgYmVmb3JlIHdlJ3ZlXG4gICAgICAvLyBtYXJrZWQgdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLiBJZiB0aGUgZXZlbnQgZmlyZXMgb3V0IG9mIHNlcXVlbmNlIGFuZCB0aGUgZWxlbWVudCB0aGF0XG4gICAgICAvLyB3ZSdyZSByZWZvY3VzaW5nIG9wZW5zIHRoZSBkYXRlcGlja2VyIG9uIGZvY3VzLCB0aGUgdXNlciBjb3VsZCBiZSBzdHVjayB3aXRoIG5vdCBiZWluZ1xuICAgICAgLy8gYWJsZSB0byBjbG9zZSB0aGUgY2FsZW5kYXIgYXQgYWxsLiBXZSB3b3JrIGFyb3VuZCBpdCBieSBtYWtpbmcgdGhlIGxvZ2ljLCB0aGF0IG1hcmtzXG4gICAgICAvLyB0aGUgZGF0ZXBpY2tlciBhcyBjbG9zZWQsIGFzeW5jIGFzIHdlbGwuXG4gICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4uZm9jdXMoKTtcbiAgICAgIHNldFRpbWVvdXQoY29tcGxldGVDbG9zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBsZXRlQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKiogT3BlbiB0aGUgY2FsZW5kYXIgYXMgYSBkaWFsb2cuICovXG4gIHByaXZhdGUgX29wZW5Bc0RpYWxvZygpOiB2b2lkIHtcbiAgICB0aGlzLl9kaWFsb2dSZWYgPSB0aGlzLl9kaWFsb2cub3BlbihNYXREYXRldGltZXBpY2tlckNvbnRlbnRDb21wb25lbnQsIHtcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlIDogJ2x0cicsXG4gICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLl92aWV3Q29udGFpbmVyUmVmLFxuICAgICAgcGFuZWxDbGFzczogJ21hdC1kYXRldGltZXBpY2tlci1kaWFsb2cnLFxuICAgIH0pO1xuICAgIHRoaXMuX2RpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlKCkpO1xuICAgIHRoaXMuX2RpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5kYXRldGltZXBpY2tlciA9IHRoaXM7XG4gIH1cblxuICAvKiogT3BlbiB0aGUgY2FsZW5kYXIgYXMgYSBwb3B1cC4gKi9cbiAgcHJpdmF0ZSBfb3BlbkFzUG9wdXAoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jYWxlbmRhclBvcnRhbCkge1xuICAgICAgdGhpcy5fY2FsZW5kYXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsPFxuICAgICAgICBNYXREYXRldGltZXBpY2tlckNvbnRlbnRDb21wb25lbnQ8RD5cbiAgICAgID4oTWF0RGF0ZXRpbWVwaWNrZXJDb250ZW50Q29tcG9uZW50LCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3BvcHVwUmVmKSB7XG4gICAgICB0aGlzLl9jcmVhdGVQb3B1cCgpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcG9wdXBSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgY29uc3QgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8TWF0RGF0ZXRpbWVwaWNrZXJDb250ZW50Q29tcG9uZW50PEQ+PiA9XG4gICAgICAgIHRoaXMuX3BvcHVwUmVmLmF0dGFjaCh0aGlzLl9jYWxlbmRhclBvcnRhbCk7XG4gICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuZGF0ZXRpbWVwaWNrZXIgPSB0aGlzO1xuXG4gICAgICAvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIG9uY2UgdGhlIGNhbGVuZGFyIGhhcyByZW5kZXJlZC5cbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZVxuICAgICAgICAuYXNPYnNlcnZhYmxlKClcbiAgICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fcG9wdXBSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcG9wdXBSZWYuYmFja2Ryb3BDbGljaygpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlKCkpO1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgcG9wdXAuICovXG4gIHByaXZhdGUgX2NyZWF0ZVBvcHVwKCk6IHZvaWQge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9jcmVhdGVQb3B1cFBvc2l0aW9uU3RyYXRlZ3koKSxcbiAgICAgIGhhc0JhY2tkcm9wOiB0cnVlLFxuICAgICAgYmFja2Ryb3BDbGFzczogJ21hdC1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlIDogJ2x0cicsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHBhbmVsQ2xhc3M6ICdtYXQtZGF0ZXRpbWVwaWNrZXItcG9wdXAnLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fcG9wdXBSZWYgPSB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIHBvcHVwIFBvc2l0aW9uU3RyYXRlZ3kuICovXG4gIHByaXZhdGUgX2NyZWF0ZVBvcHVwUG9zaXRpb25TdHJhdGVneSgpOiBQb3NpdGlvblN0cmF0ZWd5IHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuX2RhdGVwaWNrZXJJbnB1dC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkpXG4gICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQnKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFZpZXdwb3J0TWFyZ2luKDgpXG4gICAgICAud2l0aExvY2tlZFBvc2l0aW9uKClcbiAgICAgIC53aXRoUG9zaXRpb25zKFtcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICAgICAgb3JpZ2luWTogJ2JvdHRvbScsXG4gICAgICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICAgICAgb3ZlcmxheVk6ICd0b3AnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgICAgICBvdmVybGF5WTogJ2JvdHRvbScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiAnZW5kJyxcbiAgICAgICAgICBvcmlnaW5ZOiAnYm90dG9tJyxcbiAgICAgICAgICBvdmVybGF5WDogJ2VuZCcsXG4gICAgICAgICAgb3ZlcmxheVk6ICd0b3AnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogJ2VuZCcsXG4gICAgICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICAgICAgb3ZlcmxheVg6ICdlbmQnLFxuICAgICAgICAgIG92ZXJsYXlZOiAnYm90dG9tJyxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuICB9XG59XG4iLCI8bWF0LWRhdGV0aW1lcGlja2VyLWNhbGVuZGFyXG4gIChjbG9zZURhdGVUaW1lUGlja2VyKT1cImhhbmRsZUNsb3NlKCRldmVudClcIlxuICAoc2VsZWN0ZWRDaGFuZ2UpPVwib25TZWxlY3Rpb25DaGFuZ2UoJGV2ZW50KVwiXG4gICh2aWV3Q2hhbmdlZCk9XCJkYXRldGltZXBpY2tlci5fdmlld0NoYW5nZWQoJGV2ZW50KVwiXG4gIFthcmlhTmV4dE1vbnRoTGFiZWxdPVwiZGF0ZXRpbWVwaWNrZXIuYXJpYU5leHRNb250aExhYmVsXCJcbiAgW2FyaWFOZXh0WWVhckxhYmVsXT1cImRhdGV0aW1lcGlja2VyLmFyaWFOZXh0WWVhckxhYmVsXCJcbiAgW2FyaWFQcmV2TW9udGhMYWJlbF09XCJkYXRldGltZXBpY2tlci5hcmlhUHJldk1vbnRoTGFiZWxcIlxuICBbYXJpYVByZXZZZWFyTGFiZWxdPVwiZGF0ZXRpbWVwaWNrZXIuYXJpYVByZXZZZWFyTGFiZWxcIlxuICBbcHJldmVudFNhbWVEYXRlVGltZVNlbGVjdGlvbl09XCJkYXRldGltZXBpY2tlci5wcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uXCJcbiAgW2F0dHIubW9kZV09XCJkYXRldGltZXBpY2tlci5tb2RlXCJcbiAgW2RhdGVGaWx0ZXJdPVwiZGF0ZXRpbWVwaWNrZXIuX2RhdGVGaWx0ZXJcIlxuICBbaWRdPVwiZGF0ZXRpbWVwaWNrZXIuaWRcIlxuICBbbWF4RGF0ZV09XCJkYXRldGltZXBpY2tlci5fbWF4RGF0ZVwiXG4gIFttaW5EYXRlXT1cImRhdGV0aW1lcGlja2VyLl9taW5EYXRlXCJcbiAgW211bHRpWWVhclNlbGVjdG9yXT1cImRhdGV0aW1lcGlja2VyLm11bHRpWWVhclNlbGVjdG9yXCJcbiAgW3NlbGVjdGVkXT1cImRhdGV0aW1lcGlja2VyLl9zZWxlY3RlZFwiXG4gIFtzdGFydEF0XT1cImRhdGV0aW1lcGlja2VyLnN0YXJ0QXRcIlxuICBbc3RhcnRWaWV3XT1cImRhdGV0aW1lcGlja2VyLnN0YXJ0Vmlld1wiXG4gIFt0aW1lSW50ZXJ2YWxdPVwiZGF0ZXRpbWVwaWNrZXIudGltZUludGVydmFsXCJcbiAgW3R3ZWx2ZWhvdXJdPVwiZGF0ZXRpbWVwaWNrZXIudHdlbHZlaG91clwiXG4gIFt0eXBlXT1cImRhdGV0aW1lcGlja2VyLnR5cGVcIlxuICBbY2FuY2VsTGFiZWxdPVwiZGF0ZXRpbWVwaWNrZXIuY2FuY2VsTGFiZWxcIlxuICBbY29uZmlybUxhYmVsXT1cImRhdGV0aW1lcGlja2VyLmNvbmZpcm1MYWJlbFwiXG4gIGNka1RyYXBGb2N1c1xuICBjbGFzcz1cIm1hdC10eXBvZ3JhcGh5XCJcbj5cbjwvbWF0LWRhdGV0aW1lcGlja2VyLWNhbGVuZGFyPlxuIl19
