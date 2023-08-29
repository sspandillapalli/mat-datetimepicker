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
/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
export class MatDatetimepickerYearViewComponent {
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
  /** The date to display in this year view (everything other than the year is ignored). */
  get activeDate() {
    return this._activeDate;
  }
  set activeDate(value) {
    let oldActiveDate = this._activeDate;
    this._activeDate = value || this._adapter.today();
    if (
      oldActiveDate &&
      this._activeDate &&
      !this._adapter.sameYear(oldActiveDate, this._activeDate)
    ) {
      this._init();
      // if (oldActiveDate < this._activeDate) {
      //  this.calendarState('right');
      // } else {
      //  this.calendarState('left');
      // }
    }
  }
  /** The currently selected date. */
  get selected() {
    return this._selected;
  }
  set selected(value) {
    this._selected = value;
    this._selectedMonth = this._getMonthInCurrentYear(this.selected);
  }
  ngAfterContentInit() {
    this._init();
  }
  /** Handles when a new month is selected. */
  _monthSelected(month) {
    const normalizedDate = this._adapter.createDatetime(
      this._adapter.getYear(this.activeDate),
      month,
      1,
      0,
      0
    );
    this.selectedChange.emit(
      this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        month,
        Math.min(
          this._adapter.getDate(this.activeDate),
          this._adapter.getNumDaysInMonth(normalizedDate)
        ),
        this._adapter.getHour(this.activeDate),
        this._adapter.getMinute(this.activeDate)
      )
    );
    if (this.type === 'month') {
      this._userSelection.emit();
    }
  }
  _calendarStateDone() {
    this._calendarState = '';
  }
  /** Initializes this month view. */
  _init() {
    this._selectedMonth = this._getMonthInCurrentYear(this.selected);
    this._todayMonth = this._getMonthInCurrentYear(this._adapter.today());
    this._yearLabel = this._adapter.getYearName(this.activeDate);
    let monthNames = this._adapter.getMonthNames('short');
    // First row of months only contains 5 elements so we can fit the year label on the same row.
    this._months = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
    ].map((row) =>
      row.map((month) => this._createCellForMonth(month, monthNames[month]))
    );
  }
  /**
   * Gets the month in this year that the given Date falls on.
   * Returns null if the given Date is in another year.
   */
  _getMonthInCurrentYear(date) {
    return this._adapter.sameYear(date, this.activeDate)
      ? this._adapter.getMonth(date)
      : null;
  }
  /** Creates an MdCalendarCell for the given month. */
  _createCellForMonth(month, monthName) {
    let ariaLabel = this._adapter.format(
      this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        month,
        1,
        this._adapter.getHour(this.activeDate),
        this._adapter.getMinute(this.activeDate)
      ),
      this._dateFormats.display.monthYearA11yLabel
    );
    return new MatDatetimepickerCalendarCell(
      month,
      monthName.toLocaleUpperCase(),
      ariaLabel,
      this._isMonthEnabled(month)
    );
  }
  // private calendarState(direction: string): void {
  //   this._calendarState = direction;
  // }
  /** Whether the given month is enabled. */
  _isMonthEnabled(month) {
    if (!this.dateFilter) {
      return true;
    }
    let firstOfMonth = this._adapter.createDatetime(
      this._adapter.getYear(this.activeDate),
      month,
      1,
      this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate)
    );
    // If any date in the month is enabled count the month as enabled.
    for (
      let date = firstOfMonth;
      this._adapter.getMonth(date) == month;
      date = this._adapter.addCalendarDays(date, 1)
    ) {
      if (this.dateFilter(date)) {
        return true;
      }
    }
    return false;
  }
}
/** @nocollapse */ MatDatetimepickerYearViewComponent.ɵfac =
  i0.ɵɵngDeclareFactory({
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerYearViewComponent,
    deps: [
      { token: i1.DatetimeAdapter, optional: true },
      { token: MAT_DATETIME_FORMATS, optional: true },
    ],
    target: i0.ɵɵFactoryTarget.Component,
  });
