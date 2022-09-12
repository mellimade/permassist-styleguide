import { ControlValueAccessor } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { Menu } from 'primeng/menu';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare const DATEPICKER_RANGES: {
    Today: {
        label: string;
        range: Date[];
        single: Date;
    };
    Yesterday: {
        label: string;
        range: Date[];
        single: Date;
    };
    Last7Days: {
        label: string;
        range: Date[];
        single: Date;
    };
    Last30Days: {
        label: string;
        range: Date[];
        single: Date;
    };
    ThisMonth: {
        label: string;
        range: Date[];
        single: Date;
    };
    LastMonth: {
        label: string;
        range: Date[];
        single: Date;
    };
};
export declare class DatepickerComponent implements ControlValueAccessor {
    showPredefinedRanges: boolean;
    clearable: boolean;
    inputId: string;
    set selectionMode(selectionMode: string);
    get selectionMode(): string;
    set value(value: Date | Date[] | null);
    get value(): Date | Date[] | null;
    predefinedRanges: MenuItem[];
    $calendar: Calendar;
    $predefinedRangesMenu: Menu;
    private readonly showing$$;
    showing$: Observable<boolean>;
    private readonly selectionMode$$;
    selectionMode$: Observable<string>;
    numberOfMonths$: Observable<number>;
    writeValue(value: unknown): void;
    registerOnChange(fn: never): void;
    registerOnTouched(fn: never): void;
    setDisabledState(isDisabled: boolean): void;
    onOpen(): void;
    onMonthChange(): void;
    onYearChange(): void;
    onClose(): void;
    clear(): void;
    setRange(item: MenuItem, e?: Event): void;
    asNumber(x: unknown): number;
    private addRangeInteractions;
    private updateActiveMenuItem;
    private updateActiveMenuItemOnOpen;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatepickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatepickerComponent, "pa-ui-datepicker", never, { "showPredefinedRanges": "showPredefinedRanges"; "clearable": "clearable"; "inputId": "inputId"; "selectionMode": "selectionMode"; "value": "value"; "predefinedRanges": "predefinedRanges"; }, {}, never, never>;
}
