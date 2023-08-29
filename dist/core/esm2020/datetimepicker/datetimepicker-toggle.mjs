import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { asyncScheduler, merge, scheduled, Subscription } from 'rxjs';
import { MatDatetimepickerComponent } from './datetimepicker';
import * as i0 from '@angular/core';
import * as i1 from '@angular/material/datepicker';
import * as i2 from '@angular/common';
import * as i3 from '@angular/material/button';
import * as i4 from '@angular/material/icon';
export class MatDatetimepickerToggleComponent {
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
    deps: [{ token: i1.MatDatepickerIntl }, { token: i0.ChangeDetectorRef }],
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
        type: i3.MatButton,
        selector:
          'button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]',
        inputs: ['disabled', 'disableRipple', 'color'],
        exportAs: ['matButton'],
      },
      {
        kind: 'component',
        type: i4.MatIcon,
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
    return [{ type: i1.MatDatepickerIntl }, { type: i0.ChangeDetectorRef }];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXItdG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZS9zcmMvZGF0ZXRpbWVwaWNrZXIvZGF0ZXRpbWVwaWNrZXItdG9nZ2xlLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZS9zcmMvZGF0ZXRpbWVwaWNrZXIvZGF0ZXRpbWVwaWNrZXItdG9nZ2xlLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULEtBQUssRUFJTCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0RSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7Ozs7O0FBaUI5RCxNQUFNLE9BQU8sZ0NBQWdDO0lBUTNDLFlBQ1MsS0FBd0IsRUFDdkIsa0JBQXFDO1FBRHRDLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFKdkMsa0JBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO0lBS3hDLENBQUM7SUFJSiw2Q0FBNkM7SUFDN0MsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFDakMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUTtZQUM5QixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtZQUN0QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBWTtRQUNoQixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0IsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxjQUFjO1lBQzVDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWU7WUFDckMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDbEMsTUFBTSxhQUFhLEdBQ2pCLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0I7WUFDekQsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsZUFBZTtZQUN0RCxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDbEIsa0JBQWtCLEVBQ2xCLGFBQWEsQ0FDZCxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDOztnSkEvRFUsZ0NBQWdDO29JQUFoQyxnQ0FBZ0MsMFNDL0I3QyxtM0RBaURBOzJGRGxCYSxnQ0FBZ0M7a0JBZjVDLFNBQVM7K0JBQ0UsMkJBQTJCLFFBRS9CO3dCQUNKLEtBQUssRUFBRSwyQkFBMkI7d0JBQ2xDLHNHQUFzRzt3QkFDdEcsb0dBQW9HO3dCQUNwRyxzR0FBc0c7d0JBQ3RHLFNBQVMsRUFBRSxlQUFlO3FCQUMzQixZQUNTLHlCQUF5QixpQkFDcEIsaUJBQWlCLENBQUMsSUFBSSx1QkFDaEIsS0FBSyxtQkFDVCx1QkFBdUIsQ0FBQyxNQUFNO3dJQU9qQyxjQUFjO3NCQUEzQixLQUFLO3VCQUFDLEtBQUs7Z0JBWVIsUUFBUTtzQkFEWCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29lcmNlQm9vbGVhblByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcclxuaW1wb3J0IHtcclxuICBBZnRlckNvbnRlbnRJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPbkNoYW5nZXMsXHJcbiAgT25EZXN0cm95LFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdERhdGVwaWNrZXJJbnRsIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGF0ZXBpY2tlcic7XHJcbmltcG9ydCB7IGFzeW5jU2NoZWR1bGVyLCBtZXJnZSwgc2NoZWR1bGVkLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWF0LWRhdGV0aW1lcGlja2VyLXRvZ2dsZScsXHJcbiAgdGVtcGxhdGVVcmw6ICdkYXRldGltZXBpY2tlci10b2dnbGUuaHRtbCcsXHJcbiAgaG9zdDoge1xyXG4gICAgY2xhc3M6ICdtYXQtZGF0ZXRpbWVwaWNrZXItdG9nZ2xlJyxcclxuICAgIC8vIEJpbmQgdGhlIGBjbGlja2Agb24gdGhlIGhvc3QsIHJhdGhlciB0aGFuIHRoZSBpbm5lciBgYnV0dG9uYCwgc28gdGhhdCB3ZSBjYW4gY2FsbCBgc3RvcFByb3BhZ2F0aW9uYFxyXG4gICAgLy8gb24gaXQgd2l0aG91dCBhZmZlY3RpbmcgdGhlIHVzZXIncyBgY2xpY2tgIGhhbmRsZXJzLiBXZSBuZWVkIHRvIHN0b3AgaXQgc28gdGhhdCB0aGUgaW5wdXQgZG9lc24ndFxyXG4gICAgLy8gZ2V0IGZvY3VzZWQgYXV0b21hdGljYWxseSBieSB0aGUgZm9ybSBmaWVsZCAoU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMTg1NikuXHJcbiAgICAnKGNsaWNrKSc6ICdfb3BlbigkZXZlbnQpJyxcclxuICB9LFxyXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXRpbWVwaWNrZXJUb2dnbGUnLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXREYXRldGltZXBpY2tlclRvZ2dsZUNvbXBvbmVudDxEPlxyXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3lcclxue1xyXG4gIC8qKiBEYXRlcGlja2VyIGluc3RhbmNlIHRoYXQgdGhlIGJ1dHRvbiB3aWxsIHRvZ2dsZS4gKi9cclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L25vLWlucHV0LXJlbmFtZVxyXG4gIEBJbnB1dCgnZm9yJykgZGF0ZXRpbWVwaWNrZXI6IE1hdERhdGV0aW1lcGlja2VyQ29tcG9uZW50PEQ+O1xyXG4gIHByaXZhdGUgX3N0YXRlQ2hhbmdlcyA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgX2ludGw6IE1hdERhdGVwaWNrZXJJbnRsLFxyXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXHJcbiAgKSB7fVxyXG5cclxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcclxuXHJcbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBidXR0b24gaXMgZGlzYWJsZWQuICovXHJcbiAgQElucHV0KClcclxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgPT09IHVuZGVmaW5lZFxyXG4gICAgICA/IHRoaXMuZGF0ZXRpbWVwaWNrZXIuZGlzYWJsZWRcclxuICAgICAgOiAhIXRoaXMuX2Rpc2FibGVkO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5kYXRlcGlja2VyKSB7XHJcbiAgICAgIHRoaXMuX3dhdGNoU3RhdGVDaGFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xyXG4gICAgdGhpcy5fd2F0Y2hTdGF0ZUNoYW5nZXMoKTtcclxuICB9XHJcblxyXG4gIF9vcGVuKGV2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuZGF0ZXRpbWVwaWNrZXIgJiYgIXRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgdGhpcy5kYXRldGltZXBpY2tlci5vcGVuKCk7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfd2F0Y2hTdGF0ZUNoYW5nZXMoKSB7XHJcbiAgICBjb25zdCBkYXRlcGlja2VyRGlzYWJsZWQgPSB0aGlzLmRhdGV0aW1lcGlja2VyXHJcbiAgICAgID8gdGhpcy5kYXRldGltZXBpY2tlci5fZGlzYWJsZWRDaGFuZ2VcclxuICAgICAgOiBzY2hlZHVsZWQoW10sIGFzeW5jU2NoZWR1bGVyKTtcclxuICAgIGNvbnN0IGlucHV0RGlzYWJsZWQgPVxyXG4gICAgICB0aGlzLmRhdGV0aW1lcGlja2VyICYmIHRoaXMuZGF0ZXRpbWVwaWNrZXIuX2RhdGVwaWNrZXJJbnB1dFxyXG4gICAgICAgID8gdGhpcy5kYXRldGltZXBpY2tlci5fZGF0ZXBpY2tlcklucHV0Ll9kaXNhYmxlZENoYW5nZVxyXG4gICAgICAgIDogc2NoZWR1bGVkKFtdLCBhc3luY1NjaGVkdWxlcik7XHJcblxyXG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMgPSBtZXJnZShcclxuICAgICAgdGhpcy5faW50bC5jaGFuZ2VzLFxyXG4gICAgICBkYXRlcGlja2VyRGlzYWJsZWQsXHJcbiAgICAgIGlucHV0RGlzYWJsZWRcclxuICAgICkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcclxuICB9XHJcbn1cclxuIiwiPGJ1dHRvblxyXG4gIFthdHRyLmFyaWEtbGFiZWxdPVwiX2ludGwub3BlbkNhbGVuZGFyTGFiZWxcIlxyXG4gIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXHJcbiAgbWF0LWljb24tYnV0dG9uXHJcbiAgdHlwZT1cImJ1dHRvblwiXHJcbj5cclxuICA8bWF0LWljb24gW25nU3dpdGNoXT1cImRhdGV0aW1lcGlja2VyLnR5cGVcIj5cclxuICAgIDxzdmdcclxuICAgICAgKm5nU3dpdGNoQ2FzZT1cIid0aW1lJ1wiXHJcbiAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxyXG4gICAgICBmb2N1c2FibGU9XCJmYWxzZVwiXHJcbiAgICAgIGhlaWdodD1cIjEwMCVcIlxyXG4gICAgICBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiB0b3BcIlxyXG4gICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcclxuICAgICAgd2lkdGg9XCIxMDAlXCJcclxuICAgID5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBkPVwiTTEyLDIwQTgsOCAwIDAsMCAyMCwxMkE4LDggMCAwLDAgMTIsNEE4LDggMCAwLDAgNCwxMkE4LDggMCAwLDAgMTIsMjBNMTIsMkExMCwxMCAwIDAsMSAyMiwxMkExMCwxMCAwIDAsMSAxMiwyMkM2LjQ3LDIyIDIsMTcuNSAyLDEyQTEwLDEwIDAgMCwxIDEyLDJNMTIuNSw3VjEyLjI1TDE3LDE0LjkyTDE2LjI1LDE2LjE1TDExLDEzVjdIMTIuNVpcIlxyXG4gICAgICA+PC9wYXRoPlxyXG4gICAgPC9zdmc+XHJcbiAgICA8c3ZnXHJcbiAgICAgICpuZ1N3aXRjaENhc2U9XCInZGF0ZXRpbWUnXCJcclxuICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXHJcbiAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcclxuICAgICAgaGVpZ2h0PVwiMTAwJVwiXHJcbiAgICAgIHN0eWxlPVwidmVydGljYWwtYWxpZ246IHRvcFwiXHJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICB3aWR0aD1cIjEwMCVcIlxyXG4gICAgPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGQ9XCJNMTUsMTNIMTYuNVYxNS44MkwxOC45NCwxNy4yM0wxOC4xOSwxOC41M0wxNSwxNi42OVYxM00xOSw4SDVWMTlIOS42N0M5LjI0LDE4LjA5IDksMTcuMDcgOSwxNkE3LDcgMCAwLDEgMTYsOUMxNy4wNyw5IDE4LjA5LDkuMjQgMTksOS42N1Y4TTUsMjFDMy44OSwyMSAzLDIwLjEgMywxOVY1QzMsMy44OSAzLjg5LDMgNSwzSDZWMUg4VjNIMTZWMUgxOFYzSDE5QTIsMiAwIDAsMSAyMSw1VjExLjFDMjIuMjQsMTIuMzYgMjMsMTQuMDkgMjMsMTZBNyw3IDAgMCwxIDE2LDIzQzE0LjA5LDIzIDEyLjM2LDIyLjI0IDExLjEsMjFINU0xNiwxMS4xNUE0Ljg1LDQuODUgMCAwLDAgMTEuMTUsMTZDMTEuMTUsMTguNjggMTMuMzIsMjAuODUgMTYsMjAuODVBNC44NSw0Ljg1IDAgMCwwIDIwLjg1LDE2QzIwLjg1LDEzLjMyIDE4LjY4LDExLjE1IDE2LDExLjE1WlwiXHJcbiAgICAgID48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICAgIDxzdmdcclxuICAgICAgKm5nU3dpdGNoRGVmYXVsdFxyXG4gICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcclxuICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxyXG4gICAgICBoZWlnaHQ9XCIxMDAlXCJcclxuICAgICAgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogdG9wXCJcclxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgIHdpZHRoPVwiMTAwJVwiXHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDB6XCIgZmlsbD1cIm5vbmVcIiAvPlxyXG4gICAgICA8cGF0aFxyXG4gICAgICAgIGQ9XCJNMTkgM2gtMVYxaC0ydjJIOFYxSDZ2Mkg1Yy0xLjExIDAtMS45OS45LTEuOTkgMkwzIDE5YzAgMS4xLjg5IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMTZINVY4aDE0djExek03IDEwaDV2NUg3elwiXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2Zz5cclxuICA8L21hdC1pY29uPlxyXG48L2J1dHRvbj5cclxuIl19
