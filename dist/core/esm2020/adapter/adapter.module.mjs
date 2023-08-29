import { NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { DatetimeAdapter } from './datetime-adapter';
import { MAT_DATETIME_FORMATS } from './datetime-formats';
import { NativeDatetimeAdapter } from './native-datetime-adapter';
import { MAT_NATIVE_DATETIME_FORMATS } from './native-datetime-formats';
import * as i0 from '@angular/core';
// eslint-disable  max-classes-per-file
export class NativeDatetimeModule {}
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
export class MatNativeDatetimeModule {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9hZGFwdGVyL2FkYXB0ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQUV4RSx1Q0FBdUM7QUFVdkMsTUFBTSxPQUFPLG9CQUFvQjs7b0lBQXBCLG9CQUFvQjtxSUFBcEIsb0JBQW9CLFlBUnJCLGdCQUFnQjtxSUFRZixvQkFBb0IsYUFQcEI7UUFDVDtZQUNFLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLFFBQVEsRUFBRSxxQkFBcUI7U0FDaEM7S0FDRixZQU5TLGdCQUFnQjsyRkFRZixvQkFBb0I7a0JBVGhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQzNCLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsZUFBZTs0QkFDeEIsUUFBUSxFQUFFLHFCQUFxQjt5QkFDaEM7cUJBQ0Y7aUJBQ0Y7O0FBU0QsTUFBTSxPQUFPLHVCQUF1Qjs7dUlBQXZCLHVCQUF1Qjt3SUFBdkIsdUJBQXVCLFlBUnZCLG9CQUFvQixFQUdDLG1CQUFtQjt3SUFLeEMsdUJBQXVCLGFBSnZCO1FBQ1QsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLDJCQUEyQixFQUFFO0tBQ3pFLFlBSFMsb0JBQW9CLEVBQUUsbUJBQW1COzJGQUt4Qyx1QkFBdUI7a0JBTm5DLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsbUJBQW1CLENBQUM7b0JBQ3BELFNBQVMsRUFBRTt3QkFDVCxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsMkJBQTJCLEVBQUU7cUJBQ3pFO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0TmF0aXZlRGF0ZU1vZHVsZSwgTmF0aXZlRGF0ZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xyXG5pbXBvcnQgeyBEYXRldGltZUFkYXB0ZXIgfSBmcm9tICcuL2RhdGV0aW1lLWFkYXB0ZXInO1xyXG5pbXBvcnQgeyBNQVRfREFURVRJTUVfRk9STUFUUyB9IGZyb20gJy4vZGF0ZXRpbWUtZm9ybWF0cyc7XHJcbmltcG9ydCB7IE5hdGl2ZURhdGV0aW1lQWRhcHRlciB9IGZyb20gJy4vbmF0aXZlLWRhdGV0aW1lLWFkYXB0ZXInO1xyXG5pbXBvcnQgeyBNQVRfTkFUSVZFX0RBVEVUSU1FX0ZPUk1BVFMgfSBmcm9tICcuL25hdGl2ZS1kYXRldGltZS1mb3JtYXRzJztcclxuXHJcbi8vIGVzbGludC1kaXNhYmxlICBtYXgtY2xhc3Nlcy1wZXItZmlsZVxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtOYXRpdmVEYXRlTW9kdWxlXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogRGF0ZXRpbWVBZGFwdGVyLFxyXG4gICAgICB1c2VDbGFzczogTmF0aXZlRGF0ZXRpbWVBZGFwdGVyLFxyXG4gICAgfSxcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmF0aXZlRGF0ZXRpbWVNb2R1bGUge31cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW05hdGl2ZURhdGV0aW1lTW9kdWxlLCBNYXROYXRpdmVEYXRlTW9kdWxlXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHsgcHJvdmlkZTogTUFUX0RBVEVUSU1FX0ZPUk1BVFMsIHVzZVZhbHVlOiBNQVRfTkFUSVZFX0RBVEVUSU1FX0ZPUk1BVFMgfSxcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTWF0TmF0aXZlRGF0ZXRpbWVNb2R1bGUge31cclxuIl19
