import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import * as i0 from '@angular/core';
import * as i1 from '@angular/common';
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export class MatDatetimepickerCalendarCell {
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
export class MatDatetimepickerCalendarBodyComponent {
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
        type: i1.NgForOf,
        selector: '[ngFor][ngForOf]',
        inputs: ['ngForOf', 'ngForTrackBy', 'ngForTemplate'],
      },
      {
        kind: 'directive',
        type: i1.NgIf,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmUvc3JjL2RhdGV0aW1lcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9kYXRldGltZXBpY2tlci9jYWxlbmRhci1ib2R5Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04saUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDOzs7QUFFdkI7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLDZCQUE2QjtJQUN4QyxZQUNTLEtBQWEsRUFDYixZQUFvQixFQUNwQixTQUFpQixFQUNqQixPQUFnQjtRQUhoQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsaUJBQVksR0FBWixZQUFZLENBQVE7UUFDcEIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQ3RCLENBQUM7Q0FDTDtBQUVEOzs7R0FHRztBQVlILE1BQU0sT0FBTyxzQ0FBc0M7SUFYbkQ7UUEyQkUsMENBQTBDO1FBQ2pDLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFFckIsb0RBQW9EO1FBQzNDLDJCQUFzQixHQUFHLEtBQUssQ0FBQztRQUV4Qyx1REFBdUQ7UUFDOUMsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUV4QiwwQ0FBMEM7UUFDaEMsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztLQTBCNUQ7SUF4QkMsMkVBQTJFO0lBQzNFLElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO1lBQ3pELENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtZQUNwQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFtQztRQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqRCxPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsYUFBYSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDOUMsSUFBSSxVQUFVLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBRXBELHNFQUFzRTtRQUN0RSxJQUFJLFFBQVEsRUFBRTtZQUNaLFVBQVUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQ3BDO1FBRUQsT0FBTyxVQUFVLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN4QyxDQUFDOztzSkFuRFUsc0NBQXNDOzBJQUF0QyxzQ0FBc0MsdWJDckNuRCxneERBMkNBOzJGRE5hLHNDQUFzQztrQkFYbEQsU0FBUzsrQkFFRSxzQ0FBc0MsUUFHMUM7d0JBQ0osS0FBSyxFQUFFLGtDQUFrQztxQkFDMUMsaUJBQ2MsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTTs4QkFJdEMsS0FBSztzQkFBYixLQUFLO2dCQUdHLElBQUk7c0JBQVosS0FBSztnQkFHRyxVQUFVO3NCQUFsQixLQUFLO2dCQUdHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBR0cscUJBQXFCO3NCQUE3QixLQUFLO2dCQUdHLE9BQU87c0JBQWYsS0FBSztnQkFHRyxzQkFBc0I7c0JBQTlCLEtBQUs7Z0JBR0csVUFBVTtzQkFBbEIsS0FBSztnQkFHSSxtQkFBbUI7c0JBQTVCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLyoqXHJcbiAqIEFuIGludGVybmFsIGNsYXNzIHRoYXQgcmVwcmVzZW50cyB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGEgc2luZ2xlIGNhbGVuZGFyIGNlbGwuXHJcbiAqIEBkb2NzLXByaXZhdGVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNYXREYXRldGltZXBpY2tlckNhbGVuZGFyQ2VsbCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgdmFsdWU6IG51bWJlcixcclxuICAgIHB1YmxpYyBkaXNwbGF5VmFsdWU6IHN0cmluZyxcclxuICAgIHB1YmxpYyBhcmlhTGFiZWw6IHN0cmluZyxcclxuICAgIHB1YmxpYyBlbmFibGVkOiBib29sZWFuXHJcbiAgKSB7fVxyXG59XHJcblxyXG4vKipcclxuICogQW4gaW50ZXJuYWwgY29tcG9uZW50IHVzZWQgdG8gZGlzcGxheSBjYWxlbmRhciBkYXRhIGluIGEgdGFibGUuXHJcbiAqIEBkb2NzLXByaXZhdGVcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvY29tcG9uZW50LXNlbGVjdG9yXHJcbiAgc2VsZWN0b3I6ICd0Ym9keVttYXREYXRldGltZXBpY2tlckNhbGVuZGFyQm9keV0nLFxyXG4gIHRlbXBsYXRlVXJsOiAnY2FsZW5kYXItYm9keS5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnY2FsZW5kYXItYm9keS5zY3NzJ10sXHJcbiAgaG9zdDoge1xyXG4gICAgY2xhc3M6ICdtYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItYm9keScsXHJcbiAgfSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckJvZHlDb21wb25lbnQge1xyXG4gIC8qKiBUaGUgbGFiZWwgZm9yIHRoZSB0YWJsZS4gKGUuZy4gXCJKYW4gMjAxN1wiKS4gKi9cclxuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xyXG5cclxuICAvKiogVGhlIGNlbGxzIHRvIGRpc3BsYXkgaW4gdGhlIHRhYmxlLiAqL1xyXG4gIEBJbnB1dCgpIHJvd3M6IE1hdERhdGV0aW1lcGlja2VyQ2FsZW5kYXJDZWxsW11bXTtcclxuXHJcbiAgLyoqIFRoZSB2YWx1ZSBpbiB0aGUgdGFibGUgdGhhdCBjb3JyZXNwb25kcyB0byB0b2RheS4gKi9cclxuICBASW5wdXQoKSB0b2RheVZhbHVlOiBudW1iZXI7XHJcblxyXG4gIC8qKiBUaGUgdmFsdWUgaW4gdGhlIHRhYmxlIHRoYXQgaXMgY3VycmVudGx5IHNlbGVjdGVkLiAqL1xyXG4gIEBJbnB1dCgpIHNlbGVjdGVkVmFsdWU6IG51bWJlcjtcclxuXHJcbiAgLyoqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBmcmVlIGNlbGxzIG5lZWRlZCB0byBmaXQgdGhlIGxhYmVsIGluIHRoZSBmaXJzdCByb3cuICovXHJcbiAgQElucHV0KCkgbGFiZWxNaW5SZXF1aXJlZENlbGxzOiBudW1iZXI7XHJcblxyXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGNvbHVtbnMgaW4gdGhlIHRhYmxlLiAqL1xyXG4gIEBJbnB1dCgpIG51bUNvbHMgPSA3O1xyXG5cclxuICAvKiogV2hldGhlciB0byBhbGxvdyBzZWxlY3Rpb24gb2YgZGlzYWJsZWQgY2VsbHMuICovXHJcbiAgQElucHV0KCkgYWxsb3dEaXNhYmxlZFNlbGVjdGlvbiA9IGZhbHNlO1xyXG5cclxuICAvKiogVGhlIGNlbGwgbnVtYmVyIG9mIHRoZSBhY3RpdmUgY2VsbCBpbiB0aGUgdGFibGUuICovXHJcbiAgQElucHV0KCkgYWN0aXZlQ2VsbCA9IDA7XHJcblxyXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IHZhbHVlIGlzIHNlbGVjdGVkLiAqL1xyXG4gIEBPdXRwdXQoKSBzZWxlY3RlZFZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcblxyXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGJsYW5rIGNlbGxzIHRvIHB1dCBhdCB0aGUgYmVnaW5uaW5nIGZvciB0aGUgZmlyc3Qgcm93LiAqL1xyXG4gIGdldCBfZmlyc3RSb3dPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnJvd3MgJiYgdGhpcy5yb3dzLmxlbmd0aCAmJiB0aGlzLnJvd3NbMF0ubGVuZ3RoXHJcbiAgICAgID8gdGhpcy5udW1Db2xzIC0gdGhpcy5yb3dzWzBdLmxlbmd0aFxyXG4gICAgICA6IDA7XHJcbiAgfVxyXG5cclxuICBfY2VsbENsaWNrZWQoY2VsbDogTWF0RGF0ZXRpbWVwaWNrZXJDYWxlbmRhckNlbGwpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5hbGxvd0Rpc2FibGVkU2VsZWN0aW9uICYmICFjZWxsLmVuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZWxlY3RlZFZhbHVlQ2hhbmdlLmVtaXQoY2VsbC52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBfaXNBY3RpdmVDZWxsKHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGxldCBjZWxsTnVtYmVyID0gcm93SW5kZXggKiB0aGlzLm51bUNvbHMgKyBjb2xJbmRleDtcclxuXHJcbiAgICAvLyBBY2NvdW50IGZvciB0aGUgZmFjdCB0aGF0IHRoZSBmaXJzdCByb3cgbWF5IG5vdCBoYXZlIGFzIG1hbnkgY2VsbHMuXHJcbiAgICBpZiAocm93SW5kZXgpIHtcclxuICAgICAgY2VsbE51bWJlciAtPSB0aGlzLl9maXJzdFJvd09mZnNldDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2VsbE51bWJlciA9PT0gdGhpcy5hY3RpdmVDZWxsO1xyXG4gIH1cclxufVxyXG4iLCI8IS0tXHJcbiAgSWYgdGhlcmUncyBub3QgZW5vdWdoIHNwYWNlIGluIHRoZSBmaXJzdCByb3csIGNyZWF0ZSBhIHNlcGFyYXRlIGxhYmVsIHJvdy4gV2UgbWFyayB0aGlzIHJvdyBhc1xyXG4gIGFyaWEtaGlkZGVuIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBpdCB0byBiZSByZWFkIG91dCBhcyBvbmUgb2YgdGhlIHdlZWtzIGluIHRoZSBtb250aC5cclxuLS0+XHJcbjx0ciAqbmdJZj1cIl9maXJzdFJvd09mZnNldCA8IGxhYmVsTWluUmVxdWlyZWRDZWxsc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gIDx0ZCBbYXR0ci5jb2xzcGFuXT1cIm51bUNvbHNcIiBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci1ib2R5LWxhYmVsXCI+XHJcbiAgICB7eyBsYWJlbCB9fVxyXG4gIDwvdGQ+XHJcbjwvdHI+XHJcblxyXG48IS0tIENyZWF0ZSB0aGUgZmlyc3Qgcm93IHNlcGFyYXRlbHkgc28gd2UgY2FuIGluY2x1ZGUgYSBzcGVjaWFsIHNwYWNlciBjZWxsLiAtLT5cclxuPHRyICpuZ0Zvcj1cImxldCByb3cgb2Ygcm93czsgbGV0IHJvd0luZGV4ID0gaW5kZXhcIiByb2xlPVwicm93XCI+XHJcbiAgPCEtLVxyXG4gICAgV2UgbWFyayB0aGlzIGNlbGwgYXMgYXJpYS1oaWRkZW4gc28gaXQgZG9lc24ndCBnZXQgcmVhZCBvdXQgYXMgb25lIG9mIHRoZSBkYXlzIGluIHRoZSB3ZWVrLlxyXG4gIC0tPlxyXG4gIDx0ZFxyXG4gICAgKm5nSWY9XCJyb3dJbmRleCA9PT0gMCAmJiBfZmlyc3RSb3dPZmZzZXRcIlxyXG4gICAgW2F0dHIuY29sc3Bhbl09XCJfZmlyc3RSb3dPZmZzZXRcIlxyXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcclxuICAgIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNhbGVuZGFyLWJvZHktbGFiZWxcIlxyXG4gID5cclxuICAgIHt7IF9maXJzdFJvd09mZnNldCA+PSBsYWJlbE1pblJlcXVpcmVkQ2VsbHMgPyBsYWJlbCA6ICcnIH19XHJcbiAgPC90ZD5cclxuICA8dGRcclxuICAgIChjbGljayk9XCJfY2VsbENsaWNrZWQoaXRlbSlcIlxyXG4gICAgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygcm93OyBsZXQgY29sSW5kZXggPSBpbmRleFwiXHJcbiAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cIiFpdGVtLmVuYWJsZWQgfHwgbnVsbFwiXHJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIml0ZW0uYXJpYUxhYmVsXCJcclxuICAgIFtjbGFzcy5tYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItYm9keS1hY3RpdmVdPVwiX2lzQWN0aXZlQ2VsbChyb3dJbmRleCwgY29sSW5kZXgpXCJcclxuICAgIFtjbGFzcy5tYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItYm9keS1kaXNhYmxlZF09XCIhaXRlbS5lbmFibGVkXCJcclxuICAgIGNsYXNzPVwibWF0LWRhdGV0aW1lcGlja2VyLWNhbGVuZGFyLWJvZHktY2VsbFwiXHJcbiAgICByb2xlPVwiYnV0dG9uXCJcclxuICA+XHJcbiAgICA8ZGl2XHJcbiAgICAgIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwic2VsZWN0ZWRWYWx1ZSA9PT0gaXRlbS52YWx1ZVwiXHJcbiAgICAgIFtjbGFzcy5tYXQtZGF0ZXRpbWVwaWNrZXItY2FsZW5kYXItYm9keS1zZWxlY3RlZF09XCJzZWxlY3RlZFZhbHVlID09PSBpdGVtLnZhbHVlXCJcclxuICAgICAgW2NsYXNzLm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci1ib2R5LXRvZGF5XT1cInRvZGF5VmFsdWUgPT09IGl0ZW0udmFsdWVcIlxyXG4gICAgICBjbGFzcz1cIm1hdC1kYXRldGltZXBpY2tlci1jYWxlbmRhci1ib2R5LWNlbGwtY29udGVudFwiXHJcbiAgICA+XHJcbiAgICAgIHt7IGl0ZW0uZGlzcGxheVZhbHVlIH19XHJcbiAgICA8L2Rpdj5cclxuICA8L3RkPlxyXG48L3RyPlxyXG4iXX0=
