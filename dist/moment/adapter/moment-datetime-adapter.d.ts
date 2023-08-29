import { DateAdapter } from '@angular/material/core';
import { MatMomentDateAdapterOptions } from '@angular/material-moment-adapter';
import { DatetimeAdapter } from 'cus-mat-datetimepicker/core';
import { Moment } from 'moment';
import * as i0 from '@angular/core';
export declare class MomentDatetimeAdapter extends DatetimeAdapter<Moment> {
  private _localeData;
  private _useUtc;
  constructor(
    matDateLocale: string,
    matMomentAdapterOptions: MatMomentDateAdapterOptions,
    _delegate: DateAdapter<Moment>
  );
  setLocale(locale: string): void;
  getHour(date: Moment): number;
  getMinute(date: Moment): number;
  isInNextMonth(startDate: Moment, endDate: Moment): boolean;
  createDatetime(
    year: number,
    month: number,
    date: number,
    hour: number,
    minute: number
  ): Moment;
  getFirstDateOfMonth(date: Moment): Moment;
  getHourNames(): string[];
  getMinuteNames(): string[];
  addCalendarHours(date: Moment, hours: number): Moment;
  addCalendarMinutes(date: Moment, minutes: number): Moment;
  deserialize(value: any): Moment | null;
  private getDateInNextMonth;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MomentDatetimeAdapter,
    [{ optional: true }, { optional: true }, null]
  >;
  static ɵprov: i0.ɵɵInjectableDeclaration<MomentDatetimeAdapter>;
}
