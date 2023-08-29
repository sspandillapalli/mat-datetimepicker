import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { first } from 'rxjs/operators';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MAT_DATETIME_FORMATS } from '../adapter/datetime-formats';
import { slideCalendar } from './datetimepicker-animations';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MatDatetimepickerFilterType } from './datetimepicker-filtertype';
import {
  getActiveOffset,
  isSameMultiYearView,
  yearsPerPage,
  yearsPerRow,
} from './multi-year-view';
import * as i0 from '@angular/core';
import * as i1 from '@angular/material/datepicker';
import * as i2 from '../adapter/datetime-adapter';
import * as i3 from '@angular/common';
import * as i4 from '@angular/material/button';
import * as i5 from '@angular/material/icon';
import * as i6 from './clock';
import * as i7 from './month-view';
import * as i8 from './year-view';
import * as i9 from './multi-year-view';
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
export class MatDatetimepickerCalendarComponent {
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
      { token: i1.MatDatepickerIntl },
      { token: i0.NgZone },
      { token: i2.DatetimeAdapter, optional: true },
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
        type: i3.NgIf,
        selector: '[ngIf]',
        inputs: ['ngIf', 'ngIfThen', 'ngIfElse'],
      },
      {
        kind: 'directive',
        type: i3.NgSwitch,
        selector: '[ngSwitch]',
        inputs: ['ngSwitch'],
      },
      {
        kind: 'directive',
        type: i3.NgSwitchCase,
        selector: '[ngSwitchCase]',
        inputs: ['ngSwitchCase'],
      },
      {
        kind: 'directive',
        type: i3.NgSwitchDefault,
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
        type: i6.MatDatetimepickerClockComponent,
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
        type: i7.MatDatetimepickerMonthViewComponent,
        selector: 'mat-datetimepicker-month-view',
        inputs: ['type', 'dateFilter', 'activeDate', 'selected'],
        outputs: ['_userSelection', 'selectedChange'],
      },
      {
        kind: 'component',
        type: i8.MatDatetimepickerYearViewComponent,
        selector: 'mat-datetimepicker-year-view',
        inputs: ['type', 'dateFilter', 'activeDate', 'selected'],
        outputs: ['_userSelection', 'selectedChange'],
      },
      {
        kind: 'component',
        type: i9.MatDatetimepickerMultiYearViewComponent,
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
      { type: i1.MatDatepickerIntl },
      { type: i0.NgZone },
      {
        type: i2.DatetimeAdapter,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9kYXRldGltZXBpY2tlci9jYWxlbmRhci50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmUvc3JjL2RhdGV0aW1lcGlja2VyL2NhbGVuZGFyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFakUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsb0JBQW9CLEdBRXJCLE1BQU0sNkJBQTZCLENBQUM7QUFFckMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTFFLE9BQU8sRUFDTCxlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLFlBQVksRUFDWixXQUFXLEdBQ1osTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7Ozs7Ozs7QUFJM0I7OztHQUdHO0FBZ0JILE1BQU0sT0FB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b0M7cUJBQ2xELGNBQ1csQ0FBQyxhQUFhLENBQUMsaUJBQ1osaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTTs7MEJBd0M1QyxRQUFROzswQkFDUixRQUFROzswQkFDUixNQUFNOzJCQUFDLG9CQUFvQjs0RUFyQ3BCLG1CQUFtQjtzQkFBNUIsTUFBTTtnQkFFRSxpQkFBaUI7c0JBQXpCLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLGtCQUFrQjtzQkFBMUIsS0FBSztnQkFDRyxrQkFBa0I7c0JBQTFCLEtBQUs7Z0JBQ0csaUJBQWlCO3NCQUF6QixLQUFLO2dCQUNHLGlCQUFpQjtzQkFBekIsS0FBSztnQkFDRyxzQkFBc0I7c0JBQTlCLEtBQUs7Z0JBQ0csc0JBQXNCO3NCQUE5QixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFFRyw0QkFBNEI7c0JBQXBDLEtBQUs7Z0JBRUksY0FBYztzQkFBdkIsTUFBTTtnQkFFRyxXQUFXO3NCQUFwQixNQUFNO2dCQWtDSCxJQUFJO3NCQURQLEtBQUs7Z0JBZ0JGLE9BQU87c0JBRFYsS0FBSztnQkFhRixRQUFRO3NCQURYLEtBQUs7Z0JBYUYsT0FBTztzQkFEVixLQUFLO2dCQWFGLE9BQU87c0JBRFYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgRU5URVIsXG4gIEhPTUUsXG4gIExFRlRfQVJST1csXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdERhdGVwaWNrZXJJbnRsIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGF0ZXBpY2tlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGF0ZXRpbWVBZGFwdGVyIH0gZnJvbSAnLi4vYWRhcHRlci9kYXRldGltZS1hZGFwdGVyJztcbmltcG9ydCB7XG4gIE1BVF9EQVRFVElNRV9GT1JNQVRTLFxuICBNYXREYXRldGltZUZvcm1hdHMsXG59IGZyb20gJy4uL2FkYXB0ZXIvZGF0ZXRpbWUtZm9ybWF0cyc7XG5pbXBvcnQgeyBNYXRDbG9ja1ZpZXcgfSBmcm9tICcuL2Nsb2NrJztcbmltcG9ydCB7IHNsaWRlQ2FsZW5kYXIgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWVycm9ycyc7XG5pbXBvcnQgeyBNYXREYXRldGltZXBpY2tlckZpbHRlclR5cGUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWZpbHRlcnR5cGUnO1xuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci10eXBlJztcbmltcG9ydCB7XG4gIGdldEFjdGl2ZU9mZnNldCxcbiAgaXNTYW1lTXVsdGlZZWFyVmlldyxcbiAgeWVhcnNQZXJQYWdlLFxuICB5ZWFyc1BlclJvdyxcbn0gZnJvbSAnLi9tdWx0aS15ZWFyLXZpZXcnO1xuXG5leHBvcnQgdHlwZSBNYXRDYWxlbmRhclZpZXcgPSAnY2xvY2snIHwgJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJztcblxuLyoqXG4gKiBBIGNhbGVuZGFyIHRoYXQgaXMgdXNlZCBhcyBwYXJ0IG9mIHRoZSBkYXRlcGlja2VyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FsZW5kYXIuc2NzcyddLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXJdJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdhcmlhTGFiZWwnLFxuICAgIHJvbGU6ICdkaWFsb2cnLFxuICAgIHRhYmluZGV4OiAnMCcsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW3NsaWRlQ2FsZW5kYXJdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckNvbXBvbmVudDxEPlxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveVxue1xuICBAT3V0cHV0KCkgY2xvc2VEYXRlVGltZVBpY2tlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAvKiogQWN0aXZlIG11bHRpIHllYXIgdmlldyB3aGVuIGNsaWNrIG9uIHllYXIuICovXG4gIEBJbnB1dCgpIG11bHRpWWVhclNlbGVjdG9yOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBzaG91bGQgYmUgc3RhcnRlZCBpbiBtb250aCBvciB5ZWFyIHZpZXcuICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogTWF0Q2FsZW5kYXJWaWV3ID0gJ21vbnRoJztcbiAgQElucHV0KCkgdHdlbHZlaG91cjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSB0aW1lSW50ZXJ2YWw6IG51bWJlciA9IDE7XG4gIC8qKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZmlsdGVyIHdoaWNoIGRhdGVzIGFyZSBzZWxlY3RhYmxlLiAqL1xuICBASW5wdXQoKSBkYXRlRmlsdGVyOiAoZGF0ZTogRCwgdHlwZTogTWF0RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlKSA9PiBib29sZWFuO1xuICBASW5wdXQoKSBhcmlhTGFiZWwgPSAnVXNlIGFycm93IGtleXMgdG8gbmF2aWdhdGUnO1xuICBASW5wdXQoKSBhcmlhTmV4dE1vbnRoTGFiZWwgPSAnTmV4dCBtb250aCc7XG4gIEBJbnB1dCgpIGFyaWFQcmV2TW9udGhMYWJlbCA9ICdQcmV2aW91cyBtb250aCc7XG4gIEBJbnB1dCgpIGFyaWFOZXh0WWVhckxhYmVsID0gJ05leHQgeWVhcic7XG4gIEBJbnB1dCgpIGFyaWFQcmV2WWVhckxhYmVsID0gJ1ByZXZpb3VzIHllYXInO1xuICBASW5wdXQoKSBhcmlhTmV4dE11bHRpWWVhckxhYmVsID0gJ05leHQgeWVhciByYW5nZSc7XG4gIEBJbnB1dCgpIGFyaWFQcmV2TXVsdGlZZWFyTGFiZWwgPSAnUHJldmlvdXMgeWVhciByYW5nZSc7XG4gIEBJbnB1dCgpIGNvbmZpcm1MYWJlbDogc3RyaW5nID0gJ09rJztcbiAgQElucHV0KCkgY2FuY2VsTGFiZWw6IHN0cmluZyA9ICdDYW5jZWwnO1xuICAvKiogUHJldmVudCB1c2VyIHRvIHNlbGVjdCBzYW1lIGRhdGUgdGltZSAqL1xuICBASW5wdXQoKSBwcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uID0gZmFsc2U7XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgc2VsZWN0ZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHZpZXcgaGFzIGJlZW4gY2hhbmdlZC4gKiovXG4gIEBPdXRwdXQoKSB2aWV3Q2hhbmdlZDogRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVmlldz4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJWaWV3PigpO1xuICBfQU1QTTogc3RyaW5nO1xuICBfY2xvY2tWaWV3OiBNYXRDbG9ja1ZpZXcgPSAnaG91cic7XG4gIF9jYWxlbmRhclN0YXRlOiBzdHJpbmc7XG4gIHByaXZhdGUgX2ludGxDaGFuZ2VzOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2NsYW1wZWRBY3RpdmVEYXRlOiBEO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfaW50bDogTWF0RGF0ZXBpY2tlckludGwsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfYWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfREFURVRJTUVfRk9STUFUUylcbiAgICBwcml2YXRlIF9kYXRlRm9ybWF0czogTWF0RGF0ZXRpbWVGb3JtYXRzLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICBpZiAoIXRoaXMuX2FkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRldGltZUFkYXB0ZXInKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignTUFUX0RBVEVUSU1FX0ZPUk1BVFMnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pbnRsQ2hhbmdlcyA9IF9pbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+XG4gICAgICBjaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF90eXBlOiBNYXREYXRldGltZXBpY2tlclR5cGUgPSAnZGF0ZSc7XG5cbiAgQElucHV0KClcbiAgZ2V0IHR5cGUoKTogTWF0RGF0ZXRpbWVwaWNrZXJUeXBlIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuXG4gIHNldCB0eXBlKHZhbHVlOiBNYXREYXRldGltZXBpY2tlclR5cGUpIHtcbiAgICB0aGlzLl90eXBlID0gdmFsdWUgfHwgJ2RhdGUnO1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICd5ZWFyJykge1xuICAgICAgdGhpcy5tdWx0aVllYXJTZWxlY3RvciA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc3RhcnRBdDogRCB8IG51bGw7XG5cbiAgLyoqIEEgZGF0ZSByZXByZXNlbnRpbmcgdGhlIHBlcmlvZCAobW9udGggb3IgeWVhcikgdG8gc3RhcnQgdGhlIGNhbGVuZGFyIGluLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RhcnRBdCgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0QXQ7XG4gIH1cblxuICBzZXQgc3RhcnRBdCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9zdGFydEF0ID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWluRGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9taW5EYXRlO1xuICB9XG5cbiAgc2V0IG1pbkRhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX21heERhdGU6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtYXhEYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4RGF0ZTtcbiAgfVxuXG4gIHNldCBtYXhEYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9hZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgYWN0aXZlIGRhdGUuIFRoaXMgZGV0ZXJtaW5lcyB3aGljaCB0aW1lIHBlcmlvZCBpcyBzaG93biBhbmQgd2hpY2ggZGF0ZSBpc1xuICAgKiBoaWdobGlnaHRlZCB3aGVuIHVzaW5nIGtleWJvYXJkIG5hdmlnYXRpb24uXG4gICAqL1xuICBnZXQgX2FjdGl2ZURhdGUoKTogRCB7XG4gICAgcmV0dXJuIHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlO1xuICB9XG5cbiAgc2V0IF9hY3RpdmVEYXRlKHZhbHVlOiBEKSB7XG4gICAgY29uc3Qgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlO1xuICAgIHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5jbGFtcERhdGUoXG4gICAgICB2YWx1ZSxcbiAgICAgIHRoaXMubWluRGF0ZSxcbiAgICAgIHRoaXMubWF4RGF0ZVxuICAgICk7XG4gICAgaWYgKFxuICAgICAgb2xkQWN0aXZlRGF0ZSAmJlxuICAgICAgdGhpcy5fY2xhbXBlZEFjdGl2ZURhdGUgJiZcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPT09ICdtb250aCcgJiZcbiAgICAgICF0aGlzLl9hZGFwdGVyLnNhbWVNb250aEFuZFllYXIob2xkQWN0aXZlRGF0ZSwgdGhpcy5fY2xhbXBlZEFjdGl2ZURhdGUpXG4gICAgKSB7XG4gICAgICBpZiAodGhpcy5fYWRhcHRlci5pc0luTmV4dE1vbnRoKG9sZEFjdGl2ZURhdGUsIHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlKSkge1xuICAgICAgICB0aGlzLmNhbGVuZGFyU3RhdGUoJ3JpZ2h0Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNhbGVuZGFyU3RhdGUoJ2xlZnQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2FsZW5kYXIgaXMgaW4gbW9udGggdmlldy4gKi9cbiAgX2N1cnJlbnRWaWV3OiBNYXRDYWxlbmRhclZpZXc7XG5cbiAgZ2V0IGN1cnJlbnRWaWV3KCk6IE1hdENhbGVuZGFyVmlldyB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRWaWV3O1xuICB9XG5cbiAgc2V0IGN1cnJlbnRWaWV3KHZpZXc6IE1hdENhbGVuZGFyVmlldykge1xuICAgIHRoaXMuX2N1cnJlbnRWaWV3ID0gdmlldztcbiAgICB0aGlzLnZpZXdDaGFuZ2VkLmVtaXQodmlldyk7XG4gIH1cblxuICAvKiogVGhlIGxhYmVsIGZvciB0aGUgY3VycmVudCBjYWxlbmRhciB2aWV3LiAqL1xuICBnZXQgX3llYXJMYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuX2FjdGl2ZURhdGUpO1xuICB9XG5cbiAgZ2V0IF9tb250aFllYXJMYWJlbCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3ID09PSAnbXVsdGkteWVhcicpIHtcbiAgICAgIC8vIFRoZSBvZmZzZXQgZnJvbSB0aGUgYWN0aXZlIHllYXIgdG8gdGhlIFwic2xvdFwiIGZvciB0aGUgc3RhcnRpbmcgeWVhciBpcyB0aGVcbiAgICAgIC8vICphY3R1YWwqIGZpcnN0IHJlbmRlcmVkIHllYXIgaW4gdGhlIG11bHRpLXllYXIgdmlldywgYW5kIHRoZSBsYXN0IHllYXIgaXNcbiAgICAgIC8vIGp1c3QgeWVhcnNQZXJQYWdlIC0gMSBhd2F5LlxuICAgICAgY29uc3QgYWN0aXZlWWVhciA9IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLl9hY3RpdmVEYXRlKTtcbiAgICAgIGNvbnN0IG1pblllYXJPZlBhZ2UgPVxuICAgICAgICBhY3RpdmVZZWFyIC1cbiAgICAgICAgZ2V0QWN0aXZlT2Zmc2V0KFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIsXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICB0aGlzLm1pbkRhdGUsXG4gICAgICAgICAgdGhpcy5tYXhEYXRlXG4gICAgICAgICk7XG4gICAgICBjb25zdCBtYXhZZWFyT2ZQYWdlID0gbWluWWVhck9mUGFnZSArIHllYXJzUGVyUGFnZSAtIDE7XG4gICAgICBjb25zdCBtaW5ZZWFyTmFtZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhck5hbWUoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZShtaW5ZZWFyT2ZQYWdlLCAwLCAxKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IG1heFllYXJOYW1lID0gdGhpcy5fYWRhcHRlci5nZXRZZWFyTmFtZShcbiAgICAgICAgdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRlKG1heFllYXJPZlBhZ2UsIDAsIDEpXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuX2ludGwuZm9ybWF0WWVhclJhbmdlKG1pblllYXJOYW1lLCBtYXhZZWFyTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFZpZXcgPT09ICdtb250aCdcbiAgICAgID8gdGhpcy5fYWRhcHRlci5nZXRNb250aE5hbWVzKCdsb25nJylbXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aCh0aGlzLl9hY3RpdmVEYXRlKVxuICAgICAgICBdXG4gICAgICA6IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhck5hbWUodGhpcy5fYWN0aXZlRGF0ZSk7XG4gIH1cblxuICBnZXQgX2RhdGVMYWJlbCgpOiBzdHJpbmcge1xuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdtb250aCc6XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmdldE1vbnRoTmFtZXMoJ2xvbmcnKVtcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuX2FjdGl2ZURhdGUpXG4gICAgICAgIF07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5mb3JtYXQoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5LnBvcHVwSGVhZGVyRGF0ZUxhYmVsXG4gICAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IF9ob3Vyc0xhYmVsKCk6IHN0cmluZyB7XG4gICAgbGV0IGhvdXIgPSB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5fYWN0aXZlRGF0ZSk7XG4gICAgaWYgKHRoaXMudHdlbHZlaG91cikge1xuICAgICAgaWYgKGhvdXIgPT09IDApIHtcbiAgICAgICAgaG91ciA9IDI0O1xuICAgICAgfVxuICAgICAgaG91ciA9IGhvdXIgPiAxMiA/IGhvdXIgLSAxMiA6IGhvdXI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl8yZGlnaXQoaG91cik7XG4gIH1cblxuICBnZXQgX21pbnV0ZXNMYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl8yZGlnaXQodGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5fYWN0aXZlRGF0ZSkpO1xuICB9XG5cbiAgZ2V0IF9hcmlhTGFiZWxOZXh0KCk6IHN0cmluZyB7XG4gICAgc3dpdGNoICh0aGlzLl9jdXJyZW50Vmlldykge1xuICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICByZXR1cm4gdGhpcy5hcmlhTmV4dE1vbnRoTGFiZWw7XG4gICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJpYU5leHRZZWFyTGFiZWw7XG4gICAgICBjYXNlICdtdWx0aS15ZWFyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJpYU5leHRNdWx0aVllYXJMYWJlbDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cblxuICBnZXQgX2FyaWFMYWJlbFByZXYoKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKHRoaXMuX2N1cnJlbnRWaWV3KSB7XG4gICAgICBjYXNlICdtb250aCc6XG4gICAgICAgIHJldHVybiB0aGlzLmFyaWFQcmV2TW9udGhMYWJlbDtcbiAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICByZXR1cm4gdGhpcy5hcmlhUHJldlllYXJMYWJlbDtcbiAgICAgIGNhc2UgJ211bHRpLXllYXInOlxuICAgICAgICByZXR1cm4gdGhpcy5hcmlhUHJldk11bHRpWWVhckxhYmVsO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEYXRlIGZpbHRlciBmb3IgdGhlIG1vbnRoIGFuZCB5ZWFyIHZpZXdzLiAqL1xuICBfZGF0ZUZpbHRlckZvclZpZXdzID0gKGRhdGU6IEQpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgISFkYXRlICYmXG4gICAgICAoIXRoaXMuZGF0ZUZpbHRlciB8fFxuICAgICAgICB0aGlzLmRhdGVGaWx0ZXIoZGF0ZSwgTWF0RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlLkRBVEUpKSAmJlxuICAgICAgKCF0aGlzLm1pbkRhdGUgfHwgdGhpcy5fYWRhcHRlci5jb21wYXJlRGF0ZShkYXRlLCB0aGlzLm1pbkRhdGUpID49IDApICYmXG4gICAgICAoIXRoaXMubWF4RGF0ZSB8fCB0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRlKGRhdGUsIHRoaXMubWF4RGF0ZSkgPD0gMClcbiAgICApO1xuICB9O1xuXG4gIG9uQ2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMuY2xvc2VEYXRlVGltZVBpY2tlci5lbWl0KG51bGwpO1xuICB9XG5cbiAgb25Db25maXJtKCk6IHZvaWQge1xuICAgIHRoaXMuY2xvc2VEYXRlVGltZVBpY2tlci5lbWl0KHRoaXMuX2FjdGl2ZURhdGUpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLnN0YXJ0QXQgfHwgdGhpcy5fYWRhcHRlci50b2RheSgpO1xuICAgIHRoaXMuX3NlbGVjdEFNUE0odGhpcy5fYWN0aXZlRGF0ZSk7XG4gICAgdGhpcy5fZm9jdXNBY3RpdmVDZWxsKCk7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3llYXInKSB7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gJ211bHRpLXllYXInO1xuICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnbW9udGgnKSB7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gJ3llYXInO1xuICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAndGltZScpIHtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPSAnY2xvY2snO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdGhpcy5zdGFydFZpZXcgfHwgJ21vbnRoJztcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9pbnRsQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgZGF0ZSBzZWxlY3Rpb24gaW4gdGhlIG1vbnRoIHZpZXcuICovXG4gIF9kYXRlU2VsZWN0ZWQoZGF0ZTogRCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICdkYXRlJykge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5fYWRhcHRlci5zYW1lRGF0ZShkYXRlLCB0aGlzLnNlbGVjdGVkKSB8fFxuICAgICAgICAhdGhpcy5wcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KGRhdGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hY3RpdmVEYXRlID0gZGF0ZTtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPSAnY2xvY2snO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIG1vbnRoIHNlbGVjdGlvbiBpbiB0aGUgeWVhciB2aWV3LiAqL1xuICBfbW9udGhTZWxlY3RlZChtb250aDogRCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuX2FkYXB0ZXIuc2FtZU1vbnRoQW5kWWVhcihtb250aCwgdGhpcy5zZWxlY3RlZCkgfHxcbiAgICAgICAgIXRoaXMucHJldmVudFNhbWVEYXRlVGltZVNlbGVjdGlvblxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdCh0aGlzLl9hZGFwdGVyLmdldEZpcnN0RGF0ZU9mTW9udGgobW9udGgpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IG1vbnRoO1xuICAgICAgdGhpcy5jdXJyZW50VmlldyA9ICdtb250aCc7XG4gICAgICB0aGlzLl9jbG9ja1ZpZXcgPSAnaG91cic7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgeWVhciBzZWxlY3Rpb24gaW4gdGhlIG11bHRpIHllYXIgdmlldy4gKi9cbiAgX3llYXJTZWxlY3RlZCh5ZWFyOiBEKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3llYXInKSB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLl9hZGFwdGVyLnNhbWVZZWFyKHllYXIsIHRoaXMuc2VsZWN0ZWQpIHx8XG4gICAgICAgICF0aGlzLnByZXZlbnRTYW1lRGF0ZVRpbWVTZWxlY3Rpb25cbiAgICAgICkge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHllYXIpLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgMSxcbiAgICAgICAgICAwLFxuICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KG5vcm1hbGl6ZWREYXRlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHllYXI7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gJ3llYXInO1xuICAgIH1cbiAgfVxuXG4gIF90aW1lU2VsZWN0ZWQoZGF0ZTogRCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jbG9ja1ZpZXcgIT09ICdtaW51dGUnKSB7XG4gICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fdXBkYXRlRGF0ZShkYXRlKTtcbiAgICAgIHRoaXMuX2Nsb2NrVmlldyA9ICdtaW51dGUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLl9hZGFwdGVyLnNhbWVEYXRldGltZShkYXRlLCB0aGlzLnNlbGVjdGVkKSB8fFxuICAgICAgICAhdGhpcy5wcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KGRhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vbkFjdGl2ZURhdGVDaGFuZ2UoZGF0ZTogRCkge1xuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSBkYXRlO1xuICB9XG5cbiAgX3VwZGF0ZURhdGUoZGF0ZTogRCk6IEQge1xuICAgIGlmICh0aGlzLnR3ZWx2ZWhvdXIpIHtcbiAgICAgIGNvbnN0IEhPVVIgPSB0aGlzLl9hZGFwdGVyLmdldEhvdXIoZGF0ZSk7XG4gICAgICBpZiAoSE9VUiA9PT0gMTIpIHtcbiAgICAgICAgaWYgKHRoaXMuX0FNUE0gPT09ICdBTScpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckhvdXJzKGRhdGUsIC0xMik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fQU1QTSA9PT0gJ1BNJykge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckhvdXJzKGRhdGUsIDEyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cblxuICBfc2VsZWN0QU1QTShkYXRlOiBEKSB7XG4gICAgaWYgKHRoaXMuX2FkYXB0ZXIuZ2V0SG91cihkYXRlKSA+IDExKSB7XG4gICAgICB0aGlzLl9BTVBNID0gJ1BNJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fQU1QTSA9ICdBTSc7XG4gICAgfVxuICB9XG5cbiAgX2FtcG1DbGlja2VkKHNvdXJjZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHNvdXJjZSA9PT0gdGhpcy5fQU1QTSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9BTVBNID0gc291cmNlO1xuICAgIGlmICh0aGlzLl9BTVBNID09PSAnQU0nKSB7XG4gICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckhvdXJzKHRoaXMuX2FjdGl2ZURhdGUsIC0xMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFySG91cnModGhpcy5fYWN0aXZlRGF0ZSwgMTIpO1xuICAgIH1cbiAgfVxuXG4gIF95ZWFyQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50eXBlID09PSAneWVhcicgfHwgdGhpcy5tdWx0aVllYXJTZWxlY3Rvcikge1xuICAgICAgdGhpcy5jdXJyZW50VmlldyA9ICdtdWx0aS15ZWFyJztcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50VmlldyA9ICd5ZWFyJztcbiAgfVxuXG4gIF9kYXRlQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50eXBlICE9PSAnbW9udGgnKSB7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gJ21vbnRoJztcbiAgICB9XG4gIH1cblxuICBfaG91cnNDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFZpZXcgPSAnY2xvY2snO1xuICAgIHRoaXMuX2Nsb2NrVmlldyA9ICdob3VyJztcbiAgfVxuXG4gIF9taW51dGVzQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRWaWV3ID0gJ2Nsb2NrJztcbiAgICB0aGlzLl9jbG9ja1ZpZXcgPSAnbWludXRlJztcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHVzZXIgY2xpY2tzIG9uIHRoZSBwcmV2aW91cyBidXR0b24uICovXG4gIF9wcmV2aW91c0NsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID09PSAnbW9udGgnXG4gICAgICAgID8gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLl9hY3RpdmVEYXRlLCAtMSlcbiAgICAgICAgOiB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9PT0gJ3llYXInID8gLTEgOiAteWVhcnNQZXJQYWdlXG4gICAgICAgICAgKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHVzZXIgY2xpY2tzIG9uIHRoZSBuZXh0IGJ1dHRvbi4gKi9cbiAgX25leHRDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuX2FjdGl2ZURhdGUgPVxuICAgICAgdGhpcy5jdXJyZW50VmlldyA9PT0gJ21vbnRoJ1xuICAgICAgICA/IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHModGhpcy5fYWN0aXZlRGF0ZSwgMSlcbiAgICAgICAgOiB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9PT0gJ3llYXInID8gMSA6IHllYXJzUGVyUGFnZVxuICAgICAgICAgICk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcHJldmlvdXMgcGVyaW9kIGJ1dHRvbiBpcyBlbmFibGVkLiAqL1xuICBfcHJldmlvdXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5taW5EYXRlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLm1pbkRhdGUgfHwgIXRoaXMuX2lzU2FtZVZpZXcodGhpcy5fYWN0aXZlRGF0ZSwgdGhpcy5taW5EYXRlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBuZXh0IHBlcmlvZCBidXR0b24gaXMgZW5hYmxlZC4gKi9cbiAgX25leHRFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5tYXhEYXRlIHx8ICF0aGlzLl9pc1NhbWVWaWV3KHRoaXMuX2FjdGl2ZURhdGUsIHRoaXMubWF4RGF0ZSk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlkb3duIGV2ZW50cyBvbiB0aGUgY2FsZW5kYXIgYm9keS4gKi9cbiAgX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBUT0RPKG1tYWxlcmJhKTogV2UgY3VycmVudGx5IGFsbG93IGtleWJvYXJkIG5hdmlnYXRpb24gdG8gZGlzYWJsZWQgZGF0ZXMsIGJ1dCBqdXN0IHByZXZlbnRcbiAgICAvLyBkaXNhYmxlZCBvbmVzIGZyb20gYmVpbmcgc2VsZWN0ZWQuIFRoaXMgbWF5IG5vdCBiZSBpZGVhbCwgd2Ugc2hvdWxkIGxvb2sgaW50byB3aGV0aGVyXG4gICAgLy8gbmF2aWdhdGlvbiBzaG91bGQgc2tpcCBvdmVyIGRpc2FibGVkIGRhdGVzLCBhbmQgaWYgc28sIGhvdyB0byBpbXBsZW1lbnQgdGhhdCBlZmZpY2llbnRseS5cbiAgICBpZiAodGhpcy5jdXJyZW50VmlldyA9PT0gJ21vbnRoJykge1xuICAgICAgdGhpcy5faGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bkluTW9udGhWaWV3KGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFZpZXcgPT09ICd5ZWFyJykge1xuICAgICAgdGhpcy5faGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bkluWWVhclZpZXcoZXZlbnQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VmlldyA9PT0gJ211bHRpLXllYXInKSB7XG4gICAgICB0aGlzLl9oYW5kbGVDYWxlbmRhckJvZHlLZXlkb3duSW5NdWx0aVllYXJWaWV3KGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bkluQ2xvY2tWaWV3KGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBfZm9jdXNBY3RpdmVDZWxsKCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGVcbiAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIF9jYWxlbmRhclN0YXRlRG9uZSgpIHtcbiAgICB0aGlzLl9jYWxlbmRhclN0YXRlID0gJyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdHdvIGRhdGVzIHJlcHJlc2VudCB0aGUgc2FtZSB2aWV3IGluIHRoZSBjdXJyZW50IHZpZXcgbW9kZSAobW9udGggb3IgeWVhcikuICovXG4gIHByaXZhdGUgX2lzU2FtZVZpZXcoZGF0ZTE6IEQsIGRhdGUyOiBEKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY3VycmVudFZpZXcgPT09ICdtb250aCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcihkYXRlMSkgPT09IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcihkYXRlMikgJiZcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aChkYXRlMSkgPT09IHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgoZGF0ZTIpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5jdXJyZW50VmlldyA9PT0gJ3llYXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5nZXRZZWFyKGRhdGUxKSA9PT0gdGhpcy5fYWRhcHRlci5nZXRZZWFyKGRhdGUyKTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlIHdlIGFyZSBpbiAnbXVsdGkteWVhcicgdmlldy5cbiAgICByZXR1cm4gaXNTYW1lTXVsdGlZZWFyVmlldyhcbiAgICAgIHRoaXMuX2FkYXB0ZXIsXG4gICAgICBkYXRlMSxcbiAgICAgIGRhdGUyLFxuICAgICAgdGhpcy5taW5EYXRlLFxuICAgICAgdGhpcy5tYXhEYXRlXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWRvd24gZXZlbnRzIG9uIHRoZSBjYWxlbmRhciBib2R5IHdoZW4gY2FsZW5kYXIgaXMgaW4gbW9udGggdmlldy4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bkluTW9udGhWaWV3KGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyRGF5cyh0aGlzLl9hY3RpdmVEYXRlLCAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKHRoaXMuX2FjdGl2ZURhdGUsIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyRGF5cyh0aGlzLl9hY3RpdmVEYXRlLCAtNyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSwgNyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckRheXMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAxIC0gdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuX2FjdGl2ZURhdGUpXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyRGF5cyhcbiAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TnVtRGF5c0luTW9udGgodGhpcy5fYWN0aXZlRGF0ZSkgLVxuICAgICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuX2FjdGl2ZURhdGUpXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX1VQOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gZXZlbnQuYWx0S2V5XG4gICAgICAgICAgPyB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgLTEpXG4gICAgICAgICAgOiB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHRoaXMuX2FjdGl2ZURhdGUsIC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBBR0VfRE9XTjpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IGV2ZW50LmFsdEtleVxuICAgICAgICAgID8gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX2FjdGl2ZURhdGUsIDEpXG4gICAgICAgICAgOiB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHRoaXMuX2FjdGl2ZURhdGUsIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICAgIGlmICh0aGlzLl9kYXRlRmlsdGVyRm9yVmlld3ModGhpcy5fYWN0aXZlRGF0ZSkpIHtcbiAgICAgICAgICB0aGlzLl9kYXRlU2VsZWN0ZWQodGhpcy5fYWN0aXZlRGF0ZSk7XG4gICAgICAgICAgLy8gUHJldmVudCB1bmV4cGVjdGVkIGRlZmF1bHQgYWN0aW9ucyBzdWNoIGFzIGZvcm0gc3VibWlzc2lvbi5cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIERvbid0IHByZXZlbnQgZGVmYXVsdCBvciBmb2N1cyBhY3RpdmUgY2VsbCBvbiBrZXlzIHRoYXQgd2UgZG9uJ3QgZXhwbGljaXRseSBoYW5kbGUuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IHVuZXhwZWN0ZWQgZGVmYXVsdCBhY3Rpb25zIHN1Y2ggYXMgZm9ybSBzdWJtaXNzaW9uLlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlkb3duIGV2ZW50cyBvbiB0aGUgY2FsZW5kYXIgYm9keSB3aGVuIGNhbGVuZGFyIGlzIGluIHllYXIgdmlldy4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bkluWWVhclZpZXcoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAtMVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHRoaXMuX2FjdGl2ZURhdGUsIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9wcmV2TW9udGhJblNhbWVDb2wodGhpcy5fYWN0aXZlRGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fbmV4dE1vbnRoSW5TYW1lQ29sKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAtdGhpcy5fYWRhcHRlci5nZXRNb250aCh0aGlzLl9hY3RpdmVEYXRlKVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyhcbiAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIDExIC0gdGhpcy5fYWRhcHRlci5nZXRNb250aCh0aGlzLl9hY3RpdmVEYXRlKVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyhcbiAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIGV2ZW50LmFsdEtleSA/IC0xMCA6IC0xXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICBldmVudC5hbHRLZXkgPyAxMCA6IDFcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICB0aGlzLl9tb250aFNlbGVjdGVkKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIERvbid0IHByZXZlbnQgZGVmYXVsdCBvciBmb2N1cyBhY3RpdmUgY2VsbCBvbiBrZXlzIHRoYXQgd2UgZG9uJ3QgZXhwbGljaXRseSBoYW5kbGUuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IHVuZXhwZWN0ZWQgZGVmYXVsdCBhY3Rpb25zIHN1Y2ggYXMgZm9ybSBzdWJtaXNzaW9uLlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlkb3duIGV2ZW50cyBvbiB0aGUgY2FsZW5kYXIgYm9keSB3aGVuIGNhbGVuZGFyIGlzIGluIG11bHRpLXllYXIgdmlldy4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bkluTXVsdGlZZWFyVmlldyhcbiAgICBldmVudDogS2V5Ym9hcmRFdmVudFxuICApOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLCAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgLXllYXJzUGVyUm93XG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgeWVhcnNQZXJSb3dcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAtZ2V0QWN0aXZlT2Zmc2V0KFxuICAgICAgICAgICAgdGhpcy5fYWRhcHRlcixcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgICB0aGlzLm1pbkRhdGUsXG4gICAgICAgICAgICB0aGlzLm1heERhdGVcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICB5ZWFyc1BlclBhZ2UgLVxuICAgICAgICAgICAgZ2V0QWN0aXZlT2Zmc2V0KFxuICAgICAgICAgICAgICB0aGlzLl9hZGFwdGVyLFxuICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgICAgICB0aGlzLm1pbkRhdGUsXG4gICAgICAgICAgICAgIHRoaXMubWF4RGF0ZVxuICAgICAgICAgICAgKSAtXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX1VQOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgZXZlbnQuYWx0S2V5ID8gLXllYXJzUGVyUGFnZSAqIDEwIDogLXllYXJzUGVyUGFnZVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9ET1dOOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgZXZlbnQuYWx0S2V5ID8geWVhcnNQZXJQYWdlICogMTAgOiB5ZWFyc1BlclBhZ2VcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICB0aGlzLl95ZWFyU2VsZWN0ZWQodGhpcy5fYWN0aXZlRGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gRG9uJ3QgcHJldmVudCBkZWZhdWx0IG9yIGZvY3VzIGFjdGl2ZSBjZWxsIG9uIGtleXMgdGhhdCB3ZSBkb24ndCBleHBsaWNpdGx5IGhhbmRsZS5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWRvd24gZXZlbnRzIG9uIHRoZSBjYWxlbmRhciBib2R5IHdoZW4gY2FsZW5kYXIgaXMgaW4gbW9udGggdmlldy4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bkluQ2xvY2tWaWV3KGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID1cbiAgICAgICAgICB0aGlzLl9jbG9ja1ZpZXcgPT09ICdob3VyJ1xuICAgICAgICAgICAgPyB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFySG91cnModGhpcy5fYWN0aXZlRGF0ZSwgMSlcbiAgICAgICAgICAgIDogdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1pbnV0ZXModGhpcy5fYWN0aXZlRGF0ZSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID1cbiAgICAgICAgICB0aGlzLl9jbG9ja1ZpZXcgPT09ICdob3VyJ1xuICAgICAgICAgICAgPyB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFySG91cnModGhpcy5fYWN0aXZlRGF0ZSwgLTEpXG4gICAgICAgICAgICA6IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNaW51dGVzKHRoaXMuX2FjdGl2ZURhdGUsIC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICB0aGlzLl90aW1lU2VsZWN0ZWQodGhpcy5fYWN0aXZlRGF0ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIERvbid0IHByZXZlbnQgZGVmYXVsdCBvciBmb2N1cyBhY3RpdmUgY2VsbCBvbiBrZXlzIHRoYXQgd2UgZG9uJ3QgZXhwbGljaXRseSBoYW5kbGUuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IHVuZXhwZWN0ZWQgZGVmYXVsdCBhY3Rpb25zIHN1Y2ggYXMgZm9ybSBzdWJtaXNzaW9uLlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBkYXRlIGZvciB0aGUgbW9udGggdGhhdCBjb21lcyBiZWZvcmUgdGhlIGdpdmVuIG1vbnRoIGluIHRoZSBzYW1lIGNvbHVtbiBpbiB0aGVcbiAgICogY2FsZW5kYXIgdGFibGUuXG4gICAqL1xuICBwcml2YXRlIF9wcmV2TW9udGhJblNhbWVDb2woZGF0ZTogRCk6IEQge1xuICAgIC8vIERldGVybWluZSBob3cgbWFueSBtb250aHMgdG8ganVtcCBmb3J3YXJkIGdpdmVuIHRoYXQgdGhlcmUgYXJlIDIgZW1wdHkgc2xvdHMgYXQgdGhlIGJlZ2lubmluZ1xuICAgIC8vIG9mIGVhY2ggeWVhci5cbiAgICBjb25zdCBpbmNyZW1lbnQgPVxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aChkYXRlKSA8PSA0XG4gICAgICAgID8gLTVcbiAgICAgICAgOiB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKGRhdGUpID49IDdcbiAgICAgICAgPyAtN1xuICAgICAgICA6IC0xMjtcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyhkYXRlLCBpbmNyZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgZGF0ZSBmb3IgdGhlIG1vbnRoIHRoYXQgY29tZXMgYWZ0ZXIgdGhlIGdpdmVuIG1vbnRoIGluIHRoZSBzYW1lIGNvbHVtbiBpbiB0aGVcbiAgICogY2FsZW5kYXIgdGFibGUuXG4gICAqL1xuICBwcml2YXRlIF9uZXh0TW9udGhJblNhbWVDb2woZGF0ZTogRCk6IEQge1xuICAgIC8vIERldGVybWluZSBob3cgbWFueSBtb250aHMgdG8ganVtcCBmb3J3YXJkIGdpdmVuIHRoYXQgdGhlcmUgYXJlIDIgZW1wdHkgc2xvdHMgYXQgdGhlIGJlZ2lubmluZ1xuICAgIC8vIG9mIGVhY2ggeWVhci5cbiAgICBjb25zdCBpbmNyZW1lbnQgPVxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aChkYXRlKSA8PSA0XG4gICAgICAgID8gN1xuICAgICAgICA6IHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgoZGF0ZSkgPj0gN1xuICAgICAgICA/IDVcbiAgICAgICAgOiAxMjtcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyhkYXRlLCBpbmNyZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxlbmRhclN0YXRlKGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fY2FsZW5kYXJTdGF0ZSA9IGRpcmVjdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgXzJkaWdpdChuOiBudW1iZXIpIHtcbiAgICByZXR1cm4gKCcwMCcgKyBuKS5zbGljZSgtMik7XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItaGVhZGVyXCI+XG4gIDxkaXZcbiAgICAoY2xpY2spPVwiX3llYXJDbGlja2VkKClcIlxuICAgICpuZ0lmPVwidHlwZSAhPT0gJ3RpbWUnXCJcbiAgICBbY2xhc3MuYWN0aXZlXT1cImN1cnJlbnRWaWV3ID09PSAneWVhcicgfHwgY3VycmVudFZpZXcgPT09ICdtdWx0aS15ZWFyJ1wiXG4gICAgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItaGVhZGVyLXllYXJcIlxuICAgIHJvbGU9XCJidXR0b25cIlxuICA+XG4gICAge3sgX3llYXJMYWJlbCB9fVxuICAgIDxtYXQtaWNvbiAqbmdJZj1cIm11bHRpWWVhclNlbGVjdG9yIHx8IHR5cGUgPT09ICd5ZWFyJ1wiXG4gICAgICA+YXJyb3dfZHJvcF9kb3duPC9tYXQtaWNvblxuICAgID5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItaGVhZGVyLWRhdGUtdGltZVwiPlxuICAgIDxzcGFuXG4gICAgICAoY2xpY2spPVwiX2RhdGVDbGlja2VkKClcIlxuICAgICAgKm5nSWY9XCJ0eXBlICE9PSAndGltZScgJiYgdHlwZSAhPT0gJ3llYXInXCJcbiAgICAgIFtjbGFzcy5hY3RpdmVdPVwiY3VycmVudFZpZXcgPT09ICdtb250aCdcIlxuICAgICAgW2NsYXNzLm5vdC1jbGlja2FibGVdPVwidHlwZSA9PT0gJ21vbnRoJ1wiXG4gICAgICBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci1oZWFkZXItZGF0ZVwiXG4gICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgID57eyBfZGF0ZUxhYmVsIH19PC9zcGFuXG4gICAgPlxuICAgIDxzcGFuXG4gICAgICAqbmdJZj1cInR5cGUuZW5kc1dpdGgoJ3RpbWUnKVwiXG4gICAgICBbY2xhc3MuYWN0aXZlXT1cImN1cnJlbnRWaWV3ID09PSAnY2xvY2snXCJcbiAgICAgIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNhbGVuZGFyLWhlYWRlci10aW1lXCJcbiAgICA+XG4gICAgICA8c3BhblxuICAgICAgICAoY2xpY2spPVwiX2hvdXJzQ2xpY2tlZCgpXCJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJfY2xvY2tWaWV3ID09PSAnaG91cidcIlxuICAgICAgICBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci1oZWFkZXItaG91cnNcIlxuICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgPnt7IF9ob3Vyc0xhYmVsIH19PC9zcGFuXG4gICAgICA+OjxzcGFuXG4gICAgICAgIChjbGljayk9XCJfbWludXRlc0NsaWNrZWQoKVwiXG4gICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiX2Nsb2NrVmlldyA9PT0gJ21pbnV0ZSdcIlxuICAgICAgICBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci1oZWFkZXItbWludXRlc1wiXG4gICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICA+e3sgX21pbnV0ZXNMYWJlbCB9fTwvc3BhblxuICAgICAgPlxuICAgICAgPGJyIC8+XG4gICAgICA8c3BhblxuICAgICAgICAqbmdJZj1cInR3ZWx2ZWhvdXJcIlxuICAgICAgICBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci1oZWFkZXItYW1wbS1jb250YWluZXJcIlxuICAgICAgPlxuICAgICAgICA8c3BhblxuICAgICAgICAgIChjbGljayk9XCJfYW1wbUNsaWNrZWQoJ0FNJylcIlxuICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiX0FNUE0gPT09ICdBTSdcIlxuICAgICAgICAgIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNhbGVuZGFyLWhlYWRlci1hbXBtXCJcbiAgICAgICAgICA+QU08L3NwYW5cbiAgICAgICAgPi88c3BhblxuICAgICAgICAgIChjbGljayk9XCJfYW1wbUNsaWNrZWQoJ1BNJylcIlxuICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiX0FNUE0gPT09ICdQTSdcIlxuICAgICAgICAgIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNhbGVuZGFyLWhlYWRlci1hbXBtXCJcbiAgICAgICAgICA+UE08L3NwYW5cbiAgICAgICAgPlxuICAgICAgPC9zcGFuPlxuICAgIDwvc3Bhbj5cbiAgPC9kaXY+XG48L2Rpdj5cbjxkaXYgW25nU3dpdGNoXT1cImN1cnJlbnRWaWV3XCIgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItY29udGVudFwiPlxuICA8ZGl2XG4gICAgKm5nSWY9XCJjdXJyZW50VmlldyA9PT0gJ21vbnRoJyB8fCBjdXJyZW50VmlldyA9PT0gJ3llYXInIHx8IGN1cnJlbnRWaWV3ID09PSAnbXVsdGkteWVhcidcIlxuICAgIGNsYXNzPVwibWF0LW1vbnRoLWNvbnRlbnRcIlxuICA+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci1jb250cm9sc1wiPlxuICAgICAgPGRpdlxuICAgICAgICAoY2xpY2spPVwiX3ByZXZpb3VzQ2xpY2tlZCgpXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCIhX3ByZXZpb3VzRW5hYmxlZCgpXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJfYXJpYUxhYmVsUHJldlwiXG4gICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCIhX3ByZXZpb3VzRW5hYmxlZCgpXCJcbiAgICAgICAgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItcHJldmlvdXMtYnV0dG9uXCJcbiAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICA+XG4gICAgICAgIDxzdmcgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyNFwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTUuNDEgNy40MUwxNCA2bC02IDYgNiA2IDEuNDEtMS40MUwxMC44MyAxMnpcIj48L3BhdGg+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIChAc2xpZGVDYWxlbmRhci5kb25lKT1cIl9jYWxlbmRhclN0YXRlRG9uZSgpXCJcbiAgICAgICAgW0BzbGlkZUNhbGVuZGFyXT1cIl9jYWxlbmRhclN0YXRlXCJcbiAgICAgICAgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItcGVyaW9kLWJ1dHRvblwiXG4gICAgICA+XG4gICAgICAgIDxzdHJvbmc+e3sgX21vbnRoWWVhckxhYmVsIH19PC9zdHJvbmc+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKGNsaWNrKT1cIl9uZXh0Q2xpY2tlZCgpXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCIhX25leHRFbmFibGVkKClcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9hcmlhTGFiZWxOZXh0XCJcbiAgICAgICAgW2NsYXNzLmRpc2FibGVkXT1cIiFfbmV4dEVuYWJsZWQoKVwiXG4gICAgICAgIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNhbGVuZGFyLW5leHQtYnV0dG9uXCJcbiAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICA+XG4gICAgICAgIDxzdmcgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyNFwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTAgNkw4LjU5IDcuNDEgMTMuMTcgMTJsLTQuNTggNC41OUwxMCAxOGw2LTZ6XCI+PC9wYXRoPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPG1hdC1kYXRldGltZXBpY2tlci1tb250aC12aWV3XG4gICAgKF91c2VyU2VsZWN0aW9uKT1cIm9uQ2FuY2VsKClcIlxuICAgIChzZWxlY3RlZENoYW5nZSk9XCJfZGF0ZVNlbGVjdGVkKCRldmVudClcIlxuICAgICpuZ1N3aXRjaENhc2U9XCInbW9udGgnXCJcbiAgICBbYWN0aXZlRGF0ZV09XCJfYWN0aXZlRGF0ZVwiXG4gICAgW2RhdGVGaWx0ZXJdPVwiX2RhdGVGaWx0ZXJGb3JWaWV3c1wiXG4gICAgW3NlbGVjdGVkXT1cInNlbGVjdGVkXCJcbiAgICBbdHlwZV09XCJ0eXBlXCJcbiAgPlxuICA8L21hdC1kYXRldGltZXBpY2tlci1tb250aC12aWV3PlxuICA8bWF0LWRhdGV0aW1lcGlja2VyLXllYXItdmlld1xuICAgIChfdXNlclNlbGVjdGlvbik9XCJvbkNhbmNlbCgpXCJcbiAgICAoc2VsZWN0ZWRDaGFuZ2UpPVwiX21vbnRoU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgKm5nU3dpdGNoQ2FzZT1cIid5ZWFyJ1wiXG4gICAgW2FjdGl2ZURhdGVdPVwiX2FjdGl2ZURhdGVcIlxuICAgIFtkYXRlRmlsdGVyXT1cIl9kYXRlRmlsdGVyRm9yVmlld3NcIlxuICAgIFtzZWxlY3RlZF09XCJzZWxlY3RlZFwiXG4gICAgW3R5cGVdPVwidHlwZVwiXG4gID5cbiAgPC9tYXQtZGF0ZXRpbWVwaWNrZXIteWVhci12aWV3PlxuICA8bWF0LWRhdGV0aW1lcGlja2VyLW11bHRpLXllYXItdmlld1xuICAgIChfdXNlclNlbGVjdGlvbik9XCJvbkNhbmNlbCgpXCJcbiAgICAoc2VsZWN0ZWRDaGFuZ2UpPVwiX3llYXJTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICAqbmdTd2l0Y2hDYXNlPVwiJ211bHRpLXllYXInXCJcbiAgICBbYWN0aXZlRGF0ZV09XCJfYWN0aXZlRGF0ZVwiXG4gICAgW2RhdGVGaWx0ZXJdPVwiX2RhdGVGaWx0ZXJGb3JWaWV3c1wiXG4gICAgW21heERhdGVdPVwibWF4RGF0ZVwiXG4gICAgW21pbkRhdGVdPVwibWluRGF0ZVwiXG4gICAgW3NlbGVjdGVkXT1cInNlbGVjdGVkXCJcbiAgICBbdHlwZV09XCJ0eXBlXCJcbiAgPlxuICA8L21hdC1kYXRldGltZXBpY2tlci1tdWx0aS15ZWFyLXZpZXc+XG4gIDxtYXQtZGF0ZXRpbWVwaWNrZXItY2xvY2tcbiAgICAoX3VzZXJTZWxlY3Rpb24pPVwib25DYW5jZWwoKVwiXG4gICAgKGFjdGl2ZURhdGVDaGFuZ2UpPVwiX29uQWN0aXZlRGF0ZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAoc2VsZWN0ZWRDaGFuZ2UpPVwiX3RpbWVTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICAqbmdTd2l0Y2hEZWZhdWx0XG4gICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZUZpbHRlclwiXG4gICAgW2ludGVydmFsXT1cInRpbWVJbnRlcnZhbFwiXG4gICAgW21heERhdGVdPVwibWF4RGF0ZVwiXG4gICAgW21pbkRhdGVdPVwibWluRGF0ZVwiXG4gICAgW3NlbGVjdGVkXT1cIl9hY3RpdmVEYXRlXCJcbiAgICBbc3RhcnRWaWV3XT1cIl9jbG9ja1ZpZXdcIlxuICAgIFt0d2VsdmVob3VyXT1cInR3ZWx2ZWhvdXJcIlxuICA+XG4gIDwvbWF0LWRhdGV0aW1lcGlja2VyLWNsb2NrPlxuICA8ZGl2IGNsYXNzPVwiYWN0aW9uLWJ1dHRvbnNcIj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiY2FuY2VsLWJ1dHRvblwiIG1hdC1yYWlzZWQtYnV0dG9uIChjbGljayk9XCJvbkNhbmNlbCgpXCI+XG4gICAgICB7e2NhbmNlbExhYmVsfX08L2J1dHRvblxuICAgID48YnV0dG9uXG4gICAgICBjbGFzcz1cImNvbmZpcm0tYnV0dG9uXCJcbiAgICAgIG1hdC1yYWlzZWQtYnV0dG9uXG4gICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgKGNsaWNrKT1cIm9uQ29uZmlybSgpXCJcbiAgICA+XG4gICAgICB7e2NvbmZpcm1MYWJlbH19XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=
