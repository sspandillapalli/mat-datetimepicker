import {
  AfterContentInit,
  ElementRef,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MatDatetimeFormats } from '../adapter/datetime-formats';
import { MatDatetimepickerComponent } from './datetimepicker';
import { MatDatetimepickerFilterType } from './datetimepicker-filtertype';
import * as i0 from '@angular/core';
export declare const MAT_DATETIMEPICKER_VALUE_ACCESSOR: any;
export declare const MAT_DATETIMEPICKER_VALIDATORS: any;
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
export declare class MatDatetimepickerInputEvent<D> {
  target: MatDatetimepickerInputDirective<D>;
  targetElement: HTMLElement;
  /** The new value for the target datepicker input. */
  value: D | null;
  constructor(
    target: MatDatetimepickerInputDirective<D>,
    targetElement: HTMLElement
  );
}
/** Directive used to connect an input to a MatDatepicker. */
export declare class MatDatetimepickerInputDirective<D>
  implements AfterContentInit, ControlValueAccessor, OnDestroy, Validator
{
  private _elementRef;
  _dateAdapter: DatetimeAdapter<D>;
  private _dateFormats;
  private _formField;
  _datepicker: MatDatetimepickerComponent<D>;
  _dateFilter: (date: D | null, type: MatDatetimepickerFilterType) => boolean;
  /** Emits when a `change` event is fired on this `<input>`. */
  dateChange: EventEmitter<MatDatetimepickerInputEvent<D>>;
  /** Emits when an `input` event is fired on this `<input>`. */
  dateInput: EventEmitter<MatDatetimepickerInputEvent<D>>;
  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange: EventEmitter<D>;
  /** Emits when the disabled state has changed */
  _disabledChange: EventEmitter<boolean>;
  private _datepickerSubscription;
  private _localeSubscription;
  /** Whether the last value set on the input was valid. */
  private _lastValueValid;
  constructor(
    _elementRef: ElementRef,
    _dateAdapter: DatetimeAdapter<D>,
    _dateFormats: MatDatetimeFormats,
    _formField: MatFormField
  );
  /** The datepicker that this input is associated with. */
  set matDatetimepicker(value: MatDatetimepickerComponent<D>);
  set matDatepickerFilter(
    filter: (date: D | null, type: MatDatetimepickerFilterType) => boolean
  );
  private _value;
  /** The value of the input. */
  get value(): D | null;
  set value(value: D | null);
  private _min;
  /** The minimum valid date. */
  get min(): D | null;
  set min(value: D | null);
  private _max;
  /** The maximum valid date. */
  get max(): D | null;
  set max(value: D | null);
  private _disabled;
  /** Whether the datepicker-input is disabled. */
  get disabled(): any;
  set disabled(value: any);
  _onTouched: () => void;
  ngAfterContentInit(): void;
  ngOnDestroy(): void;
  registerOnValidatorChange(fn: () => void): void;
  validate(c: AbstractControl): ValidationErrors | null;
  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin(): ElementRef;
  writeValue(value: D): void;
  registerOnChange(fn: (value: any) => void): void;
  registerOnTouched(fn: () => void): void;
  setDisabledState(disabled: boolean): void;
  _onKeydown(event: KeyboardEvent): void;
  _onInput(value: string): void;
  _onChange(): void;
  /** Handles blur events on the input. */
  _onBlur(): void;
  private registerDatepicker;
  private getDisplayFormat;
  private getParseFormat;
  private _cvaOnChange;
  private _validatorOnChange;
  /** The form control validator for whether the input parses. */
  private _parseValidator;
  /** The form control validator for the min date. */
  private _minValidator;
  /** The form control validator for the max date. */
  private _maxValidator;
  /** The form control validator for the date filter. */
  private _filterValidator;
  /** The combined form control validator for this input. */
  private _validator;
  /** Formats a value and sets it on the input element. */
  private _formatValue;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    MatDatetimepickerInputDirective<any>,
    [null, { optional: true }, { optional: true }, { optional: true }]
  >;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    MatDatetimepickerInputDirective<any>,
    'input[matDatetimepicker]',
    ['matDatepickerInput'],
    {
      matDatetimepicker: 'matDatetimepicker';
      matDatepickerFilter: 'matDatepickerFilter';
      value: 'value';
      min: 'min';
      max: 'max';
      disabled: 'disabled';
    },
    { dateChange: 'dateChange'; dateInput: 'dateInput' },
    never,
    never,
    false
  >;
}
