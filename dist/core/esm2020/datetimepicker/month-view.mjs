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
import { MAT_DATETIME_FORMATS } from '../adapter/datetime-formats';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MatDatetimepickerCalendarCell } from './calendar-body';
import { slideCalendar } from './datetimepicker-animations';
import { createMissingDateImplError } from './datetimepicker-errors';
import * as i0 from '@angular/core';
import * as i1 from '../adapter/datetime-adapter';
import * as i2 from '@angular/common';
import * as i3 from './calendar-body';
const DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export class MatDatetimepickerMonthViewComponent {
  constructor(_adapter, _dateFormats) {
    this._adapter = _adapter;
    this._dateFormats = _dateFormats;
    this.type = 'date';
    this._userSelection = new EventEmitter();
    /** Emits when a new date is selected. */
    this.selectedChange = new EventEmitter();
    if (!this._adapter) {
      throw createMissingDateImplError('DatetimeAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('MAT_DATETIME_FORMATS');
    }
    const firstDayOfWeek = this._adapter.getFirstDayOfWeek();
    const narrowWeekdays = this._adapter.getDayOfWeekNames('narrow');
    const longWeekdays = this._adapter.getDayOfWeekNames('long');
    // Rotate the labels for days of the week based on the configured first day of the week.
    let weekdays = longWeekdays.map((long, i) => {
      return { long, narrow: narrowWeekdays[i] };
    });
    this._weekdays = weekdays
      .slice(firstDayOfWeek)
      .concat(weekdays.slice(0, firstDayOfWeek));
    this._activeDate = this._adapter.today();
  }
  /**
   * The date to display in this month view (everything other than the month and year is ignored).
   */
  get activeDate() {
    return this._activeDate;
  }
  set activeDate(value) {
    let oldActiveDate = this._activeDate;
    this._activeDate = value || this._adapter.today();
    if (
      oldActiveDate &&
      this._activeDate &&
      !this._adapter.sameMonthAndYear(oldActiveDate, this._activeDate)
    ) {
      this._init();
      if (this._adapter.isInNextMonth(oldActiveDate, this._activeDate)) {
        this.calendarState('right');
      } else {
        this.calendarState('left');
      }
    }
  }
  /** The currently selected date. */
  get selected() {
    return this._selected;
  }
  set selected(value) {
    this._selected = value;
    this._selectedDate = this._getDateInCurrentMonth(this.selected);
  }
  ngAfterContentInit() {
    this._init();
  }
  /** Handles when a new date is selected. */
  _dateSelected(date) {
    this.selectedChange.emit(
      this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate),
        date,
        this._adapter.getHour(this.activeDate),
        this._adapter.getMinute(this.activeDate)
      )
    );
    if (this.type === 'date') {
      this._userSelection.emit();
    }
  }
  _calendarStateDone() {
    this._calendarState = '';
  }
  /** Initializes this month view. */
  _init() {
    this._selectedDate = this._getDateInCurrentMonth(this.selected);
    this._todayDate = this._getDateInCurrentMonth(this._adapter.today());
    let firstOfMonth = this._adapter.createDatetime(
      this._adapter.getYear(this.activeDate),
      this._adapter.getMonth(this.activeDate),
      1,
      this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate)
    );
    this._firstWeekOffset =
      (DAYS_PER_WEEK +
        this._adapter.getDayOfWeek(firstOfMonth) -
        this._adapter.getFirstDayOfWeek()) %
      DAYS_PER_WEEK;
    this._createWeekCells();
  }
  /** Creates MdCalendarCells for the dates in this month. */
  _createWeekCells() {
    let daysInMonth = this._adapter.getNumDaysInMonth(this.activeDate);
    let dateNames = this._adapter.getDateNames();
    this._weeks = [[]];
    for (
      let i = 0, cell = this._firstWeekOffset;
      i < daysInMonth;
      i++, cell++
    ) {
      if (cell == DAYS_PER_WEEK) {
        this._weeks.push([]);
        cell = 0;
      }
      let date = this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate),
        i + 1,
        this._adapter.getHour(this.activeDate),
        this._adapter.getMinute(this.activeDate)
      );
      let enabled = !this.dateFilter || this.dateFilter(date);
      let ariaLabel = this._adapter.format(
        date,
        this._dateFormats.display.dateA11yLabel
      );
      this._weeks[this._weeks.length - 1].push(
        new MatDatetimepickerCalendarCell(
          i + 1,
          dateNames[i],
          ariaLabel,
          enabled
        )
      );
    }
  }
  /**
   * Gets the date in this month that the given Date falls on.
   * Returns null if the given Date is in another month.
   */
  _getDateInCurrentMonth(date) {
    return this._adapter.sameMonthAndYear(date, this.activeDate)
      ? this._adapter.getDate(date)
      : null;
  }
  calendarState(direction) {
    this._calendarState = direction;
  }
}
/** @nocollapse */ MatDatetimepickerMonthViewComponent.ɵfac =
  i0.ɵɵngDeclareFactory({
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerMonthViewComponent,
    deps: [
      { token: i1.DatetimeAdapter, optional: true },
      { token: MAT_DATETIME_FORMATS, optional: true },
    ],
    target: i0.ɵɵFactoryTarget.Component,
  });
