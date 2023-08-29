import { NgModule } from '@angular/core';
import {
  MatMomentDateModule,
  MomentDateModule,
} from '@angular/material-moment-adapter';
import {
  DatetimeAdapter,
  MAT_DATETIME_FORMATS,
} from 'cus-mat-datetimepicker/core';
import { MomentDatetimeAdapter } from './moment-datetime-adapter';
import { MAT_MOMENT_DATETIME_FORMATS } from './moment-datetime-formats';
import * as i0 from '@angular/core';
export * from './moment-datetime-adapter';
export * from './moment-datetime-formats';
export class MomentDatetimeModule {}
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
export class MatMomentDatetimeModule {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9tb21lbnQvc3JjL2FkYXB0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLGdCQUFnQixHQUNqQixNQUFNLGtDQUFrQyxDQUFDO0FBQzFDLE9BQU8sRUFDTCxlQUFlLEVBQ2Ysb0JBQW9CLEdBQ3JCLE1BQU0sNkJBQTZCLENBQUM7QUFDckMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7O0FBRXhFLGNBQWMsMkJBQTJCLENBQUM7QUFDMUMsY0FBYywyQkFBMkIsQ0FBQztBQVcxQyxNQUFNLE9BQU8sb0JBQW9COztvSUFBcEIsb0JBQW9CO3FJQUFwQixvQkFBb0IsWUFSckIsZ0JBQWdCO3FJQVFmLG9CQUFvQixhQVBwQjtRQUNUO1lBQ0UsT0FBTyxFQUFFLGVBQWU7WUFDeEIsUUFBUSxFQUFFLHFCQUFxQjtTQUNoQztLQUNGLFlBTlMsZ0JBQWdCOzJGQVFmLG9CQUFvQjtrQkFUaEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDM0IsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxlQUFlOzRCQUN4QixRQUFRLEVBQUUscUJBQXFCO3lCQUNoQztxQkFDRjtpQkFDRjs7QUFTRCxNQUFNLE9BQU8sdUJBQXVCOzt1SUFBdkIsdUJBQXVCO3dJQUF2Qix1QkFBdUIsWUFSdkIsb0JBQW9CLEVBR0MsbUJBQW1CO3dJQUt4Qyx1QkFBdUIsYUFKdkI7UUFDVCxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsMkJBQTJCLEVBQUU7S0FDekUsWUFIUyxvQkFBb0IsRUFBRSxtQkFBbUI7MkZBS3hDLHVCQUF1QjtrQkFObkMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxtQkFBbUIsQ0FBQztvQkFDcEQsU0FBUyxFQUFFO3dCQUNULEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSwyQkFBMkIsRUFBRTtxQkFDekU7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTWF0TW9tZW50RGF0ZU1vZHVsZSxcbiAgTW9tZW50RGF0ZU1vZHVsZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwtbW9tZW50LWFkYXB0ZXInO1xuaW1wb3J0IHtcbiAgRGF0ZXRpbWVBZGFwdGVyLFxuICBNQVRfREFURVRJTUVfRk9STUFUUyxcbn0gZnJvbSAnY3VzLW1hdC1kYXRldGltZXBpY2tlci9jb3JlJztcbmltcG9ydCB7IE1vbWVudERhdGV0aW1lQWRhcHRlciB9IGZyb20gJy4vbW9tZW50LWRhdGV0aW1lLWFkYXB0ZXInO1xuaW1wb3J0IHsgTUFUX01PTUVOVF9EQVRFVElNRV9GT1JNQVRTIH0gZnJvbSAnLi9tb21lbnQtZGF0ZXRpbWUtZm9ybWF0cyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbW9tZW50LWRhdGV0aW1lLWFkYXB0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9tb21lbnQtZGF0ZXRpbWUtZm9ybWF0cyc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNb21lbnREYXRlTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogRGF0ZXRpbWVBZGFwdGVyLFxuICAgICAgdXNlQ2xhc3M6IE1vbWVudERhdGV0aW1lQWRhcHRlcixcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNb21lbnREYXRldGltZU1vZHVsZSB7fVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTW9tZW50RGF0ZXRpbWVNb2R1bGUsIE1hdE1vbWVudERhdGVNb2R1bGVdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE1BVF9EQVRFVElNRV9GT1JNQVRTLCB1c2VWYWx1ZTogTUFUX01PTUVOVF9EQVRFVElNRV9GT1JNQVRTIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1vbWVudERhdGV0aW1lTW9kdWxlIHt9XG4iXX0=
