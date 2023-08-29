import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatetimepickerCalendarComponent } from './calendar';
import { MatDatetimepickerCalendarBodyComponent } from './calendar-body';
import { MatDatetimepickerClockComponent } from './clock';
import {
  MatDatetimepickerComponent,
  MatDatetimepickerContentComponent,
} from './datetimepicker';
import { MatDatetimepickerInputDirective } from './datetimepicker-input';
import { MatDatetimepickerToggleComponent } from './datetimepicker-toggle';
import { MatDatetimepickerMonthViewComponent } from './month-view';
import { MatDatetimepickerYearViewComponent } from './year-view';
import { MatDatetimepickerMultiYearViewComponent } from './multi-year-view';
import * as i0 from '@angular/core';
export class MatDatetimepickerModule {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvY29yZS9zcmMvZGF0ZXRpbWVwaWNrZXIvZGF0ZXRpbWVwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMxRCxPQUFPLEVBQ0wsMEJBQTBCLEVBQzFCLGlDQUFpQyxHQUNsQyxNQUFNLGtCQUFrQixDQUFDO0FBQzFCLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzNFLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDakUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7O0FBcUM1RSxNQUFNLE9BQU8sdUJBQXVCOzt1SUFBdkIsdUJBQXVCO3dJQUF2Qix1QkFBdUIsaUJBeEJoQyxrQ0FBa0M7UUFDbEMsc0NBQXNDO1FBQ3RDLCtCQUErQjtRQUMvQiwwQkFBMEI7UUFDMUIsZ0NBQWdDO1FBQ2hDLCtCQUErQjtRQUMvQixpQ0FBaUM7UUFDakMsbUNBQW1DO1FBQ25DLGtDQUFrQztRQUNsQyx1Q0FBdUMsYUFsQnZDLFlBQVk7UUFDWixlQUFlO1FBQ2YsZUFBZTtRQUNmLGFBQWE7UUFDYixhQUFhO1FBQ2IsVUFBVSxhQWdCVixrQ0FBa0M7UUFDbEMsc0NBQXNDO1FBQ3RDLCtCQUErQjtRQUMvQiwwQkFBMEI7UUFDMUIsZ0NBQWdDO1FBQ2hDLCtCQUErQjtRQUMvQixpQ0FBaUM7UUFDakMsbUNBQW1DO1FBQ25DLGtDQUFrQztRQUNsQyx1Q0FBdUM7d0lBRzlCLHVCQUF1QixZQWpDaEMsWUFBWTtRQUNaLGVBQWU7UUFDZixlQUFlO1FBQ2YsYUFBYTtRQUNiLGFBQWE7UUFDYixVQUFVOzJGQTRCRCx1QkFBdUI7a0JBbkNuQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixhQUFhO3dCQUNiLGFBQWE7d0JBQ2IsVUFBVTtxQkFDWDtvQkFDRCxlQUFlLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztvQkFDcEQsWUFBWSxFQUFFO3dCQUNaLGtDQUFrQzt3QkFDbEMsc0NBQXNDO3dCQUN0QywrQkFBK0I7d0JBQy9CLDBCQUEwQjt3QkFDMUIsZ0NBQWdDO3dCQUNoQywrQkFBK0I7d0JBQy9CLGlDQUFpQzt3QkFDakMsbUNBQW1DO3dCQUNuQyxrQ0FBa0M7d0JBQ2xDLHVDQUF1QztxQkFDeEM7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGtDQUFrQzt3QkFDbEMsc0NBQXNDO3dCQUN0QywrQkFBK0I7d0JBQy9CLDBCQUEwQjt3QkFDMUIsZ0NBQWdDO3dCQUNoQywrQkFBK0I7d0JBQy9CLGlDQUFpQzt3QkFDakMsbUNBQW1DO3dCQUNuQyxrQ0FBa0M7d0JBQ2xDLHVDQUF1QztxQkFDeEM7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBMTF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xyXG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xyXG5pbXBvcnQgeyBNYXREaWFsb2dNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5pbXBvcnQgeyBNYXRJY29uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XHJcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyJztcclxuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckJvZHlDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xyXG5pbXBvcnQgeyBNYXREYXRldGltZXBpY2tlckNsb2NrQ29tcG9uZW50IH0gZnJvbSAnLi9jbG9jayc7XHJcbmltcG9ydCB7XHJcbiAgTWF0RGF0ZXRpbWVwaWNrZXJDb21wb25lbnQsXHJcbiAgTWF0RGF0ZXRpbWVwaWNrZXJDb250ZW50Q29tcG9uZW50LFxyXG59IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXInO1xyXG5pbXBvcnQgeyBNYXREYXRldGltZXBpY2tlcklucHV0RGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1pbnB1dCc7XHJcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VyVG9nZ2xlQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci10b2dnbGUnO1xyXG5pbXBvcnQgeyBNYXREYXRldGltZXBpY2tlck1vbnRoVmlld0NvbXBvbmVudCB9IGZyb20gJy4vbW9udGgtdmlldyc7XHJcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VyWWVhclZpZXdDb21wb25lbnQgfSBmcm9tICcuL3llYXItdmlldyc7XHJcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VyTXVsdGlZZWFyVmlld0NvbXBvbmVudCB9IGZyb20gJy4vbXVsdGkteWVhci12aWV3JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gICAgTWF0RGlhbG9nTW9kdWxlLFxyXG4gICAgTWF0SWNvbk1vZHVsZSxcclxuICAgIE92ZXJsYXlNb2R1bGUsXHJcbiAgICBBMTF5TW9kdWxlLFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbTWF0RGF0ZXRpbWVwaWNrZXJDb250ZW50Q29tcG9uZW50XSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDb21wb25lbnQsXHJcbiAgICBNYXREYXRldGltZXBpY2tlckNhbGVuZGFyQm9keUNvbXBvbmVudCxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyQ2xvY2tDb21wb25lbnQsXHJcbiAgICBNYXREYXRldGltZXBpY2tlckNvbXBvbmVudCxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyVG9nZ2xlQ29tcG9uZW50LFxyXG4gICAgTWF0RGF0ZXRpbWVwaWNrZXJJbnB1dERpcmVjdGl2ZSxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyQ29udGVudENvbXBvbmVudCxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyTW9udGhWaWV3Q29tcG9uZW50LFxyXG4gICAgTWF0RGF0ZXRpbWVwaWNrZXJZZWFyVmlld0NvbXBvbmVudCxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyTXVsdGlZZWFyVmlld0NvbXBvbmVudCxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDb21wb25lbnQsXHJcbiAgICBNYXREYXRldGltZXBpY2tlckNhbGVuZGFyQm9keUNvbXBvbmVudCxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyQ2xvY2tDb21wb25lbnQsXHJcbiAgICBNYXREYXRldGltZXBpY2tlckNvbXBvbmVudCxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyVG9nZ2xlQ29tcG9uZW50LFxyXG4gICAgTWF0RGF0ZXRpbWVwaWNrZXJJbnB1dERpcmVjdGl2ZSxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyQ29udGVudENvbXBvbmVudCxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyTW9udGhWaWV3Q29tcG9uZW50LFxyXG4gICAgTWF0RGF0ZXRpbWVwaWNrZXJZZWFyVmlld0NvbXBvbmVudCxcclxuICAgIE1hdERhdGV0aW1lcGlja2VyTXVsdGlZZWFyVmlld0NvbXBvbmVudCxcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXRpbWVwaWNrZXJNb2R1bGUge31cclxuIl19
