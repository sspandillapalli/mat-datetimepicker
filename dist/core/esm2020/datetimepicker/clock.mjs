import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MatDatetimepickerFilterType } from './datetimepicker-filtertype';
import * as i0 from '@angular/core';
import * as i1 from '../adapter/datetime-adapter';
import * as i2 from '@angular/common';
export const CLOCK_RADIUS = 50;
export const CLOCK_INNER_RADIUS = 27.5;
export const CLOCK_OUTER_RADIUS = 41.25;
export const CLOCK_TICK_RADIUS = 7.0833;
/**
 * A clock that is used as part of the datepicker.
 * @docs-private
 */
export class MatDatetimepickerClockComponent {
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
    deps: [{ token: i0.ElementRef }, { token: i1.DatetimeAdapter }],
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
    return [{ type: i0.ElementRef }, { type: i1.DatetimeAdapter }];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9kYXRldGltZXBpY2tlci9jbG9jay50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmUvc3JjL2RhdGV0aW1lcGlja2VyL2Nsb2NrLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7O0FBRTFFLE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDL0IsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQztBQUN4QyxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUM7QUFJeEM7OztHQUdHO0FBVUgsTUFBTSxPQUFPLCtCQUErQjtJQW1CMUMsWUFDVSxRQUFvQixFQUNwQixRQUE0QjtRQUQ1QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBbEI3QixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDckMsc0RBQXNEO1FBQzVDLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQUssQ0FBQztRQUN2QyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBSyxDQUFDO1FBQ25ELHFEQUFxRDtRQUNyRCxXQUFNLEdBQWtCLEVBQUUsQ0FBQztRQUMzQixhQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUM3Qix5Q0FBeUM7UUFDekMsY0FBUyxHQUFZLElBQUksQ0FB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LEVBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQ3RDLEtBQUssQ0FDTixDQUFDO1NBQ0g7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5QyxDQUFDOzsrSUF2VlUsK0JBQStCO21JQUEvQiwrQkFBK0IsOGJDL0I1Qywrc0NBNkJBOzJGREVhLCtCQUErQjtrQkFUM0MsU0FBUzsrQkFDRSwwQkFBMEIsUUFHOUI7d0JBQ0osSUFBSSxFQUFFLE9BQU87d0JBQ2IsYUFBYSxFQUFFLDBCQUEwQjtxQkFDMUM7K0hBSVEsVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUksY0FBYztzQkFBdkIsTUFBTTtnQkFDRyxnQkFBZ0I7c0JBQXpCLE1BQU07Z0JBOEJILFVBQVU7c0JBRGIsS0FBSztnQkFxQkYsUUFBUTtzQkFEWCxLQUFLO2dCQWtCRixPQUFPO3NCQURWLEtBQUs7Z0JBZUYsT0FBTztzQkFEVixLQUFLO2dCQWFGLFNBQVM7c0JBRFosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGV0aW1lQWRhcHRlciB9IGZyb20gJy4uL2FkYXB0ZXIvZGF0ZXRpbWUtYWRhcHRlcic7XG5pbXBvcnQgeyBNYXREYXRldGltZXBpY2tlckZpbHRlclR5cGUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWZpbHRlcnR5cGUnO1xuXG5leHBvcnQgY29uc3QgQ0xPQ0tfUkFESVVTID0gNTA7XG5leHBvcnQgY29uc3QgQ0xPQ0tfSU5ORVJfUkFESVVTID0gMjcuNTtcbmV4cG9ydCBjb25zdCBDTE9DS19PVVRFUl9SQURJVVMgPSA0MS4yNTtcbmV4cG9ydCBjb25zdCBDTE9DS19USUNLX1JBRElVUyA9IDcuMDgzMztcblxuZXhwb3J0IHR5cGUgTWF0Q2xvY2tWaWV3ID0gJ2hvdXInIHwgJ21pbnV0ZSc7XG5cbi8qKlxuICogQSBjbG9jayB0aGF0IGlzIHVzZWQgYXMgcGFydCBvZiB0aGUgZGF0ZXBpY2tlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGV0aW1lcGlja2VyLWNsb2NrJyxcbiAgdGVtcGxhdGVVcmw6ICdjbG9jay5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2Nsb2NrLnNjc3MnXSxcbiAgaG9zdDoge1xuICAgIHJvbGU6ICdjbG9jaycsXG4gICAgJyhtb3VzZWRvd24pJzogJ19oYW5kbGVNb3VzZWRvd24oJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGV0aW1lcGlja2VyQ2xvY2tDb21wb25lbnQ8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgLyoqIEEgZnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXI6IChkYXRlOiBELCB0eXBlOiBNYXREYXRldGltZXBpY2tlckZpbHRlclR5cGUpID0+IGJvb2xlYW47XG4gIEBJbnB1dCgpIGludGVydmFsOiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSB0d2VsdmVob3VyOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgc2VsZWN0ZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG4gIEBPdXRwdXQoKSBhY3RpdmVEYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuICAvKiogSG91cnMgYW5kIE1pbnV0ZXMgcmVwcmVzZW50aW5nIHRoZSBjbG9jayB2aWV3LiAqL1xuICBfaG91cnM6IEFycmF5PE9iamVjdD4gPSBbXTtcbiAgX21pbnV0ZXM6IEFycmF5PE9iamVjdD4gPSBbXTtcbiAgLyoqIFdoZXRoZXIgdGhlIGNsb2NrIGlzIGluIGhvdXIgdmlldy4gKi9cbiAgX2hvdXJWaWV3OiBib29sZWFuID0gdHJ1ZTtcbiAgX3NlbGVjdGVkSG91cjogbnVtYmVyO1xuICBfc2VsZWN0ZWRNaW51dGU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfdGltZUNoYW5nZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBtb3VzZU1vdmVMaXN0ZW5lcjogYW55O1xuICBwcml2YXRlIG1vdXNlVXBMaXN0ZW5lcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfYWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+XG4gICkge1xuICAgIHRoaXMubW91c2VNb3ZlTGlzdGVuZXIgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgdGhpcy5faGFuZGxlTW91c2Vtb3ZlKGV2ZW50KTtcbiAgICB9O1xuICAgIHRoaXMubW91c2VVcExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5faGFuZGxlTW91c2V1cCgpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9hY3RpdmVEYXRlOiBEO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF0ZSB0byBkaXNwbGF5IGluIHRoaXMgY2xvY2sgdmlldy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhY3RpdmVEYXRlKCk6IEQge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVEYXRlO1xuICB9XG5cbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICBsZXQgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY2xhbXBEYXRlKFxuICAgICAgdmFsdWUsXG4gICAgICB0aGlzLm1pbkRhdGUsXG4gICAgICB0aGlzLm1heERhdGVcbiAgICApO1xuICAgIGlmICghdGhpcy5fYWRhcHRlci5zYW1lTWludXRlKG9sZEFjdGl2ZURhdGUsIHRoaXMuX2FjdGl2ZURhdGUpKSB7XG4gICAgICB0aGlzLl9pbml0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZCgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoXG4gICAgICB0aGlzLl9hZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKVxuICAgICk7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9zZWxlY3RlZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9taW5EYXRlOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkRhdGU7XG4gIH1cblxuICBzZXQgbWluRGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoXG4gICAgICB0aGlzLl9hZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9tYXhEYXRlOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21heERhdGU7XG4gIH1cblxuICBzZXQgbWF4RGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9tYXhEYXRlID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoXG4gICAgICB0aGlzLl9hZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKVxuICAgICk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2xvY2sgc2hvdWxkIGJlIHN0YXJ0ZWQgaW4gaG91ciBvciBtaW51dGUgdmlldy4gKi9cbiAgQElucHV0KClcbiAgc2V0IHN0YXJ0Vmlldyh2YWx1ZTogTWF0Q2xvY2tWaWV3KSB7XG4gICAgdGhpcy5faG91clZpZXcgPSB2YWx1ZSAhPSAnbWludXRlJztcbiAgfVxuXG4gIGdldCBfaGFuZCgpOiBhbnkge1xuICAgIGxldCBob3VyID0gdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgaWYgKHRoaXMudHdlbHZlaG91cikge1xuICAgICAgaWYgKGhvdXIgPT09IDApIHtcbiAgICAgICAgaG91ciA9IDI0O1xuICAgICAgfVxuICAgICAgdGhpcy5fc2VsZWN0ZWRIb3VyID0gaG91ciA+IDEyID8gaG91ciAtIDEyIDogaG91cjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRIb3VyID0gaG91cjtcbiAgICB9XG4gICAgdGhpcy5fc2VsZWN0ZWRNaW51dGUgPSB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpO1xuICAgIGxldCBkZWcgPSAwO1xuICAgIGxldCByYWRpdXMgPSBDTE9DS19PVVRFUl9SQURJVVM7XG4gICAgaWYgKHRoaXMuX2hvdXJWaWV3KSB7XG4gICAgICBsZXQgb3V0ZXIgPSB0aGlzLl9zZWxlY3RlZEhvdXIgPiAwICYmIHRoaXMuX3NlbGVjdGVkSG91ciA8IDEzO1xuICAgICAgcmFkaXVzID0gb3V0ZXIgPyBDTE9DS19PVVRFUl9SQURJVVMgOiBDTE9DS19JTk5FUl9SQURJVVM7XG4gICAgICBpZiAodGhpcy50d2VsdmVob3VyKSB7XG4gICAgICAgIHJhZGl1cyA9IENMT0NLX09VVEVSX1JBRElVUztcbiAgICAgIH1cbiAgICAgIGRlZyA9IE1hdGgucm91bmQodGhpcy5fc2VsZWN0ZWRIb3VyICogKDM2MCAvICgyNCAvIDIpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZyA9IE1hdGgucm91bmQodGhpcy5fc2VsZWN0ZWRNaW51dGUgKiAoMzYwIC8gNjApKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zZm9ybTogYHJvdGF0ZSgke2RlZ31kZWcpYCxcbiAgICAgIGhlaWdodDogYCR7cmFkaXVzfSVgLFxuICAgICAgJ21hcmdpbi10b3AnOiBgJHs1MCAtIHJhZGl1c30lYCxcbiAgICB9O1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGUgfHwgdGhpcy5fYWRhcHRlci50b2RheSgpO1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIG1vdXNlZG93biBldmVudHMgb24gdGhlIGNsb2NrIGJvZHkuICovXG4gIF9oYW5kbGVNb3VzZWRvd24oZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuX3RpbWVDaGFuZ2VkID0gZmFsc2U7XG4gICAgdGhpcy5zZXRUaW1lKGV2ZW50KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlTW92ZUxpc3RlbmVyKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm1vdXNlTW92ZUxpc3RlbmVyKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZVVwTGlzdGVuZXIpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5tb3VzZVVwTGlzdGVuZXIpO1xuICB9XG5cbiAgX2hhbmRsZU1vdXNlbW92ZShldmVudDogYW55KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFRpbWUoZXZlbnQpO1xuICB9XG5cbiAgX2hhbmRsZU1vdXNldXAoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZU1vdmVMaXN0ZW5lcik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5tb3VzZU1vdmVMaXN0ZW5lcik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2VVcExpc3RlbmVyKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMubW91c2VVcExpc3RlbmVyKTtcbiAgICBpZiAodGhpcy5fdGltZUNoYW5nZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdCh0aGlzLmFjdGl2ZURhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIGNsb2NrIHZpZXcuICovXG4gIHByaXZhdGUgX2luaXQoKSB7XG4gICAgdGhpcy5faG91cnMubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9taW51dGVzLmxlbmd0aCA9IDA7XG5cbiAgICBsZXQgaG91ck5hbWVzID0gdGhpcy5fYWRhcHRlci5nZXRIb3VyTmFtZXMoKTtcbiAgICBsZXQgbWludXRlTmFtZXMgPSB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZU5hbWVzKCk7XG5cbiAgICBpZiAodGhpcy50d2VsdmVob3VyKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGhvdXJOYW1lcy5sZW5ndGggLyAyICsgMTsgaSsrKSB7XG4gICAgICAgIGxldCByYWRpYW4gPSAoaSAvIDYpICogTWF0aC5QSTtcbiAgICAgICAgbGV0IHJhZGl1cyA9IENMT0NLX09VVEVSX1JBRElVUztcbiAgICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aCh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIGkgKyAxLFxuICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IGVuYWJsZWQgPVxuICAgICAgICAgICghdGhpcy5taW5EYXRlIHx8XG4gICAgICAgICAgICB0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1pbkRhdGUpID49IDApICYmXG4gICAgICAgICAgKCF0aGlzLm1heERhdGUgfHxcbiAgICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGV0aW1lKGRhdGUsIHRoaXMubWF4RGF0ZSkgPD0gMCk7XG4gICAgICAgIHRoaXMuX2hvdXJzLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiBpLFxuICAgICAgICAgIGRpc3BsYXlWYWx1ZTogaSA9PT0gMCA/ICcwMCcgOiBob3VyTmFtZXNbaV0sXG4gICAgICAgICAgZW5hYmxlZDogZW5hYmxlZCxcbiAgICAgICAgICB0b3A6IENMT0NLX1JBRElVUyAtIE1hdGguY29zKHJhZGlhbikgKiByYWRpdXMgLSBDTE9DS19USUNLX1JBRElVUyxcbiAgICAgICAgICBsZWZ0OiBDTE9DS19SQURJVVMgKyBNYXRoLnNpbihyYWRpYW4pICogcmFkaXVzIC0gQ0xPQ0tfVElDS19SQURJVVMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhvdXJOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgcmFkaWFuID0gKGkgLyA2KSAqIE1hdGguUEk7XG4gICAgICAgIGxldCBvdXRlciA9IGkgPiAwICYmIGkgPCAxMyxcbiAgICAgICAgICByYWRpdXMgPSBvdXRlciA/IENMT0NLX09VVEVSX1JBRElVUyA6IENMT0NLX0lOTkVSX1JBRElVUztcbiAgICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aCh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIGksXG4gICAgICAgICAgMFxuICAgICAgICApO1xuICAgICAgICBsZXQgZW5hYmxlZCA9XG4gICAgICAgICAgKCF0aGlzLm1pbkRhdGUgfHxcbiAgICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGV0aW1lKGRhdGUsIHRoaXMubWluRGF0ZSwgZmFsc2UpID49IDApICYmXG4gICAgICAgICAgKCF0aGlzLm1heERhdGUgfHxcbiAgICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGV0aW1lKGRhdGUsIHRoaXMubWF4RGF0ZSwgZmFsc2UpIDw9IDApICYmXG4gICAgICAgICAgKCF0aGlzLmRhdGVGaWx0ZXIgfHxcbiAgICAgICAgICAgIHRoaXMuZGF0ZUZpbHRlcihkYXRlLCBNYXREYXRldGltZXBpY2tlckZpbHRlclR5cGUuSE9VUikpO1xuICAgICAgICB0aGlzLl9ob3Vycy5wdXNoKHtcbiAgICAgICAgICB2YWx1ZTogaSxcbiAgICAgICAgICBkaXNwbGF5VmFsdWU6IGkgPT09IDAgPyAnMDAnIDogaG91ck5hbWVzW2ldLFxuICAgICAgICAgIGVuYWJsZWQ6IGVuYWJsZWQsXG4gICAgICAgICAgdG9wOiBDTE9DS19SQURJVVMgLSBNYXRoLmNvcyhyYWRpYW4pICogcmFkaXVzIC0gQ0xPQ0tfVElDS19SQURJVVMsXG4gICAgICAgICAgbGVmdDogQ0xPQ0tfUkFESVVTICsgTWF0aC5zaW4ocmFkaWFuKSAqIHJhZGl1cyAtIENMT0NLX1RJQ0tfUkFESVVTLFxuICAgICAgICAgIGZvbnRTaXplOiBpID4gMCAmJiBpIDwgMTMgPyAnJyA6ICc4MCUnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbnV0ZU5hbWVzLmxlbmd0aDsgaSArPSA1KSB7XG4gICAgICBsZXQgcmFkaWFuID0gKGkgLyAzMCkgKiBNYXRoLlBJO1xuICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgaVxuICAgICAgKTtcbiAgICAgIGxldCBlbmFibGVkID1cbiAgICAgICAgKCF0aGlzLm1pbkRhdGUgfHxcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1pbkRhdGUpID49IDApICYmXG4gICAgICAgICghdGhpcy5tYXhEYXRlIHx8XG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5jb21wYXJlRGF0ZXRpbWUoZGF0ZSwgdGhpcy5tYXhEYXRlKSA8PSAwKSAmJlxuICAgICAgICAoIXRoaXMuZGF0ZUZpbHRlciB8fFxuICAgICAgICAgIHRoaXMuZGF0ZUZpbHRlcihkYXRlLCBNYXREYXRldGltZXBpY2tlckZpbHRlclR5cGUuTUlOVVRFKSk7XG4gICAgICB0aGlzLl9taW51dGVzLnB1c2goe1xuICAgICAgICB2YWx1ZTogaSxcbiAgICAgICAgZGlzcGxheVZhbHVlOiBpID09PSAwID8gJzAwJyA6IG1pbnV0ZU5hbWVzW2ldLFxuICAgICAgICBlbmFibGVkOiBlbmFibGVkLFxuICAgICAgICB0b3A6XG4gICAgICAgICAgQ0xPQ0tfUkFESVVTIC1cbiAgICAgICAgICBNYXRoLmNvcyhyYWRpYW4pICogQ0xPQ0tfT1VURVJfUkFESVVTIC1cbiAgICAgICAgICBDTE9DS19USUNLX1JBRElVUyxcbiAgICAgICAgbGVmdDpcbiAgICAgICAgICBDTE9DS19SQURJVVMgK1xuICAgICAgICAgIE1hdGguc2luKHJhZGlhbikgKiBDTE9DS19PVVRFUl9SQURJVVMgLVxuICAgICAgICAgIENMT0NLX1RJQ0tfUkFESVVTLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBUaW1lXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgcHJpdmF0ZSBzZXRUaW1lKGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgdHJpZ2dlciA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgdHJpZ2dlclJlY3QgPSB0cmlnZ2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCB3aWR0aCA9IHRyaWdnZXIub2Zmc2V0V2lkdGg7XG4gICAgbGV0IGhlaWdodCA9IHRyaWdnZXIub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBwYWdlWCA9XG4gICAgICBldmVudC5wYWdlWCAhPT0gdW5kZWZpbmVkID8gZXZlbnQucGFnZVggOiBldmVudC50b3VjaGVzWzBdLnBhZ2VYO1xuICAgIGxldCBwYWdlWSA9XG4gICAgICBldmVudC5wYWdlWSAhPT0gdW5kZWZpbmVkID8gZXZlbnQucGFnZVkgOiBldmVudC50b3VjaGVzWzBdLnBhZ2VZO1xuICAgIGxldCB4ID0gd2lkdGggLyAyIC0gKHBhZ2VYIC0gdHJpZ2dlclJlY3QubGVmdCAtIHdpbmRvdy5wYWdlWE9mZnNldCk7XG4gICAgbGV0IHkgPSBoZWlnaHQgLyAyIC0gKHBhZ2VZIC0gdHJpZ2dlclJlY3QudG9wIC0gd2luZG93LnBhZ2VZT2Zmc2V0KTtcbiAgICBsZXQgcmFkaWFuID0gTWF0aC5hdGFuMigteCwgeSk7XG4gICAgbGV0IHVuaXQgPVxuICAgICAgTWF0aC5QSSAvICh0aGlzLl9ob3VyVmlldyA/IDYgOiB0aGlzLmludGVydmFsID8gMzAgLyB0aGlzLmludGVydmFsIDogMzApO1xuICAgIGxldCB6ID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIGxldCBvdXRlciA9XG4gICAgICB0aGlzLl9ob3VyVmlldyAmJlxuICAgICAgeiA+XG4gICAgICAgICh3aWR0aCAqIChDTE9DS19PVVRFUl9SQURJVVMgLyAxMDApICtcbiAgICAgICAgICB3aWR0aCAqIChDTE9DS19JTk5FUl9SQURJVVMgLyAxMDApKSAvXG4gICAgICAgICAgMjtcblxuICAgIGlmIChyYWRpYW4gPCAwKSB7XG4gICAgICByYWRpYW4gPSBNYXRoLlBJICogMiArIHJhZGlhbjtcbiAgICB9XG4gICAgbGV0IHZhbHVlID0gTWF0aC5yb3VuZChyYWRpYW4gLyB1bml0KTtcblxuICAgIGxldCBkYXRlO1xuICAgIGlmICh0aGlzLl9ob3VyVmlldykge1xuICAgICAgaWYgKHRoaXMudHdlbHZlaG91cikge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlID09PSAwID8gMTIgOiB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMTIpIHtcbiAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgPSBvdXRlclxuICAgICAgICAgID8gdmFsdWUgPT09IDBcbiAgICAgICAgICAgID8gMTJcbiAgICAgICAgICAgIDogdmFsdWVcbiAgICAgICAgICA6IHZhbHVlID09PSAwXG4gICAgICAgICAgPyAwXG4gICAgICAgICAgOiB2YWx1ZSArIDEyO1xuICAgICAgfVxuXG4gICAgICAvLyBEb24ndCBjbG9zZSB0aGUgaG91cnMgdmlldyBpZiBhbiBpbnZhbGlkIGhvdXIgaXMgY2xpY2tlZC5cbiAgICAgIGlmICghdGhpcy5faG91cnMuZmluZCgoaCkgPT4gaD8uWyd2YWx1ZSddID09PSB2YWx1ZSk/LlsnZW5hYmxlZCddKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFsdWUgKj0gdGhpcy5pbnRlcnZhbDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSA9PT0gNjApIHtcbiAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgfVxuXG4gICAgICAvLyBEb24ndCBjbG9zZSB0aGUgbWludXRlcyB2aWV3IGlmIGFuIGludmFsaWQgbWludXRlIGlzIGNsaWNrZWQuXG4gICAgICBpZiAoIXRoaXMuX21pbnV0ZXMuZmluZCgobSkgPT4gbT8uWyd2YWx1ZSddID09PSB2YWx1ZSk/LlsnZW5hYmxlZCddKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5fdGltZUNoYW5nZWQgPSB0cnVlO1xuICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGRhdGU7XG4gICAgdGhpcy5hY3RpdmVEYXRlQ2hhbmdlLmVtaXQodGhpcy5hY3RpdmVEYXRlKTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jbG9ja1wiPlxyXG4gIDxkaXYgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2xvY2stY2VudGVyXCI+PC9kaXY+XHJcbiAgPGRpdiBbbmdTdHlsZV09XCJfaGFuZFwiIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNsb2NrLWhhbmRcIj48L2Rpdj5cclxuICA8ZGl2IFtjbGFzcy5hY3RpdmVdPVwiX2hvdXJWaWV3XCIgY2xhc3M9XCJtYXQtZGF0ZXRpbWVwaWNrZXItY2xvY2staG91cnNcIj5cclxuICAgIDxkaXZcclxuICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgX2hvdXJzXCJcclxuICAgICAgW2NsYXNzLm1hdC1kYXRldGltZXBpY2tlci1jbG9jay1jZWxsLWRpc2FibGVkXT1cIiFpdGVtLmVuYWJsZWRcIlxyXG4gICAgICBbY2xhc3MubWF0LWRhdGV0aW1lcGlja2VyLWNsb2NrLWNlbGwtc2VsZWN0ZWRdPVwiX3NlbGVjdGVkSG91ciA9PT0gaXRlbS52YWx1ZVwiXHJcbiAgICAgIFtzdHlsZS5mb250U2l6ZV09XCJpdGVtLmZvbnRTaXplXCJcclxuICAgICAgW3N0eWxlLmxlZnRdPVwiaXRlbS5sZWZ0ICsgJyUnXCJcclxuICAgICAgW3N0eWxlLnRvcF09XCJpdGVtLnRvcCArICclJ1wiXHJcbiAgICAgIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNsb2NrLWNlbGxcIlxyXG4gICAgPlxyXG4gICAgICB7eyBpdGVtLmRpc3BsYXlWYWx1ZSB9fVxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBbY2xhc3MuYWN0aXZlXT1cIiFfaG91clZpZXdcIiBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jbG9jay1taW51dGVzXCI+XHJcbiAgICA8ZGl2XHJcbiAgICAgICpuZ0Zvcj1cImxldCBpdGVtIG9mIF9taW51dGVzXCJcclxuICAgICAgW2NsYXNzLm1hdC1kYXRldGltZXBpY2tlci1jbG9jay1jZWxsLWRpc2FibGVkXT1cIiFpdGVtLmVuYWJsZWRcIlxyXG4gICAgICBbY2xhc3MubWF0LWRhdGV0aW1lcGlja2VyLWNsb2NrLWNlbGwtc2VsZWN0ZWRdPVwiX3NlbGVjdGVkTWludXRlID09PSBpdGVtLnZhbHVlXCJcclxuICAgICAgW3N0eWxlLmxlZnRdPVwiaXRlbS5sZWZ0ICsgJyUnXCJcclxuICAgICAgW3N0eWxlLnRvcF09XCJpdGVtLnRvcCArICclJ1wiXHJcbiAgICAgIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNsb2NrLWNlbGxcIlxyXG4gICAgPlxyXG4gICAgICB7eyBpdGVtLmRpc3BsYXlWYWx1ZSB9fVxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG4iXX0=
