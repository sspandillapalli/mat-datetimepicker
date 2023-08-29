import {
  AfterContentInit,
  ChangeDetectorRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { MatDatetimepickerComponent } from './datetimepicker';
import * as i0 from '@angular/core';
export declare class MatDatetimepickerToggleComponent<D>
  implements AfterContentInit, OnChanges, OnDestroy
{
  _intl: MatDatepickerIntl;
  private _changeDetectorRef;
  /** Datepicker instance that the button will toggle. */
  datetimepicker: MatDatetimepickerComponent<D>;
  private _stateChanges;
  constructor(_intl: MatDatepickerIntl, _changeDetectorRef: ChangeDetectorRef);
  private _disabled;
  /** Whether the toggle button is disabled. */
  get disabled(): boolean;
  set disabled(value: boolean);
  ngOnChanges(changes: SimpleChanges): void;
  ngOnDestroy(): void;
  ngAfterContentInit(): void;
  _open(event: Event): void;
  private _watchStateChanges;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerToggleComponent<any>,
    never
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    MatDatetimepickerToggleComponent<any>,
    'mat-datetimepicker-toggle',
    ['matDatetimepickerToggle'],
    { datetimepicker: 'for'; disabled: 'disabled' },
    {},
    never,
    never,
    false
  >;
}
