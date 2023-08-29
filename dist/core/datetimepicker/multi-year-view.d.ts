import { AfterContentInit, EventEmitter } from '@angular/core';
import { MatDatetimepickerCalendarCell } from './calendar-body';
import { MatDatetimeFormats } from '../adapter/datetime-formats';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MatDatetimepickerType } from './datetimepicker-type';
import * as i0 from '@angular/core';
export declare const yearsPerPage = 24;
export declare const yearsPerRow = 4;
/**
 * An internal component used to display multiple years in the datepicker.
 * @docs-private
 */
export declare class MatDatetimepickerMultiYearViewComponent<D>
  implements AfterContentInit
{
  _adapter: DatetimeAdapter<D>;
  private _dateFormats;
  _userSelection: EventEmitter<void>;
  type: MatDatetimepickerType;
  /** A function used to filter which dates are selectable. */
  dateFilter: (date: D) => boolean;
  /** Emits when a new month is selected. */
  selectedChange: EventEmitter<D>;
  /** Grid of calendar cells representing the years in the range. */
  _years: MatDatetimepickerCalendarCell[][];
  /** The label for this year range (e.g. "2000-2020"). */
  _yearLabel: string;
  /** The year in this range that today falls on. Null if today is in a different range. */
  _todayYear: number;
  /**
   * The year in this range that the selected Date falls on.
   * Null if the selected Date is in a different range.
   */
  _selectedYear: number | null;
  _calendarState: string;
  constructor(_adapter: DatetimeAdapter<D>, _dateFormats: MatDatetimeFormats);
  private _activeDate;
  /** The date to display in this multi year view*/
  get activeDate(): D;
  set activeDate(value: D);
  private _selected;
  /** The currently selected date. */
  get selected(): D;
  set selected(value: D);
  private _minDate;
  /** The minimum selectable date. */
  get minDate(): D | null;
  set minDate(value: D | null);
  private _maxDate;
  /** The maximum selectable date. */
  get maxDate(): D | null;
  set maxDate(value: D | null);
  ngAfterContentInit(): void;
  /** Handles when a new year is selected. */
  _yearSelected(year: number): void;
  _getActiveCell(): number;
  _calendarStateDone(): void;
  /** Initializes this year view. */
  private _init;
  /** Creates an MatDatetimepickerCalendarCell for the given year. */
  private _createCellForYear;
  /** Whether the given year is enabled. */
  private _shouldEnableYear;
  /**
   * Gets the year in this years range that the given Date falls on.
   * Returns null if the given Date is not in this range.
   */
  private _getYearInCurrentRange;
  /**
   * Validate if the current year is in the current range
   * Returns true if is in range else returns false
   */
  private _isInRange;
  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerMultiYearViewComponent<any>,
    [{ optional: true }, { optional: true }]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MatDatetimepickerMultiYearViewComponent<any>,
    'mat-datetimepicker-multi-year-view',
    never,
    {
      type: 'type';
      dateFilter: 'dateFilter';
      activeDate: 'activeDate';
      selected: 'selected';
      minDate: 'minDate';
      maxDate: 'maxDate';
    },
    { _userSelection: '_userSelection'; selectedChange: 'selectedChange' },
    never,
    never,
    false
  >;
}
export declare function isSameMultiYearView<D>(
  dateAdapter: DatetimeAdapter<D>,
  date1: D,
  date2: D,
  minDate: D | null,
  maxDate: D | null
): boolean;
/**
 * When the multi-year view is first opened, the active year will be in view.
 * So we compute how many years are between the active year and the *slot* where our
 * "startingYear" will render when paged into view.
 */
export declare function getActiveOffset<D>(
  dateAdapter: DatetimeAdapter<D>,
  activeDate: D,
  minDate: D | null,
  maxDate: D | null
): number;