/** @nocollapse */ MatDatetimepickerYearViewComponent.ɵcmp =
  i0.ɵɵngDeclareComponent({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerYearViewComponent,
    selector: 'mat-datetimepicker-year-view',
    inputs: {
      type: 'type',
      dateFilter: 'dateFilter',
      activeDate: 'activeDate',
      selected: 'selected',
    },
    outputs: {
      _userSelection: '_userSelection',
      selectedChange: 'selectedChange',
    },
    ngImport: i0,
    template:
      '<table class="mat-datetimepicker-calendar-table">\r\n  <thead class="mat-datetimepicker-calendar-table-header"></thead>\r\n  <tbody\r\n    (@slideCalendar.done)="_calendarStateDone()"\r\n    (selectedValueChange)="_monthSelected($event)"\r\n    [@slideCalendar]="_calendarState"\r\n    [activeCell]="_adapter.getMonth(activeDate)"\r\n    [labelMinRequiredCells]="2"\r\n    [label]="_yearLabel"\r\n    [rows]="_months"\r\n    [selectedValue]="_selectedMonth"\r\n    [todayValue]="_todayMonth"\r\n    allowDisabledSelection="true"\r\n    matDatetimepickerCalendarBody\r\n    role="grid"\r\n  ></tbody>\r\n</table>\r\n',
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
  type: MatDatetimepickerYearViewComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-datetimepicker-year-view',
          animations: [slideCalendar],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<table class="mat-datetimepicker-calendar-table">\r\n  <thead class="mat-datetimepicker-calendar-table-header"></thead>\r\n  <tbody\r\n    (@slideCalendar.done)="_calendarStateDone()"\r\n    (selectedValueChange)="_monthSelected($event)"\r\n    [@slideCalendar]="_calendarState"\r\n    [activeCell]="_adapter.getMonth(activeDate)"\r\n    [labelMinRequiredCells]="2"\r\n    [label]="_yearLabel"\r\n    [rows]="_months"\r\n    [selectedValue]="_selectedMonth"\r\n    [todayValue]="_todayMonth"\r\n    allowDisabledSelection="true"\r\n    matDatetimepickerCalendarBody\r\n    role="grid"\r\n  ></tbody>\r\n</table>\r\n',
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
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhci12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZS9zcmMvZGF0ZXRpbWVwaWNrZXIveWVhci12aWV3LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZS9zcmMvZGF0ZXRpbWVwaWNrZXIveWVhci12aWV3Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFDTCxvQkFBb0IsR0FFckIsTUFBTSw2QkFBNkIsQ0FBQztBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7Ozs7QUFHOUQ7OztHQUdHO0FBUUgsTUFBTSxPQUFPLGtDQUFrQztJQXFCN0MsWUFDcUIsUUFBNEIsRUFHdkMsWUFBZ0M7UUFIckIsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFHdkMsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBeEJoQyxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFFM0MsU0FBSSxHQUEwQixNQUFNLENBQUM7UUFHOUMsMENBQTBDO1FBQ2hDLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQUssQ0FBQztRQW9CL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSwwQkFBMEIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3JEO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVB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Qm5CLGtDQUFrQyx5UENoQy9DLG1vQkFpQkEsZ1VEV2MsQ0FBQyxhQUFhLENBQUM7MkZBSWhCLGtDQUFrQztrQkFQOUMsU0FBUzsrQkFDRSw4QkFBOEIsY0FFNUIsQ0FBQyxhQUFhLENBQUMsaUJBQ1osaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTTs7MEJBd0I1QyxRQUFROzswQkFDUixRQUFROzswQkFDUixNQUFNOzJCQUFDLG9CQUFvQjs0Q0F2QnBCLGNBQWM7c0JBQXZCLE1BQU07Z0JBRUUsSUFBSTtzQkFBWixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUksY0FBYztzQkFBdkIsTUFBTTtnQkFtQ0gsVUFBVTtzQkFEYixLQUFLO2dCQTBCRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIEFmdGVyQ29udGVudEluaXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29tcG9uZW50LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT3B0aW9uYWwsXHJcbiAgT3V0cHV0LFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvciB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItZXJyb3JzJztcclxuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckNlbGwgfSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xyXG5pbXBvcnQgeyBzbGlkZUNhbGVuZGFyIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1hbmltYXRpb25zJztcclxuaW1wb3J0IHtcclxuICBNQVRfREFURVRJTUVfRk9STUFUUyxcclxuICBNYXREYXRldGltZUZvcm1hdHMsXHJcbn0gZnJvbSAnLi4vYWRhcHRlci9kYXRldGltZS1mb3JtYXRzJztcclxuaW1wb3J0IHsgRGF0ZXRpbWVBZGFwdGVyIH0gZnJvbSAnLi4vYWRhcHRlci9kYXRldGltZS1hZGFwdGVyJztcclxuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci10eXBlJztcclxuXHJcbi8qKlxyXG4gKiBBbiBpbnRlcm5hbCBjb21wb25lbnQgdXNlZCB0byBkaXNwbGF5IGEgc2luZ2xlIHllYXIgaW4gdGhlIGRhdGVwaWNrZXIuXHJcbiAqIEBkb2NzLXByaXZhdGVcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWF0LWRhdGV0aW1lcGlja2VyLXllYXItdmlldycsXHJcbiAgdGVtcGxhdGVVcmw6ICd5ZWFyLXZpZXcuaHRtbCcsXHJcbiAgYW5pbWF0aW9uczogW3NsaWRlQ2FsZW5kYXJdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXREYXRldGltZXBpY2tlclllYXJWaWV3Q29tcG9uZW50PEQ+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XHJcbiAgQE91dHB1dCgpIF91c2VyU2VsZWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG5cclxuICBASW5wdXQoKSB0eXBlOiBNYXREYXRldGltZXBpY2tlclR5cGUgPSAnZGF0ZSc7XHJcbiAgLyoqIEEgZnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXHJcbiAgQElucHV0KCkgZGF0ZUZpbHRlcjogKGRhdGU6IEQpID0+IGJvb2xlYW47XHJcbiAgLyoqIEVtaXRzIHdoZW4gYSBuZXcgbW9udGggaXMgc2VsZWN0ZWQuICovXHJcbiAgQE91dHB1dCgpIHNlbGVjdGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xyXG4gIC8qKiBHcmlkIG9mIGNhbGVuZGFyIGNlbGxzIHJlcHJlc2VudGluZyB0aGUgbW9udGhzIG9mIHRoZSB5ZWFyLiAqL1xyXG4gIF9tb250aHM6IE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDZWxsW11bXTtcclxuICAvKiogVGhlIGxhYmVsIGZvciB0aGlzIHllYXIgKGUuZy4gXCIyMDE3XCIpLiAqL1xyXG4gIF95ZWFyTGFiZWw6IHN0cmluZztcclxuICAvKiogVGhlIG1vbnRoIGluIHRoaXMgeWVhciB0aGF0IHRvZGF5IGZhbGxzIG9uLiBOdWxsIGlmIHRvZGF5IGlzIGluIGEgZGlmZmVyZW50IHllYXIuICovXHJcbiAgX3RvZGF5TW9udGg6IG51bWJlcjtcclxuICAvKipcclxuICAgKiBUaGUgbW9udGggaW4gdGhpcyB5ZWFyIHRoYXQgdGhlIHNlbGVjdGVkIERhdGUgZmFsbHMgb24uXHJcbiAgICogTnVsbCBpZiB0aGUgc2VsZWN0ZWQgRGF0ZSBpcyBpbiBhIGRpZmZlcmVudCB5ZWFyLlxyXG4gICAqL1xyXG4gIF9zZWxlY3RlZE1vbnRoOiBudW1iZXI7XHJcbiAgX2NhbGVuZGFyU3RhdGU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX2FkYXB0ZXI6IERhdGV0aW1lQWRhcHRlcjxEPixcclxuICAgIEBPcHRpb25hbCgpXHJcbiAgICBASW5qZWN0KE1BVF9EQVRFVElNRV9GT1JNQVRTKVxyXG4gICAgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGV0aW1lRm9ybWF0c1xyXG4gICkge1xyXG4gICAgaWYgKCF0aGlzLl9hZGFwdGVyKSB7XHJcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRldGltZUFkYXB0ZXInKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XHJcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNQVRfREFURVRJTUVfRk9STUFUUycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLnRvZGF5KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9hY3RpdmVEYXRlOiBEO1xyXG5cclxuICAvKiogVGhlIGRhdGUgdG8gZGlzcGxheSBpbiB0aGlzIHllYXIgdmlldyAoZXZlcnl0aGluZyBvdGhlciB0aGFuIHRoZSB5ZWFyIGlzIGlnbm9yZWQpLiAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IGFjdGl2ZURhdGUoKTogRCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlRGF0ZTtcclxuICB9XHJcblxyXG4gIHNldCBhY3RpdmVEYXRlKHZhbHVlOiBEKSB7XHJcbiAgICBsZXQgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XHJcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdmFsdWUgfHwgdGhpcy5fYWRhcHRlci50b2RheSgpO1xyXG4gICAgaWYgKFxyXG4gICAgICBvbGRBY3RpdmVEYXRlICYmXHJcbiAgICAgIHRoaXMuX2FjdGl2ZURhdGUgJiZcclxuICAgICAgIXRoaXMuX2FkYXB0ZXIuc2FtZVllYXIob2xkQWN0aXZlRGF0ZSwgdGhpcy5fYWN0aXZlRGF0ZSlcclxuICAgICkge1xyXG4gICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICAgIC8vIGlmIChvbGRBY3RpdmVEYXRlIDwgdGhpcy5fYWN0aXZlRGF0ZSkge1xyXG4gICAgICAvLyAgdGhpcy5jYWxlbmRhclN0YXRlKCdyaWdodCcpO1xyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgdGhpcy5jYWxlbmRhclN0YXRlKCdsZWZ0Jyk7XHJcbiAgICAgIC8vIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3NlbGVjdGVkOiBEO1xyXG5cclxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IHNlbGVjdGVkKCk6IEQge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xyXG4gIH1cclxuXHJcbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBEKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHZhbHVlO1xyXG4gICAgdGhpcy5fc2VsZWN0ZWRNb250aCA9IHRoaXMuX2dldE1vbnRoSW5DdXJyZW50WWVhcih0aGlzLnNlbGVjdGVkKTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcclxuICAgIHRoaXMuX2luaXQoKTtcclxuICB9XHJcblxyXG4gIC8qKiBIYW5kbGVzIHdoZW4gYSBuZXcgbW9udGggaXMgc2VsZWN0ZWQuICovXHJcbiAgX21vbnRoU2VsZWN0ZWQobW9udGg6IG51bWJlcikge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZERhdGUgPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgbW9udGgsXHJcbiAgICAgIDEsXHJcbiAgICAgIDAsXHJcbiAgICAgIDBcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxyXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxyXG4gICAgICAgIG1vbnRoLFxyXG4gICAgICAgIE1hdGgubWluKFxyXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXHJcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE51bURheXNJbk1vbnRoKG5vcm1hbGl6ZWREYXRlKVxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuYWN0aXZlRGF0ZSksXHJcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKVxyXG4gICAgICApXHJcbiAgICApO1xyXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xyXG4gICAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9jYWxlbmRhclN0YXRlRG9uZSgpIHtcclxuICAgIHRoaXMuX2NhbGVuZGFyU3RhdGUgPSAnJztcclxuICB9XHJcblxyXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIG1vbnRoIHZpZXcuICovXHJcbiAgcHJpdmF0ZSBfaW5pdCgpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkTW9udGggPSB0aGlzLl9nZXRNb250aEluQ3VycmVudFllYXIodGhpcy5zZWxlY3RlZCk7XHJcbiAgICB0aGlzLl90b2RheU1vbnRoID0gdGhpcy5fZ2V0TW9udGhJbkN1cnJlbnRZZWFyKHRoaXMuX2FkYXB0ZXIudG9kYXkoKSk7XHJcbiAgICB0aGlzLl95ZWFyTGFiZWwgPSB0aGlzLl9hZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuYWN0aXZlRGF0ZSk7XHJcblxyXG4gICAgbGV0IG1vbnRoTmFtZXMgPSB0aGlzLl9hZGFwdGVyLmdldE1vbnRoTmFtZXMoJ3Nob3J0Jyk7XHJcbiAgICAvLyBGaXJzdCByb3cgb2YgbW9udGhzIG9ubHkgY29udGFpbnMgNSBlbGVtZW50cyBzbyB3ZSBjYW4gZml0IHRoZSB5ZWFyIGxhYmVsIG9uIHRoZSBzYW1lIHJvdy5cclxuICAgIHRoaXMuX21vbnRocyA9IFtcclxuICAgICAgWzAsIDEsIDIsIDMsIDRdLFxyXG4gICAgICBbNSwgNiwgNywgOCwgOSwgMTAsIDExXSxcclxuICAgIF0ubWFwKChyb3cpID0+XHJcbiAgICAgIHJvdy5tYXAoKG1vbnRoKSA9PiB0aGlzLl9jcmVhdGVDZWxsRm9yTW9udGgobW9udGgsIG1vbnRoTmFtZXNbbW9udGhdKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBtb250aCBpbiB0aGlzIHllYXIgdGhhdCB0aGUgZ2l2ZW4gRGF0ZSBmYWxscyBvbi5cclxuICAgKiBSZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuIERhdGUgaXMgaW4gYW5vdGhlciB5ZWFyLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2dldE1vbnRoSW5DdXJyZW50WWVhcihkYXRlOiBEKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5zYW1lWWVhcihkYXRlLCB0aGlzLmFjdGl2ZURhdGUpXHJcbiAgICAgID8gdGhpcy5fYWRhcHRlci5nZXRNb250aChkYXRlKVxyXG4gICAgICA6IG51bGw7XHJcbiAgfVxyXG5cclxuICAvKiogQ3JlYXRlcyBhbiBNZENhbGVuZGFyQ2VsbCBmb3IgdGhlIGdpdmVuIG1vbnRoLiAqL1xyXG4gIHByaXZhdGUgX2NyZWF0ZUNlbGxGb3JNb250aChtb250aDogbnVtYmVyLCBtb250aE5hbWU6IHN0cmluZykge1xyXG4gICAgbGV0IGFyaWFMYWJlbCA9IHRoaXMuX2FkYXB0ZXIuZm9ybWF0KFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxyXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxyXG4gICAgICAgIG1vbnRoLFxyXG4gICAgICAgIDEsXHJcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuYWN0aXZlRGF0ZSksXHJcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKVxyXG4gICAgICApLFxyXG4gICAgICB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5Lm1vbnRoWWVhckExMXlMYWJlbFxyXG4gICAgKTtcclxuICAgIHJldHVybiBuZXcgTWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckNlbGwoXHJcbiAgICAgIG1vbnRoLFxyXG4gICAgICBtb250aE5hbWUudG9Mb2NhbGVVcHBlckNhc2UoKSxcclxuICAgICAgYXJpYUxhYmVsLFxyXG4gICAgICB0aGlzLl9pc01vbnRoRW5hYmxlZChtb250aClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGNhbGVuZGFyU3RhdGUoZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAvLyAgIHRoaXMuX2NhbGVuZGFyU3RhdGUgPSBkaXJlY3Rpb247XHJcbiAgLy8gfVxyXG5cclxuICAvKiogV2hldGhlciB0aGUgZ2l2ZW4gbW9udGggaXMgZW5hYmxlZC4gKi9cclxuICBwcml2YXRlIF9pc01vbnRoRW5hYmxlZChtb250aDogbnVtYmVyKSB7XHJcbiAgICBpZiAoIXRoaXMuZGF0ZUZpbHRlcikge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZmlyc3RPZk1vbnRoID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcclxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXHJcbiAgICAgIG1vbnRoLFxyXG4gICAgICAxLFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBJZiBhbnkgZGF0ZSBpbiB0aGUgbW9udGggaXMgZW5hYmxlZCBjb3VudCB0aGUgbW9udGggYXMgZW5hYmxlZC5cclxuICAgIGZvciAoXHJcbiAgICAgIGxldCBkYXRlID0gZmlyc3RPZk1vbnRoO1xyXG4gICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKGRhdGUpID09IG1vbnRoO1xyXG4gICAgICBkYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckRheXMoZGF0ZSwgMSlcclxuICAgICkge1xyXG4gICAgICBpZiAodGhpcy5kYXRlRmlsdGVyKGRhdGUpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsIjx0YWJsZSBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci10YWJsZVwiPlxyXG4gIDx0aGVhZCBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci10YWJsZS1oZWFkZXJcIj48L3RoZWFkPlxyXG4gIDx0Ym9keVxyXG4gICAgKEBzbGlkZUNhbGVuZGFyLmRvbmUpPVwiX2NhbGVuZGFyU3RhdGVEb25lKClcIlxyXG4gICAgKHNlbGVjdGVkVmFsdWVDaGFuZ2UpPVwiX21vbnRoU2VsZWN0ZWQoJGV2ZW50KVwiXHJcbiAgICBbQHNsaWRlQ2FsZW5kYXJdPVwiX2NhbGVuZGFyU3RhdGVcIlxyXG4gICAgW2FjdGl2ZUNlbGxdPVwiX2FkYXB0ZXIuZ2V0TW9udGgoYWN0aXZlRGF0ZSlcIlxyXG4gICAgW2xhYmVsTWluUmVxdWlyZWRDZWxsc109XCIyXCJcclxuICAgIFtsYWJlbF09XCJfeWVhckxhYmVsXCJcclxuICAgIFtyb3dzXT1cIl9tb250aHNcIlxyXG4gICAgW3NlbGVjdGVkVmFsdWVdPVwiX3NlbGVjdGVkTW9udGhcIlxyXG4gICAgW3RvZGF5VmFsdWVdPVwiX3RvZGF5TW9udGhcIlxyXG4gICAgYWxsb3dEaXNhYmxlZFNlbGVjdGlvbj1cInRydWVcIlxyXG4gICAgbWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckJvZHlcclxuICAgIHJvbGU9XCJncmlkXCJcclxuICA+PC90Ym9keT5cclxuPC90YWJsZT5cclxuIl19
