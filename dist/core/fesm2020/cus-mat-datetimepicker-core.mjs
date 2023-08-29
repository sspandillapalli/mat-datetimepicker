import * as i0 from '@angular/core';
import {
  InjectionToken,
  Injectable,
  Optional,
  Inject,
  NgModule,
  EventEmitter,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Output,
  ViewChild,
  forwardRef,
  Directive,
} from '@angular/core';
import * as i1 from '@angular/material/core';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  NativeDateModule,
  MatNativeDateModule,
} from '@angular/material/core';
import * as i1$2 from '@angular/cdk/a11y';
import { A11yModule } from '@angular/cdk/a11y';
import * as i4$1 from '@angular/cdk/overlay';
import { OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import * as i2 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i4 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import * as i3 from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import * as i5 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import {
  ENTER,
  PAGE_DOWN,
  PAGE_UP,
  END,
  HOME,
  DOWN_ARROW,
  UP_ARROW,
  RIGHT_ARROW,
  LEFT_ARROW,
  ESCAPE,
} from '@angular/cdk/keycodes';
import * as i1$1 from '@angular/material/datepicker';
import { MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';
import { first } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import * as i6 from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject, Subscription, scheduled, asyncScheduler, merge } from 'rxjs';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import * as i2$1 from '@angular/material/form-field';

class DatetimeAdapter extends DateAdapter {
  constructor(_delegate) {
    super();
    this._delegate = _delegate;
  }
  getValidDateOrNull(obj) {
    return this.isDateInstance(obj) && this.isValid(obj) ? obj : null;
  }
  compareDatetime(first, second, respectMinutePart = true) {
    return (
      this.compareDate(first, second) ||
      this.getHour(first) - this.getHour(second) ||
      (respectMinutePart && this.getMinute(first) - this.getMinute(second))
    );
  }
  sameDatetime(first, second) {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !this.compareDatetime(first, second);
      }
      return firstValid === secondValid;
    }
    return first === second;
  }
  sameYear(first, second) {
    return first && second && this.getYear(first) === this.getYear(second);
  }
  sameDay(first, second) {
    return (
      first &&
      second &&
      this.getDate(first) === this.getDate(second) &&
      this.sameMonthAndYear(first, second)
    );
  }
  sameHour(first, second) {
    return (
      first &&
      second &&
      this.getHour(first) === this.getHour(second) &&
      this.sameDay(first, second)
    );
  }
  sameMinute(first, second) {
    return (
      first &&
      second &&
      this.getMinute(first) === this.getMinute(second) &&
      this.sameHour(first, second)
    );
  }
  sameMonthAndYear(first, second) {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !(
          this.getYear(first) - this.getYear(second) ||
          this.getMonth(first) - this.getMonth(second)
        );
      }
      return firstValid === secondValid;
    }
    return first === second;
  }
  // delegate
  deserialize(value) {
    return this._delegate.deserialize(value);
  }
  clone(date) {
    return this._delegate.clone(date);
  }
  addCalendarYears(date, years) {
    return this._delegate.addCalendarYears(date, years);
  }
  addCalendarMonths(date, months) {
    return this._delegate.addCalendarMonths(date, months);
  }
  addCalendarDays(date, days) {
    return this._delegate.addCalendarDays(date, days);
  }
  getYear(date) {
    return this._delegate.getYear(date);
  }
  getMonth(date) {
    return this._delegate.getMonth(date);
  }
  getDate(date) {
    return this._delegate.getDate(date);
  }
  getDayOfWeek(date) {
    return this._delegate.getDayOfWeek(date);
  }
  getMonthNames(style) {
    return this._delegate.getMonthNames(style);
  }
  getDateNames() {
    return this._delegate.getDateNames();
  }
  getDayOfWeekNames(style) {
    return this._delegate.getDayOfWeekNames(style);
  }
  getYearName(date) {
    return this._delegate.getYearName(date);
  }
  getFirstDayOfWeek() {
    return this._delegate.getFirstDayOfWeek();
  }
  getNumDaysInMonth(date) {
    return this._delegate.getNumDaysInMonth(date);
  }
  createDate(year, month, date) {
    return this._delegate.createDate(year, month, date);
  }
  today() {
    return this._delegate.today();
  }
  parse(value, parseFormat) {
    return this._delegate.parse(value, parseFormat);
  }
  format(date, displayFormat) {
    return this._delegate.format(date, displayFormat);
  }
  toIso8601(date) {
    return this._delegate.toIso8601(date);
  }
  isDateInstance(obj) {
    return this._delegate.isDateInstance(obj);
  }
  isValid(date) {
    return this._delegate.isValid(date);
  }
  invalid() {
    return this._delegate.invalid();
  }
  clampDate(date, min, max) {
    if (min && this.compareDatetime(date, min) < 0) {
      return min;
    }
    if (max && this.compareDatetime(date, max) > 0) {
      return max;
    }
    return date;
  }
}

const MAT_DATETIME_FORMATS = new InjectionToken('mat-datetime-formats');

