import {
  AfterContentInit,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MatDatetimeFormats } from '../adapter/datetime-formats';
import { MatClockView } from './clock';
import { MatDatetimepickerFilterType } from './datetimepicker-filtertype';
import { MatDatetimepickerType } from './datetimepicker-type';
import * as i0 from '@angular/core';
export declare type MatCalendarView = 'clock' | 'month' | 'year' | 'multi-year';
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
export declare class MatDatetimepickerCalendarComponent<D>
  implements AfterContentInit, OnDestroy
{
  private _elementRef;
  private _intl;
  private _ngZone;
  private _adapter;
  private _dateFormats;
  closeDateTimePicker: EventEmitter<any>;
  /** Active multi year view when click on year. */
  multiYearSelector: boolean;
  /** Whether the calendar should be started in month or year view. */
  startView: MatCalendarView;
  twelvehour: boolean;
  timeInterval: number;
  /** A function used to filter which dates are selectable. */
  dateFilter: (date: D, type: MatDatetimepickerFilterType) => boolean;
  ariaLabel: string;
  ariaNextMonthLabel: string;
  ariaPrevMonthLabel: string;
  ariaNextYearLabel: string;
  ariaPrevYearLabel: string;
  ariaNextMultiYearLabel: string;
  ariaPrevMultiYearLabel: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Prevent user to select same date time */
  preventSameDateTimeSelection: boolean;
  /** Emits when the currently selected date changes. */
  selectedChange: EventEmitter<D>;
  /** Emits when the view has been changed. **/
  viewChanged: EventEmitter<MatCalendarView>;
  _AMPM: string;
  _clockView: MatClockView;
  _calendarState: string;
  private _intlChanges;
  private _clampedActiveDate;
  constructor(
    _elementRef: ElementRef,
    _intl: MatDatepickerIntl,
    _ngZone: NgZone,
    _adapter: DatetimeAdapter<D>,
    _dateFormats: MatDatetimeFormats,
    changeDetectorRef: ChangeDetectorRef
  );
  private _type;
  get type(): MatDatetimepickerType;
  set type(value: MatDatetimepickerType);
  private _startAt;
  /** A date representing the period (month or year) to start the calendar in. */
  get startAt(): D | null;
  set startAt(value: D | null);
  private _selected;
  /** The currently selected date. */
  get selected(): D | null;
  set selected(value: D | null);
  private _minDate;
  /** The minimum selectable date. */
  get minDate(): D | null;
  set minDate(value: D | null);
  private _maxDate;
  /** The maximum selectable date. */
  get maxDate(): D | null;
  set maxDate(value: D | null);
  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get _activeDate(): D;
  set _activeDate(value: D);
  /** Whether the calendar is in month view. */
  _currentView: MatCalendarView;
  get currentView(): MatCalendarView;
  set currentView(view: MatCalendarView);
  /** The label for the current calendar view. */
  get _yearLabel(): string;
  get _monthYearLabel(): string;
  get _dateLabel(): string;
  get _hoursLabel(): string;
  get _minutesLabel(): string;
  get _ariaLabelNext(): string;
  get _ariaLabelPrev(): string;
  /** Date filter for the month and year views. */
  _dateFilterForViews: (date: D) => boolean;
  onCancel(): void;
  onConfirm(): void;
  ngAfterContentInit(): void;
  ngOnDestroy(): void;
  /** Handles date selection in the month view. */
  _dateSelected(date: D): void;
  /** Handles month selection in the year view. */
  _monthSelected(month: D): void;
  /** Handles year selection in the multi year view. */
  _yearSelected(year: D): void;
  _timeSelected(date: D): void;
  _onActiveDateChange(date: D): void;
  _updateDate(date: D): D;
  _selectAMPM(date: D): void;
  _ampmClicked(source: string): void;
  _yearClicked(): void;
  _dateClicked(): void;
  _hoursClicked(): void;
  _minutesClicked(): void;
  /** Handles user clicks on the previous button. */
  _previousClicked(): void;
  /** Handles user clicks on the next button. */
  _nextClicked(): void;
  /** Whether the previous period button is enabled. */
  _previousEnabled(): boolean;
  /** Whether the next period button is enabled. */
  _nextEnabled(): boolean;
  /** Handles keydown events on the calendar body. */
  _handleCalendarBodyKeydown(event: KeyboardEvent): void;
  _focusActiveCell(): void;
  _calendarStateDone(): void;
  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView;
  /** Handles keydown events on the calendar body when calendar is in month view. */
  private _handleCalendarBodyKeydownInMonthView;
  /** Handles keydown events on the calendar body when calendar is in year view. */
  private _handleCalendarBodyKeydownInYearView;
  /** Handles keydown events on the calendar body when calendar is in multi-year view. */
  private _handleCalendarBodyKeydownInMultiYearView;
  /** Handles keydown events on the calendar body when calendar is in month view. */
  private _handleCalendarBodyKeydownInClockView;
  /**
   * Determine the date for the month that comes before the given month in the same column in the
   * calendar table.
   */
  private _prevMonthInSameCol;
  /**
   * Determine the date for the month that comes after the given month in the same column in the
   * calendar table.
   */
  private _nextMonthInSameCol;
  private calendarState;
  private _2digit;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerCalendarComponent<any>,
    [null, null, null, { optional: true }, { optional: true }, null]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MatDatetimepickerCalendarComponent<any>,
    'mat-datetimepicker-calendar',
    never,
    {
      multiYearSelector: 'multiYearSelector';
      startView: 'startView';
      twelvehour: 'twelvehour';
      timeInterval: 'timeInterval';
      dateFilter: 'dateFilter';
      ariaLabel: 'ariaLabel';
      ariaNextMonthLabel: 'ariaNextMonthLabel';
      ariaPrevMonthLabel: 'ariaPrevMonthLabel';
      ariaNextYearLabel: 'ariaNextYearLabel';
      ariaPrevYearLabel: 'ariaPrevYearLabel';
      ariaNextMultiYearLabel: 'ariaNextMultiYearLabel';
      ariaPrevMultiYearLabel: 'ariaPrevMultiYearLabel';
      confirmLabel: 'confirmLabel';
      cancelLabel: 'cancelLabel';
      preventSameDateTimeSelection: 'preventSameDateTimeSelection';
      type: 'type';
      startAt: 'startAt';
      selected: 'selected';
      minDate: 'minDate';
      maxDate: 'maxDate';
    },
    {
      closeDateTimePicker: 'closeDateTimePicker';
      selectedChange: 'selectedChange';
      viewChanged: 'viewChanged';
    },
    never,
    never,
    false
  >;
}
