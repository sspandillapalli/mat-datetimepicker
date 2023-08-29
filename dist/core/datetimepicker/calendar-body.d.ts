import { EventEmitter } from '@angular/core';
import * as i0 from '@angular/core';
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export declare class MatDatetimepickerCalendarCell {
  value: number;
  displayValue: string;
  ariaLabel: string;
  enabled: boolean;
  constructor(
    value: number,
    displayValue: string,
    ariaLabel: string,
    enabled: boolean
  );
}
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
export declare class MatDatetimepickerCalendarBodyComponent {
  /** The label for the table. (e.g. "Jan 2017"). */
  label: string;
  /** The cells to display in the table. */
  rows: MatDatetimepickerCalendarCell[][];
  /** The value in the table that corresponds to today. */
  todayValue: number;
  /** The value in the table that is currently selected. */
  selectedValue: number;
  /** The minimum number of free cells needed to fit the label in the first row. */
  labelMinRequiredCells: number;
  /** The number of columns in the table. */
  numCols: number;
  /** Whether to allow selection of disabled cells. */
  allowDisabledSelection: boolean;
  /** The cell number of the active cell in the table. */
  activeCell: number;
  /** Emits when a new value is selected. */
  selectedValueChange: EventEmitter<number>;
  /** The number of blank cells to put at the beginning for the first row. */
  get _firstRowOffset(): number;
  _cellClicked(cell: MatDatetimepickerCalendarCell): void;
  _isActiveCell(rowIndex: number, colIndex: number): boolean;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerCalendarBodyComponent,
    never
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MatDatetimepickerCalendarBodyComponent,
    'tbody[matDatetimepickerCalendarBody]',
    never,
    {
      label: 'label';
      rows: 'rows';
      todayValue: 'todayValue';
      selectedValue: 'selectedValue';
      labelMinRequiredCells: 'labelMinRequiredCells';
      numCols: 'numCols';
      allowDisabledSelection: 'allowDisabledSelection';
      activeCell: 'activeCell';
    },
    { selectedValueChange: 'selectedValueChange' },
    never,
    never,
    false
  >;
}
