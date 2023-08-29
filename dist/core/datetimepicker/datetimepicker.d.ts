import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import {
  AfterContentInit,
  EventEmitter,
  NgZone,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import {
  MatCalendarView,
  MatDatetimepickerCalendarComponent,
} from './calendar';
import { MatDatetimepickerFilterType } from './datetimepicker-filtertype';
import { MatDatetimepickerInputDirective } from './datetimepicker-input';
import { MatDatetimepickerType } from './datetimepicker-type';
import * as i0 from '@angular/core';
export declare type MatDatetimepickerMode = 'auto' | 'portrait' | 'landscape';
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export declare class MatDatetimepickerContentComponent<D>
  implements AfterContentInit
{
  datetimepicker: MatDatetimepickerComponent<D>;
  _calendar: MatDatetimepickerCalendarComponent<D>;
  changedDate: D;
  ngAfterContentInit(): void;
  onSelectionChange(date: D): void;
  onSelectionConfirm(date: D): void;
  handleClose(val: any): void;
  /**
   * Handles keydown event on datepicker content.
   * @param event The event.
   */
  _handleKeydown(event: KeyboardEvent): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerContentComponent<any>,
    never
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MatDatetimepickerContentComponent<any>,
    'mat-datetimepicker-content',
    never,
    {},
    {},
    never,
    never,
    false
  >;
}
export declare class MatDatetimepickerComponent<D> implements OnDestroy {
  private _dialog;
  private _overlay;
  private _ngZone;
  private _viewContainerRef;
  private _scrollStrategy;
  private _dateAdapter;
  private _dir;
  private _document;
  /** Active multi year view when click on year. */
  multiYearSelector: boolean;
  /** if true change the clock to 12 hour format. */
  twelvehour: boolean;
  /** The view that the calendar should start in. */
  startView: MatCalendarView;
  mode: MatDatetimepickerMode;
  timeInterval: number;
  ariaNextMonthLabel: string;
  ariaPrevMonthLabel: string;
  ariaNextYearLabel: string;
  ariaPrevYearLabel: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Prevent user to select same date time */
  preventSameDateTimeSelection: boolean;
  /**
   * Emits new selected date when selected date changes.
   * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
   */
  selectedChanged: EventEmitter<D>;
  /** Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`. */
  panelClass: string | string[];
  /** Emits when the datepicker has been opened. */
  openedStream: EventEmitter<void>;
  /** Emits when the datepicker has been closed. */
  closedStream: EventEmitter<void>;
  /** Emits when the view has been changed. **/
  viewChanged: EventEmitter<MatCalendarView>;
  /** Whether the calendar is open. */
  opened: boolean;
  /** The id for the datepicker calendar. */
  id: string;
  /** The input element this datepicker is associated with. */
  _datepickerInput: MatDatetimepickerInputDirective<D>;
  /** Emits when the datepicker is disabled. */
  _disabledChange: Subject<boolean>;
  private _validSelected;
  /** A reference to the overlay when the calendar is opened as a popup. */
  private _popupRef;
  /** A reference to the dialog when the calendar is opened as a dialog. */
  private _dialogRef;
  /** A portal containing the calendar for this datepicker. */
  private _calendarPortal;
  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen;
  private _inputSubscription;
  constructor(
    _dialog: MatDialog,
    _overlay: Overlay,
    _ngZone: NgZone,
    _viewContainerRef: ViewContainerRef,
    _scrollStrategy: any,
    _dateAdapter: DatetimeAdapter<D>,
    _dir: Directionality,
    _document: any
  );
  private _startAt;
  /** The date to open the calendar to initially. */
  get startAt(): D | null;
  set startAt(date: D | null);
  private _openOnFocus;
  get openOnFocus(): boolean;
  set openOnFocus(value: boolean);
  private _type;
  get type(): MatDatetimepickerType;
  set type(value: MatDatetimepickerType);
  private _touchUi;
  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
  get touchUi(): boolean;
  set touchUi(value: boolean);
  private _disabled;
  /** Whether the datepicker pop-up should be disabled. */
  get disabled(): boolean;
  set disabled(value: boolean);
  /** The currently selected date. */
  get _selected(): D | null;
  set _selected(value: D | null);
  /** The minimum selectable date. */
  get _minDate(): D | null;
  /** The maximum selectable date. */
  get _maxDate(): D | null;
  get _dateFilter(): (
    date: D | null,
    type: MatDatetimepickerFilterType
  ) => boolean;
  _handleFocus(): void;
  _viewChanged(type: MatCalendarView): void;
  ngOnDestroy(): void;
  /** Selects the given date */
  _select(date: D): void;
  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  _registerInput(input: MatDatetimepickerInputDirective<D>): void;
  /** Open the calendar. */
  open(): void;
  /** Close the calendar. */
  close(): void;
  /** Open the calendar as a dialog. */
  private _openAsDialog;
  /** Open the calendar as a popup. */
  private _openAsPopup;
  /** Create the popup. */
  private _createPopup;
  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerComponent<any>,
    [
      null,
      null,
      null,
      null,
      null,
      { optional: true },
      { optional: true },
      { optional: true }
    ]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MatDatetimepickerComponent<any>,
    'mat-datetimepicker',
    ['matDatetimepicker'],
    {
      multiYearSelector: 'multiYearSelector';
      twelvehour: 'twelvehour';
      startView: 'startView';
      mode: 'mode';
      timeInterval: 'timeInterval';
      ariaNextMonthLabel: 'ariaNextMonthLabel';
      ariaPrevMonthLabel: 'ariaPrevMonthLabel';
      ariaNextYearLabel: 'ariaNextYearLabel';
      ariaPrevYearLabel: 'ariaPrevYearLabel';
      confirmLabel: 'confirmLabel';
      cancelLabel: 'cancelLabel';
      preventSameDateTimeSelection: 'preventSameDateTimeSelection';
      panelClass: 'panelClass';
      startAt: 'startAt';
      openOnFocus: 'openOnFocus';
      type: 'type';
      touchUi: 'touchUi';
      disabled: 'disabled';
    },
    {
      selectedChanged: 'selectedChanged';
      openedStream: 'opened';
      closedStream: 'closed';
      viewChanged: 'viewChanged';
    },
    never,
    never,
    false
  >;
}
