import { AfterContentInit, EventEmitter } from '@angular/core';
import { MatDatetimepickerCalendarCell } from './calendar-body';
import { MatDatetimeFormats } from '../adapter/datetime-formats';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MatDatetimepickerType } from './datetimepicker-type';
import * as i0 from '@angular/core';
/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
export declare class MatDatetimepickerYearViewComponent<D>
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
  /** Grid of calendar cells representing the months of the year. */
  _months: MatDatetimepickerCalendarCell[][];
  /** The label for this year (e.g. "2017"). */
  _yearLabel: string;
  /** The month in this year that today falls on. Null if today is in a different year. */
  _todayMonth: number;
  /**
   * The month in this year that the selected Date falls on.
   * Null if the selected Date is in a different year.
   */
  _selectedMonth: number;
  _calendarState: string;
  constructor(_adapter: DatetimeAdapter<D>, _dateFormats: MatDatetimeFormats);
  private _activeDate;
  /** The date to display in this year view (everything other than the year is ignored). */
  get activeDate(): D;
  set activeDate(value: D);
  private _selected;
  /** The currently selected date. */
  get selected(): D;
  set selected(value: D);
  ngAfterContentInit(): void;
  /** Handles when a new month is selected. */
  _monthSelected(month: number): void;
  _calendarStateDone(): void;
  /** Initializes this month view. */
  private _init;
  /**
   * Gets the month in this year that the given Date falls on.
   * Returns null if the given Date is in another year.
   */
  private _getMonthInCurrentYear;
  /** Creates an MdCalendarCell for the given month. */
  private _createCellForMonth;
  /** Whether the given month is enabled. */
  private _isMonthEnabled;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerYearViewComponent<any>,
    [{ optional: true }, { optional: true }]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MatDatetimepickerYearViewComponent<any>,
    'mat-datetimepicker-year-view',
    never,
    {
      type: 'type';
      dateFilter: 'dateFilter';
      activeDate: 'activeDate';
      selected: 'selected';
    },
    { _userSelection: '_userSelection'; selectedChange: 'selectedChange' },
    never,
    never,
    false
  >;
}
