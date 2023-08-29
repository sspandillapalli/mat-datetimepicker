import { AfterContentInit, EventEmitter } from '@angular/core';
import { MatDatetimeFormats } from '../adapter/datetime-formats';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MatDatetimepickerCalendarCell } from './calendar-body';
import { MatDatetimepickerType } from './datetimepicker-type';
import * as i0 from '@angular/core';
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export declare class MatDatetimepickerMonthViewComponent<D>
  implements AfterContentInit
{
  _adapter: DatetimeAdapter<D>;
  private _dateFormats;
  type: MatDatetimepickerType;
  _userSelection: EventEmitter<void>;
  /** A function used to filter which dates are selectable. */
  dateFilter: (date: D) => boolean;
  /** Emits when a new date is selected. */
  selectedChange: EventEmitter<D>;
  /** Grid of calendar cells representing the dates of the month. */
  _weeks: MatDatetimepickerCalendarCell[][];
  /** The number of blank cells in the first row before the 1st of the month. */
  _firstWeekOffset: number;
  /**
   * The date of the month that the currently selected Date falls on.
   * Null if the currently selected Date is in another month.
   */
  _selectedDate: number;
  /** The date of the month that today falls on. Null if today is in another month. */
  _todayDate: number;
  /** The names of the weekdays. */
  _weekdays: {
    long: string;
    narrow: string;
  }[];
  _calendarState: string;
  constructor(_adapter: DatetimeAdapter<D>, _dateFormats: MatDatetimeFormats);
  private _activeDate;
  /**
   * The date to display in this month view (everything other than the month and year is ignored).
   */
  get activeDate(): D;
  set activeDate(value: D);
  private _selected;
  /** The currently selected date. */
  get selected(): D;
  set selected(value: D);
  ngAfterContentInit(): void;
  /** Handles when a new date is selected. */
  _dateSelected(date: number): void;
  _calendarStateDone(): void;
  /** Initializes this month view. */
  private _init;
  /** Creates MdCalendarCells for the dates in this month. */
  private _createWeekCells;
  /**
   * Gets the date in this month that the given Date falls on.
   * Returns null if the given Date is in another month.
   */
  private _getDateInCurrentMonth;
  private calendarState;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerMonthViewComponent<any>,
    [{ optional: true }, { optional: true }]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MatDatetimepickerMonthViewComponent<any>,
    'mat-datetimepicker-month-view',
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
