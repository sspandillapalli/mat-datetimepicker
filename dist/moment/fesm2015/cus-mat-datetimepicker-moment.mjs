import * as i0 from '@angular/core';
import { Injectable, Optional, Inject, NgModule } from '@angular/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateModule,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import {
  DatetimeAdapter,
  MAT_DATETIME_FORMATS,
} from 'cus-mat-datetimepicker/core';
import * as i1 from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment_ from 'moment';

const moment = 'default' in moment_ ? moment_['default'] : moment_;
function range(length, valueFunction) {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}
class MomentDatetimeAdapter extends DatetimeAdapter {
  constructor(matDateLocale, matMomentAdapterOptions, _delegate) {
    super(_delegate);
    this._useUtc = false;
    this.setLocale(matDateLocale || moment.locale());
    this._useUtc = matMomentAdapterOptions.useUtc;
  }
  setLocale(locale) {
    super.setLocale(locale);
    const momentLocaleData = moment.localeData(locale);
    this._localeData = {
      firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
      longMonths: momentLocaleData.months(),
      shortMonths: momentLocaleData.monthsShort(),
      dates: range(31, (i) => super.createDate(2017, 0, i + 1).format('D')),
      hours: range(24, (i) =>
        this.createDatetime(2017, 0, 1, i, 0).format('H')
      ),
      minutes: range(60, (i) =>
        this.createDatetime(2017, 0, 1, 1, i).format('m')
      ),
      longDaysOfWeek: momentLocaleData.weekdays(),
      shortDaysOfWeek: momentLocaleData.weekdaysShort(),
      narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
    };
  }
  getHour(date) {
    return super.clone(date).hour();
  }
  getMinute(date) {
    return super.clone(date).minute();
  }
  isInNextMonth(startDate, endDate) {
    const nextMonth = this.getDateInNextMonth(startDate);
    return super.sameMonthAndYear(nextMonth, endDate);
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
    // const result = moment({year, month, date, hour, minute}).locale(this.locale);
    let result = moment({ year, month, date, hour, minute });
    if (this._useUtc) {
      result = result.utc();
    }
    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }
    return result;
  }
  getFirstDateOfMonth(date) {
    return super.clone(date).startOf('month');
  }
  getHourNames() {
    return this._localeData.hours;
  }
  getMinuteNames() {
    return this._localeData.minutes;
  }
  addCalendarHours(date, hours) {
    return super.clone(date).add({ hours });
  }
  addCalendarMinutes(date, minutes) {
    return super.clone(date).add({ minutes });
  }
  deserialize(value) {
    return this._delegate.deserialize(value);
  }
  getDateInNextMonth(date) {
    return super.clone(date).date(1).add({ month: 1 });
  }
}
/** @nocollapse */ MomentDatetimeAdapter.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MomentDatetimeAdapter,
  deps: [
    { token: MAT_DATE_LOCALE, optional: true },
    { token: MAT_MOMENT_DATE_ADAPTER_OPTIONS, optional: true },
    { token: i1.DateAdapter },
  ],
  target: i0.ɵɵFactoryTarget.Injectable,
});
/** @nocollapse */ MomentDatetimeAdapter.ɵprov = i0.ɵɵngDeclareInjectable({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MomentDatetimeAdapter,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MomentDatetimeAdapter,
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
      {
        type: undefined,
        decorators: [
          {
            type: Optional,
          },
          {
            type: Inject,
            args: [MAT_MOMENT_DATE_ADAPTER_OPTIONS],
          },
        ],
      },
      { type: i1.DateAdapter },
    ];
  },
});

const MAT_MOMENT_DATETIME_FORMATS = {
  parse: {
    dateInput: 'L',
    monthInput: 'MMMM',
    timeInput: 'LT',
    datetimeInput: 'L LT',
  },
  display: {
    dateInput: 'L',
    monthInput: 'MMMM',
    datetimeInput: 'L LT',
    timeInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    popupHeaderDateLabel: 'ddd, DD MMM',
  },
};

class MomentDatetimeModule {}
/** @nocollapse */ MomentDatetimeModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MomentDatetimeModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
/** @nocollapse */ MomentDatetimeModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MomentDatetimeModule,
  imports: [MomentDateModule],
});
/** @nocollapse */ MomentDatetimeModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MomentDatetimeModule,
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: MomentDatetimeAdapter,
    },
  ],
  imports: [MomentDateModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MomentDatetimeModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [MomentDateModule],
          providers: [
            {
              provide: DatetimeAdapter,
              useClass: MomentDatetimeAdapter,
            },
          ],
        },
      ],
    },
  ],
});
class MatMomentDatetimeModule {}
/** @nocollapse */ MatMomentDatetimeModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatMomentDatetimeModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
/** @nocollapse */ MatMomentDatetimeModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatMomentDatetimeModule,
  imports: [MomentDatetimeModule, MatMomentDateModule],
});
/** @nocollapse */ MatMomentDatetimeModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatMomentDatetimeModule,
  providers: [
    { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS },
  ],
  imports: [MomentDatetimeModule, MatMomentDateModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatMomentDatetimeModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [MomentDatetimeModule, MatMomentDateModule],
          providers: [
            {
              provide: MAT_DATETIME_FORMATS,
              useValue: MAT_MOMENT_DATETIME_FORMATS,
            },
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
  MAT_MOMENT_DATETIME_FORMATS,
  MatMomentDatetimeModule,
  MomentDatetimeAdapter,
  MomentDatetimeModule,
};
//# sourceMappingURL=cus-mat-datetimepicker-moment.mjs.map
