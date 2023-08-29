import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MatDatetimepickerCalendarCell } from './calendar-body';
import { slideCalendar } from './datetimepicker-animations';
import { MAT_DATETIME_FORMATS } from '../adapter/datetime-formats';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import * as i0 from '@angular/core';
import * as i1 from '../adapter/datetime-adapter';
import * as i2 from './calendar-body';
export const yearsPerPage = 24;
export const yearsPerRow = 4;
/**
 * An internal component used to display multiple years in the datepicker.
 * @docs-private
 */
export class MatDatetimepickerMultiYearViewComponent {
  constructor(_adapter, _dateFormats) {
    this._adapter = _adapter;
    this._dateFormats = _dateFormats;
    this._userSelection = new EventEmitter();
    this.type = 'date';
    /** Emits when a new month is selected. */
    this.selectedChange = new EventEmitter();
    if (!this._adapter) {
      throw createMissingDateImplError('DatetimeAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('MAT_DATETIME_FORMATS');
    }
    this._activeDate = this._adapter.today();
  }
  /** The date to display in this multi year view*/
  get activeDate() {
    return this._activeDate;
  }
  set activeDate(value) {
    let oldActiveDate = this._activeDate;
    this._activeDate = value || this._adapter.today();
    if (
      oldActiveDate &&
      this._activeDate &&
      !isSameMultiYearView(
        this._adapter,
        oldActiveDate,
        this._activeDate,
        this.minDate,
        this.maxDate
      )
    ) {
      this._init();
    }
  }
  /** The currently selected date. */
  get selected() {
    return this._selected;
  }
  set selected(value) {
    this._selected = value;
    this._selectedYear =
      this._selected && this._adapter.getYear(this._selected);
  }
  /** The minimum selectable date. */
  get minDate() {
    return this._minDate;
  }
  set minDate(value) {
    this._minDate = this._getValidDateOrNull(this._adapter.deserialize(value));
  }
  /** The maximum selectable date. */
  get maxDate() {
    return this._maxDate;
  }
  set maxDate(value) {
    this._maxDate = this._getValidDateOrNull(this._adapter.deserialize(value));
  }
  ngAfterContentInit() {
    this._init();
  }
  /** Handles when a new year is selected. */
  _yearSelected(year) {
    const month = this._adapter.getMonth(this.activeDate);
    const normalizedDate = this._adapter.createDatetime(year, month, 1, 0, 0);
    this.selectedChange.emit(
      this._adapter.createDatetime(
        year,
        month,
        Math.min(
          this._adapter.getDate(this.activeDate),
          this._adapter.getNumDaysInMonth(normalizedDate)
        ),
        this._adapter.getHour(this.activeDate),
        this._adapter.getMinute(this.activeDate)
      )
    );
    if (this.type === 'year') {
      this._userSelection.emit();
    }
  }
  _getActiveCell() {
    return getActiveOffset(
      this._adapter,
      this.activeDate,
      this.minDate,
      this.maxDate
    );
  }
  _calendarStateDone() {
    this._calendarState = '';
  }
  /** Initializes this year view. */
  _init() {
    this._todayYear = this._adapter.getYear(this._adapter.today());
    this._yearLabel = this._adapter.getYearName(this.activeDate);
    const activeYear = this._adapter.getYear(this.activeDate);
    const minYearOfPage =
      activeYear -
      getActiveOffset(
        this._adapter,
        this.activeDate,
        this.minDate,
        this.maxDate
      );
    this._years = [];
    for (let i = 0, row = []; i < yearsPerPage; i++) {
      row.push(minYearOfPage + i);
      if (row.length == yearsPerRow) {
        this._years.push(row.map((year) => this._createCellForYear(year)));
        row = [];
      }
    }
  }
  /** Creates an MatDatetimepickerCalendarCell for the given year. */
  _createCellForYear(year) {
    let yearName = this._adapter.getYearName(
      this._adapter.createDate(year, 0, 1)
    );
    return new MatDatetimepickerCalendarCell(
      year,
      yearName,
      yearName,
      this._shouldEnableYear(year)
    );
  }
  /** Whether the given year is enabled. */
  _shouldEnableYear(year) {
    // disable if the year is greater than maxDate lower than minDate
    if (
      year === undefined ||
      year === null ||
      (this.maxDate && year > this._adapter.getYear(this.maxDate)) ||
      (this.minDate && year < this._adapter.getYear(this.minDate))
    ) {
      return false;
    }
    // enable if it reaches here and there's no filter defined
    if (!this.dateFilter) {
      return true;
    }
    const firstOfYear = this._adapter.createDate(year, 0, 1);
    // If any date in the year is enabled count the year as enabled.
    for (
      let date = firstOfYear;
      this._adapter.getYear(date) == year;
      date = this._adapter.addCalendarDays(date, 1)
    ) {
      if (this.dateFilter(date)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Gets the year in this years range that the given Date falls on.
   * Returns null if the given Date is not in this range.
   */
  _getYearInCurrentRange(date) {
    const year = this._adapter.getYear(date);
    return this._isInRange(year) ? year : null;
  }
  /**
   * Validate if the current year is in the current range
   * Returns true if is in range else returns false
   */
  _isInRange(year) {
    return true;
  }
  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  _getValidDateOrNull(obj) {
    return this._adapter.isDateInstance(obj) && this._adapter.isValid(obj)
      ? obj
      : null;
  }
}
/** @nocollapse */ MatDatetimepickerMultiYearViewComponent.ɵfac =
  i0.ɵɵngDeclareFactory({
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerMultiYearViewComponent,
    deps: [
      { token: i1.DatetimeAdapter, optional: true },
      { token: MAT_DATETIME_FORMATS, optional: true },
    ],
    target: i0.ɵɵFactoryTarget.Component,
  });
/** @nocollapse */ MatDatetimepickerMultiYearViewComponent.ɵcmp =
  i0.ɵɵngDeclareComponent({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerMultiYearViewComponent,
    selector: 'mat-datetimepicker-multi-year-view',
    inputs: {
      type: 'type',
      dateFilter: 'dateFilter',
      activeDate: 'activeDate',
      selected: 'selected',
      minDate: 'minDate',
      maxDate: 'maxDate',
    },
    outputs: {
      _userSelection: '_userSelection',
      selectedChange: 'selectedChange',
    },
    ngImport: i0,
    template:
      '<table class="mat-datetimepicker-calendar-table">\r\n  <thead class="mat-datetimepicker-calendar-table-header"></thead>\r\n  <tbody\r\n    (@slideCalendar.done)="_calendarStateDone()"\r\n    (selectedValueChange)="_yearSelected($event)"\r\n    [@slideCalendar]="_calendarState"\r\n    [activeCell]="_getActiveCell()"\r\n    [numCols]="4"\r\n    [rows]="_years"\r\n    [selectedValue]="_selectedYear"\r\n    [todayValue]="_todayYear"\r\n    allowDisabledSelection="true"\r\n    matDatetimepickerCalendarBody\r\n    role="grid"\r\n  ></tbody>\r\n</table>\r\n',
    dependencies: [
      {
        kind: 'component',
        type: i2.MatDatetimepickerCalendarBodyComponent,
        selector: 'tbody[matDatetimepickerCalendarBody]',
        inputs: [
          'label',
          'rows',
          'todayValue',
          'selectedValue',
          'labelMinRequiredCells',
          'numCols',
          'allowDisabledSelection',
          'activeCell',
        ],
        outputs: ['selectedValueChange'],
      },
    ],
    animations: [slideCalendar],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None,
  });
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerMultiYearViewComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-datetimepicker-multi-year-view',
          animations: [slideCalendar],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<table class="mat-datetimepicker-calendar-table">\r\n  <thead class="mat-datetimepicker-calendar-table-header"></thead>\r\n  <tbody\r\n    (@slideCalendar.done)="_calendarStateDone()"\r\n    (selectedValueChange)="_yearSelected($event)"\r\n    [@slideCalendar]="_calendarState"\r\n    [activeCell]="_getActiveCell()"\r\n    [numCols]="4"\r\n    [rows]="_years"\r\n    [selectedValue]="_selectedYear"\r\n    [todayValue]="_todayYear"\r\n    allowDisabledSelection="true"\r\n    matDatetimepickerCalendarBody\r\n    role="grid"\r\n  ></tbody>\r\n</table>\r\n',
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      {
        type: i1.DatetimeAdapter,
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
            args: [MAT_DATETIME_FORMATS],
          },
        ],
      },
    ];
  },
  propDecorators: {
    _userSelection: [
      {
        type: Output,
      },
    ],
    type: [
      {
        type: Input,
      },
    ],
    dateFilter: [
      {
        type: Input,
      },
    ],
    selectedChange: [
      {
        type: Output,
      },
    ],
    activeDate: [
      {
        type: Input,
      },
    ],
    selected: [
      {
        type: Input,
      },
    ],
    minDate: [
      {
        type: Input,
      },
    ],
    maxDate: [
      {
        type: Input,
      },
    ],
  },
});
export function isSameMultiYearView(
  dateAdapter,
  date1,
  date2,
  minDate,
  maxDate
) {
  const year1 = dateAdapter.getYear(date1);
  const year2 = dateAdapter.getYear(date2);
  const startingYear = getStartingYear(dateAdapter, minDate, maxDate);
  return (
    Math.floor((year1 - startingYear) / yearsPerPage) ===
    Math.floor((year2 - startingYear) / yearsPerPage)
  );
}
/**
 * When the multi-year view is first opened, the active year will be in view.
 * So we compute how many years are between the active year and the *slot* where our
 * "startingYear" will render when paged into view.
 */