/** @nocollapse */ MatDatetimepickerMonthViewComponent.ɵcmp =
  i0.ɵɵngDeclareComponent({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerMonthViewComponent,
    selector: 'mat-datetimepicker-month-view',
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
      '<table class="mat-datetimepicker-calendar-table">\r\n  <thead class="mat-datetimepicker-calendar-table-header">\r\n    <tr>\r\n      <th *ngFor="let day of _weekdays" [attr.aria-label]="day.long">\r\n        {{day.narrow}}\r\n      </th>\r\n    </tr>\r\n  </thead>\r\n  <tbody\r\n    (@slideCalendar.done)="_calendarStateDone()"\r\n    (selectedValueChange)="_dateSelected($event)"\r\n    [@slideCalendar]="_calendarState"\r\n    [activeCell]="_adapter.getDate(activeDate) - 1"\r\n    [rows]="_weeks"\r\n    [selectedValue]="_selectedDate"\r\n    [todayValue]="_todayDate"\r\n    matDatetimepickerCalendarBody\r\n    role="grid"\r\n  ></tbody>\r\n</table>\r\n',
    dependencies: [
      {
        kind: 'directive',
        type: i2.NgForOf,
        selector: '[ngFor][ngForOf]',
        inputs: ['ngForOf', 'ngForTrackBy', 'ngForTemplate'],
      },
      {
        kind: 'component',
        type: i3.MatDatetimepickerCalendarBodyComponent,
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
  type: MatDatetimepickerMonthViewComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-datetimepicker-month-view',
          animations: [slideCalendar],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<table class="mat-datetimepicker-calendar-table">\r\n  <thead class="mat-datetimepicker-calendar-table-header">\r\n    <tr>\r\n      <th *ngFor="let day of _weekdays" [attr.aria-label]="day.long">\r\n        {{day.narrow}}\r\n      </th>\r\n    </tr>\r\n  </thead>\r\n  <tbody\r\n    (@slideCalendar.done)="_calendarStateDone()"\r\n    (selectedValueChange)="_dateSelected($event)"\r\n    [@slideCalendar]="_calendarState"\r\n    [activeCell]="_adapter.getDate(activeDate) - 1"\r\n    [rows]="_weeks"\r\n    [selectedValue]="_selectedDate"\r\n    [todayValue]="_todayDate"\r\n    matDatetimepickerCalendarBody\r\n    role="grid"\r\n  ></tbody>\r\n</table>\r\n',
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
    type: [
      {
        type: Input,
      },
    ],
    _userSelection: [
      {
        type: Output,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmUvc3JjL2RhdGV0aW1lcGlja2VyL21vbnRoLXZpZXcudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9kYXRldGltZXBpY2tlci9tb250aC12aWV3Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLG9CQUFvQixHQUVyQixNQUFNLDZCQUE2QixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0seUJBQXlCLENBQUM7Ozs7O0FBR3JFLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQztBQUV4Qjs7O0dBR0c7QUFRSCxNQUFNLE9BQU8sbUNBQW1DO0lBeUI5QyxZQUNxQixRQUE0QixFQUd2QyxZQUFnQztRQUhyQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUd2QyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUExQmpDLFNBQUksR0FBMEIsTUFBTSxDQUFDO1FBRXBDLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUdwRCx5Q0FBeUM7UUFDL0IsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBSyxDQUFDO1FBc0IvQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixNQUFNLDBCQUEwQixDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDckQ7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixNQUFNLDBCQUEwQixDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FDMUQ7UUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTdELHdGQUF3RjtRQUN4RixJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRO2FBQ3RCLEtBQUssQ0FBQyxjQUFjLENBQUM7YUFDckIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFJRDs7T0FFRztJQUNILElBQ0ksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxVQUFVLENBQUMsS0FBUTtRQUNyQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEQsSUFDRSxhQUFhO1lBQ2IsSUFBSSxDQUFDLFdBQVc7WUFDaEIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQ2hFO1lBQ0EsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUNoRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzdCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUI7U0FDRjtJQUNILENBQUM7SUFJRCxtQ0FBbUM7SUFDbkMsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFFBQVEsQ0FBQyxLQUFRO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsYUFBYSxDQUFDLElBQVk7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDdkMsSUFBSSxFQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUN6QyxDQUNGLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxtQ0FBbUM7SUFDM0IsS0FBSztRQUNYLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFckUsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQzdDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUN2QyxDQUFDLEVBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQ3pDLENBQUM7UUFDRixJQUFJLENBQUMsZ0JBQWdCO1lBQ25CLENBQUMsYUFBYTtnQkFDWixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEMsYUFBYSxDQUFDO1FBRWhCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCwyREFBMkQ7SUFDbkQsZ0JBQWdCO1FBQ3RCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25FLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25CLEtBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQ3ZDLENBQUMsR0FBRyxXQUFXLEVBQ2YsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQ1g7WUFDQSxJQUFJLElBQUksSUFBSSxhQUFhLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQ3ZDLENBQUMsR0FBRyxDQUFDLEVBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQ3pDLENBQUM7WUFDRixJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDbEMsSUFBSSxFQUNKLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FDeEMsQ0FBQztZQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN0QyxJQUFJLDZCQUE2QixDQUMvQixDQUFDLEdBQUcsQ0FBQyxFQUNMLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFDWixTQUFTLEVBQ1QsT0FBTyxDQUNSLENBQ0YsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHNCQUFzQixDQUFDLElBQU87UUFDcEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzFELENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNYLENBQUM7SUFFTyxhQUFhLENBQUMsU0FBaUI7UUFDckMsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7SUFDbEMsQ0FBQzs7bUpBNUxVLG1DQUFtQyxpRUE0QnBDLG9CQUFvQjt1SUE1Qm5CLG1DQUFtQywwUENsQ2hELDZxQkFvQkEsNmJEVWMsQ0FBQyxhQUFhLENBQUM7MkZBSWhCLG1DQUFtQztrQkFQL0MsU0FBUzsrQkFDRSwrQkFBK0IsY0FFN0IsQ0FBQyxhQUFhLENBQUMsaUJBQ1osaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTTs7MEJBNEI1QyxRQUFROzswQkFDUixRQUFROzswQkFDUixNQUFNOzJCQUFDLG9CQUFvQjs0Q0F6QnJCLElBQUk7c0JBQVosS0FBSztnQkFFSSxjQUFjO3NCQUF2QixNQUFNO2dCQUVFLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUksY0FBYztzQkFBdkIsTUFBTTtnQkFtREgsVUFBVTtzQkFEYixLQUFLO2dCQTBCRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIEFmdGVyQ29udGVudEluaXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29tcG9uZW50LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT3B0aW9uYWwsXHJcbiAgT3V0cHV0LFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIE1BVF9EQVRFVElNRV9GT1JNQVRTLFxyXG4gIE1hdERhdGV0aW1lRm9ybWF0cyxcclxufSBmcm9tICcuLi9hZGFwdGVyL2RhdGV0aW1lLWZvcm1hdHMnO1xyXG5pbXBvcnQgeyBEYXRldGltZUFkYXB0ZXIgfSBmcm9tICcuLi9hZGFwdGVyL2RhdGV0aW1lLWFkYXB0ZXInO1xyXG5pbXBvcnQgeyBNYXREYXRldGltZXBpY2tlckNhbGVuZGFyQ2VsbCB9IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XHJcbmltcG9ydCB7IHNsaWRlQ2FsZW5kYXIgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWFuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvciB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItZXJyb3JzJztcclxuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci10eXBlJztcclxuXHJcbmNvbnN0IERBWVNfUEVSX1dFRUsgPSA3O1xyXG5cclxuLyoqXHJcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCB1c2VkIHRvIGRpc3BsYXkgYSBzaW5nbGUgbW9udGggaW4gdGhlIGRhdGVwaWNrZXIuXHJcbiAqIEBkb2NzLXByaXZhdGVcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWF0LWRhdGV0aW1lcGlja2VyLW1vbnRoLXZpZXcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnbW9udGgtdmlldy5odG1sJyxcclxuICBhbmltYXRpb25zOiBbc2xpZGVDYWxlbmRhcl0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxufSlcclxuZXhwb3J0IGNsYXNzIE1hdERhdGV0aW1lcGlja2VyTW9udGhWaWV3Q29tcG9uZW50PEQ+XHJcbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0XHJcbntcclxuICBASW5wdXQoKSB0eXBlOiBNYXREYXRldGltZXBpY2tlclR5cGUgPSAnZGF0ZSc7XHJcblxyXG4gIEBPdXRwdXQoKSBfdXNlclNlbGVjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICAvKiogQSBmdW5jdGlvbiB1c2VkIHRvIGZpbHRlciB3aGljaCBkYXRlcyBhcmUgc2VsZWN0YWJsZS4gKi9cclxuICBASW5wdXQoKSBkYXRlRmlsdGVyOiAoZGF0ZTogRCkgPT4gYm9vbGVhbjtcclxuICAvKiogRW1pdHMgd2hlbiBhIG5ldyBkYXRlIGlzIHNlbGVjdGVkLiAqL1xyXG4gIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcclxuICAvKiogR3JpZCBvZiBjYWxlbmRhciBjZWxscyByZXByZXNlbnRpbmcgdGhlIGRhdGVzIG9mIHRoZSBtb250aC4gKi9cclxuICBfd2Vla3M6IE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDZWxsW11bXTtcclxuICAvKiogVGhlIG51bWJlciBvZiBibGFuayBjZWxscyBpbiB0aGUgZmlyc3Qgcm93IGJlZm9yZSB0aGUgMXN0IG9mIHRoZSBtb250aC4gKi9cclxuICBfZmlyc3RXZWVrT2Zmc2V0OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogVGhlIGRhdGUgb2YgdGhlIG1vbnRoIHRoYXQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBEYXRlIGZhbGxzIG9uLlxyXG4gICAqIE51bGwgaWYgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBEYXRlIGlzIGluIGFub3RoZXIgbW9udGguXHJcbiAgICovXHJcbiAgX3NlbGVjdGVkRGF0ZTogbnVtYmVyO1xyXG4gIC8qKiBUaGUgZGF0ZSBvZiB0aGUgbW9udGggdGhhdCB0b2RheSBmYWxscyBvbi4gTnVsbCBpZiB0b2RheSBpcyBpbiBhbm90aGVyIG1vbnRoLiAqL1xyXG4gIF90b2RheURhdGU6IG51bWJlcjtcclxuICAvKiogVGhlIG5hbWVzIG9mIHRoZSB3ZWVrZGF5cy4gKi9cclxuICBfd2Vla2RheXM6IHsgbG9uZzogc3RyaW5nOyBuYXJyb3c6IHN0cmluZyB9W107XHJcbiAgX2NhbGVuZGFyU3RhdGU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX2FkYXB0ZXI6IERhdGV0aW1lQWRhcHRlcjxEPixcclxuICAgIEBPcHRpb25hbCgpXHJcbiAgICBASW5qZWN0KE1BVF9EQVRFVElNRV9GT1JNQVRTKVxyXG4gICAgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE1hdERhdGV0aW1lRm9ybWF0c1xyXG4gICkge1xyXG4gICAgaWYgKCF0aGlzLl9hZGFwdGVyKSB7XHJcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRldGltZUFkYXB0ZXInKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XHJcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNQVRfREFURVRJTUVfRk9STUFUUycpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZpcnN0RGF5T2ZXZWVrID0gdGhpcy5fYWRhcHRlci5nZXRGaXJzdERheU9mV2VlaygpO1xyXG4gICAgY29uc3QgbmFycm93V2Vla2RheXMgPSB0aGlzLl9hZGFwdGVyLmdldERheU9mV2Vla05hbWVzKCduYXJyb3cnKTtcclxuICAgIGNvbnN0IGxvbmdXZWVrZGF5cyA9IHRoaXMuX2FkYXB0ZXIuZ2V0RGF5T2ZXZWVrTmFtZXMoJ2xvbmcnKTtcclxuXHJcbiAgICAvLyBSb3RhdGUgdGhlIGxhYmVscyBmb3IgZGF5cyBvZiB0aGUgd2VlayBiYXNlZCBvbiB0aGUgY29uZmlndXJlZCBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXHJcbiAgICBsZXQgd2Vla2RheXMgPSBsb25nV2Vla2RheXMubWFwKChsb25nLCBpKSA9PiB7XHJcbiAgICAgIHJldHVybiB7IGxvbmcsIG5hcnJvdzogbmFycm93V2Vla2RheXNbaV0gfTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5fd2Vla2RheXMgPSB3ZWVrZGF5c1xyXG4gICAgICAuc2xpY2UoZmlyc3REYXlPZldlZWspXHJcbiAgICAgIC5jb25jYXQod2Vla2RheXMuc2xpY2UoMCwgZmlyc3REYXlPZldlZWspKTtcclxuXHJcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci50b2RheSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfYWN0aXZlRGF0ZTogRDtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGRhdGUgdG8gZGlzcGxheSBpbiB0aGlzIG1vbnRoIHZpZXcgKGV2ZXJ5dGhpbmcgb3RoZXIgdGhhbiB0aGUgbW9udGggYW5kIHllYXIgaXMgaWdub3JlZCkuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBnZXQgYWN0aXZlRGF0ZSgpOiBEIHtcclxuICAgIHJldHVybiB0aGlzLl9hY3RpdmVEYXRlO1xyXG4gIH1cclxuXHJcbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcclxuICAgIGxldCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fYWN0aXZlRGF0ZTtcclxuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB2YWx1ZSB8fCB0aGlzLl9hZGFwdGVyLnRvZGF5KCk7XHJcbiAgICBpZiAoXHJcbiAgICAgIG9sZEFjdGl2ZURhdGUgJiZcclxuICAgICAgdGhpcy5fYWN0aXZlRGF0ZSAmJlxyXG4gICAgICAhdGhpcy5fYWRhcHRlci5zYW1lTW9udGhBbmRZZWFyKG9sZEFjdGl2ZURhdGUsIHRoaXMuX2FjdGl2ZURhdGUpXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgICBpZiAodGhpcy5fYWRhcHRlci5pc0luTmV4dE1vbnRoKG9sZEFjdGl2ZURhdGUsIHRoaXMuX2FjdGl2ZURhdGUpKSB7XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhclN0YXRlKCdyaWdodCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJTdGF0ZSgnbGVmdCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9zZWxlY3RlZDogRDtcclxuXHJcbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZS4gKi9cclxuICBASW5wdXQoKVxyXG4gIGdldCBzZWxlY3RlZCgpOiBEIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcclxuICB9XHJcblxyXG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogRCkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZTtcclxuICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IHRoaXMuX2dldERhdGVJbkN1cnJlbnRNb250aCh0aGlzLnNlbGVjdGVkKTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuX2luaXQoKTtcclxuICB9XHJcblxyXG4gIC8qKiBIYW5kbGVzIHdoZW4gYSBuZXcgZGF0ZSBpcyBzZWxlY3RlZC4gKi9cclxuICBfZGF0ZVNlbGVjdGVkKGRhdGU6IG51bWJlcikge1xyXG4gICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxyXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxyXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgICBkYXRlLFxyXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0SG91cih0aGlzLmFjdGl2ZURhdGUpLFxyXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TWludXRlKHRoaXMuYWN0aXZlRGF0ZSlcclxuICAgICAgKVxyXG4gICAgKTtcclxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdkYXRlJykge1xyXG4gICAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9jYWxlbmRhclN0YXRlRG9uZSgpIHtcclxuICAgIHRoaXMuX2NhbGVuZGFyU3RhdGUgPSAnJztcclxuICB9XHJcblxyXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIG1vbnRoIHZpZXcuICovXHJcbiAgcHJpdmF0ZSBfaW5pdCgpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IHRoaXMuX2dldERhdGVJbkN1cnJlbnRNb250aCh0aGlzLnNlbGVjdGVkKTtcclxuICAgIHRoaXMuX3RvZGF5RGF0ZSA9IHRoaXMuX2dldERhdGVJbkN1cnJlbnRNb250aCh0aGlzLl9hZGFwdGVyLnRvZGF5KCkpO1xyXG5cclxuICAgIGxldCBmaXJzdE9mTW9udGggPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aCh0aGlzLmFjdGl2ZURhdGUpLFxyXG4gICAgICAxLFxyXG4gICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKVxyXG4gICAgKTtcclxuICAgIHRoaXMuX2ZpcnN0V2Vla09mZnNldCA9XHJcbiAgICAgIChEQVlTX1BFUl9XRUVLICtcclxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldERheU9mV2VlayhmaXJzdE9mTW9udGgpIC1cclxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEZpcnN0RGF5T2ZXZWVrKCkpICVcclxuICAgICAgREFZU19QRVJfV0VFSztcclxuXHJcbiAgICB0aGlzLl9jcmVhdGVXZWVrQ2VsbHMoKTtcclxuICB9XHJcblxyXG4gIC8qKiBDcmVhdGVzIE1kQ2FsZW5kYXJDZWxscyBmb3IgdGhlIGRhdGVzIGluIHRoaXMgbW9udGguICovXHJcbiAgcHJpdmF0ZSBfY3JlYXRlV2Vla0NlbGxzKCkge1xyXG4gICAgbGV0IGRheXNJbk1vbnRoID0gdGhpcy5fYWRhcHRlci5nZXROdW1EYXlzSW5Nb250aCh0aGlzLmFjdGl2ZURhdGUpO1xyXG4gICAgbGV0IGRhdGVOYW1lcyA9IHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZU5hbWVzKCk7XHJcbiAgICB0aGlzLl93ZWVrcyA9IFtbXV07XHJcbiAgICBmb3IgKFxyXG4gICAgICBsZXQgaSA9IDAsIGNlbGwgPSB0aGlzLl9maXJzdFdlZWtPZmZzZXQ7XHJcbiAgICAgIGkgPCBkYXlzSW5Nb250aDtcclxuICAgICAgaSsrLCBjZWxsKytcclxuICAgICkge1xyXG4gICAgICBpZiAoY2VsbCA9PSBEQVlTX1BFUl9XRUVLKSB7XHJcbiAgICAgICAgdGhpcy5fd2Vla3MucHVzaChbXSk7XHJcbiAgICAgICAgY2VsbCA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IGRhdGUgPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxyXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxyXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgICBpICsgMSxcclxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcclxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpXHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBlbmFibGVkID0gIXRoaXMuZGF0ZUZpbHRlciB8fCB0aGlzLmRhdGVGaWx0ZXIoZGF0ZSk7XHJcbiAgICAgIGxldCBhcmlhTGFiZWwgPSB0aGlzLl9hZGFwdGVyLmZvcm1hdChcclxuICAgICAgICBkYXRlLFxyXG4gICAgICAgIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkuZGF0ZUExMXlMYWJlbFxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLl93ZWVrc1t0aGlzLl93ZWVrcy5sZW5ndGggLSAxXS5wdXNoKFxyXG4gICAgICAgIG5ldyBNYXREYXRldGltZXBpY2tlckNhbGVuZGFyQ2VsbChcclxuICAgICAgICAgIGkgKyAxLFxyXG4gICAgICAgICAgZGF0ZU5hbWVzW2ldLFxyXG4gICAgICAgICAgYXJpYUxhYmVsLFxyXG4gICAgICAgICAgZW5hYmxlZFxyXG4gICAgICAgIClcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGRhdGUgaW4gdGhpcyBtb250aCB0aGF0IHRoZSBnaXZlbiBEYXRlIGZhbGxzIG9uLlxyXG4gICAqIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gRGF0ZSBpcyBpbiBhbm90aGVyIG1vbnRoLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2dldERhdGVJbkN1cnJlbnRNb250aChkYXRlOiBEKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLnNhbWVNb250aEFuZFllYXIoZGF0ZSwgdGhpcy5hY3RpdmVEYXRlKVxyXG4gICAgICA/IHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZShkYXRlKVxyXG4gICAgICA6IG51bGw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGVuZGFyU3RhdGUoZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuX2NhbGVuZGFyU3RhdGUgPSBkaXJlY3Rpb247XHJcbiAgfVxyXG59XHJcbiIsIjx0YWJsZSBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci10YWJsZVwiPlxyXG4gIDx0aGVhZCBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci10YWJsZS1oZWFkZXJcIj5cclxuICAgIDx0cj5cclxuICAgICAgPHRoICpuZ0Zvcj1cImxldCBkYXkgb2YgX3dlZWtkYXlzXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJkYXkubG9uZ1wiPlxyXG4gICAgICAgIHt7ZGF5Lm5hcnJvd319XHJcbiAgICAgIDwvdGg+XHJcbiAgICA8L3RyPlxyXG4gIDwvdGhlYWQ+XHJcbiAgPHRib2R5XHJcbiAgICAoQHNsaWRlQ2FsZW5kYXIuZG9uZSk9XCJfY2FsZW5kYXJTdGF0ZURvbmUoKVwiXHJcbiAgICAoc2VsZWN0ZWRWYWx1ZUNoYW5nZSk9XCJfZGF0ZVNlbGVjdGVkKCRldmVudClcIlxyXG4gICAgW0BzbGlkZUNhbGVuZGFyXT1cIl9jYWxlbmRhclN0YXRlXCJcclxuICAgIFthY3RpdmVDZWxsXT1cIl9hZGFwdGVyLmdldERhdGUoYWN0aXZlRGF0ZSkgLSAxXCJcclxuICAgIFtyb3dzXT1cIl93ZWVrc1wiXHJcbiAgICBbc2VsZWN0ZWRWYWx1ZV09XCJfc2VsZWN0ZWREYXRlXCJcclxuICAgIFt0b2RheVZhbHVlXT1cIl90b2RheURhdGVcIlxyXG4gICAgbWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckJvZHlcclxuICAgIHJvbGU9XCJncmlkXCJcclxuICA+PC90Ym9keT5cclxuPC90YWJsZT5cclxuIl19
