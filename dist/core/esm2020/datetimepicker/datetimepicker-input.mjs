import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { DatetimeAdapter } from '../adapter/datetime-adapter';
import { MAT_DATETIME_FORMATS } from '../adapter/datetime-formats';
import { MatDatetimepickerComponent } from './datetimepicker';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MatDatetimepickerFilterType } from './datetimepicker-filtertype';
import * as i0 from '@angular/core';
import * as i1 from '../adapter/datetime-adapter';
import * as i2 from '@angular/material/form-field';
// eslint-disable  @typescript-eslint/no-use-before-define
export const MAT_DATETIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatDatetimepickerInputDirective),
  multi: true,
};
export const MAT_DATETIMEPICKER_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MatDatetimepickerInputDirective),
  multi: true,
};
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
export class MatDatetimepickerInputEvent {
  constructor(target, targetElement) {
    this.target = target;
    this.targetElement = targetElement;
    this.value = this.target.value;
  }
}
/** Directive used to connect an input to a MatDatepicker. */
export class MatDatetimepickerInputDirective {
  constructor(_elementRef, _dateAdapter, _dateFormats, _formField) {
    this._elementRef = _elementRef;
    this._dateAdapter = _dateAdapter;
    this._dateFormats = _dateFormats;
    this._formField = _formField;
    /** Emits when a `change` event is fired on this `<input>`. */
    this.dateChange = new EventEmitter();
    /** Emits when an `input` event is fired on this `<input>`. */
    this.dateInput = new EventEmitter();
    /** Emits when the value changes (either due to user input or programmatic change). */
    this._valueChange = new EventEmitter();
    /** Emits when the disabled state has changed */
    this._disabledChange = new EventEmitter();
    this._datepickerSubscription = Subscription.EMPTY;
    this._localeSubscription = Subscription.EMPTY;
    /** Whether the last value set on the input was valid. */
    this._lastValueValid = false;
    this._onTouched = () => {};
    this._cvaOnChange = () => {};
    this._validatorOnChange = () => {};
    /** The form control validator for whether the input parses. */
    this._parseValidator = () => {
      return this._lastValueValid
        ? null
        : {
            matDatepickerParse: { text: this._elementRef.nativeElement.value },
          };
    };
    /** The form control validator for the min date. */
    this._minValidator = (control) => {
      const controlValue = this._dateAdapter.getValidDateOrNull(
        this._dateAdapter.deserialize(control.value)
      );
      return !this.min ||
        !controlValue ||
        this._dateAdapter.compareDatetime(this.min, controlValue) <= 0
        ? null
        : { matDatepickerMin: { min: this.min, actual: controlValue } };
    };
    /** The form control validator for the max date. */
    this._maxValidator = (control) => {
      const controlValue = this._dateAdapter.getValidDateOrNull(
        this._dateAdapter.deserialize(control.value)
      );
      return !this.max ||
        !controlValue ||
        this._dateAdapter.compareDatetime(this.max, controlValue) >= 0
        ? null
        : { matDatepickerMax: { max: this.max, actual: controlValue } };
    };
    /** The form control validator for the date filter. */
    this._filterValidator = (control) => {
      const controlValue = this._dateAdapter.getValidDateOrNull(
        this._dateAdapter.deserialize(control.value)
      );
      return !this._dateFilter ||
        !controlValue ||
        this._dateFilter(controlValue, MatDatetimepickerFilterType.DATE)
        ? null
        : { matDatepickerFilter: true };
    };
    /** The combined form control validator for this input. */
    this._validator = Validators.compose([
      this._parseValidator,
      this._minValidator,
      this._maxValidator,
      this._filterValidator,
    ]);
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DatetimeAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('MAT_DATETIME_FORMATS');
    }
    // Update the displayed date when the locale changes.
    this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
      this.value = this.value;
    });
  }
  /** The datepicker that this input is associated with. */
  set matDatetimepicker(value) {
    this.registerDatepicker(value);
  }
  set matDatepickerFilter(filter) {
    this._dateFilter = filter;
    this._validatorOnChange();
  }
  /** The value of the input. */
  get value() {
    return this._value;
  }
  set value(value) {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._dateAdapter.getValidDateOrNull(value);
    const oldDate = this.value;
    this._value = value;
    this._formatValue(value);
    // use timeout to ensure the datetimepicker is instantiated and we get the correct format
    setTimeout(() => {
      if (!this._dateAdapter.sameDatetime(oldDate, value)) {
        this._valueChange.emit(value);
      }
    });
  }
  /** The minimum valid date. */
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value)
    );
    this._validatorOnChange();
  }
  /** The maximum valid date. */
  get max() {
    return this._max;
  }
  set max(value) {
    this._max = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value)
    );
    this._validatorOnChange();
  }
  /** Whether the datepicker-input is disabled. */
  get disabled() {
    return !!this._disabled;
  }
  set disabled(value) {
    const newValue = coerceBooleanProperty(value);
    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }
  }
  ngAfterContentInit() {
    if (this._datepicker) {
      this._datepickerSubscription = this._datepicker.selectedChanged.subscribe(
        (selected) => {
          this.value = selected;
          this._cvaOnChange(selected);
          this._onTouched();
          this.dateInput.emit(
            new MatDatetimepickerInputEvent(
              this,
              this._elementRef.nativeElement
            )
          );
          this.dateChange.emit(
            new MatDatetimepickerInputEvent(
              this,
              this._elementRef.nativeElement
            )
          );
        }
      );
    }
  }
  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
  }
  registerOnValidatorChange(fn) {
    this._validatorOnChange = fn;
  }
  validate(c) {
    return this._validator ? this._validator(c) : null;
  }
  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin() {
    return this._formField
      ? this._formField.getConnectedOverlayOrigin()
      : this._elementRef;
  }
  // Implemented as part of ControlValueAccessor
  writeValue(value) {
    this.value = value;
  }
  // Implemented as part of ControlValueAccessor
  registerOnChange(fn) {
    this._cvaOnChange = fn;
  }
  // Implemented as part of ControlValueAccessor
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  // Implemented as part of ControlValueAccessor
  setDisabledState(disabled) {
    this.disabled = disabled;
  }
  _onKeydown(event) {
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this._datepicker.open();
      event.preventDefault();
    }
  }
  _onInput(value) {
    let date = this._dateAdapter.parse(value, this.getParseFormat());
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._dateAdapter.getValidDateOrNull(date);
    this._value = date;
    this._cvaOnChange(date);
    this._valueChange.emit(date);
    this.dateInput.emit(
      new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement)
    );
  }
  _onChange() {
    this.dateChange.emit(
      new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement)
    );
  }
  /** Handles blur events on the input. */
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this._formatValue(this.value);
    }
    this._onTouched();
  }
  registerDatepicker(value) {
    if (value) {
      this._datepicker = value;
      this._datepicker._registerInput(this);
    }
  }
  getDisplayFormat() {
    switch (this._datepicker.type) {
      case 'date':
        return this._dateFormats.display.dateInput;
      case 'datetime':
        return this._dateFormats.display.datetimeInput;
      case 'time':
        return this._dateFormats.display.timeInput;
      case 'month':
        return this._dateFormats.display.monthInput;
    }
  }
  getParseFormat() {
    let parseFormat;
    switch (this._datepicker.type) {
      case 'date':
        parseFormat = this._dateFormats.parse.dateInput;
        break;
      case 'datetime':
        parseFormat = this._dateFormats.parse.datetimeInput;
        break;
      case 'time':
        parseFormat = this._dateFormats.parse.timeInput;
        break;
      case 'month':
        parseFormat = this._dateFormats.parse.monthInput;
        break;
    }
    if (!parseFormat) {
      parseFormat = this._dateFormats.parse.dateInput;
    }
    return parseFormat;
  }
  /** Formats a value and sets it on the input element. */
  _formatValue(value) {
    this._elementRef.nativeElement.value = value
      ? this._dateAdapter.format(value, this.getDisplayFormat())
      : '';
  }
}
/** @nocollapse */ MatDatetimepickerInputDirective.ɵfac = i0.ɵɵngDeclareFactory(
  {
    minVersion: '12.0.0',
    version: '14.2.5',
    ngImport: i0,
    type: MatDatetimepickerInputDirective,
    deps: [
      { token: i0.ElementRef },
      { token: i1.DatetimeAdapter, optional: true },
      { token: MAT_DATETIME_FORMATS, optional: true },
      { token: i2.MatFormField, optional: true },
    ],
    target: i0.ɵɵFactoryTarget.Directive,
  }
);
/** @nocollapse */ MatDatetimepickerInputDirective.ɵdir =
  i0.ɵɵngDeclareDirective({
    minVersion: '14.0.0',
    version: '14.2.5',
    type: MatDatetimepickerInputDirective,
    selector: 'input[matDatetimepicker]',
    inputs: {
      matDatetimepicker: 'matDatetimepicker',
      matDatepickerFilter: 'matDatepickerFilter',
      value: 'value',
      min: 'min',
      max: 'max',
      disabled: 'disabled',
    },
    outputs: { dateChange: 'dateChange', dateInput: 'dateInput' },
    host: {
      listeners: {
        focus: '_datepicker._handleFocus()',
        input: '_onInput($event.target.value)',
        change: '_onChange()',
        blur: '_onBlur()',
        keydown: '_onKeydown($event)',
      },
      properties: {
        'attr.aria-haspopup': 'true',
        'attr.aria-owns': '(_datepicker?.opened && _datepicker.id) || null',
        'attr.min': 'min ? _dateAdapter.toIso8601(min) : null',
        'attr.max': 'max ? _dateAdapter.toIso8601(max) : null',
        disabled: 'disabled',
      },
    },
    providers: [
      MAT_DATETIMEPICKER_VALUE_ACCESSOR,
      MAT_DATETIMEPICKER_VALIDATORS,
      {
        provide: MAT_INPUT_VALUE_ACCESSOR,
        useExisting: MatDatetimepickerInputDirective,
      },
    ],
    exportAs: ['matDatepickerInput'],
    ngImport: i0,
  });
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.5',
  ngImport: i0,
  type: MatDatetimepickerInputDirective,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: 'input[matDatetimepicker]',
          providers: [
            MAT_DATETIMEPICKER_VALUE_ACCESSOR,
            MAT_DATETIMEPICKER_VALIDATORS,
            {
              provide: MAT_INPUT_VALUE_ACCESSOR,
              useExisting: MatDatetimepickerInputDirective,
            },
          ],
          host: {
            '[attr.aria-haspopup]': 'true',
            '[attr.aria-owns]':
              '(_datepicker?.opened && _datepicker.id) || null',
            '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
            '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
            '[disabled]': 'disabled',
            '(focus)': '_datepicker._handleFocus()',
            '(input)': '_onInput($event.target.value)',
            '(change)': '_onChange()',
            '(blur)': '_onBlur()',
            '(keydown)': '_onKeydown($event)',
          },
          exportAs: 'matDatepickerInput',
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      {
        type: i1.DatetimeAdapter,
        decorators: [
          {
            type: Optional,
          },
        ],
      },
      {
        type: undefined,
        decorators: [
          {
            type: Optional,
          },
          {
            type: Inject,
            args: [MAT_DATETIME_FORMATS],
          },
        ],
      },
      {
        type: i2.MatFormField,
        decorators: [
          {
            type: Optional,
          },
        ],
      },
    ];
  },
  propDecorators: {
    dateChange: [
      {
        type: Output,
      },
    ],
    dateInput: [
      {
        type: Output,
      },
    ],
    matDatetimepicker: [
      {
        type: Input,
      },
    ],
    matDatepickerFilter: [
      {
        type: Input,
      },
    ],
    value: [
      {
        type: Input,
      },
    ],
    min: [
      {
        type: Input,
      },
    ],
    max: [
      {
        type: Input,
      },
    ],
    disabled: [
      {
        type: Input,
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXItaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkQsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixpQkFBaUIsRUFJakIsVUFBVSxHQUNYLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFDTCxvQkFBb0IsR0FFckIsTUFBTSw2QkFBNkIsQ0FBQztBQUNyQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7OztBQUUxRSwwREFBMEQ7QUFFMUQsTUFBTSxDQUFDLE1BQU0saUNBQWlDLEdBQVE7SUFDcEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLCtC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Q2pDLDZCQUE2QjtRQUM3QjtZQUNFLE9BQU8sRUFBRSx3QkFBd0I7WUFDakMsV0FBVyxFQUFFLCtCQUErQjtTQUM3QztLQUNGOzJGQWVVLCtCQUErQjtrQkF4QjNDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsU0FBUyxFQUFFO3dCQUNULGlDQUFpQzt3QkFDakMsNkJBQTZCO3dCQUM3Qjs0QkFDRSxPQUFPLEVBQUUsd0JBQXdCOzRCQUNqQyxXQUFXLGlDQUFpQzt5QkFDN0M7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLHNCQUFzQixFQUFFLE1BQU07d0JBQzlCLGtCQUFrQixFQUFFLGlEQUFpRDt3QkFDckUsWUFBWSxFQUFFLDBDQUEwQzt3QkFDeEQsWUFBWSxFQUFFLDBDQUEwQzt3QkFDeEQsWUFBWSxFQUFFLFVBQVU7d0JBQ3hCLFNBQVMsRUFBRSw0QkFBNEI7d0JBQ3ZDLFNBQVMsRUFBRSwrQkFBK0I7d0JBQzFDLFVBQVUsRUFBRSxhQUFhO3dCQUN6QixRQUFRLEVBQUUsV0FBVzt3QkFDckIsV0FBVyxFQUFFLG9CQUFvQjtxQkFDbEM7b0JBQ0QsUUFBUSxFQUFFLG9CQUFvQjtpQkFDL0I7OzBCQXFCSSxRQUFROzswQkFDUixRQUFROzswQkFDUixNQUFNOzJCQUFDLG9CQUFvQjs7MEJBRTNCLFFBQVE7NENBbEJELFVBQVU7c0JBQW5CLE1BQU07Z0JBRUcsU0FBUztzQkFBbEIsTUFBTTtnQkFpQ0gsaUJBQWlCO3NCQURwQixLQUFLO2dCQUtPLG1CQUFtQjtzQkFBL0IsS0FBSztnQkFXRixLQUFLO3NCQURSLEtBQUs7Z0JBeUJGLEdBQUc7c0JBRE4sS0FBSztnQkFnQkYsR0FBRztzQkFETixLQUFLO2dCQWdCRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xyXG5pbXBvcnQgeyBET1dOX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcclxuaW1wb3J0IHtcclxuICBBZnRlckNvbnRlbnRJbml0LFxyXG4gIERpcmVjdGl2ZSxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBmb3J3YXJkUmVmLFxyXG4gIEluamVjdCxcclxuICBJbnB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT3B0aW9uYWwsXHJcbiAgT3V0cHV0LFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIEFic3RyYWN0Q29udHJvbCxcclxuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcclxuICBOR19WQUxJREFUT1JTLFxyXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gIFZhbGlkYXRpb25FcnJvcnMsXHJcbiAgVmFsaWRhdG9yLFxyXG4gIFZhbGlkYXRvckZuLFxyXG4gIFZhbGlkYXRvcnMsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XHJcbmltcG9ydCB7IE1hdEZvcm1GaWVsZCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgRGF0ZXRpbWVBZGFwdGVyIH0gZnJvbSAnLi4vYWRhcHRlci9kYXRldGltZS1hZGFwdGVyJztcclxuaW1wb3J0IHtcclxuICBNQVRfREFURVRJTUVfRk9STUFUUyxcclxuICBNYXREYXRldGltZUZvcm1hdHMsXHJcbn0gZnJvbSAnLi4vYWRhcHRlci9kYXRldGltZS1mb3JtYXRzJztcclxuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyJztcclxuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWVycm9ycyc7XHJcbmltcG9ydCB7IE1hdERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZSB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItZmlsdGVydHlwZSc7XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZSAgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVzZS1iZWZvcmUtZGVmaW5lXHJcblxyXG5leHBvcnQgY29uc3QgTUFUX0RBVEVUSU1FUElDS0VSX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XHJcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0RGF0ZXRpbWVwaWNrZXJJbnB1dERpcmVjdGl2ZSksXHJcbiAgbXVsdGk6IHRydWUsXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgTUFUX0RBVEVUSU1FUElDS0VSX1ZBTElEQVRPUlM6IGFueSA9IHtcclxuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxyXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdERhdGV0aW1lcGlja2VySW5wdXREaXJlY3RpdmUpLFxyXG4gIG11bHRpOiB0cnVlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFuIGV2ZW50IHVzZWQgZm9yIGRhdGVwaWNrZXIgaW5wdXQgYW5kIGNoYW5nZSBldmVudHMuIFdlIGRvbid0IGFsd2F5cyBoYXZlIGFjY2VzcyB0byBhIG5hdGl2ZVxyXG4gKiBpbnB1dCBvciBjaGFuZ2UgZXZlbnQgYmVjYXVzZSB0aGUgZXZlbnQgbWF5IGhhdmUgYmVlbiB0cmlnZ2VyZWQgYnkgdGhlIHVzZXIgY2xpY2tpbmcgb24gdGhlXHJcbiAqIGNhbGVuZGFyIHBvcHVwLiBGb3IgY29uc2lzdGVuY3ksIHdlIGFsd2F5cyB1c2UgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQgaW5zdGVhZC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBNYXREYXRldGltZXBpY2tlcklucHV0RXZlbnQ8RD4ge1xyXG4gIC8qKiBUaGUgbmV3IHZhbHVlIGZvciB0aGUgdGFyZ2V0IGRhdGVwaWNrZXIgaW5wdXQuICovXHJcbiAgdmFsdWU6IEQgfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyB0YXJnZXQ6IE1hdERhdGV0aW1lcGlja2VySW5wdXREaXJlY3RpdmU8RD4sXHJcbiAgICBwdWJsaWMgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnRcclxuICApIHtcclxuICAgIHRoaXMudmFsdWUgPSB0aGlzLnRhcmdldC52YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8qKiBEaXJlY3RpdmUgdXNlZCB0byBjb25uZWN0IGFuIGlucHV0IHRvIGEgTWF0RGF0ZXBpY2tlci4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXREYXRldGltZXBpY2tlcl0nLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgTUFUX0RBVEVUSU1FUElDS0VSX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgTUFUX0RBVEVUSU1FUElDS0VSX1ZBTElEQVRPUlMsXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IE1BVF9JTlBVVF9WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgdXNlRXhpc3Rpbmc6IE1hdERhdGV0aW1lcGlja2VySW5wdXREaXJlY3RpdmUsXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgaG9zdDoge1xyXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ3RydWUnLFxyXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9kYXRlcGlja2VyPy5vcGVuZWQgJiYgX2RhdGVwaWNrZXIuaWQpIHx8IG51bGwnLFxyXG4gICAgJ1thdHRyLm1pbl0nOiAnbWluID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtaW4pIDogbnVsbCcsXHJcbiAgICAnW2F0dHIubWF4XSc6ICdtYXggPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKG1heCkgOiBudWxsJyxcclxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcclxuICAgICcoZm9jdXMpJzogJ19kYXRlcGlja2VyLl9oYW5kbGVGb2N1cygpJyxcclxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcclxuICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoKScsXHJcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXHJcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXHJcbiAgfSxcclxuICBleHBvcnRBczogJ21hdERhdGVwaWNrZXJJbnB1dCcsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXREYXRldGltZXBpY2tlcklucHV0RGlyZWN0aXZlPEQ+XHJcbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25EZXN0cm95LCBWYWxpZGF0b3Jcclxue1xyXG4gIF9kYXRlcGlja2VyOiBNYXREYXRldGltZXBpY2tlckNvbXBvbmVudDxEPjtcclxuICBfZGF0ZUZpbHRlcjogKGRhdGU6IEQgfCBudWxsLCB0eXBlOiBNYXREYXRldGltZXBpY2tlckZpbHRlclR5cGUpID0+IGJvb2xlYW47XHJcbiAgLyoqIEVtaXRzIHdoZW4gYSBgY2hhbmdlYCBldmVudCBpcyBmaXJlZCBvbiB0aGlzIGA8aW5wdXQ+YC4gKi9cclxuICBAT3V0cHV0KCkgZGF0ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0RGF0ZXRpbWVwaWNrZXJJbnB1dEV2ZW50PEQ+PigpO1xyXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGBpbnB1dGAgZXZlbnQgaXMgZmlyZWQgb24gdGhpcyBgPGlucHV0PmAuICovXHJcbiAgQE91dHB1dCgpIGRhdGVJbnB1dCA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0RGF0ZXRpbWVwaWNrZXJJbnB1dEV2ZW50PEQ+PigpO1xyXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzIChlaXRoZXIgZHVlIHRvIHVzZXIgaW5wdXQgb3IgcHJvZ3JhbW1hdGljIGNoYW5nZSkuICovXHJcbiAgX3ZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEIHwgbnVsbD4oKTtcclxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGlzYWJsZWQgc3RhdGUgaGFzIGNoYW5nZWQgKi9cclxuICBfZGlzYWJsZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcbiAgcHJpdmF0ZSBfZGF0ZXBpY2tlclN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcclxuICBwcml2YXRlIF9sb2NhbGVTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XHJcbiAgLyoqIFdoZXRoZXIgdGhlIGxhc3QgdmFsdWUgc2V0IG9uIHRoZSBpbnB1dCB3YXMgdmFsaWQuICovXHJcbiAgcHJpdmF0ZSBfbGFzdFZhbHVlVmFsaWQgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9kYXRlQWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxyXG4gICAgQE9wdGlvbmFsKClcclxuICAgIEBJbmplY3QoTUFUX0RBVEVUSU1FX0ZPUk1BVFMpXHJcbiAgICBwcml2YXRlIF9kYXRlRm9ybWF0czogTWF0RGF0ZXRpbWVGb3JtYXRzLFxyXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZm9ybUZpZWxkOiBNYXRGb3JtRmllbGRcclxuICApIHtcclxuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcclxuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGV0aW1lQWRhcHRlcicpO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLl9kYXRlRm9ybWF0cykge1xyXG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignTUFUX0RBVEVUSU1FX0ZPUk1BVFMnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVcGRhdGUgdGhlIGRpc3BsYXllZCBkYXRlIHdoZW4gdGhlIGxvY2FsZSBjaGFuZ2VzLlxyXG4gICAgdGhpcy5fbG9jYWxlU3Vic2NyaXB0aW9uID0gX2RhdGVBZGFwdGVyLmxvY2FsZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKiBUaGUgZGF0ZXBpY2tlciB0aGF0IHRoaXMgaW5wdXQgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgc2V0IG1hdERhdGV0aW1lcGlja2VyKHZhbHVlOiBNYXREYXRldGltZXBpY2tlckNvbXBvbmVudDxEPikge1xyXG4gICAgdGhpcy5yZWdpc3RlckRhdGVwaWNrZXIodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KCkgc2V0IG1hdERhdGVwaWNrZXJGaWx0ZXIoXHJcbiAgICBmaWx0ZXI6IChkYXRlOiBEIHwgbnVsbCwgdHlwZTogTWF0RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlKSA9PiBib29sZWFuXHJcbiAgKSB7XHJcbiAgICB0aGlzLl9kYXRlRmlsdGVyID0gZmlsdGVyO1xyXG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3ZhbHVlOiBEIHwgbnVsbDtcclxuXHJcbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXHJcbiAgQElucHV0KClcclxuICBnZXQgdmFsdWUoKTogRCB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgc2V0IHZhbHVlKHZhbHVlOiBEIHwgbnVsbCkge1xyXG4gICAgdmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XHJcbiAgICB0aGlzLl9sYXN0VmFsdWVWYWxpZCA9ICF2YWx1ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKHZhbHVlKTtcclxuICAgIHZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHZhbHVlKTtcclxuICAgIGNvbnN0IG9sZERhdGUgPSB0aGlzLnZhbHVlO1xyXG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcclxuICAgIHRoaXMuX2Zvcm1hdFZhbHVlKHZhbHVlKTtcclxuXHJcbiAgICAvLyB1c2UgdGltZW91dCB0byBlbnN1cmUgdGhlIGRhdGV0aW1lcGlja2VyIGlzIGluc3RhbnRpYXRlZCBhbmQgd2UgZ2V0IHRoZSBjb3JyZWN0IGZvcm1hdFxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGV0aW1lKG9sZERhdGUsIHZhbHVlKSkge1xyXG4gICAgICAgIHRoaXMuX3ZhbHVlQ2hhbmdlLmVtaXQodmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX21pbjogRCB8IG51bGw7XHJcblxyXG4gIC8qKiBUaGUgbWluaW11bSB2YWxpZCBkYXRlLiAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IG1pbigpOiBEIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy5fbWluO1xyXG4gIH1cclxuXHJcbiAgc2V0IG1pbih2YWx1ZTogRCB8IG51bGwpIHtcclxuICAgIHRoaXMuX21pbiA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbChcclxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpXHJcbiAgICApO1xyXG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX21heDogRCB8IG51bGw7XHJcblxyXG4gIC8qKiBUaGUgbWF4aW11bSB2YWxpZCBkYXRlLiAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IG1heCgpOiBEIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy5fbWF4O1xyXG4gIH1cclxuXHJcbiAgc2V0IG1heCh2YWx1ZTogRCB8IG51bGwpIHtcclxuICAgIHRoaXMuX21heCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbChcclxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpXHJcbiAgICApO1xyXG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xyXG5cclxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlci1pbnB1dCBpcyBkaXNhYmxlZC4gKi9cclxuICBASW5wdXQoKVxyXG4gIGdldCBkaXNhYmxlZCgpIHtcclxuICAgIHJldHVybiAhIXRoaXMuX2Rpc2FibGVkO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHtcclxuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcclxuXHJcbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IG5ld1ZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XHJcbiAgICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLmVtaXQobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xyXG5cclxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5fZGF0ZXBpY2tlcikge1xyXG4gICAgICB0aGlzLl9kYXRlcGlja2VyU3Vic2NyaXB0aW9uID0gdGhpcy5fZGF0ZXBpY2tlci5zZWxlY3RlZENoYW5nZWQuc3Vic2NyaWJlKFxyXG4gICAgICAgIChzZWxlY3RlZDogRCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgdGhpcy5fY3ZhT25DaGFuZ2Uoc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XHJcbiAgICAgICAgICB0aGlzLmRhdGVJbnB1dC5lbWl0KFxyXG4gICAgICAgICAgICBuZXcgTWF0RGF0ZXRpbWVwaWNrZXJJbnB1dEV2ZW50KFxyXG4gICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICB0aGlzLmRhdGVDaGFuZ2UuZW1pdChcclxuICAgICAgICAgICAgbmV3IE1hdERhdGV0aW1lcGlja2VySW5wdXRFdmVudChcclxuICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5fZGF0ZXBpY2tlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgdGhpcy5fbG9jYWxlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLl92YWx1ZUNoYW5nZS5jb21wbGV0ZSgpO1xyXG4gICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UuY29tcGxldGUoKTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlID0gZm47XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdG9yID8gdGhpcy5fdmFsaWRhdG9yKGMpIDogbnVsbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgZGF0ZXBpY2tlciBwb3B1cCBzaG91bGQgYmUgY29ubmVjdGVkIHRvLlxyXG4gICAqIEByZXR1cm4gVGhlIGVsZW1lbnQgdG8gY29ubmVjdCB0aGUgcG9wdXAgdG8uXHJcbiAgICovXHJcbiAgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpOiBFbGVtZW50UmVmIHtcclxuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGRcclxuICAgICAgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpXHJcbiAgICAgIDogdGhpcy5fZWxlbWVudFJlZjtcclxuICB9XHJcblxyXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3JcclxuICB3cml0ZVZhbHVlKHZhbHVlOiBEKTogdm9pZCB7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHRoaXMuX2N2YU9uQ2hhbmdlID0gZm47XHJcbiAgfVxyXG5cclxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yXHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xyXG4gIH1cclxuXHJcbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3NvclxyXG4gIHNldERpc2FibGVkU3RhdGUoZGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcclxuICB9XHJcblxyXG4gIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGlmIChldmVudC5hbHRLZXkgJiYgZXZlbnQua2V5Q29kZSA9PT0gRE9XTl9BUlJPVykge1xyXG4gICAgICB0aGlzLl9kYXRlcGlja2VyLm9wZW4oKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGxldCBkYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIucGFyc2UodmFsdWUsIHRoaXMuZ2V0UGFyc2VGb3JtYXQoKSk7XHJcbiAgICB0aGlzLl9sYXN0VmFsdWVWYWxpZCA9ICFkYXRlIHx8IHRoaXMuX2RhdGVBZGFwdGVyLmlzVmFsaWQoZGF0ZSk7XHJcbiAgICBkYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKGRhdGUpO1xyXG4gICAgdGhpcy5fdmFsdWUgPSBkYXRlO1xyXG4gICAgdGhpcy5fY3ZhT25DaGFuZ2UoZGF0ZSk7XHJcbiAgICB0aGlzLl92YWx1ZUNoYW5nZS5lbWl0KGRhdGUpO1xyXG4gICAgdGhpcy5kYXRlSW5wdXQuZW1pdChcclxuICAgICAgbmV3IE1hdERhdGV0aW1lcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgX29uQ2hhbmdlKCkge1xyXG4gICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQoXHJcbiAgICAgIG5ldyBNYXREYXRldGltZXBpY2tlcklucHV0RXZlbnQodGhpcywgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKiBIYW5kbGVzIGJsdXIgZXZlbnRzIG9uIHRoZSBpbnB1dC4gKi9cclxuICBfb25CbHVyKCkge1xyXG4gICAgLy8gUmVmb3JtYXQgdGhlIGlucHV0IG9ubHkgaWYgd2UgaGF2ZSBhIHZhbGlkIHZhbHVlLlxyXG4gICAgaWYgKHRoaXMudmFsdWUpIHtcclxuICAgICAgdGhpcy5fZm9ybWF0VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fb25Ub3VjaGVkKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZ2lzdGVyRGF0ZXBpY2tlcih2YWx1ZTogTWF0RGF0ZXRpbWVwaWNrZXJDb21wb25lbnQ8RD4pIHtcclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICB0aGlzLl9kYXRlcGlja2VyID0gdmFsdWU7XHJcbiAgICAgIHRoaXMuX2RhdGVwaWNrZXIuX3JlZ2lzdGVySW5wdXQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldERpc3BsYXlGb3JtYXQoKSB7XHJcbiAgICBzd2l0Y2ggKHRoaXMuX2RhdGVwaWNrZXIudHlwZSkge1xyXG4gICAgICBjYXNlICdkYXRlJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5kYXRlSW5wdXQ7XHJcbiAgICAgIGNhc2UgJ2RhdGV0aW1lJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5kYXRldGltZUlucHV0O1xyXG4gICAgICBjYXNlICd0aW1lJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS50aW1lSW5wdXQ7XHJcbiAgICAgIGNhc2UgJ21vbnRoJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5tb250aElucHV0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRQYXJzZUZvcm1hdCgpIHtcclxuICAgIGxldCBwYXJzZUZvcm1hdDtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMuX2RhdGVwaWNrZXIudHlwZSkge1xyXG4gICAgICBjYXNlICdkYXRlJzpcclxuICAgICAgICBwYXJzZUZvcm1hdCA9IHRoaXMuX2RhdGVGb3JtYXRzLnBhcnNlLmRhdGVJbnB1dDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnZGF0ZXRpbWUnOlxyXG4gICAgICAgIHBhcnNlRm9ybWF0ID0gdGhpcy5fZGF0ZUZvcm1hdHMucGFyc2UuZGF0ZXRpbWVJbnB1dDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAndGltZSc6XHJcbiAgICAgICAgcGFyc2VGb3JtYXQgPSB0aGlzLl9kYXRlRm9ybWF0cy5wYXJzZS50aW1lSW5wdXQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ21vbnRoJzpcclxuICAgICAgICBwYXJzZUZvcm1hdCA9IHRoaXMuX2RhdGVGb3JtYXRzLnBhcnNlLm1vbnRoSW5wdXQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBpZiAoIXBhcnNlRm9ybWF0KSB7XHJcbiAgICAgIHBhcnNlRm9ybWF0ID0gdGhpcy5fZGF0ZUZvcm1hdHMucGFyc2UuZGF0ZUlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJzZUZvcm1hdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2N2YU9uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xyXG5cclxuICBwcml2YXRlIF92YWxpZGF0b3JPbkNoYW5nZSA9ICgpID0+IHt9O1xyXG5cclxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHdoZXRoZXIgdGhlIGlucHV0IHBhcnNlcy4gKi9cclxuICBwcml2YXRlIF9wYXJzZVZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xhc3RWYWx1ZVZhbGlkXHJcbiAgICAgID8gbnVsbFxyXG4gICAgICA6IHsgbWF0RGF0ZXBpY2tlclBhcnNlOiB7IHRleHQ6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSB9IH07XHJcbiAgfTtcclxuXHJcbiAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGUgbWluIGRhdGUuICovXHJcbiAgcHJpdmF0ZSBfbWluVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChcclxuICAgIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbFxyXG4gICk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcclxuICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbChcclxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSlcclxuICAgICk7XHJcbiAgICByZXR1cm4gIXRoaXMubWluIHx8XHJcbiAgICAgICFjb250cm9sVmFsdWUgfHxcclxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGV0aW1lKHRoaXMubWluLCBjb250cm9sVmFsdWUpIDw9IDBcclxuICAgICAgPyBudWxsXHJcbiAgICAgIDogeyBtYXREYXRlcGlja2VyTWluOiB7IG1pbjogdGhpcy5taW4sIGFjdHVhbDogY29udHJvbFZhbHVlIH0gfTtcclxuICB9O1xyXG5cclxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBtYXggZGF0ZS4gKi9cclxuICBwcml2YXRlIF9tYXhWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKFxyXG4gICAgY29udHJvbDogQWJzdHJhY3RDb250cm9sXHJcbiAgKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xyXG4gICAgY29uc3QgY29udHJvbFZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKFxyXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKVxyXG4gICAgKTtcclxuICAgIHJldHVybiAhdGhpcy5tYXggfHxcclxuICAgICAgIWNvbnRyb2xWYWx1ZSB8fFxyXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZXRpbWUodGhpcy5tYXgsIGNvbnRyb2xWYWx1ZSkgPj0gMFxyXG4gICAgICA/IG51bGxcclxuICAgICAgOiB7IG1hdERhdGVwaWNrZXJNYXg6IHsgbWF4OiB0aGlzLm1heCwgYWN0dWFsOiBjb250cm9sVmFsdWUgfSB9O1xyXG4gIH07XHJcblxyXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIGRhdGUgZmlsdGVyLiAqL1xyXG4gIHByaXZhdGUgX2ZpbHRlclZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoXHJcbiAgICBjb250cm9sOiBBYnN0cmFjdENvbnRyb2xcclxuICApOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XHJcbiAgICBjb25zdCBjb250cm9sVmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoXHJcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpXHJcbiAgICApO1xyXG4gICAgcmV0dXJuICF0aGlzLl9kYXRlRmlsdGVyIHx8XHJcbiAgICAgICFjb250cm9sVmFsdWUgfHxcclxuICAgICAgdGhpcy5fZGF0ZUZpbHRlcihjb250cm9sVmFsdWUsIE1hdERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZS5EQVRFKVxyXG4gICAgICA/IG51bGxcclxuICAgICAgOiB7IG1hdERhdGVwaWNrZXJGaWx0ZXI6IHRydWUgfTtcclxuICB9O1xyXG5cclxuICAvKiogVGhlIGNvbWJpbmVkIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoaXMgaW5wdXQuICovXHJcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IG51bGwgPSBWYWxpZGF0b3JzLmNvbXBvc2UoW1xyXG4gICAgdGhpcy5fcGFyc2VWYWxpZGF0b3IsXHJcbiAgICB0aGlzLl9taW5WYWxpZGF0b3IsXHJcbiAgICB0aGlzLl9tYXhWYWxpZGF0b3IsXHJcbiAgICB0aGlzLl9maWx0ZXJWYWxpZGF0b3IsXHJcbiAgXSk7XHJcblxyXG4gIC8qKiBGb3JtYXRzIGEgdmFsdWUgYW5kIHNldHMgaXQgb24gdGhlIGlucHV0IGVsZW1lbnQuICovXHJcbiAgcHJpdmF0ZSBfZm9ybWF0VmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XHJcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZVxyXG4gICAgICA/IHRoaXMuX2RhdGVBZGFwdGVyLmZvcm1hdCh2YWx1ZSwgdGhpcy5nZXREaXNwbGF5Rm9ybWF0KCkpXHJcbiAgICAgIDogJyc7XHJcbiAgfVxyXG59XHJcbiJdfQ==