export function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
  const activeYear = dateAdapter.getYear(activeDate);
  return euclideanModulo(
    activeYear - getStartingYear(dateAdapter, minDate, maxDate),
    yearsPerPage
  );
}
/**
 * We pick a "starting" year such that either the maximum year would be at the end
 * or the minimum year would be at the beginning of a page.
 */
function getStartingYear(dateAdapter, minDate, maxDate) {
  let startingYear = 0;
  if (maxDate) {
    const maxYear = dateAdapter.getYear(maxDate);
    startingYear = maxYear - yearsPerPage + 1;
  } else if (minDate) {
    startingYear = dateAdapter.getYear(minDate);
  }
  return startingYear;
}
/** Gets remainder that is non-negative, even if first number is negative */
function euclideanModulo(a, b) {
  return ((a % b) + b) % b;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkteWVhci12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZS9zcmMvZGF0ZXRpbWVwaWNrZXIvbXVsdGkteWVhci12aWV3LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZS9zcmMvZGF0ZXRpbWVwaWNrZXIvbXVsdGkteWVhci12aWV3Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFDTCxvQkFBb0IsR0FFckIsTUFBTSw2QkFBNkIsQ0FBQztBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7Ozs7QUFHOUQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUUvQixNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBRTdCOzs7R0FHRztBQVFILE1BQU0sT0FBTyx1Q0FBdUM7SUF1QmxELFlBQ3FCLFFBQTRCLEVBR3ZDLFlBQWdDO1FBSHJCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBR3ZDLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtRQXhCaEMsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTNDLFNBQUksR0FBMEIsTUFBTSxDQUFDO1FBRzlDLDBDQUEwQztRQUNoQyxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFLLENBQUM7UUFvQi9DLElBQUksQ0FB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LENBQUMsQ0FBQztJQUNuRCxPQUFPLGVBQWUsQ0FDcEIsVUFBVSxHQUFHLGVBQWUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUMzRCxZQUFZLENBQ2IsQ0FBQztBQUNKLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLGVBQWUsQ0FDdEIsV0FBK0IsRUFDL0IsT0FBaUIsRUFDakIsT0FBaUI7SUFFakIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksT0FBTyxFQUFFO1FBQ1gsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxZQUFZLEdBQUcsT0FBTyxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUM7S0FDM0M7U0FBTSxJQUFJLE9BQU8sRUFBRTtRQUNsQixZQUFZLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM3QztJQUNELE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFFRCw0RUFBNEU7QUFDNUUsU0FBUyxlQUFlLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDM0MsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBZnRlckNvbnRlbnRJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSW5qZWN0LFxyXG4gIElucHV0LFxyXG4gIE9wdGlvbmFsLFxyXG4gIE91dHB1dCxcclxuICBWaWV3RW5jYXBzdWxhdGlvbixcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWVycm9ycyc7XHJcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDZWxsIH0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcclxuaW1wb3J0IHsgc2xpZGVDYWxlbmRhciB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7XHJcbiAgTUFUX0RBVEVUSU1FX0ZPUk1BVFMsXHJcbiAgTWF0RGF0ZXRpbWVGb3JtYXRzLFxyXG59IGZyb20gJy4uL2FkYXB0ZXIvZGF0ZXRpbWUtZm9ybWF0cyc7XHJcbmltcG9ydCB7IERhdGV0aW1lQWRhcHRlciB9IGZyb20gJy4uL2FkYXB0ZXIvZGF0ZXRpbWUtYWRhcHRlcic7XHJcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VyVHlwZSB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItdHlwZSc7XHJcblxyXG5leHBvcnQgY29uc3QgeWVhcnNQZXJQYWdlID0gMjQ7XHJcblxyXG5leHBvcnQgY29uc3QgeWVhcnNQZXJSb3cgPSA0O1xyXG5cclxuLyoqXHJcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgbXVsdGlwbGUgeWVhcnMgaW4gdGhlIGRhdGVwaWNrZXIuXHJcbiAqIEBkb2NzLXByaXZhdGVcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWF0LWRhdGV0aW1lcGlja2VyLW11bHRpLXllYXItdmlldycsXHJcbiAgdGVtcGxhdGVVcmw6ICdtdWx0aS15ZWFyLXZpZXcuaHRtbCcsXHJcbiAgYW5pbWF0aW9uczogW3NsaWRlQ2FsZW5kYXJdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXREYXRldGltZXBpY2tlck11bHRpWWVhclZpZXdDb21wb25lbnQ8RD5cclxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXRcclxue1xyXG4gIEBPdXRwdXQoKSBfdXNlclNlbGVjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuXHJcbiAgQElucHV0KCkgdHlwZTogTWF0RGF0ZXRpbWVwaWNrZXJUeXBlID0gJ2RhdGUnO1xyXG4gIC8qKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZmlsdGVyIHdoaWNoIGRhdGVzIGFyZSBzZWxlY3RhYmxlLiAqL1xyXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXI6IChkYXRlOiBEKSA9PiBib29sZWFuO1xyXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IG1vbnRoIGlzIHNlbGVjdGVkLiAqL1xyXG4gIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcclxuICAvKiogR3JpZCBvZiBjYWxlbmRhciBjZWxscyByZXByZXNlbnRpbmcgdGhlIHllYXJzIGluIHRoZSByYW5nZS4gKi9cclxuICBfeWVhcnM6IE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDZWxsW11bXTtcclxuICAvKiogVGhlIGxhYmVsIGZvciB0aGlzIHllYXIgcmFuZ2UgKGUuZy4gXCIyMDAwLTIwMjBcIikuICovXHJcbiAgX3llYXJMYWJlbDogc3RyaW5nO1xyXG4gIC8qKiBUaGUgeWVhciBpbiB0aGlzIHJhbmdlIHRoYXQgdG9kYXkgZmFsbHMgb24uIE51bGwgaWYgdG9kYXkgaXMgaW4gYSBkaWZmZXJlbnQgcmFuZ2UuICovXHJcbiAgX3RvZGF5WWVhcjogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIFRoZSB5ZWFyIGluIHRoaXMgcmFuZ2UgdGhhdCB0aGUgc2VsZWN0ZWQgRGF0ZSBmYWxscyBvbi5cclxuICAgKiBOdWxsIGlmIHRoZSBzZWxlY3RlZCBEYXRlIGlzIGluIGEgZGlmZmVyZW50IHJhbmdlLlxyXG4gICAqL1xyXG4gIF9zZWxlY3RlZFllYXI6IG51bWJlciB8IG51bGw7XHJcbiAgX2NhbGVuZGFyU3RhdGU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX2FkYXB0ZXI6IERhdGV0aW1lQWRhcHRlcjxEPixcclxuICAgIEBPcHRpb25hbCgpXHJcbiAgICBASW5qZWN0KE1BVF9EQVRFVElNRV9GT1JNQVRTKVxyXG4gICAgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGV0aW1lRm9ybWF0c1xyXG4gICkge1xyXG4gICAgaWYgKCF0aGlzLl9hZGFwdGVyKSB7XHJcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRldGltZUFkYXB0ZXInKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XHJcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNQVRfREFURVRJTUVfRk9STUFUUycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLnRvZGF5KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9hY3RpdmVEYXRlOiBEO1xyXG5cclxuICAvKiogVGhlIGRhdGUgdG8gZGlzcGxheSBpbiB0aGlzIG11bHRpIHllYXIgdmlldyovXHJcbiAgQElucHV0KClcclxuICBnZXQgYWN0aXZlRGF0ZSgpOiBEIHtcclxuICAgIHJldHVybiB0aGlzLl9hY3RpdmVEYXRlO1xyXG4gIH1cclxuXHJcbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcclxuICAgIGxldCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fYWN0aXZlRGF0ZTtcclxuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB2YWx1ZSB8fCB0aGlzLl9hZGFwdGVyLnRvZGF5KCk7XHJcbiAgICBpZiAoXHJcbiAgICAgIG9sZEFjdGl2ZURhdGUgJiZcclxuICAgICAgdGhpcy5fYWN0aXZlRGF0ZSAmJlxyXG4gICAgICAhaXNTYW1lTXVsdGlZZWFyVmlldyhcclxuICAgICAgICB0aGlzLl9hZGFwdGVyLFxyXG4gICAgICAgIG9sZEFjdGl2ZURhdGUsXHJcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcclxuICAgICAgICB0aGlzLm1pbkRhdGUsXHJcbiAgICAgICAgdGhpcy5tYXhEYXRlXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9zZWxlY3RlZDogRDtcclxuXHJcbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZS4gKi9cclxuICBASW5wdXQoKVxyXG4gIGdldCBzZWxlY3RlZCgpOiBEIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcclxuICB9XHJcblxyXG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogRCkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZTtcclxuICAgIHRoaXMuX3NlbGVjdGVkWWVhciA9XHJcbiAgICAgIHRoaXMuX3NlbGVjdGVkICYmIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLl9zZWxlY3RlZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9taW5EYXRlOiBEIHwgbnVsbDtcclxuXHJcbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cclxuICBASW5wdXQoKVxyXG4gIGdldCBtaW5EYXRlKCk6IEQgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLl9taW5EYXRlO1xyXG4gIH1cclxuXHJcbiAgc2V0IG1pbkRhdGUodmFsdWU6IEQgfCBudWxsKSB7XHJcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2FkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX21heERhdGU6IEQgfCBudWxsO1xyXG5cclxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMuX21heERhdGU7XHJcbiAgfVxyXG5cclxuICBzZXQgbWF4RGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcclxuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fYWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xyXG4gICAgdGhpcy5faW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEhhbmRsZXMgd2hlbiBhIG5ldyB5ZWFyIGlzIHNlbGVjdGVkLiAqL1xyXG4gIF95ZWFyU2VsZWN0ZWQoeWVhcjogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBtb250aCA9IHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKTtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWREYXRlID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZSh5ZWFyLCBtb250aCwgMSwgMCwgMCk7XHJcblxyXG4gICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxyXG4gICAgICAgIHllYXIsXHJcbiAgICAgICAgbW9udGgsXHJcbiAgICAgICAgTWF0aC5taW4oXHJcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldERhdGUodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TnVtRGF5c0luTW9udGgobm9ybWFsaXplZERhdGUpXHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpXHJcbiAgICAgIClcclxuICAgICk7XHJcblxyXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3llYXInKSB7XHJcbiAgICAgIHRoaXMuX3VzZXJTZWxlY3Rpb24uZW1pdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2dldEFjdGl2ZUNlbGwoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBnZXRBY3RpdmVPZmZzZXQoXHJcbiAgICAgIHRoaXMuX2FkYXB0ZXIsXHJcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZSxcclxuICAgICAgdGhpcy5taW5EYXRlLFxyXG4gICAgICB0aGlzLm1heERhdGVcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBfY2FsZW5kYXJTdGF0ZURvbmUoKSB7XHJcbiAgICB0aGlzLl9jYWxlbmRhclN0YXRlID0gJyc7XHJcbiAgfVxyXG5cclxuICAvKiogSW5pdGlhbGl6ZXMgdGhpcyB5ZWFyIHZpZXcuICovXHJcbiAgcHJpdmF0ZSBfaW5pdCgpIHtcclxuICAgIHRoaXMuX3RvZGF5WWVhciA9IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLl9hZGFwdGVyLnRvZGF5KCkpO1xyXG4gICAgdGhpcy5feWVhckxhYmVsID0gdGhpcy5fYWRhcHRlci5nZXRZZWFyTmFtZSh0aGlzLmFjdGl2ZURhdGUpO1xyXG5cclxuICAgIGNvbnN0IGFjdGl2ZVllYXIgPSB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKTtcclxuXHJcbiAgICBjb25zdCBtaW5ZZWFyT2ZQYWdlID1cclxuICAgICAgYWN0aXZlWWVhciAtXHJcbiAgICAgIGdldEFjdGl2ZU9mZnNldChcclxuICAgICAgICB0aGlzLl9hZGFwdGVyLFxyXG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSxcclxuICAgICAgICB0aGlzLm1pbkRhdGUsXHJcbiAgICAgICAgdGhpcy5tYXhEYXRlXHJcbiAgICAgICk7XHJcblxyXG4gICAgdGhpcy5feWVhcnMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwLCByb3c6IG51bWJlcltdID0gW107IGkgPCB5ZWFyc1BlclBhZ2U7IGkrKykge1xyXG4gICAgICByb3cucHVzaChtaW5ZZWFyT2ZQYWdlICsgaSk7XHJcbiAgICAgIGlmIChyb3cubGVuZ3RoID09IHllYXJzUGVyUm93KSB7XHJcbiAgICAgICAgdGhpcy5feWVhcnMucHVzaChyb3cubWFwKCh5ZWFyKSA9PiB0aGlzLl9jcmVhdGVDZWxsRm9yWWVhcih5ZWFyKSkpO1xyXG4gICAgICAgIHJvdyA9IFtdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogQ3JlYXRlcyBhbiBNYXREYXRldGltZXBpY2tlckNhbGVuZGFyQ2VsbCBmb3IgdGhlIGdpdmVuIHllYXIuICovXHJcbiAgcHJpdmF0ZSBfY3JlYXRlQ2VsbEZvclllYXIoeWVhcjogbnVtYmVyKSB7XHJcbiAgICBsZXQgeWVhck5hbWUgPSB0aGlzLl9hZGFwdGVyLmdldFllYXJOYW1lKFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGUoeWVhciwgMCwgMSlcclxuICAgICk7XHJcbiAgICByZXR1cm4gbmV3IE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDZWxsKFxyXG4gICAgICB5ZWFyLFxyXG4gICAgICB5ZWFyTmFtZSxcclxuICAgICAgeWVhck5hbWUsXHJcbiAgICAgIHRoaXMuX3Nob3VsZEVuYWJsZVllYXIoeWVhcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4geWVhciBpcyBlbmFibGVkLiAqL1xyXG4gIHByaXZhdGUgX3Nob3VsZEVuYWJsZVllYXIoeWVhcjogbnVtYmVyKSB7XHJcbiAgICAvLyBkaXNhYmxlIGlmIHRoZSB5ZWFyIGlzIGdyZWF0ZXIgdGhhbiBtYXhEYXRlIGxvd2VyIHRoYW4gbWluRGF0ZVxyXG4gICAgaWYgKFxyXG4gICAgICB5ZWFyID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgeWVhciA9PT0gbnVsbCB8fFxyXG4gICAgICAodGhpcy5tYXhEYXRlICYmIHllYXIgPiB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5tYXhEYXRlKSkgfHxcclxuICAgICAgKHRoaXMubWluRGF0ZSAmJiB5ZWFyIDwgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMubWluRGF0ZSkpXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGVuYWJsZSBpZiBpdCByZWFjaGVzIGhlcmUgYW5kIHRoZXJlJ3Mgbm8gZmlsdGVyIGRlZmluZWRcclxuICAgIGlmICghdGhpcy5kYXRlRmlsdGVyKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZpcnN0T2ZZZWFyID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRlKHllYXIsIDAsIDEpO1xyXG5cclxuICAgIC8vIElmIGFueSBkYXRlIGluIHRoZSB5ZWFyIGlzIGVuYWJsZWQgY291bnQgdGhlIHllYXIgYXMgZW5hYmxlZC5cclxuICAgIGZvciAoXHJcbiAgICAgIGxldCBkYXRlID0gZmlyc3RPZlllYXI7XHJcbiAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcihkYXRlKSA9PSB5ZWFyO1xyXG4gICAgICBkYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckRheXMoZGF0ZSwgMSlcclxuICAgICkge1xyXG4gICAgICBpZiAodGhpcy5kYXRlRmlsdGVyKGRhdGUpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSB5ZWFyIGluIHRoaXMgeWVhcnMgcmFuZ2UgdGhhdCB0aGUgZ2l2ZW4gRGF0ZSBmYWxscyBvbi5cclxuICAgKiBSZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuIERhdGUgaXMgbm90IGluIHRoaXMgcmFuZ2UuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfZ2V0WWVhckluQ3VycmVudFJhbmdlKGRhdGU6IEQpIHtcclxuICAgIGNvbnN0IHllYXIgPSB0aGlzLl9hZGFwdGVyLmdldFllYXIoZGF0ZSk7XHJcbiAgICByZXR1cm4gdGhpcy5faXNJblJhbmdlKHllYXIpID8geWVhciA6IG51bGw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZSBpZiB0aGUgY3VycmVudCB5ZWFyIGlzIGluIHRoZSBjdXJyZW50IHJhbmdlXHJcbiAgICogUmV0dXJucyB0cnVlIGlmIGlzIGluIHJhbmdlIGVsc2UgcmV0dXJucyBmYWxzZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2lzSW5SYW5nZSh5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIGNoZWNrLlxyXG4gICAqIEByZXR1cm5zIFRoZSBnaXZlbiBvYmplY3QgaWYgaXQgaXMgYm90aCBhIGRhdGUgaW5zdGFuY2UgYW5kIHZhbGlkLCBvdGhlcndpc2UgbnVsbC5cclxuICAgKi9cclxuICBwcml2YXRlIF9nZXRWYWxpZERhdGVPck51bGwob2JqOiBhbnkpOiBEIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5pc0RhdGVJbnN0YW5jZShvYmopICYmIHRoaXMuX2FkYXB0ZXIuaXNWYWxpZChvYmopXHJcbiAgICAgID8gb2JqXHJcbiAgICAgIDogbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1NhbWVNdWx0aVllYXJWaWV3PEQ+KFxyXG4gIGRhdGVBZGFwdGVyOiBEYXRldGltZUFkYXB0ZXI8RD4sXHJcbiAgZGF0ZTE6IEQsXHJcbiAgZGF0ZTI6IEQsXHJcbiAgbWluRGF0ZTogRCB8IG51bGwsXHJcbiAgbWF4RGF0ZTogRCB8IG51bGxcclxuKTogYm9vbGVhbiB7XHJcbiAgY29uc3QgeWVhcjEgPSBkYXRlQWRhcHRlci5nZXRZZWFyKGRhdGUxKTtcclxuICBjb25zdCB5ZWFyMiA9IGRhdGVBZGFwdGVyLmdldFllYXIoZGF0ZTIpO1xyXG4gIGNvbnN0IHN0YXJ0aW5nWWVhciA9IGdldFN0YXJ0aW5nWWVhcihkYXRlQWRhcHRlciwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgcmV0dXJuIChcclxuICAgIE1hdGguZmxvb3IoKHllYXIxIC0gc3RhcnRpbmdZZWFyKSAvIHllYXJzUGVyUGFnZSkgPT09XHJcbiAgICBNYXRoLmZsb29yKCh5ZWFyMiAtIHN0YXJ0aW5nWWVhcikgLyB5ZWFyc1BlclBhZ2UpXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFdoZW4gdGhlIG11bHRpLXllYXIgdmlldyBpcyBmaXJzdCBvcGVuZWQsIHRoZSBhY3RpdmUgeWVhciB3aWxsIGJlIGluIHZpZXcuXHJcbiAqIFNvIHdlIGNvbXB1dGUgaG93IG1hbnkgeWVhcnMgYXJlIGJldHdlZW4gdGhlIGFjdGl2ZSB5ZWFyIGFuZCB0aGUgKnNsb3QqIHdoZXJlIG91clxyXG4gKiBcInN0YXJ0aW5nWWVhclwiIHdpbGwgcmVuZGVyIHdoZW4gcGFnZWQgaW50byB2aWV3LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZU9mZnNldDxEPihcclxuICBkYXRlQWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxyXG4gIGFjdGl2ZURhdGU6IEQsXHJcbiAgbWluRGF0ZTogRCB8IG51bGwsXHJcbiAgbWF4RGF0ZTogRCB8IG51bGxcclxuKTogbnVtYmVyIHtcclxuICBjb25zdCBhY3RpdmVZZWFyID0gZGF0ZUFkYXB0ZXIuZ2V0WWVhcihhY3RpdmVEYXRlKTtcclxuICByZXR1cm4gZXVjbGlkZWFuTW9kdWxvKFxyXG4gICAgYWN0aXZlWWVhciAtIGdldFN0YXJ0aW5nWWVhcihkYXRlQWRhcHRlciwgbWluRGF0ZSwgbWF4RGF0ZSksXHJcbiAgICB5ZWFyc1BlclBhZ2VcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogV2UgcGljayBhIFwic3RhcnRpbmdcIiB5ZWFyIHN1Y2ggdGhhdCBlaXRoZXIgdGhlIG1heGltdW0geWVhciB3b3VsZCBiZSBhdCB0aGUgZW5kXHJcbiAqIG9yIHRoZSBtaW5pbXVtIHllYXIgd291bGQgYmUgYXQgdGhlIGJlZ2lubmluZyBvZiBhIHBhZ2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTdGFydGluZ1llYXI8RD4oXHJcbiAgZGF0ZUFkYXB0ZXI6IERhdGV0aW1lQWRhcHRlcjxEPixcclxuICBtaW5EYXRlOiBEIHwgbnVsbCxcclxuICBtYXhEYXRlOiBEIHwgbnVsbFxyXG4pOiBudW1iZXIge1xyXG4gIGxldCBzdGFydGluZ1llYXIgPSAwO1xyXG4gIGlmIChtYXhEYXRlKSB7XHJcbiAgICBjb25zdCBtYXhZZWFyID0gZGF0ZUFkYXB0ZXIuZ2V0WWVhcihtYXhEYXRlKTtcclxuICAgIHN0YXJ0aW5nWWVhciA9IG1heFllYXIgLSB5ZWFyc1BlclBhZ2UgKyAxO1xyXG4gIH0gZWxzZSBpZiAobWluRGF0ZSkge1xyXG4gICAgc3RhcnRpbmdZZWFyID0gZGF0ZUFkYXB0ZXIuZ2V0WWVhcihtaW5EYXRlKTtcclxuICB9XHJcbiAgcmV0dXJuIHN0YXJ0aW5nWWVhcjtcclxufVxyXG5cclxuLyoqIEdldHMgcmVtYWluZGVyIHRoYXQgaXMgbm9uLW5lZ2F0aXZlLCBldmVuIGlmIGZpcnN0IG51bWJlciBpcyBuZWdhdGl2ZSAqL1xyXG5mdW5jdGlvbiBldWNsaWRlYW5Nb2R1bG8oYTogbnVtYmVyLCBiOiBudW1iZXIpOiBudW1iZXIge1xyXG4gIHJldHVybiAoKGEgJSBiKSArIGIpICUgYjtcclxufVxyXG4iLCI8dGFibGUgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItdGFibGVcIj5cclxuICA8dGhlYWQgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItdGFibGUtaGVhZGVyXCI+PC90aGVhZD5cclxuICA8dGJvZHlcclxuICAgIChAc2xpZGVDYWxlbmRhci5kb25lKT1cIl9jYWxlbmRhclN0YXRlRG9uZSgpXCJcclxuICAgIChzZWxlY3RlZFZhbHVlQ2hhbmdlKT1cIl95ZWFyU2VsZWN0ZWQoJGV2ZW50KVwiXHJcbiAgICBbQHNsaWRlQ2FsZW5kYXJdPVwiX2NhbGVuZGFyU3RhdGVcIlxyXG4gICAgW2FjdGl2ZUNlbGxdPVwiX2dldEFjdGl2ZUNlbGwoKVwiXHJcbiAgICBbbnVtQ29sc109XCI0XCJcclxuICAgIFtyb3dzXT1cIl95ZWFyc1wiXHJcbiAgICBbc2VsZWN0ZWRWYWx1ZV09XCJfc2VsZWN0ZWRZZWFyXCJcclxuICAgIFt0b2RheVZhbHVlXT1cIl90b2RheVllYXJcIlxyXG4gICAgYWxsb3dEaXNhYmxlZFNlbGVjdGlvbj1cInRydWVcIlxyXG4gICAgbWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckJvZHlcclxuICAgIHJvbGU9XCJncmlkXCJcclxuICA+PC90Ym9keT5cclxuPC90YWJsZT5cclxuIl19