/** The default hour names to use if Intl API is not available. */
const DEFAULT_HOUR_NAMES = range(24, (i) => String(i));
/** The default minute names to use if Intl API is not available. */
const DEFAULT_MINUTE_NAMES = range(60, (i) => String(i));
function range(length, valueFunction) {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}
class NativeDatetimeAdapter extends DatetimeAdapter {
  constructor(matDateLocale, _delegate) {
    super(_delegate);
    this.setLocale(matDateLocale);
  }
  clone(date) {
    return this.createDatetime(
      this.getYear(date),
      this.getMonth(date),
      this.getDate(date),
      this.getHour(date),
      this.getMinute(date)
    );
  }
  getHour(date) {
    return date.getHours();
  }
  getMinute(date) {
    return date.getMinutes();
  }
  isInNextMonth(startDate, endDate) {
    const nextMonth = this.getDateInNextMonth(startDate);
    return this.sameMonthAndYear(nextMonth, endDate);
  }
  createDatetime(year, month, date, hour, minute) {
    // Check for invalid month and date (except upper bound on date which we have to check after
    // creating the Date).
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`
      );
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }
    if (hour < 0 || hour > 23) {
      throw Error(`Invalid hour "${hour}". Hour has to be between 0 and 23.`);
    }
    if (minute < 0 || minute > 59) {
      throw Error(
        `Invalid minute "${minute}". Minute has to be between 0 and 59.`
      );
    }
    const result = this._createDateWithOverflow(
      year,
      month,
      date,
      hour,
      minute
    );
    // Check that the date wasn't above the upper bound for the month, causing the month to overflow
    if (result.getMonth() !== month) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }
    return result;
  }
  getFirstDateOfMonth(date) {
    const result = new Date();
    result.setFullYear(date.getFullYear(), date.getMonth(), 1);
    return result;
  }
  getHourNames() {
    return DEFAULT_HOUR_NAMES;
  }
  getMinuteNames() {
    return DEFAULT_MINUTE_NAMES;
  }
  addCalendarYears(date, years) {
    return this.addCalendarMonths(date, years * 12);
  }
  addCalendarMonths(date, months) {
    let newDate = this._createDateWithOverflow(
      this.getYear(date),
      this.getMonth(date) + months,
      this.getDate(date),
      this.getHour(date),
      this.getMinute(date)
    );
    // It's possible to wind up in the wrong month if the original month has more days than the new
    // month. In this case we want to go to the last day of the desired month.
    // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
    // guarantee this.
    if (
      this.getMonth(newDate) !==
      (((this.getMonth(date) + months) % 12) + 12) % 12
    ) {
      newDate = this._createDateWithOverflow(
        this.getYear(newDate),
        this.getMonth(newDate),
        0,
        this.getHour(date),
        this.getMinute(date)
      );
    }
    return newDate;
  }
  addCalendarDays(date, days) {
    return this._createDateWithOverflow(
      this.getYear(date),
      this.getMonth(date),
      this.getDate(date) + days,
      this.getHour(date),
      this.getMinute(date)
    );
  }
  addCalendarHours(date, hours) {
    return this._createDateWithOverflow(
      this.getYear(date),
      this.getMonth(date),
      this.getDate(date),
      this.getHour(date) + hours,
      this.getMinute(date)
    );
  }
  addCalendarMinutes(date, minutes) {
    return this._createDateWithOverflow(
      this.getYear(date),
      this.getMonth(date),
      this.getDate(date),
      this.getHour(date),
      this.getMinute(date) + minutes
    );
  }
  toIso8601(date) {
    return (
      super.toIso8601(date) +
      'T' +
      [
        this._2digit(date.getUTCHours()),
        this._2digit(date.getUTCMinutes()),
      ].join(':')
    );
  }
  getDateInNextMonth(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1,
      date.getHours(),
      date.getMinutes()
    );
  }
  /**
   * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
   * other browsers do not. We remove them to make output consistent and because they interfere with
   * date parsing.
   * @param str The string to strip direction characters from.
   * @returns The stripped string.
   */
  _stripDirectionalityCharacters(str) {
    return str.replace(/[\u200e\u200f]/g, '');
  }
  /**
   * Pads a number to make it two digits.
   * @param n The number to pad.
   * @returns The padded number.
   */
  _2digit(n) {
    return ('00' + n).slice(-2);
  }
  /** Creates a date but allows the month and date to overflow. */
  _createDateWithOverflow(year, month, date, hours, minutes) {
    const result = new Date(year, month, date, hours, minutes);
    // We need to correct for the fact that JS native Date treats years in range [0, 99] as
    // abbreviations for 19xx.
    if (year >= 0 && year < 100) {
      result.setFullYear(this.getYear(result) - 1900);
    }
    return result;
  }
}
/** @nocollapse */ NativeDatetimeAdapter.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: NativeDatetimeAdapter,
  deps: [{ token: MAT_DATE_LOCALE, optional: true }, { token: i1.DateAdapter }],
  target: i0.ɵɵFactoryTarget.Injectable,
});
/** @nocollapse */ NativeDatetimeAdapter.ɵprov = i0.ɵɵngDeclareInjectable({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: NativeDatetimeAdapter,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: NativeDatetimeAdapter,
  decorators: [
    {
      type: Injectable,
    },
  ],
  ctorParameters: function () {
    return [
      {
        type: undefined,
        decorators: [
          {
            type: Optional,
          },
          {
            type: Inject,
            args: [MAT_DATE_LOCALE],
          },
        ],
      },
      { type: i1.DateAdapter },
    ];
  },
});

const MAT_NATIVE_DATETIME_FORMATS = {
  parse: {},
  display: {
    dateInput: { year: 'numeric', month: '2-digit', day: '2-digit' },
    monthInput: { month: 'long' },
    datetimeInput: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
    timeInput: { hour: '2-digit', minute: '2-digit' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
    popupHeaderDateLabel: { weekday: 'short', month: 'short', day: '2-digit' },
  },
};

// eslint-disable  max-classes-per-file
class NativeDatetimeModule {}
/** @nocollapse */ NativeDatetimeModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: NativeDatetimeModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
/** @nocollapse */ NativeDatetimeModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: NativeDatetimeModule,
  imports: [NativeDateModule],
});
/** @nocollapse */ NativeDatetimeModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: NativeDatetimeModule,
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: NativeDatetimeAdapter,
    },
  ],
  imports: [NativeDateModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: NativeDatetimeModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [NativeDateModule],
          providers: [
            {
              provide: DatetimeAdapter,
              useClass: NativeDatetimeAdapter,
            },
          ],
        },
      ],
    },
  ],
});
class MatNativeDatetimeModule {}
/** @nocollapse */ MatNativeDatetimeModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatNativeDatetimeModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
/** @nocollapse */ MatNativeDatetimeModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatNativeDatetimeModule,
  imports: [NativeDatetimeModule, MatNativeDateModule],
});
/** @nocollapse */ MatNativeDatetimeModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatNativeDatetimeModule,
  providers: [
    { provide: MAT_DATETIME_FORMATS, useValue: MAT_NATIVE_DATETIME_FORMATS },
  ],
  imports: [NativeDatetimeModule, MatNativeDateModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatNativeDatetimeModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [NativeDatetimeModule, MatNativeDateModule],
          providers: [
            {
              provide: MAT_DATETIME_FORMATS,
              useValue: MAT_NATIVE_DATETIME_FORMATS,
            },
          ],
        },
      ],
    },
  ],
});

/**
 * This animation fades in the background color and text content of the
 * select's options. It is time delayed to occur 100ms after the overlay
 * panel has transformed in.
 */
const fadeInContent = trigger('fadeInContent', [
  state('showing', style({ opacity: 1 })),
  transition('void => showing', [
    style({ opacity: 0 }),
    animate(`150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)`),
  ]),
]);
const slideCalendar = trigger('slideCalendar', [
  transition('* => left', [
    animate(
      180,
      keyframes([
        style({ transform: 'translateX(100%)', offset: 0.5 }),
        style({ transform: 'translateX(-100%)', offset: 0.51 }),
        style({ transform: 'translateX(0)', offset: 1 }),
      ])
    ),
  ]),
  transition('* => right', [
    animate(
      180,
      keyframes([
        style({ transform: 'translateX(-100%)', offset: 0.5 }),
        style({ transform: 'translateX(100%)', offset: 0.51 }),
        style({ transform: 'translateX(0)', offset: 1 }),
      ])
    ),
  ]),
]);

/** @docs-private */
function createMissingDateImplError(provider) {
  return Error(
    `MatDatetimepickerComponent: No provider found for ${provider}. You must import one of the following ` +
      `modules at your application root: MatNativeDatetimeModule, MatMomentDatetimeModule, or provide a ` +
      `custom implementation.`
  );
}

var MatDatetimepickerFilterType;
(function (MatDatetimepickerFilterType) {
  MatDatetimepickerFilterType[(MatDatetimepickerFilterType['DATE'] = 0)] =
    'DATE';
  MatDatetimepickerFilterType[(MatDatetimepickerFilterType['HOUR'] = 1)] =
    'HOUR';
  MatDatetimepickerFilterType[(MatDatetimepickerFilterType['MINUTE'] = 2)] =
    'MINUTE';
})(MatDatetimepickerFilterType || (MatDatetimepickerFilterType = {}));

/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
class MatDatetimepickerCalendarCell {
  constructor(value, displayValue, ariaLabel, enabled) {
    this.value = value;
    this.displayValue = displayValue;
    this.ariaLabel = ariaLabel;
    this.enabled = enabled;
  }
}
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
class MatDatetimepickerCalendarBodyComponent {
  constructor() {
    /** The number of columns in the table. */
    this.numCols = 7;
    /** Whether to allow selection of disabled cells. */
    this.allowDisabledSelection = false;
    /** The cell number of the active cell in the table. */
    this.activeCell = 0;
    /** Emits when a new value is selected. */
    this.selectedValueChange = new EventEmitter();
  }
  /** The number of blank cells to put at the beginning for the first row. */
  get _firstRowOffset() {
    return this.rows && this.rows.length && this.rows[0].length
      ? this.numCols - this.rows[0].length
      : 0;
  }
  _cellClicked(cell) {
    if (!this.allowDisabledSelection && !cell.enabled) {
      return;
    }
    this.selectedValueChange.emit(cell.value);
  }
  _isActiveCell(rowIndex, colIndex) {
    let cellNumber = rowIndex * this.numCols + colIndex;
    // Account for the fact that the first row may not have as many cells.
    if (rowIndex) {
      cellNumber -= this._firstRowOffset;
    }
    return cellNumber === this.activeCell;
  }
}
/** @nocollapse */ MatDatetimepickerCalendarBodyComponent.ɵfac =
  i0.ɵɵngDeclareFactory({
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerCalendarBodyComponent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component,
  });
/** @nocollapse */ MatDatetimepickerCalendarBodyComponent.ɵcmp =
  i0.ɵɵngDeclareComponent({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerCalendarBodyComponent,
    selector: 'tbody[matDatetimepickerCalendarBody]',
    inputs: {
      label: 'label',
      rows: 'rows',
      todayValue: 'todayValue',
      selectedValue: 'selectedValue',
      labelMinRequiredCells: 'labelMinRequiredCells',
      numCols: 'numCols',
      allowDisabledSelection: 'allowDisabledSelection',
      activeCell: 'activeCell',
    },
    outputs: { selectedValueChange: 'selectedValueChange' },
    host: { classAttribute: 'mat-datetimepicker-calendar-body' },
    ngImport: i0,
    template:
      '<!--\r\n  If there\'s not enough space in the first row, create a separate label row. We mark this row as\r\n  aria-hidden because we don\'t want it to be read out as one of the weeks in the month.\r\n-->\r\n<tr *ngIf="_firstRowOffset < labelMinRequiredCells" aria-hidden="true">\r\n  <td [attr.colspan]="numCols" class="mat-datetimepicker-calendar-body-label">\r\n    {{ label }}\r\n  </td>\r\n</tr>\r\n\r\n<!-- Create the first row separately so we can include a special spacer cell. -->\r\n<tr *ngFor="let row of rows; let rowIndex = index" role="row">\r\n  <!--\r\n    We mark this cell as aria-hidden so it doesn\'t get read out as one of the days in the week.\r\n  -->\r\n  <td\r\n    *ngIf="rowIndex === 0 && _firstRowOffset"\r\n    [attr.colspan]="_firstRowOffset"\r\n    aria-hidden="true"\r\n    class="mat-datetimepicker-calendar-body-label"\r\n  >\r\n    {{ _firstRowOffset >= labelMinRequiredCells ? label : \'\' }}\r\n  </td>\r\n  <td\r\n    (click)="_cellClicked(item)"\r\n    *ngFor="let item of row; let colIndex = index"\r\n    [attr.aria-disabled]="!item.enabled || null"\r\n    [attr.aria-label]="item.ariaLabel"\r\n    [class.mat-datetimepicker-calendar-body-active]="_isActiveCell(rowIndex, colIndex)"\r\n    [class.mat-datetimepicker-calendar-body-disabled]="!item.enabled"\r\n    class="mat-datetimepicker-calendar-body-cell"\r\n    role="button"\r\n  >\r\n    <div\r\n      [attr.aria-selected]="selectedValue === item.value"\r\n      [class.mat-datetimepicker-calendar-body-selected]="selectedValue === item.value"\r\n      [class.mat-datetimepicker-calendar-body-today]="todayValue === item.value"\r\n      class="mat-datetimepicker-calendar-body-cell-content"\r\n    >\r\n      {{ item.displayValue }}\r\n    </div>\r\n  </td>\r\n</tr>\r\n',
    styles: [
      '.mat-datetimepicker-calendar-body{font-size:13px;min-width:224px}.mat-datetimepicker-calendar-body-label{padding:7.1428571429% 0 7.1428571429% 7.1428571429%;height:0;line-height:0;color:#0000008a;transform:translate(-6px);text-align:left}.mat-datetimepicker-calendar-body-cell{position:relative;width:14.2857142857%;height:0;line-height:0;padding:7.1428571429% 0;text-align:center;outline:none;cursor:pointer}.mat-datetimepicker-calendar-body-disabled{cursor:default;pointer-events:none}.mat-datetimepicker-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;color:#000000de;border:1px solid transparent;border-radius:50px}.mat-datetimepicker-calendar-body-disabled>.mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected){color:#00000061}:not(.mat-datetimepicker-calendar-body-disabled):hover>.mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected),.mat-datetimepicker-calendar-body-active>.mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected){background-color:#0000001f}.mat-datetimepicker-calendar-body-disabled>.mat-datetimepicker-calendar-body-today:not(.mat-datetimepicker-calendar-body-selected){border-color:#0000002e}[dir=rtl] .mat-datetimepicker-calendar-body-label{padding:0 7.1428571429% 0 0;transform:translate(6px);text-align:right}\n',
    ],
    dependencies: [
      {
        kind: 'directive',
        type: i2.NgForOf,
        selector: '[ngFor][ngForOf]',
        inputs: ['ngForOf', 'ngForTrackBy', 'ngForTemplate'],
      },
      {
        kind: 'directive',
        type: i2.NgIf,
        selector: '[ngIf]',
        inputs: ['ngIf', 'ngIfThen', 'ngIfElse'],
      },
    ],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None,
  });
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerCalendarBodyComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tbody[matDatetimepickerCalendarBody]',
          host: {
            class: 'mat-datetimepicker-calendar-body',
          },
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<!--\r\n  If there\'s not enough space in the first row, create a separate label row. We mark this row as\r\n  aria-hidden because we don\'t want it to be read out as one of the weeks in the month.\r\n-->\r\n<tr *ngIf="_firstRowOffset < labelMinRequiredCells" aria-hidden="true">\r\n  <td [attr.colspan]="numCols" class="mat-datetimepicker-calendar-body-label">\r\n    {{ label }}\r\n  </td>\r\n</tr>\r\n\r\n<!-- Create the first row separately so we can include a special spacer cell. -->\r\n<tr *ngFor="let row of rows; let rowIndex = index" role="row">\r\n  <!--\r\n    We mark this cell as aria-hidden so it doesn\'t get read out as one of the days in the week.\r\n  -->\r\n  <td\r\n    *ngIf="rowIndex === 0 && _firstRowOffset"\r\n    [attr.colspan]="_firstRowOffset"\r\n    aria-hidden="true"\r\n    class="mat-datetimepicker-calendar-body-label"\r\n  >\r\n    {{ _firstRowOffset >= labelMinRequiredCells ? label : \'\' }}\r\n  </td>\r\n  <td\r\n    (click)="_cellClicked(item)"\r\n    *ngFor="let item of row; let colIndex = index"\r\n    [attr.aria-disabled]="!item.enabled || null"\r\n    [attr.aria-label]="item.ariaLabel"\r\n    [class.mat-datetimepicker-calendar-body-active]="_isActiveCell(rowIndex, colIndex)"\r\n    [class.mat-datetimepicker-calendar-body-disabled]="!item.enabled"\r\n    class="mat-datetimepicker-calendar-body-cell"\r\n    role="button"\r\n  >\r\n    <div\r\n      [attr.aria-selected]="selectedValue === item.value"\r\n      [class.mat-datetimepicker-calendar-body-selected]="selectedValue === item.value"\r\n      [class.mat-datetimepicker-calendar-body-today]="todayValue === item.value"\r\n      class="mat-datetimepicker-calendar-body-cell-content"\r\n    >\r\n      {{ item.displayValue }}\r\n    </div>\r\n  </td>\r\n</tr>\r\n',
          styles: [
            '.mat-datetimepicker-calendar-body{font-size:13px;min-width:224px}.mat-datetimepicker-calendar-body-label{padding:7.1428571429% 0 7.1428571429% 7.1428571429%;height:0;line-height:0;color:#0000008a;transform:translate(-6px);text-align:left}.mat-datetimepicker-calendar-body-cell{position:relative;width:14.2857142857%;height:0;line-height:0;padding:7.1428571429% 0;text-align:center;outline:none;cursor:pointer}.mat-datetimepicker-calendar-body-disabled{cursor:default;pointer-events:none}.mat-datetimepicker-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;color:#000000de;border:1px solid transparent;border-radius:50px}.mat-datetimepicker-calendar-body-disabled>.mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected){color:#00000061}:not(.mat-datetimepicker-calendar-body-disabled):hover>.mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected),.mat-datetimepicker-calendar-body-active>.mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected){background-color:#0000001f}.mat-datetimepicker-calendar-body-disabled>.mat-datetimepicker-calendar-body-today:not(.mat-datetimepicker-calendar-body-selected){border-color:#0000002e}[dir=rtl] .mat-datetimepicker-calendar-body-label{padding:0 7.1428571429% 0 0;transform:translate(6px);text-align:right}\n',
          ],
        },
      ],
    },
  ],
  propDecorators: {
    label: [
      {
        type: Input,
      },
    ],
    rows: [
      {
        type: Input,
      },
    ],
    todayValue: [
      {
        type: Input,
      },
    ],
    selectedValue: [
      {
        type: Input,
      },
    ],
    labelMinRequiredCells: [
      {
        type: Input,
      },
    ],
    numCols: [
      {
        type: Input,
      },
    ],
    allowDisabledSelection: [
      {
        type: Input,
      },
    ],
    activeCell: [
      {
        type: Input,
      },
    ],
    selectedValueChange: [
      {
        type: Output,
      },
    ],
  },
});

const yearsPerPage = 24;
const yearsPerRow = 4;
/**
 * An internal component used to display multiple years in the datepicker.
 * @docs-private
 */
class MatDatetimepickerMultiYearViewComponent {
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
      { token: DatetimeAdapter, optional: true },
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
        type: MatDatetimepickerCalendarBodyComponent,
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
        type: DatetimeAdapter,
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
function isSameMultiYearView(dateAdapter, date1, date2, minDate, maxDate) {
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
function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
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

const CLOCK_RADIUS = 50;
const CLOCK_INNER_RADIUS = 27.5;
const CLOCK_OUTER_RADIUS = 41.25;
const CLOCK_TICK_RADIUS = 7.0833;
/**
 * A clock that is used as part of the datepicker.
 * @docs-private
 */
class MatDatetimepickerClockComponent {
  constructor(_element, _adapter) {
    this._element = _element;
    this._adapter = _adapter;
    this.interval = 1;
    this.twelvehour = false;
    /** Emits when the currently selected date changes. */
    this.selectedChange = new EventEmitter();
    this.activeDateChange = new EventEmitter();
    /** Hours and Minutes representing the clock view. */
    this._hours = [];
    this._minutes = [];
    /** Whether the clock is in hour view. */
    this._hourView = true;
    this._timeChanged = false;
    this.mouseMoveListener = (event) => {
      this._handleMousemove(event);
    };
    this.mouseUpListener = () => {
      this._handleMouseup();
    };
  }
  /**
   * The date to display in this clock view.
   */
  get activeDate() {
    return this._activeDate;
  }
  set activeDate(value) {
    let oldActiveDate = this._activeDate;
    this._activeDate = this._adapter.clampDate(
      value,
      this.minDate,
      this.maxDate
    );
    if (!this._adapter.sameMinute(oldActiveDate, this._activeDate)) {
      this._init();
    }
  }
  /** The currently selected date. */
  get selected() {
    return this._selected;
  }
  set selected(value) {
    this._selected = this._adapter.getValidDateOrNull(
      this._adapter.deserialize(value)
    );
    if (this._selected) {
      this.activeDate = this._selected;
    }
  }
  /** The minimum selectable date. */
  get minDate() {
    return this._minDate;
  }
  set minDate(value) {
    this._minDate = this._adapter.getValidDateOrNull(
      this._adapter.deserialize(value)
    );
  }
  /** The maximum selectable date. */
  get maxDate() {
    return this._maxDate;
  }
  set maxDate(value) {
    this._maxDate = this._adapter.getValidDateOrNull(
      this._adapter.deserialize(value)
    );
  }
  /** Whether the clock should be started in hour or minute view. */
  set startView(value) {
    this._hourView = value != 'minute';
  }
  get _hand() {
    let hour = this._adapter.getHour(this.activeDate);
    if (this.twelvehour) {
      if (hour === 0) {
        hour = 24;
      }
      this._selectedHour = hour > 12 ? hour - 12 : hour;
    } else {
      this._selectedHour = hour;
    }
    this._selectedMinute = this._adapter.getMinute(this.activeDate);
    let deg = 0;
    let radius = CLOCK_OUTER_RADIUS;
    if (this._hourView) {
      let outer = this._selectedHour > 0 && this._selectedHour < 13;
      radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
      if (this.twelvehour) {
        radius = CLOCK_OUTER_RADIUS;
      }
      deg = Math.round(this._selectedHour * (360 / (24 / 2)));
    } else {
      deg = Math.round(this._selectedMinute * (360 / 60));
    }
    return {
      transform: `rotate(${deg}deg)`,
      height: `${radius}%`,
      'margin-top': `${50 - radius}%`,
    };
  }
  ngAfterContentInit() {
    this.activeDate = this._activeDate || this._adapter.today();
    this._init();
  }
  /** Handles mousedown events on the clock body. */
  _handleMousedown(event) {
    this._timeChanged = false;
    this.setTime(event);
    document.addEventListener('mousemove', this.mouseMoveListener);
    document.addEventListener('touchmove', this.mouseMoveListener);
    document.addEventListener('mouseup', this.mouseUpListener);
    document.addEventListener('touchend', this.mouseUpListener);
  }
  _handleMousemove(event) {
    event.preventDefault();
    this.setTime(event);
  }
  _handleMouseup() {
    document.removeEventListener('mousemove', this.mouseMoveListener);
    document.removeEventListener('touchmove', this.mouseMoveListener);
    document.removeEventListener('mouseup', this.mouseUpListener);
    document.removeEventListener('touchend', this.mouseUpListener);
    if (this._timeChanged) {
      this.selectedChange.emit(this.activeDate);
    }
  }
  /** Initializes this clock view. */
  _init() {
    this._hours.length = 0;
    this._minutes.length = 0;
    let hourNames = this._adapter.getHourNames();
    let minuteNames = this._adapter.getMinuteNames();
    if (this.twelvehour) {
      for (let i = 1; i < hourNames.length / 2 + 1; i++) {
        let radian = (i / 6) * Math.PI;
        let radius = CLOCK_OUTER_RADIUS;
        const date = this._adapter.createDatetime(
          this._adapter.getYear(this.activeDate),
          this._adapter.getMonth(this.activeDate),
          this._adapter.getDate(this.activeDate),
          i + 1,
          0
        );
        let enabled =
          (!this.minDate ||
            this._adapter.compareDatetime(date, this.minDate) >= 0) &&
          (!this.maxDate ||
            this._adapter.compareDatetime(date, this.maxDate) <= 0);
        this._hours.push({
          value: i,
          displayValue: i === 0 ? '00' : hourNames[i],
          enabled: enabled,
          top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
          left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
        });
      }
    } else {
      for (let i = 0; i < hourNames.length; i++) {
        let radian = (i / 6) * Math.PI;
        let outer = i > 0 && i < 13,
          radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
        const date = this._adapter.createDatetime(
          this._adapter.getYear(this.activeDate),
          this._adapter.getMonth(this.activeDate),
          this._adapter.getDate(this.activeDate),
          i,
          0
        );
        let enabled =
          (!this.minDate ||
            this._adapter.compareDatetime(date, this.minDate, false) >= 0) &&
          (!this.maxDate ||
            this._adapter.compareDatetime(date, this.maxDate, false) <= 0) &&
          (!this.dateFilter ||
            this.dateFilter(date, MatDatetimepickerFilterType.HOUR));
        this._hours.push({
          value: i,
          displayValue: i === 0 ? '00' : hourNames[i],
          enabled: enabled,
          top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
          left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
          fontSize: i > 0 && i < 13 ? '' : '80%',
        });
      }
    }
    for (let i = 0; i < minuteNames.length; i += 5) {
      let radian = (i / 30) * Math.PI;
      const date = this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate),
        this._adapter.getDate(this.activeDate),
        this._adapter.getHour(this.activeDate),
        i
      );
      let enabled =
        (!this.minDate ||
          this._adapter.compareDatetime(date, this.minDate) >= 0) &&
        (!this.maxDate ||
          this._adapter.compareDatetime(date, this.maxDate) <= 0) &&
        (!this.dateFilter ||
          this.dateFilter(date, MatDatetimepickerFilterType.MINUTE));
      this._minutes.push({
        value: i,
        displayValue: i === 0 ? '00' : minuteNames[i],
        enabled: enabled,
        top:
          CLOCK_RADIUS -
          Math.cos(radian) * CLOCK_OUTER_RADIUS -
          CLOCK_TICK_RADIUS,
        left:
          CLOCK_RADIUS +
          Math.sin(radian) * CLOCK_OUTER_RADIUS -
          CLOCK_TICK_RADIUS,
      });
    }
  }
  /**
   * Set Time
   * @param event
   */
  setTime(event) {
    let trigger = this._element.nativeElement;
    let triggerRect = trigger.getBoundingClientRect();
    let width = trigger.offsetWidth;
    let height = trigger.offsetHeight;
    let pageX =
      event.pageX !== undefined ? event.pageX : event.touches[0].pageX;
    let pageY =
      event.pageY !== undefined ? event.pageY : event.touches[0].pageY;
    let x = width / 2 - (pageX - triggerRect.left - window.pageXOffset);
    let y = height / 2 - (pageY - triggerRect.top - window.pageYOffset);
    let radian = Math.atan2(-x, y);
    let unit =
      Math.PI / (this._hourView ? 6 : this.interval ? 30 / this.interval : 30);
    let z = Math.sqrt(x * x + y * y);
    let outer =
      this._hourView &&
      z >
        (width * (CLOCK_OUTER_RADIUS / 100) +
          width * (CLOCK_INNER_RADIUS / 100)) /
          2;
    if (radian < 0) {
      radian = Math.PI * 2 + radian;
    }
    let value = Math.round(radian / unit);
    let date;
    if (this._hourView) {
      if (this.twelvehour) {
        value = value === 0 ? 12 : value;
      } else {
        if (value === 12) {
          value = 0;
        }
        value = outer
          ? value === 0
            ? 12
            : value
          : value === 0
          ? 0
          : value + 12;
      }
      // Don't close the hours view if an invalid hour is clicked.
      if (!this._hours.find((h) => h?.['value'] === value)?.['enabled']) {
        return;
      }
      date = this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate),
        this._adapter.getDate(this.activeDate),
        value,
        this._adapter.getMinute(this.activeDate)
      );
    } else {
      if (this.interval) {
        value *= this.interval;
      }
      if (value === 60) {
        value = 0;
      }
      // Don't close the minutes view if an invalid minute is clicked.
      if (!this._minutes.find((m) => m?.['value'] === value)?.['enabled']) {
        return;
      }
      date = this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate),
        this._adapter.getDate(this.activeDate),
        this._adapter.getHour(this.activeDate),
        value
      );
    }
    this._timeChanged = true;
    this.activeDate = date;
    this.activeDateChange.emit(this.activeDate);
  }
}
/** @nocollapse */ MatDatetimepickerClockComponent.ɵfac = i0.ɵɵngDeclareFactory(
  {
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerClockComponent,
    deps: [{ token: i0.ElementRef }, { token: DatetimeAdapter }],
    target: i0.ɵɵFactoryTarget.Component,
  }
);
/** @nocollapse */ MatDatetimepickerClockComponent.ɵcmp =
  i0.ɵɵngDeclareComponent({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerClockComponent,
    selector: 'mat-datetimepicker-clock',
    inputs: {
      dateFilter: 'dateFilter',
      interval: 'interval',
      twelvehour: 'twelvehour',
      activeDate: 'activeDate',
      selected: 'selected',
      minDate: 'minDate',
      maxDate: 'maxDate',
      startView: 'startView',
    },
    outputs: {
      selectedChange: 'selectedChange',
      activeDateChange: 'activeDateChange',
    },
    host: {
      attributes: { role: 'clock' },
      listeners: { mousedown: '_handleMousedown($event)' },
    },
    ngImport: i0,
    template:
      '<div class="mat-datetimepicker-clock">\r\n  <div class="mat-datetimepicker-clock-center"></div>\r\n  <div [ngStyle]="_hand" class="mat-datetimepicker-clock-hand"></div>\r\n  <div [class.active]="_hourView" class="mat-datetimepicker-clock-hours">\r\n    <div\r\n      *ngFor="let item of _hours"\r\n      [class.mat-datetimepicker-clock-cell-disabled]="!item.enabled"\r\n      [class.mat-datetimepicker-clock-cell-selected]="_selectedHour === item.value"\r\n      [style.fontSize]="item.fontSize"\r\n      [style.left]="item.left + \'%\'"\r\n      [style.top]="item.top + \'%\'"\r\n      class="mat-datetimepicker-clock-cell"\r\n    >\r\n      {{ item.displayValue }}\r\n    </div>\r\n  </div>\r\n  <div [class.active]="!_hourView" class="mat-datetimepicker-clock-minutes">\r\n    <div\r\n      *ngFor="let item of _minutes"\r\n      [class.mat-datetimepicker-clock-cell-disabled]="!item.enabled"\r\n      [class.mat-datetimepicker-clock-cell-selected]="_selectedMinute === item.value"\r\n      [style.left]="item.left + \'%\'"\r\n      [style.top]="item.top + \'%\'"\r\n      class="mat-datetimepicker-clock-cell"\r\n    >\r\n      {{ item.displayValue }}\r\n    </div>\r\n  </div>\r\n</div>\r\n',
    styles: [
      ':host{position:relative;display:block;min-width:224px;margin:8px;font-size:14px;box-sizing:border-box;-webkit-user-select:none;user-select:none}.mat-datetimepicker-clock{position:relative;width:100%;height:0;padding-top:100%;background-color:#e0e0e0;border-radius:50%}.mat-datetimepicker-clock-center{position:absolute;top:50%;left:50%;width:2%;height:2%;margin:-1%;border-radius:50%}.mat-datetimepicker-clock-hand{position:absolute;inset:0;width:1px;margin:0 auto;transform-origin:bottom}.mat-datetimepicker-clock-hand:before{content:"";position:absolute;top:-4px;left:-4px;width:8px;height:8px;border-radius:50%}.mat-datetimepicker-clock-hours,.mat-datetimepicker-clock-minutes{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden;transition:.35s;transform:scale(1.2)}.mat-datetimepicker-clock-hours.active,.mat-datetimepicker-clock-minutes.active{opacity:1;visibility:visible;transform:scale(1)}.mat-datetimepicker-clock-minutes{transform:scale(.8)}.mat-datetimepicker-clock-cell{position:absolute;display:flex;width:14.1666%;height:14.1666%;color:#000000de;justify-content:center;box-sizing:border-box;border-radius:50%;align-items:center;cursor:pointer}.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-selected):not(.mat-datetimepicker-clock-cell-disabled):hover{background-color:#0000001a}.mat-datetimepicker-clock-cell.mat-datetimepicker-clock-cell-disabled{color:#00000061;pointer-events:none}.mat-datetimepicker-clock-cell.mat-datetimepicker-clock-cell-selected{color:#fff}\n',
    ],
    dependencies: [
      {
        kind: 'directive',
        type: i2.NgForOf,
        selector: '[ngFor][ngForOf]',
        inputs: ['ngForOf', 'ngForTrackBy', 'ngForTemplate'],
      },
      {
        kind: 'directive',
        type: i2.NgStyle,
        selector: '[ngStyle]',
        inputs: ['ngStyle'],
      },
    ],
  });
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerClockComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-datetimepicker-clock',
          host: {
            role: 'clock',
            '(mousedown)': '_handleMousedown($event)',
          },
          template:
            '<div class="mat-datetimepicker-clock">\r\n  <div class="mat-datetimepicker-clock-center"></div>\r\n  <div [ngStyle]="_hand" class="mat-datetimepicker-clock-hand"></div>\r\n  <div [class.active]="_hourView" class="mat-datetimepicker-clock-hours">\r\n    <div\r\n      *ngFor="let item of _hours"\r\n      [class.mat-datetimepicker-clock-cell-disabled]="!item.enabled"\r\n      [class.mat-datetimepicker-clock-cell-selected]="_selectedHour === item.value"\r\n      [style.fontSize]="item.fontSize"\r\n      [style.left]="item.left + \'%\'"\r\n      [style.top]="item.top + \'%\'"\r\n      class="mat-datetimepicker-clock-cell"\r\n    >\r\n      {{ item.displayValue }}\r\n    </div>\r\n  </div>\r\n  <div [class.active]="!_hourView" class="mat-datetimepicker-clock-minutes">\r\n    <div\r\n      *ngFor="let item of _minutes"\r\n      [class.mat-datetimepicker-clock-cell-disabled]="!item.enabled"\r\n      [class.mat-datetimepicker-clock-cell-selected]="_selectedMinute === item.value"\r\n      [style.left]="item.left + \'%\'"\r\n      [style.top]="item.top + \'%\'"\r\n      class="mat-datetimepicker-clock-cell"\r\n    >\r\n      {{ item.displayValue }}\r\n    </div>\r\n  </div>\r\n</div>\r\n',
          styles: [
            ':host{position:relative;display:block;min-width:224px;margin:8px;font-size:14px;box-sizing:border-box;-webkit-user-select:none;user-select:none}.mat-datetimepicker-clock{position:relative;width:100%;height:0;padding-top:100%;background-color:#e0e0e0;border-radius:50%}.mat-datetimepicker-clock-center{position:absolute;top:50%;left:50%;width:2%;height:2%;margin:-1%;border-radius:50%}.mat-datetimepicker-clock-hand{position:absolute;inset:0;width:1px;margin:0 auto;transform-origin:bottom}.mat-datetimepicker-clock-hand:before{content:"";position:absolute;top:-4px;left:-4px;width:8px;height:8px;border-radius:50%}.mat-datetimepicker-clock-hours,.mat-datetimepicker-clock-minutes{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden;transition:.35s;transform:scale(1.2)}.mat-datetimepicker-clock-hours.active,.mat-datetimepicker-clock-minutes.active{opacity:1;visibility:visible;transform:scale(1)}.mat-datetimepicker-clock-minutes{transform:scale(.8)}.mat-datetimepicker-clock-cell{position:absolute;display:flex;width:14.1666%;height:14.1666%;color:#000000de;justify-content:center;box-sizing:border-box;border-radius:50%;align-items:center;cursor:pointer}.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-selected):not(.mat-datetimepicker-clock-cell-disabled):hover{background-color:#0000001a}.mat-datetimepicker-clock-cell.mat-datetimepicker-clock-cell-disabled{color:#00000061;pointer-events:none}.mat-datetimepicker-clock-cell.mat-datetimepicker-clock-cell-selected{color:#fff}\n',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [{ type: i0.ElementRef }, { type: DatetimeAdapter }];
  },
  propDecorators: {
    dateFilter: [
      {
        type: Input,
      },
    ],
    interval: [
      {
        type: Input,
      },
    ],
    twelvehour: [
      {
        type: Input,
      },
    ],
    selectedChange: [
      {
        type: Output,
      },
    ],
    activeDateChange: [
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
    startView: [
      {
        type: Input,
      },
    ],
  },
});

const DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
class MatDatetimepickerMonthViewComponent {
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
      { token: DatetimeAdapter, optional: true },
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
        type: MatDatetimepickerCalendarBodyComponent,
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
        type: DatetimeAdapter,
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

/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
class MatDatetimepickerYearViewComponent {
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
      { token: DatetimeAdapter, optional: true },
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
        type: MatDatetimepickerCalendarBodyComponent,
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
        type: DatetimeAdapter,
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

/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
class MatDatetimepickerCalendarComponent {
  constructor(
    _elementRef,
    _intl,
    _ngZone,
    _adapter,
    _dateFormats,
    changeDetectorRef
  ) {
    this._elementRef = _elementRef;
    this._intl = _intl;
    this._ngZone = _ngZone;
    this._adapter = _adapter;
    this._dateFormats = _dateFormats;
    this.closeDateTimePicker = new EventEmitter();
    /** Active multi year view when click on year. */
    this.multiYearSelector = false;
    /** Whether the calendar should be started in month or year view. */
    this.startView = 'month';
    this.twelvehour = false;
    this.timeInterval = 1;
    this.ariaLabel = 'Use arrow keys to navigate';
    this.ariaNextMonthLabel = 'Next month';
    this.ariaPrevMonthLabel = 'Previous month';
    this.ariaNextYearLabel = 'Next year';
    this.ariaPrevYearLabel = 'Previous year';
    this.ariaNextMultiYearLabel = 'Next year range';
    this.ariaPrevMultiYearLabel = 'Previous year range';
    this.confirmLabel = 'Ok';
    this.cancelLabel = 'Cancel';
    /** Prevent user to select same date time */
    this.preventSameDateTimeSelection = false;
    /** Emits when the currently selected date changes. */
    this.selectedChange = new EventEmitter();
    /** Emits when the view has been changed. **/
    this.viewChanged = new EventEmitter();
    this._clockView = 'hour';
    this._type = 'date';
    /** Date filter for the month and year views. */
    this._dateFilterForViews = (date) => {
      return (
        !!date &&
        (!this.dateFilter ||
          this.dateFilter(date, MatDatetimepickerFilterType.DATE)) &&
        (!this.minDate || this._adapter.compareDate(date, this.minDate) >= 0) &&
        (!this.maxDate || this._adapter.compareDate(date, this.maxDate) <= 0)
      );
    };
    if (!this._adapter) {
      throw createMissingDateImplError('DatetimeAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('MAT_DATETIME_FORMATS');
    }
    this._intlChanges = _intl.changes.subscribe(() =>
      changeDetectorRef.markForCheck()
    );
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value || 'date';
    if (this.type === 'year') {
      this.multiYearSelector = true;
    }
  }
  /** A date representing the period (month or year) to start the calendar in. */
  get startAt() {
    return this._startAt;
  }
  set startAt(value) {
    this._startAt = this._adapter.getValidDateOrNull(value);
  }
  /** The currently selected date. */
  get selected() {
    return this._selected;
  }
  set selected(value) {
    this._selected = this._adapter.getValidDateOrNull(value);
  }
  /** The minimum selectable date. */
  get minDate() {
    return this._minDate;
  }
  set minDate(value) {
    this._minDate = this._adapter.getValidDateOrNull(value);
  }
  /** The maximum selectable date. */
  get maxDate() {
    return this._maxDate;
  }
  set maxDate(value) {
    this._maxDate = this._adapter.getValidDateOrNull(value);
  }
  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get _activeDate() {
    return this._clampedActiveDate;
  }
  set _activeDate(value) {
    const oldActiveDate = this._clampedActiveDate;
    this._clampedActiveDate = this._adapter.clampDate(
      value,
      this.minDate,
      this.maxDate
    );
    if (
      oldActiveDate &&
      this._clampedActiveDate &&
      this.currentView === 'month' &&
      !this._adapter.sameMonthAndYear(oldActiveDate, this._clampedActiveDate)
    ) {
      if (this._adapter.isInNextMonth(oldActiveDate, this._clampedActiveDate)) {
        this.calendarState('right');
      } else {
        this.calendarState('left');
      }
    }
  }
  get currentView() {
    return this._currentView;
  }
  set currentView(view) {
    this._currentView = view;
    this.viewChanged.emit(view);
  }
  /** The label for the current calendar view. */
  get _yearLabel() {
    return this._adapter.getYearName(this._activeDate);
  }
  get _monthYearLabel() {
    if (this.currentView === 'multi-year') {
      // The offset from the active year to the "slot" for the starting year is the
      // *actual* first rendered year in the multi-year view, and the last year is
      // just yearsPerPage - 1 away.
      const activeYear = this._adapter.getYear(this._activeDate);
      const minYearOfPage =
        activeYear -
        getActiveOffset(
          this._adapter,
          this._activeDate,
          this.minDate,
          this.maxDate
        );
      const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
      const minYearName = this._adapter.getYearName(
        this._adapter.createDate(minYearOfPage, 0, 1)
      );
      const maxYearName = this._adapter.getYearName(
        this._adapter.createDate(maxYearOfPage, 0, 1)
      );
      return this._intl.formatYearRange(minYearName, maxYearName);
    }
    return this.currentView === 'month'
      ? this._adapter.getMonthNames('long')[
          this._adapter.getMonth(this._activeDate)
        ]
      : this._adapter.getYearName(this._activeDate);
  }
  get _dateLabel() {
    switch (this.type) {
      case 'month':
        return this._adapter.getMonthNames('long')[
          this._adapter.getMonth(this._activeDate)
        ];
      default:
        return this._adapter.format(
          this._activeDate,
          this._dateFormats.display.popupHeaderDateLabel
        );
    }
  }
  get _hoursLabel() {
    let hour = this._adapter.getHour(this._activeDate);
    if (this.twelvehour) {
      if (hour === 0) {
        hour = 24;
      }
      hour = hour > 12 ? hour - 12 : hour;
    }
    return this._2digit(hour);
  }
  get _minutesLabel() {
    return this._2digit(this._adapter.getMinute(this._activeDate));
  }
  get _ariaLabelNext() {
    switch (this._currentView) {
      case 'month':
        return this.ariaNextMonthLabel;
      case 'year':
        return this.ariaNextYearLabel;
      case 'multi-year':
        return this.ariaNextMultiYearLabel;
      default:
        return '';
    }
  }
  get _ariaLabelPrev() {
    switch (this._currentView) {
      case 'month':
        return this.ariaPrevMonthLabel;
      case 'year':
        return this.ariaPrevYearLabel;
      case 'multi-year':
        return this.ariaPrevMultiYearLabel;
      default:
        return '';
    }
  }
  onCancel() {
    this.closeDateTimePicker.emit(null);
  }
  onConfirm() {
    this.closeDateTimePicker.emit(this._activeDate);
  }
  ngAfterContentInit() {
    this._activeDate = this.startAt || this._adapter.today();
    this._selectAMPM(this._activeDate);
    this._focusActiveCell();
    if (this.type === 'year') {
      this.currentView = 'multi-year';
    } else if (this.type === 'month') {
      this.currentView = 'year';
    } else if (this.type === 'time') {
      this.currentView = 'clock';
    } else {
      this.currentView = this.startView || 'month';
    }
  }
  ngOnDestroy() {
    this._intlChanges.unsubscribe();
  }
  /** Handles date selection in the month view. */
  _dateSelected(date) {
    if (this.type === 'date') {
      if (
        !this._adapter.sameDate(date, this.selected) ||
        !this.preventSameDateTimeSelection
      ) {
        this.selectedChange.emit(date);
      }
    } else {
      this._activeDate = date;
      this.currentView = 'clock';
    }
  }
  /** Handles month selection in the year view. */
  _monthSelected(month) {
    if (this.type === 'month') {
      if (
        !this._adapter.sameMonthAndYear(month, this.selected) ||
        !this.preventSameDateTimeSelection
      ) {
        this.selectedChange.emit(this._adapter.getFirstDateOfMonth(month));
      }
    } else {
      this._activeDate = month;
      this.currentView = 'month';
      this._clockView = 'hour';
    }
  }
  /** Handles year selection in the multi year view. */
  _yearSelected(year) {
    if (this.type === 'year') {
      if (
        !this._adapter.sameYear(year, this.selected) ||
        !this.preventSameDateTimeSelection
      ) {
        const normalizedDate = this._adapter.createDatetime(
          this._adapter.getYear(year),
          0,
          1,
          0,
          0
        );
        this.selectedChange.emit(normalizedDate);
      }
    } else {
      this._activeDate = year;
      this.currentView = 'year';
    }
  }
  _timeSelected(date) {
    if (this._clockView !== 'minute') {
      this._activeDate = this._updateDate(date);
      this._clockView = 'minute';
    } else {
      if (
        !this._adapter.sameDatetime(date, this.selected) ||
        !this.preventSameDateTimeSelection
      ) {
        this.selectedChange.emit(date);
      }
    }
  }
  _onActiveDateChange(date) {
    this._activeDate = date;
  }
  _updateDate(date) {
    if (this.twelvehour) {
      const HOUR = this._adapter.getHour(date);
      if (HOUR === 12) {
        if (this._AMPM === 'AM') {
          return this._adapter.addCalendarHours(date, -12);
        }
      } else if (this._AMPM === 'PM') {
        return this._adapter.addCalendarHours(date, 12);
      }
    }
    return date;
  }
  _selectAMPM(date) {
    if (this._adapter.getHour(date) > 11) {
      this._AMPM = 'PM';
    } else {
      this._AMPM = 'AM';
    }
  }
  _ampmClicked(source) {
    if (source === this._AMPM) {
      return;
    }
    this._AMPM = source;
    if (this._AMPM === 'AM') {
      this._activeDate = this._adapter.addCalendarHours(this._activeDate, -12);
    } else {
      this._activeDate = this._adapter.addCalendarHours(this._activeDate, 12);
    }
  }
  _yearClicked() {
    if (this.type === 'year' || this.multiYearSelector) {
      this.currentView = 'multi-year';
      return;
    }
    this.currentView = 'year';
  }
  _dateClicked() {
    if (this.type !== 'month') {
      this.currentView = 'month';
    }
  }
  _hoursClicked() {
    this.currentView = 'clock';
    this._clockView = 'hour';
  }
  _minutesClicked() {
    this.currentView = 'clock';
    this._clockView = 'minute';
  }
  /** Handles user clicks on the previous button. */
  _previousClicked() {
    this._activeDate =
      this.currentView === 'month'
        ? this._adapter.addCalendarMonths(this._activeDate, -1)
        : this._adapter.addCalendarYears(
            this._activeDate,
            this.currentView === 'year' ? -1 : -yearsPerPage
          );
  }
  /** Handles user clicks on the next button. */
  _nextClicked() {
    this._activeDate =
      this.currentView === 'month'
        ? this._adapter.addCalendarMonths(this._activeDate, 1)
        : this._adapter.addCalendarYears(
            this._activeDate,
            this.currentView === 'year' ? 1 : yearsPerPage
          );
  }
  /** Whether the previous period button is enabled. */
  _previousEnabled() {
    if (!this.minDate) {
      return true;
    }
    return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
  }
  /** Whether the next period button is enabled. */
  _nextEnabled() {
    return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
  }
  /** Handles keydown events on the calendar body. */
  _handleCalendarBodyKeydown(event) {
    // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
    // disabled ones from being selected. This may not be ideal, we should look into whether
    // navigation should skip over disabled dates, and if so, how to implement that efficiently.
    if (this.currentView === 'month') {
      this._handleCalendarBodyKeydownInMonthView(event);
    } else if (this.currentView === 'year') {
      this._handleCalendarBodyKeydownInYearView(event);
    } else if (this.currentView === 'multi-year') {
      this._handleCalendarBodyKeydownInMultiYearView(event);
    } else {
      this._handleCalendarBodyKeydownInClockView(event);
    }
  }
  _focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable
        .asObservable()
        .pipe(first())
        .subscribe(() => {
          this._elementRef.nativeElement.focus();
        });
    });
  }
  _calendarStateDone() {
    this._calendarState = '';
  }
  /** Whether the two dates represent the same view in the current view mode (month or year). */
  _isSameView(date1, date2) {
    if (this.currentView === 'month') {
      return (
        this._adapter.getYear(date1) === this._adapter.getYear(date2) &&
        this._adapter.getMonth(date1) === this._adapter.getMonth(date2)
      );
    }
    if (this.currentView === 'year') {
      return this._adapter.getYear(date1) === this._adapter.getYear(date2);
    }
    // Otherwise we are in 'multi-year' view.
    return isSameMultiYearView(
      this._adapter,
      date1,
      date2,
      this.minDate,
      this.maxDate
    );
  }
  /** Handles keydown events on the calendar body when calendar is in month view. */
  _handleCalendarBodyKeydownInMonthView(event) {
    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, 1);
        break;
      case UP_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, -7);
        break;
      case DOWN_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, 7);
        break;
      case HOME:
        this._activeDate = this._adapter.addCalendarDays(
          this._activeDate,
          1 - this._adapter.getDate(this._activeDate)
        );
        break;
      case END:
        this._activeDate = this._adapter.addCalendarDays(
          this._activeDate,
          this._adapter.getNumDaysInMonth(this._activeDate) -
            this._adapter.getDate(this._activeDate)
        );
        break;
      case PAGE_UP:
        this._activeDate = event.altKey
          ? this._adapter.addCalendarYears(this._activeDate, -1)
          : this._adapter.addCalendarMonths(this._activeDate, -1);
        break;
      case PAGE_DOWN:
        this._activeDate = event.altKey
          ? this._adapter.addCalendarYears(this._activeDate, 1)
          : this._adapter.addCalendarMonths(this._activeDate, 1);
        break;
      case ENTER:
        if (this._dateFilterForViews(this._activeDate)) {
          this._dateSelected(this._activeDate);
          // Prevent unexpected default actions such as form submission.
          event.preventDefault();
        }
        return;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }
    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }
  /** Handles keydown events on the calendar body when calendar is in year view. */
  _handleCalendarBodyKeydownInYearView(event) {
    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = this._adapter.addCalendarMonths(
          this._activeDate,
          -1
        );
        break;
      case RIGHT_ARROW:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate, 1);
        break;
      case UP_ARROW:
        this._activeDate = this._prevMonthInSameCol(this._activeDate);
        break;
      case DOWN_ARROW:
        this._activeDate = this._nextMonthInSameCol(this._activeDate);
        break;
      case HOME:
        this._activeDate = this._adapter.addCalendarMonths(
          this._activeDate,
          -this._adapter.getMonth(this._activeDate)
        );
        break;
      case END:
        this._activeDate = this._adapter.addCalendarMonths(
          this._activeDate,
          11 - this._adapter.getMonth(this._activeDate)
        );
        break;
      case PAGE_UP:
        this._activeDate = this._adapter.addCalendarYears(
          this._activeDate,
          event.altKey ? -10 : -1
        );
        break;
      case PAGE_DOWN:
        this._activeDate = this._adapter.addCalendarYears(
          this._activeDate,
          event.altKey ? 10 : 1
        );
        break;
      case ENTER:
        this._monthSelected(this._activeDate);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }
    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }
  /** Handles keydown events on the calendar body when calendar is in multi-year view. */
  _handleCalendarBodyKeydownInMultiYearView(event) {
    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = this._adapter.addCalendarYears(this._activeDate, -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = this._adapter.addCalendarYears(this._activeDate, 1);
        break;
      case UP_ARROW:
        this._activeDate = this._adapter.addCalendarYears(
          this._activeDate,
          -yearsPerRow
        );
        break;
      case DOWN_ARROW:
        this._activeDate = this._adapter.addCalendarYears(
          this._activeDate,
          yearsPerRow
        );
        break;
      case HOME:
        this._activeDate = this._adapter.addCalendarYears(
          this._activeDate,
          -getActiveOffset(
            this._adapter,
            this._activeDate,
            this.minDate,
            this.maxDate
          )
        );
        break;
      case END:
        this._activeDate = this._adapter.addCalendarYears(
          this._activeDate,
          yearsPerPage -
            getActiveOffset(
              this._adapter,
              this._activeDate,
              this.minDate,
              this.maxDate
            ) -
            1
        );
        break;
      case PAGE_UP:
        this._activeDate = this._adapter.addCalendarYears(
          this._activeDate,
          event.altKey ? -yearsPerPage * 10 : -yearsPerPage
        );
        break;
      case PAGE_DOWN:
        this._activeDate = this._adapter.addCalendarYears(
          this._activeDate,
          event.altKey ? yearsPerPage * 10 : yearsPerPage
        );
        break;
      case ENTER:
        this._yearSelected(this._activeDate);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }
  }
  /** Handles keydown events on the calendar body when calendar is in month view. */
  _handleCalendarBodyKeydownInClockView(event) {
    switch (event.keyCode) {
      case UP_ARROW:
        this._activeDate =
          this._clockView === 'hour'
            ? this._adapter.addCalendarHours(this._activeDate, 1)
            : this._adapter.addCalendarMinutes(this._activeDate, 1);
        break;
      case DOWN_ARROW:
        this._activeDate =
          this._clockView === 'hour'
            ? this._adapter.addCalendarHours(this._activeDate, -1)
            : this._adapter.addCalendarMinutes(this._activeDate, -1);
        break;
      case ENTER:
        this._timeSelected(this._activeDate);
        return;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }
    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }
  /**
   * Determine the date for the month that comes before the given month in the same column in the
   * calendar table.
   */
  _prevMonthInSameCol(date) {
    // Determine how many months to jump forward given that there are 2 empty slots at the beginning
    // of each year.
    const increment =
      this._adapter.getMonth(date) <= 4
        ? -5
        : this._adapter.getMonth(date) >= 7
        ? -7
        : -12;
    return this._adapter.addCalendarMonths(date, increment);
  }
  /**
   * Determine the date for the month that comes after the given month in the same column in the
   * calendar table.
   */
  _nextMonthInSameCol(date) {
    // Determine how many months to jump forward given that there are 2 empty slots at the beginning
    // of each year.
    const increment =
      this._adapter.getMonth(date) <= 4
        ? 7
        : this._adapter.getMonth(date) >= 7
        ? 5
        : 12;
    return this._adapter.addCalendarMonths(date, increment);
  }
  calendarState(direction) {
    this._calendarState = direction;
  }
  _2digit(n) {
    return ('00' + n).slice(-2);
  }
}
/** @nocollapse */ MatDatetimepickerCalendarComponent.ɵfac =
  i0.ɵɵngDeclareFactory({
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerCalendarComponent,
    deps: [
      { token: i0.ElementRef },
      { token: i1$1.MatDatepickerIntl },
      { token: i0.NgZone },
      { token: DatetimeAdapter, optional: true },
      { token: MAT_DATETIME_FORMATS, optional: true },
      { token: i0.ChangeDetectorRef },
    ],
    target: i0.ɵɵFactoryTarget.Component,
  });
/** @nocollapse */ MatDatetimepickerCalendarComponent.ɵcmp =
  i0.ɵɵngDeclareComponent({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerCalendarComponent,
    selector: 'mat-datetimepicker-calendar',
    inputs: {
      multiYearSelector: 'multiYearSelector',
      startView: 'startView',
      twelvehour: 'twelvehour',
      timeInterval: 'timeInterval',
      dateFilter: 'dateFilter',
      ariaLabel: 'ariaLabel',
      ariaNextMonthLabel: 'ariaNextMonthLabel',
      ariaPrevMonthLabel: 'ariaPrevMonthLabel',
      ariaNextYearLabel: 'ariaNextYearLabel',
      ariaPrevYearLabel: 'ariaPrevYearLabel',
      ariaNextMultiYearLabel: 'ariaNextMultiYearLabel',
      ariaPrevMultiYearLabel: 'ariaPrevMultiYearLabel',
      confirmLabel: 'confirmLabel',
      cancelLabel: 'cancelLabel',
      preventSameDateTimeSelection: 'preventSameDateTimeSelection',
      type: 'type',
      startAt: 'startAt',
      selected: 'selected',
      minDate: 'minDate',
      maxDate: 'maxDate',
    },
    outputs: {
      closeDateTimePicker: 'closeDateTimePicker',
      selectedChange: 'selectedChange',
      viewChanged: 'viewChanged',
    },
    host: {
      attributes: { role: 'dialog', tabindex: '0' },
      listeners: { keydown: '_handleCalendarBodyKeydown($event)' },
      properties: {
        'class.mat-datetimepicker-calendar': 'true',
        'attr.aria-label': 'ariaLabel',
      },
    },
    ngImport: i0,
    template:
      '<div class="mat-datetimepicker-calendar-header">\n  <div\n    (click)="_yearClicked()"\n    *ngIf="type !== \'time\'"\n    [class.active]="currentView === \'year\' || currentView === \'multi-year\'"\n    class="mat-datetimepicker-calendar-header-year"\n    role="button"\n  >\n    {{ _yearLabel }}\n    <mat-icon *ngIf="multiYearSelector || type === \'year\'"\n      >arrow_drop_down</mat-icon\n    >\n  </div>\n  <div class="mat-datetimepicker-calendar-header-date-time">\n    <span\n      (click)="_dateClicked()"\n      *ngIf="type !== \'time\' && type !== \'year\'"\n      [class.active]="currentView === \'month\'"\n      [class.not-clickable]="type === \'month\'"\n      class="mat-datetimepicker-calendar-header-date"\n      role="button"\n      >{{ _dateLabel }}</span\n    >\n    <span\n      *ngIf="type.endsWith(\'time\')"\n      [class.active]="currentView === \'clock\'"\n      class="mat-datetimepicker-calendar-header-time"\n    >\n      <span\n        (click)="_hoursClicked()"\n        [class.active]="_clockView === \'hour\'"\n        class="mat-datetimepicker-calendar-header-hours"\n        role="button"\n        >{{ _hoursLabel }}</span\n      >:<span\n        (click)="_minutesClicked()"\n        [class.active]="_clockView === \'minute\'"\n        class="mat-datetimepicker-calendar-header-minutes"\n        role="button"\n        >{{ _minutesLabel }}</span\n      >\n      <br />\n      <span\n        *ngIf="twelvehour"\n        class="mat-datetimepicker-calendar-header-ampm-container"\n      >\n        <span\n          (click)="_ampmClicked(\'AM\')"\n          [class.active]="_AMPM === \'AM\'"\n          class="mat-datetimepicker-calendar-header-ampm"\n          >AM</span\n        >/<span\n          (click)="_ampmClicked(\'PM\')"\n          [class.active]="_AMPM === \'PM\'"\n          class="mat-datetimepicker-calendar-header-ampm"\n          >PM</span\n        >\n      </span>\n    </span>\n  </div>\n</div>\n<div [ngSwitch]="currentView" class="mat-datetimepicker-calendar-content">\n  <div\n    *ngIf="currentView === \'month\' || currentView === \'year\' || currentView === \'multi-year\'"\n    class="mat-month-content"\n  >\n    <div class="mat-datetimepicker-calendar-controls">\n      <div\n        (click)="_previousClicked()"\n        [attr.aria-disabled]="!_previousEnabled()"\n        [attr.aria-label]="_ariaLabelPrev"\n        [class.disabled]="!_previousEnabled()"\n        class="mat-datetimepicker-calendar-previous-button"\n        role="button"\n      >\n        <svg height="24" viewBox="0 0 24 24" width="24">\n          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>\n        </svg>\n      </div>\n      <div\n        (@slideCalendar.done)="_calendarStateDone()"\n        [@slideCalendar]="_calendarState"\n        class="mat-datetimepicker-calendar-period-button"\n      >\n        <strong>{{ _monthYearLabel }}</strong>\n      </div>\n      <div\n        (click)="_nextClicked()"\n        [attr.aria-disabled]="!_nextEnabled()"\n        [attr.aria-label]="_ariaLabelNext"\n        [class.disabled]="!_nextEnabled()"\n        class="mat-datetimepicker-calendar-next-button"\n        role="button"\n      >\n        <svg height="24" viewBox="0 0 24 24" width="24">\n          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>\n        </svg>\n      </div>\n    </div>\n  </div>\n  <mat-datetimepicker-month-view\n    (_userSelection)="onCancel()"\n    (selectedChange)="_dateSelected($event)"\n    *ngSwitchCase="\'month\'"\n    [activeDate]="_activeDate"\n    [dateFilter]="_dateFilterForViews"\n    [selected]="selected"\n    [type]="type"\n  >\n  </mat-datetimepicker-month-view>\n  <mat-datetimepicker-year-view\n    (_userSelection)="onCancel()"\n    (selectedChange)="_monthSelected($event)"\n    *ngSwitchCase="\'year\'"\n    [activeDate]="_activeDate"\n    [dateFilter]="_dateFilterForViews"\n    [selected]="selected"\n    [type]="type"\n  >\n  </mat-datetimepicker-year-view>\n  <mat-datetimepicker-multi-year-view\n    (_userSelection)="onCancel()"\n    (selectedChange)="_yearSelected($event)"\n    *ngSwitchCase="\'multi-year\'"\n    [activeDate]="_activeDate"\n    [dateFilter]="_dateFilterForViews"\n    [maxDate]="maxDate"\n    [minDate]="minDate"\n    [selected]="selected"\n    [type]="type"\n  >\n  </mat-datetimepicker-multi-year-view>\n  <mat-datetimepicker-clock\n    (_userSelection)="onCancel()"\n    (activeDateChange)="_onActiveDateChange($event)"\n    (selectedChange)="_timeSelected($event)"\n    *ngSwitchDefault\n    [dateFilter]="dateFilter"\n    [interval]="timeInterval"\n    [maxDate]="maxDate"\n    [minDate]="minDate"\n    [selected]="_activeDate"\n    [startView]="_clockView"\n    [twelvehour]="twelvehour"\n  >\n  </mat-datetimepicker-clock>\n  <div class="action-buttons">\n    <button class="cancel-button" mat-raised-button (click)="onCancel()">\n      {{cancelLabel}}</button\n    ><button\n      class="confirm-button"\n      mat-raised-button\n      color="primary"\n      (click)="onConfirm()"\n    >\n      {{confirmLabel}}\n    </button>\n  </div>\n</div>\n',
    styles: [
      '.mat-datetimepicker-calendar{-webkit-user-select:none;user-select:none;display:block;outline:none}.mat-datetimepicker-calendar[mode=landscape]{display:flex}.mat-datetimepicker-calendar-header{padding:16px;font-size:14px;color:#fff;box-sizing:border-box}[mode=landscape] .mat-datetimepicker-calendar-header{width:150px;min-width:150px}.mat-datetimepicker-calendar-header-year,.mat-datetimepicker-calendar-header-date-time{width:100%;font-weight:500;white-space:nowrap}.mat-datetimepicker-calendar-header-year{font-size:16px}.mat-datetimepicker-calendar-header-year mat-icon{transform:translateY(5px)}.mat-datetimepicker-calendar-header-date-time{font-size:30px;line-height:34px}[mode=landscape] .mat-datetimepicker-calendar-header-date-time{white-space:normal;word-wrap:break-word}.mat-datetimepicker-calendar-header-ampm-container{font-size:.77em}.mat-datetimepicker-calendar-header-year:not(.active),.mat-datetimepicker-calendar-header-date:not(.active),.mat-datetimepicker-calendar-header-hours:not(.active),.mat-datetimepicker-calendar-header-minutes:not(.active),.mat-datetimepicker-calendar-header-ampm:not(.active){cursor:pointer;opacity:.6}.mat-datetimepicker-calendar-header-year.not-clickable,.mat-datetimepicker-calendar-header-date.not-clickable,.mat-datetimepicker-calendar-header-hours.not-clickable,.mat-datetimepicker-calendar-header-minutes.not-clickable,.mat-datetimepicker-calendar-header-ampm.not-clickable{cursor:initial}.mat-datetimepicker-calendar-header-time{padding-left:8px}.mat-datetimepicker-calendar-header-time:not(.active){opacity:.6}.mat-datetimepicker-calendar-header-time:not(.active) .mat-datetimepicker-calendar-header-hours,.mat-datetimepicker-calendar-header-time:not(.active) .mat-datetimepicker-calendar-header-minutes,.mat-datetimepicker-calendar-header-time:not(.active) .mat-datetimepicker-calendar-header-ampm{cursor:pointer;opacity:1}[mode=landscape] .mat-datetimepicker-calendar-header-time{display:block;padding-left:0}.mat-datetimepicker-calendar-content{width:100%;padding:0 8px 8px;outline:none;box-sizing:border-box;overflow:hidden}[mode=landscape] .mat-datetimepicker-calendar-content{padding-top:8px}.mat-datetimepicker-calendar-controls{display:flex;justify-content:space-between}.mat-datetimepicker-calendar-period-button{display:inline-block;height:48px;padding:12px;outline:none;border:0;background:transparent;box-sizing:border-box}.mat-datetimepicker-calendar-previous-button,.mat-datetimepicker-calendar-next-button{display:inline-block;width:48px;height:48px;padding:12px;outline:none;border:0;cursor:pointer;background:transparent;box-sizing:border-box}.mat-datetimepicker-calendar-previous-button.disabled,.mat-datetimepicker-calendar-next-button.disabled{color:#00000061;pointer-events:none}.mat-datetimepicker-calendar-previous-button svg,.mat-datetimepicker-calendar-next-button svg{fill:currentColor;vertical-align:top}.mat-datetimepicker-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-datetimepicker-calendar-table-header{color:#00000061}.mat-datetimepicker-calendar-table-header th{text-align:center;font-size:11px;padding:0 0 8px}@media (min-width: 480px){.mat-datetimepicker-calendar[mode=auto]{display:flex}.mat-datetimepicker-calendar[mode=auto] .mat-datetimepicker-calendar-header{width:150px;min-width:150px}.mat-datetimepicker-calendar[mode=auto] .mat-datetimepicker-calendar-header-date-time{white-space:normal;word-wrap:break-word}.mat-datetimepicker-calendar[mode=auto] .mat-datetimepicker-calendar-header-time{display:block;padding-left:0}.mat-datetimepicker-calendar[mode=auto] .mat-datetimepicker-calendar-content{padding-top:8px}}.action-buttons{margin:10px 0;position:absolute;float:right;right:0;bottom:0}.cancel-button,.confirm-button{margin:0 10px!important}\n',
    ],
    dependencies: [
      {
        kind: 'directive',
        type: i2.NgIf,
        selector: '[ngIf]',
        inputs: ['ngIf', 'ngIfThen', 'ngIfElse'],
      },
      {
        kind: 'directive',
        type: i2.NgSwitch,
        selector: '[ngSwitch]',
        inputs: ['ngSwitch'],
      },
      {
        kind: 'directive',
        type: i2.NgSwitchCase,
        selector: '[ngSwitchCase]',
        inputs: ['ngSwitchCase'],
      },
      {
        kind: 'directive',
        type: i2.NgSwitchDefault,
        selector: '[ngSwitchDefault]',
      },
      {
        kind: 'component',
        type: i4.MatButton,
        selector:
          'button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]',
        inputs: ['disabled', 'disableRipple', 'color'],
        exportAs: ['matButton'],
      },
      {
        kind: 'component',
        type: i5.MatIcon,
        selector: 'mat-icon',
        inputs: ['color', 'inline', 'svgIcon', 'fontSet', 'fontIcon'],
        exportAs: ['matIcon'],
      },
      {
        kind: 'component',
        type: MatDatetimepickerClockComponent,
        selector: 'mat-datetimepicker-clock',
        inputs: [
          'dateFilter',
          'interval',
          'twelvehour',
          'activeDate',
          'selected',
          'minDate',
          'maxDate',
          'startView',
        ],
        outputs: ['selectedChange', 'activeDateChange'],
      },
      {
        kind: 'component',
        type: MatDatetimepickerMonthViewComponent,
        selector: 'mat-datetimepicker-month-view',
        inputs: ['type', 'dateFilter', 'activeDate', 'selected'],
        outputs: ['_userSelection', 'selectedChange'],
      },
      {
        kind: 'component',
        type: MatDatetimepickerYearViewComponent,
        selector: 'mat-datetimepicker-year-view',
        inputs: ['type', 'dateFilter', 'activeDate', 'selected'],
        outputs: ['_userSelection', 'selectedChange'],
      },
      {
        kind: 'component',
        type: MatDatetimepickerMultiYearViewComponent,
        selector: 'mat-datetimepicker-multi-year-view',
        inputs: [
          'type',
          'dateFilter',
          'activeDate',
          'selected',
          'minDate',
          'maxDate',
        ],
        outputs: ['_userSelection', 'selectedChange'],
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
  type: MatDatetimepickerCalendarComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-datetimepicker-calendar',
          host: {
            '[class.mat-datetimepicker-calendar]': 'true',
            '[attr.aria-label]': 'ariaLabel',
            role: 'dialog',
            tabindex: '0',
            '(keydown)': '_handleCalendarBodyKeydown($event)',
          },
          animations: [slideCalendar],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<div class="mat-datetimepicker-calendar-header">\n  <div\n    (click)="_yearClicked()"\n    *ngIf="type !== \'time\'"\n    [class.active]="currentView === \'year\' || currentView === \'multi-year\'"\n    class="mat-datetimepicker-calendar-header-year"\n    role="button"\n  >\n    {{ _yearLabel }}\n    <mat-icon *ngIf="multiYearSelector || type === \'year\'"\n      >arrow_drop_down</mat-icon\n    >\n  </div>\n  <div class="mat-datetimepicker-calendar-header-date-time">\n    <span\n      (click)="_dateClicked()"\n      *ngIf="type !== \'time\' && type !== \'year\'"\n      [class.active]="currentView === \'month\'"\n      [class.not-clickable]="type === \'month\'"\n      class="mat-datetimepicker-calendar-header-date"\n      role="button"\n      >{{ _dateLabel }}</span\n    >\n    <span\n      *ngIf="type.endsWith(\'time\')"\n      [class.active]="currentView === \'clock\'"\n      class="mat-datetimepicker-calendar-header-time"\n    >\n      <span\n        (click)="_hoursClicked()"\n        [class.active]="_clockView === \'hour\'"\n        class="mat-datetimepicker-calendar-header-hours"\n        role="button"\n        >{{ _hoursLabel }}</span\n      >:<span\n        (click)="_minutesClicked()"\n        [class.active]="_clockView === \'minute\'"\n        class="mat-datetimepicker-calendar-header-minutes"\n        role="button"\n        >{{ _minutesLabel }}</span\n      >\n      <br />\n      <span\n        *ngIf="twelvehour"\n        class="mat-datetimepicker-calendar-header-ampm-container"\n      >\n        <span\n          (click)="_ampmClicked(\'AM\')"\n          [class.active]="_AMPM === \'AM\'"\n          class="mat-datetimepicker-calendar-header-ampm"\n          >AM</span\n        >/<span\n          (click)="_ampmClicked(\'PM\')"\n          [class.active]="_AMPM === \'PM\'"\n          class="mat-datetimepicker-calendar-header-ampm"\n          >PM</span\n        >\n      </span>\n    </span>\n  </div>\n</div>\n<div [ngSwitch]="currentView" class="mat-datetimepicker-calendar-content">\n  <div\n    *ngIf="currentView === \'month\' || currentView === \'year\' || currentView === \'multi-year\'"\n    class="mat-month-content"\n  >\n    <div class="mat-datetimepicker-calendar-controls">\n      <div\n        (click)="_previousClicked()"\n        [attr.aria-disabled]="!_previousEnabled()"\n        [attr.aria-label]="_ariaLabelPrev"\n        [class.disabled]="!_previousEnabled()"\n        class="mat-datetimepicker-calendar-previous-button"\n        role="button"\n      >\n        <svg height="24" viewBox="0 0 24 24" width="24">\n          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>\n        </svg>\n      </div>\n      <div\n        (@slideCalendar.done)="_calendarStateDone()"\n        [@slideCalendar]="_calendarState"\n        class="mat-datetimepicker-calendar-period-button"\n      >\n        <strong>{{ _monthYearLabel }}</strong>\n      </div>\n      <div\n        (click)="_nextClicked()"\n        [attr.aria-disabled]="!_nextEnabled()"\n        [attr.aria-label]="_ariaLabelNext"\n        [class.disabled]="!_nextEnabled()"\n        class="mat-datetimepicker-calendar-next-button"\n        role="button"\n      >\n        <svg height="24" viewBox="0 0 24 24" width="24">\n          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>\n        </svg>\n      </div>\n    </div>\n  </div>\n  <mat-datetimepicker-month-view\n    (_userSelection)="onCancel()"\n    (selectedChange)="_dateSelected($event)"\n    *ngSwitchCase="\'month\'"\n    [activeDate]="_activeDate"\n    [dateFilter]="_dateFilterForViews"\n    [selected]="selected"\n    [type]="type"\n  >\n  </mat-datetimepicker-month-view>\n  <mat-datetimepicker-year-view\n    (_userSelection)="onCancel()"\n    (selectedChange)="_monthSelected($event)"\n    *ngSwitchCase="\'year\'"\n    [activeDate]="_activeDate"\n    [dateFilter]="_dateFilterForViews"\n    [selected]="selected"\n    [type]="type"\n  >\n  </mat-datetimepicker-year-view>\n  <mat-datetimepicker-multi-year-view\n    (_userSelection)="onCancel()"\n    (selectedChange)="_yearSelected($event)"\n    *ngSwitchCase="\'multi-year\'"\n    [activeDate]="_activeDate"\n    [dateFilter]="_dateFilterForViews"\n    [maxDate]="maxDate"\n    [minDate]="minDate"\n    [selected]="selected"\n    [type]="type"\n  >\n  </mat-datetimepicker-multi-year-view>\n  <mat-datetimepicker-clock\n    (_userSelection)="onCancel()"\n    (activeDateChange)="_onActiveDateChange($event)"\n    (selectedChange)="_timeSelected($event)"\n    *ngSwitchDefault\n    [dateFilter]="dateFilter"\n    [interval]="timeInterval"\n    [maxDate]="maxDate"\n    [minDate]="minDate"\n    [selected]="_activeDate"\n    [startView]="_clockView"\n    [twelvehour]="twelvehour"\n  >\n  </mat-datetimepicker-clock>\n  <div class="action-buttons">\n    <button class="cancel-button" mat-raised-button (click)="onCancel()">\n      {{cancelLabel}}</button\n    ><button\n      class="confirm-button"\n      mat-raised-button\n      color="primary"\n      (click)="onConfirm()"\n    >\n      {{confirmLabel}}\n    </button>\n  </div>\n</div>\n',
          styles: [
            '.mat-datetimepicker-calendar{-webkit-user-select:none;user-select:none;display:block;outline:none}.mat-datetimepicker-calendar[mode=landscape]{display:flex}.mat-datetimepicker-calendar-header{padding:16px;font-size:14px;color:#fff;box-sizing:border-box}[mode=landscape] .mat-datetimepicker-calendar-header{width:150px;min-width:150px}.mat-datetimepicker-calendar-header-year,.mat-datetimepicker-calendar-header-date-time{width:100%;font-weight:500;white-space:nowrap}.mat-datetimepicker-calendar-header-year{font-size:16px}.mat-datetimepicker-calendar-header-year mat-icon{transform:translateY(5px)}.mat-datetimepicker-calendar-header-date-time{font-size:30px;line-height:34px}[mode=landscape] .mat-datetimepicker-calendar-header-date-time{white-space:normal;word-wrap:break-word}.mat-datetimepicker-calendar-header-ampm-container{font-size:.77em}.mat-datetimepicker-calendar-header-year:not(.active),.mat-datetimepicker-calendar-header-date:not(.active),.mat-datetimepicker-calendar-header-hours:not(.active),.mat-datetimepicker-calendar-header-minutes:not(.active),.mat-datetimepicker-calendar-header-ampm:not(.active){cursor:pointer;opacity:.6}.mat-datetimepicker-calendar-header-year.not-clickable,.mat-datetimepicker-calendar-header-date.not-clickable,.mat-datetimepicker-calendar-header-hours.not-clickable,.mat-datetimepicker-calendar-header-minutes.not-clickable,.mat-datetimepicker-calendar-header-ampm.not-clickable{cursor:initial}.mat-datetimepicker-calendar-header-time{padding-left:8px}.mat-datetimepicker-calendar-header-time:not(.active){opacity:.6}.mat-datetimepicker-calendar-header-time:not(.active) .mat-datetimepicker-calendar-header-hours,.mat-datetimepicker-calendar-header-time:not(.active) .mat-datetimepicker-calendar-header-minutes,.mat-datetimepicker-calendar-header-time:not(.active) .mat-datetimepicker-calendar-header-ampm{cursor:pointer;opacity:1}[mode=landscape] .mat-datetimepicker-calendar-header-time{display:block;padding-left:0}.mat-datetimepicker-calendar-content{width:100%;padding:0 8px 8px;outline:none;box-sizing:border-box;overflow:hidden}[mode=landscape] .mat-datetimepicker-calendar-content{padding-top:8px}.mat-datetimepicker-calendar-controls{display:flex;justify-content:space-between}.mat-datetimepicker-calendar-period-button{display:inline-block;height:48px;padding:12px;outline:none;border:0;background:transparent;box-sizing:border-box}.mat-datetimepicker-calendar-previous-button,.mat-datetimepicker-calendar-next-button{display:inline-block;width:48px;height:48px;padding:12px;outline:none;border:0;cursor:pointer;background:transparent;box-sizing:border-box}.mat-datetimepicker-calendar-previous-button.disabled,.mat-datetimepicker-calendar-next-button.disabled{color:#00000061;pointer-events:none}.mat-datetimepicker-calendar-previous-button svg,.mat-datetimepicker-calendar-next-button svg{fill:currentColor;vertical-align:top}.mat-datetimepicker-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-datetimepicker-calendar-table-header{color:#00000061}.mat-datetimepicker-calendar-table-header th{text-align:center;font-size:11px;padding:0 0 8px}@media (min-width: 480px){.mat-datetimepicker-calendar[mode=auto]{display:flex}.mat-datetimepicker-calendar[mode=auto] .mat-datetimepicker-calendar-header{width:150px;min-width:150px}.mat-datetimepicker-calendar[mode=auto] .mat-datetimepicker-calendar-header-date-time{white-space:normal;word-wrap:break-word}.mat-datetimepicker-calendar[mode=auto] .mat-datetimepicker-calendar-header-time{display:block;padding-left:0}.mat-datetimepicker-calendar[mode=auto] .mat-datetimepicker-calendar-content{padding-top:8px}}.action-buttons{margin:10px 0;position:absolute;float:right;right:0;bottom:0}.cancel-button,.confirm-button{margin:0 10px!important}\n',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      { type: i1$1.MatDatepickerIntl },
      { type: i0.NgZone },
      {
        type: DatetimeAdapter,
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
      { type: i0.ChangeDetectorRef },
    ];
  },
  propDecorators: {
    closeDateTimePicker: [
      {
        type: Output,
      },
    ],
    multiYearSelector: [
      {
        type: Input,
      },
    ],
    startView: [
      {
        type: Input,
      },
    ],
    twelvehour: [
      {
        type: Input,
      },
    ],
    timeInterval: [
      {
        type: Input,
      },
    ],
    dateFilter: [
      {
        type: Input,
      },
    ],
    ariaLabel: [
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
    ariaNextMultiYearLabel: [
      {
        type: Input,
      },
    ],
    ariaPrevMultiYearLabel: [
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
    selectedChange: [
      {
        type: Output,
      },
    ],
    viewChanged: [
      {
        type: Output,
      },
    ],
    type: [
      {
        type: Input,
      },
    ],
    startAt: [
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

/** Used to generate a unique ID for each datepicker instance. */
let datetimepickerUid = 0;
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
class MatDatetimepickerContentComponent {
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
        type: i1$2.CdkTrapFocus,
        selector: '[cdkTrapFocus]',
        inputs: ['cdkTrapFocus', 'cdkTrapFocusAutoCapture'],
        exportAs: ['cdkTrapFocus'],
      },
      {
        kind: 'component',
        type: MatDatetimepickerCalendarComponent,
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
class MatDatetimepickerComponent {
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
    { token: i4$1.Overlay },
    { token: i0.NgZone },
    { token: i0.ViewContainerRef },
    { token: MAT_DATEPICKER_SCROLL_STRATEGY },
    { token: DatetimeAdapter, optional: true },
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
      { type: i4$1.Overlay },
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
        type: DatetimeAdapter,
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

// eslint-disable  @typescript-eslint/no-use-before-define
const MAT_DATETIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatDatetimepickerInputDirective),
  multi: true,
};
const MAT_DATETIMEPICKER_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MatDatetimepickerInputDirective),
  multi: true,
};
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
class MatDatetimepickerInputEvent {
  constructor(target, targetElement) {
    this.target = target;
    this.targetElement = targetElement;
    this.value = this.target.value;
  }
}
/** Directive used to connect an input to a MatDatepicker. */
class MatDatetimepickerInputDirective {
  constructor(_elementRef, _dateAdapter, _dateFormats, _formField) {
    this._elementRef = _elementRef;
    this._dateAdapter = _dateAdapter;
    this._dateFormats = _dateFormats;
    this._formField = _formField;
    /** Emits when a `change` event is fired on this `<input>`. */
    this.dateChange = new EventEmitter();
    /** Emits when an `input` event is fired on this `<input>`. */
    this.dateInput = new EventEmitter();
    /** Emits when the value changes (either due to user input or programmatic change). */
    this._valueChange = new EventEmitter();
    /** Emits when the disabled state has changed */
    this._disabledChange = new EventEmitter();
    this._datepickerSubscription = Subscription.EMPTY;
    this._localeSubscription = Subscription.EMPTY;
    /** Whether the last value set on the input was valid. */
    this._lastValueValid = false;
    this._onTouched = () => {};
    this._cvaOnChange = () => {};
    this._validatorOnChange = () => {};
    /** The form control validator for whether the input parses. */
    this._parseValidator = () => {
      return this._lastValueValid
        ? null
        : {
            matDatepickerParse: { text: this._elementRef.nativeElement.value },
          };
    };
    /** The form control validator for the min date. */
    this._minValidator = (control) => {
      const controlValue = this._dateAdapter.getValidDateOrNull(
        this._dateAdapter.deserialize(control.value)
      );
      return !this.min ||
        !controlValue ||
        this._dateAdapter.compareDatetime(this.min, controlValue) <= 0
        ? null
        : { matDatepickerMin: { min: this.min, actual: controlValue } };
    };
    /** The form control validator for the max date. */
    this._maxValidator = (control) => {
      const controlValue = this._dateAdapter.getValidDateOrNull(
        this._dateAdapter.deserialize(control.value)
      );
      return !this.max ||
        !controlValue ||
        this._dateAdapter.compareDatetime(this.max, controlValue) >= 0
        ? null
        : { matDatepickerMax: { max: this.max, actual: controlValue } };
    };
    /** The form control validator for the date filter. */
    this._filterValidator = (control) => {
      const controlValue = this._dateAdapter.getValidDateOrNull(
        this._dateAdapter.deserialize(control.value)
      );
      return !this._dateFilter ||
        !controlValue ||
        this._dateFilter(controlValue, MatDatetimepickerFilterType.DATE)
        ? null
        : { matDatepickerFilter: true };
    };
    /** The combined form control validator for this input. */
    this._validator = Validators.compose([
      this._parseValidator,
      this._minValidator,
      this._maxValidator,
      this._filterValidator,
    ]);
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DatetimeAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('MAT_DATETIME_FORMATS');
    }
    // Update the displayed date when the locale changes.
    this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
      this.value = this.value;
    });
  }
  /** The datepicker that this input is associated with. */
  set matDatetimepicker(value) {
    this.registerDatepicker(value);
  }
  set matDatepickerFilter(filter) {
    this._dateFilter = filter;
    this._validatorOnChange();
  }
  /** The value of the input. */
  get value() {
    return this._value;
  }
  set value(value) {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._dateAdapter.getValidDateOrNull(value);
    const oldDate = this.value;
    this._value = value;
    this._formatValue(value);
    // use timeout to ensure the datetimepicker is instantiated and we get the correct format
    setTimeout(() => {
      if (!this._dateAdapter.sameDatetime(oldDate, value)) {
        this._valueChange.emit(value);
      }
    });
  }
  /** The minimum valid date. */
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value)
    );
    this._validatorOnChange();
  }
  /** The maximum valid date. */
  get max() {
    return this._max;
  }
  set max(value) {
    this._max = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value)
    );
    this._validatorOnChange();
  }
  /** Whether the datepicker-input is disabled. */
  get disabled() {
    return !!this._disabled;
  }
  set disabled(value) {
    const newValue = coerceBooleanProperty(value);
    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }
  }
  ngAfterContentInit() {
    if (this._datepicker) {
      this._datepickerSubscription = this._datepicker.selectedChanged.subscribe(
        (selected) => {
          this.value = selected;
          this._cvaOnChange(selected);
          this._onTouched();
          this.dateInput.emit(
            new MatDatetimepickerInputEvent(
              this,
              this._elementRef.nativeElement
            )
          );
          this.dateChange.emit(
            new MatDatetimepickerInputEvent(
              this,
              this._elementRef.nativeElement
            )
          );
        }
      );
    }
  }
  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
  }
  registerOnValidatorChange(fn) {
    this._validatorOnChange = fn;
  }
  validate(c) {
    return this._validator ? this._validator(c) : null;
  }
  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin() {
    return this._formField
      ? this._formField.getConnectedOverlayOrigin()
      : this._elementRef;
  }
  // Implemented as part of ControlValueAccessor
  writeValue(value) {
    this.value = value;
  }
  // Implemented as part of ControlValueAccessor
  registerOnChange(fn) {
    this._cvaOnChange = fn;
  }
  // Implemented as part of ControlValueAccessor
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  // Implemented as part of ControlValueAccessor
  setDisabledState(disabled) {
    this.disabled = disabled;
  }
  _onKeydown(event) {
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this._datepicker.open();
      event.preventDefault();
    }
  }
  _onInput(value) {
    let date = this._dateAdapter.parse(value, this.getParseFormat());
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._dateAdapter.getValidDateOrNull(date);
    this._value = date;
    this._cvaOnChange(date);
    this._valueChange.emit(date);
    this.dateInput.emit(
      new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement)
    );
  }
  _onChange() {
    this.dateChange.emit(
      new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement)
    );
  }
  /** Handles blur events on the input. */
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this._formatValue(this.value);
    }
    this._onTouched();
  }
  registerDatepicker(value) {
    if (value) {
      this._datepicker = value;
      this._datepicker._registerInput(this);
    }
  }
  getDisplayFormat() {
    switch (this._datepicker.type) {
      case 'date':
        return this._dateFormats.display.dateInput;
      case 'datetime':
        return this._dateFormats.display.datetimeInput;
      case 'time':
        return this._dateFormats.display.timeInput;
      case 'month':
        return this._dateFormats.display.monthInput;
    }
  }
  getParseFormat() {
    let parseFormat;
    switch (this._datepicker.type) {
      case 'date':
        parseFormat = this._dateFormats.parse.dateInput;
        break;
      case 'datetime':
        parseFormat = this._dateFormats.parse.datetimeInput;
        break;
      case 'time':
        parseFormat = this._dateFormats.parse.timeInput;
        break;
      case 'month':
        parseFormat = this._dateFormats.parse.monthInput;
        break;
    }
    if (!parseFormat) {
      parseFormat = this._dateFormats.parse.dateInput;
    }
    return parseFormat;
  }
  /** Formats a value and sets it on the input element. */
  _formatValue(value) {
    this._elementRef.nativeElement.value = value
      ? this._dateAdapter.format(value, this.getDisplayFormat())
      : '';
  }
}
/** @nocollapse */ MatDatetimepickerInputDirective.ɵfac = i0.ɵɵngDeclareFactory(
  {
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerInputDirective,
    deps: [
      { token: i0.ElementRef },
      { token: DatetimeAdapter, optional: true },
      { token: MAT_DATETIME_FORMATS, optional: true },
      { token: i2$1.MatFormField, optional: true },
    ],
    target: i0.ɵɵFactoryTarget.Directive,
  }
);
/** @nocollapse */ MatDatetimepickerInputDirective.ɵdir =
  i0.ɵɵngDeclareDirective({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerInputDirective,
    selector: 'input[matDatetimepicker]',
    inputs: {
      matDatetimepicker: 'matDatetimepicker',
      matDatepickerFilter: 'matDatepickerFilter',
      value: 'value',
      min: 'min',
      max: 'max',
      disabled: 'disabled',
    },
    outputs: { dateChange: 'dateChange', dateInput: 'dateInput' },
    host: {
      listeners: {
        focus: '_datepicker._handleFocus()',
        input: '_onInput($event.target.value)',
        change: '_onChange()',
        blur: '_onBlur()',
        keydown: '_onKeydown($event)',
      },
      properties: {
        'attr.aria-haspopup': 'true',
        'attr.aria-owns': '(_datepicker?.opened && _datepicker.id) || null',
        'attr.min': 'min ? _dateAdapter.toIso8601(min) : null',
        'attr.max': 'max ? _dateAdapter.toIso8601(max) : null',
        disabled: 'disabled',
      },
    },
    providers: [
      MAT_DATETIMEPICKER_VALUE_ACCESSOR,
      MAT_DATETIMEPICKER_VALIDATORS,
      {
        provide: MAT_INPUT_VALUE_ACCESSOR,
        useExisting: MatDatetimepickerInputDirective,
      },
    ],
    exportAs: ['matDatepickerInput'],
    ngImport: i0,
  });
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerInputDirective,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'input[matDatetimepicker]',
          providers: [
            MAT_DATETIMEPICKER_VALUE_ACCESSOR,
            MAT_DATETIMEPICKER_VALIDATORS,
            {
              provide: MAT_INPUT_VALUE_ACCESSOR,
              useExisting: MatDatetimepickerInputDirective,
            },
          ],
          host: {
            '[attr.aria-haspopup]': 'true',
            '[attr.aria-owns]':
              '(_datepicker?.opened && _datepicker.id) || null',
            '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
            '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
            '[disabled]': 'disabled',
            '(focus)': '_datepicker._handleFocus()',
            '(input)': '_onInput($event.target.value)',
            '(change)': '_onChange()',
            '(blur)': '_onBlur()',
            '(keydown)': '_onKeydown($event)',
          },
          exportAs: 'matDatepickerInput',
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      {
        type: DatetimeAdapter,
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
      {
        type: i2$1.MatFormField,
        decorators: [
          {
            type: Optional,
          },
        ],
      },
    ];
  },
  propDecorators: {
    dateChange: [
      {
        type: Output,
      },
    ],
    dateInput: [
      {
        type: Output,
      },
    ],
    matDatetimepicker: [
      {
        type: Input,
      },
    ],
    matDatepickerFilter: [
      {
        type: Input,
      },
    ],
    value: [
      {
        type: Input,
      },
    ],
    min: [
      {
        type: Input,
      },
    ],
    max: [
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

class MatDatetimepickerToggleComponent {
  constructor(_intl, _changeDetectorRef) {
    this._intl = _intl;
    this._changeDetectorRef = _changeDetectorRef;
    this._stateChanges = Subscription.EMPTY;
  }
  /** Whether the toggle button is disabled. */
  get disabled() {
    return this._disabled === undefined
      ? this.datetimepicker.disabled
      : !!this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }
  ngOnChanges(changes) {
    if (changes.datepicker) {
      this._watchStateChanges();
    }
  }
  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }
  ngAfterContentInit() {
    this._watchStateChanges();
  }
  _open(event) {
    if (this.datetimepicker && !this.disabled) {
      this.datetimepicker.open();
      event.stopPropagation();
    }
  }
  _watchStateChanges() {
    const datepickerDisabled = this.datetimepicker
      ? this.datetimepicker._disabledChange
      : scheduled([], asyncScheduler);
    const inputDisabled =
      this.datetimepicker && this.datetimepicker._datepickerInput
        ? this.datetimepicker._datepickerInput._disabledChange
        : scheduled([], asyncScheduler);
    this._stateChanges.unsubscribe();
    this._stateChanges = merge(
      this._intl.changes,
      datepickerDisabled,
      inputDisabled
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }
}
/** @nocollapse */ MatDatetimepickerToggleComponent.ɵfac =
  i0.ɵɵngDeclareFactory({
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerToggleComponent,
    deps: [{ token: i1$1.MatDatepickerIntl }, { token: i0.ChangeDetectorRef }],
    target: i0.ɵɵFactoryTarget.Component,
  });
/** @nocollapse */ MatDatetimepickerToggleComponent.ɵcmp =
  i0.ɵɵngDeclareComponent({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerToggleComponent,
    selector: 'mat-datetimepicker-toggle',
    inputs: { datetimepicker: ['for', 'datetimepicker'], disabled: 'disabled' },
    host: {
      listeners: { click: '_open($event)' },
      classAttribute: 'mat-datetimepicker-toggle',
    },
    exportAs: ['matDatetimepickerToggle'],
    usesOnChanges: true,
    ngImport: i0,
    template:
      '<button\r\n  [attr.aria-label]="_intl.openCalendarLabel"\r\n  [disabled]="disabled"\r\n  mat-icon-button\r\n  type="button"\r\n>\r\n  <mat-icon [ngSwitch]="datetimepicker.type">\r\n    <svg\r\n      *ngSwitchCase="\'time\'"\r\n      fill="currentColor"\r\n      focusable="false"\r\n      height="100%"\r\n      style="vertical-align: top"\r\n      viewBox="0 0 24 24"\r\n      width="100%"\r\n    >\r\n      <path\r\n        d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"\r\n      ></path>\r\n    </svg>\r\n    <svg\r\n      *ngSwitchCase="\'datetime\'"\r\n      fill="currentColor"\r\n      focusable="false"\r\n      height="100%"\r\n      style="vertical-align: top"\r\n      viewBox="0 0 24 24"\r\n      width="100%"\r\n    >\r\n      <path\r\n        d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z"\r\n      ></path>\r\n    </svg>\r\n    <svg\r\n      *ngSwitchDefault\r\n      fill="currentColor"\r\n      focusable="false"\r\n      height="100%"\r\n      style="vertical-align: top"\r\n      viewBox="0 0 24 24"\r\n      width="100%"\r\n    >\r\n      <path d="M0 0h24v24H0z" fill="none" />\r\n      <path\r\n        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"\r\n      />\r\n    </svg>\r\n  </mat-icon>\r\n</button>\r\n',
    dependencies: [
      {
        kind: 'directive',
        type: i2.NgSwitch,
        selector: '[ngSwitch]',
        inputs: ['ngSwitch'],
      },
      {
        kind: 'directive',
        type: i2.NgSwitchCase,
        selector: '[ngSwitchCase]',
        inputs: ['ngSwitchCase'],
      },
      {
        kind: 'directive',
        type: i2.NgSwitchDefault,
        selector: '[ngSwitchDefault]',
      },
      {
        kind: 'component',
        type: i4.MatButton,
        selector:
          'button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]',
        inputs: ['disabled', 'disableRipple', 'color'],
        exportAs: ['matButton'],
      },
      {
        kind: 'component',
        type: i5.MatIcon,
        selector: 'mat-icon',
        inputs: ['color', 'inline', 'svgIcon', 'fontSet', 'fontIcon'],
        exportAs: ['matIcon'],
      },
    ],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None,
  });
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerToggleComponent,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'mat-datetimepicker-toggle',
          host: {
            class: 'mat-datetimepicker-toggle',
            // Bind the `click` on the host, rather than the inner `button`, so that we can call `stopPropagation`
            // on it without affecting the user's `click` handlers. We need to stop it so that the input doesn't
            // get focused automatically by the form field (See https://github.com/angular/components/pull/21856).
            '(click)': '_open($event)',
          },
          exportAs: 'matDatetimepickerToggle',
          encapsulation: ViewEncapsulation.None,
          preserveWhitespaces: false,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<button\r\n  [attr.aria-label]="_intl.openCalendarLabel"\r\n  [disabled]="disabled"\r\n  mat-icon-button\r\n  type="button"\r\n>\r\n  <mat-icon [ngSwitch]="datetimepicker.type">\r\n    <svg\r\n      *ngSwitchCase="\'time\'"\r\n      fill="currentColor"\r\n      focusable="false"\r\n      height="100%"\r\n      style="vertical-align: top"\r\n      viewBox="0 0 24 24"\r\n      width="100%"\r\n    >\r\n      <path\r\n        d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"\r\n      ></path>\r\n    </svg>\r\n    <svg\r\n      *ngSwitchCase="\'datetime\'"\r\n      fill="currentColor"\r\n      focusable="false"\r\n      height="100%"\r\n      style="vertical-align: top"\r\n      viewBox="0 0 24 24"\r\n      width="100%"\r\n    >\r\n      <path\r\n        d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z"\r\n      ></path>\r\n    </svg>\r\n    <svg\r\n      *ngSwitchDefault\r\n      fill="currentColor"\r\n      focusable="false"\r\n      height="100%"\r\n      style="vertical-align: top"\r\n      viewBox="0 0 24 24"\r\n      width="100%"\r\n    >\r\n      <path d="M0 0h24v24H0z" fill="none" />\r\n      <path\r\n        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"\r\n      />\r\n    </svg>\r\n  </mat-icon>\r\n</button>\r\n',
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [{ type: i1$1.MatDatepickerIntl }, { type: i0.ChangeDetectorRef }];
  },
  propDecorators: {
    datetimepicker: [
      {
        type: Input,
        args: ['for'],
      },
    ],
    disabled: [
      {
        type: Input,
      },
    ],
  },
});

class MatDatetimepickerModule {}
/** @nocollapse */ MatDatetimepickerModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
/** @nocollapse */ MatDatetimepickerModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerModule,
  declarations: [
    MatDatetimepickerCalendarComponent,
    MatDatetimepickerCalendarBodyComponent,
    MatDatetimepickerClockComponent,
    MatDatetimepickerComponent,
    MatDatetimepickerToggleComponent,
    MatDatetimepickerInputDirective,
    MatDatetimepickerContentComponent,
    MatDatetimepickerMonthViewComponent,
    MatDatetimepickerYearViewComponent,
    MatDatetimepickerMultiYearViewComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    OverlayModule,
    A11yModule,
  ],
  exports: [
    MatDatetimepickerCalendarComponent,
    MatDatetimepickerCalendarBodyComponent,
    MatDatetimepickerClockComponent,
    MatDatetimepickerComponent,
    MatDatetimepickerToggleComponent,
    MatDatetimepickerInputDirective,
    MatDatetimepickerContentComponent,
    MatDatetimepickerMonthViewComponent,
    MatDatetimepickerYearViewComponent,
    MatDatetimepickerMultiYearViewComponent,
  ],
});
/** @nocollapse */ MatDatetimepickerModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerModule,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    OverlayModule,
    A11yModule,
  ],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [
            CommonModule,
            MatButtonModule,
            MatDialogModule,
            MatIconModule,
            OverlayModule,
            A11yModule,
          ],
          entryComponents: [MatDatetimepickerContentComponent],
          declarations: [
            MatDatetimepickerCalendarComponent,
            MatDatetimepickerCalendarBodyComponent,
            MatDatetimepickerClockComponent,
            MatDatetimepickerComponent,
            MatDatetimepickerToggleComponent,
            MatDatetimepickerInputDirective,
            MatDatetimepickerContentComponent,
            MatDatetimepickerMonthViewComponent,
            MatDatetimepickerYearViewComponent,
            MatDatetimepickerMultiYearViewComponent,
          ],
          exports: [
            MatDatetimepickerCalendarComponent,
            MatDatetimepickerCalendarBodyComponent,
            MatDatetimepickerClockComponent,
            MatDatetimepickerComponent,
            MatDatetimepickerToggleComponent,
            MatDatetimepickerInputDirective,
            MatDatetimepickerContentComponent,
            MatDatetimepickerMonthViewComponent,
            MatDatetimepickerYearViewComponent,
            MatDatetimepickerMultiYearViewComponent,
          ],
        },
      ],
    },
  ],
});

/**
 * Generated bundle index. Do not edit.
 */

export {
  CLOCK_INNER_RADIUS,
  CLOCK_OUTER_RADIUS,
  CLOCK_RADIUS,
  CLOCK_TICK_RADIUS,
  DatetimeAdapter,
  MAT_DATETIMEPICKER_VALIDATORS,
  MAT_DATETIMEPICKER_VALUE_ACCESSOR,
  MAT_DATETIME_FORMATS,
  MAT_NATIVE_DATETIME_FORMATS,
  MatDatetimepickerCalendarBodyComponent,
  MatDatetimepickerCalendarCell,
  MatDatetimepickerCalendarComponent,
  MatDatetimepickerClockComponent,
  MatDatetimepickerComponent,
  MatDatetimepickerContentComponent,
  MatDatetimepickerFilterType,
  MatDatetimepickerInputDirective,
  MatDatetimepickerInputEvent,
  MatDatetimepickerModule,
  MatDatetimepickerMonthViewComponent,
  MatDatetimepickerMultiYearViewComponent,
  MatDatetimepickerToggleComponent,
  MatDatetimepickerYearViewComponent,
  MatNativeDatetimeModule,
  NativeDatetimeAdapter,
  NativeDatetimeModule,
  getActiveOffset,
  isSameMultiYearView,
  yearsPerPage,
  yearsPerRow,
};
//# sourceMappingURL=cus-mat-datetimepicker-core.mjs.map
