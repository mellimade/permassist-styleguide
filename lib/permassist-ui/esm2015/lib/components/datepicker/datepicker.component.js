import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { daysAgo, monthsAgo } from '../../@helpers/dates';
import { getParentsOf, waitUntilExistsFrom } from '../../@helpers/utilities';
import * as i0 from "@angular/core";
import * as i1 from "primeng/calendar";
import * as i2 from "primeng/menu";
import * as i3 from "primeng/api";
import * as i4 from "@angular/common";
function multiplyDayDependingOnGroup(day, $day) {
    var _a;
    const $group = (_a = getParentsOf($day, '.p-datepicker-group')) === null || _a === void 0 ? void 0 : _a[0];
    if (!$group)
        return day;
    return day + (32 * Array.from($group.parentNode.children).indexOf($group));
}
export const DATEPICKER_RANGES = {
    Today: {
        label: 'Today',
        range: [new Date(), new Date()],
        single: new Date(),
    },
    Yesterday: {
        label: 'Yesterday',
        range: [daysAgo(1), daysAgo(1)],
        single: daysAgo(1),
    },
    Last7Days: {
        label: 'Last 7 Days',
        range: [daysAgo(7), new Date()],
        single: daysAgo(7),
    },
    Last30Days: {
        label: 'Last 30 Days',
        range: [daysAgo(30), new Date()],
        single: daysAgo(30),
    },
    ThisMonth: {
        label: 'This Month',
        range: [daysAgo(-1, monthsAgo(0, 1)), daysAgo(-1, monthsAgo(0, 0))],
        single: monthsAgo(0, 1),
    },
    LastMonth: {
        label: 'Last Month',
        range: [daysAgo(-1, monthsAgo(1, 1)), daysAgo(0, monthsAgo(0, 0))],
        single: monthsAgo(1, 1),
    },
};
export class DatepickerComponent {
    constructor() {
        this.showPredefinedRanges = true;
        this.clearable = true;
        this.inputId = '';
        this.predefinedRanges = [
            { label: DATEPICKER_RANGES.Today.label, command: e => this.setRange(e.item, e.originalEvent) },
            { label: DATEPICKER_RANGES.Yesterday.label, command: e => this.setRange(e.item, e.originalEvent) },
            { label: DATEPICKER_RANGES.Last7Days.label, command: e => this.setRange(e.item, e.originalEvent) },
            { label: DATEPICKER_RANGES.Last30Days.label, command: e => this.setRange(e.item, e.originalEvent) },
            { label: DATEPICKER_RANGES.ThisMonth.label, command: e => this.setRange(e.item, e.originalEvent) },
            { label: DATEPICKER_RANGES.LastMonth.label, command: e => this.setRange(e.item, e.originalEvent) },
        ];
        this.showing$$ = new BehaviorSubject(false);
        this.showing$ = this.showing$$.asObservable();
        this.selectionMode$$ = new BehaviorSubject('single');
        this.selectionMode$ = this.selectionMode$$.asObservable();
        this.numberOfMonths$ = this.selectionMode$.pipe(map(x => x === 'range' ? 2 : 1));
    }
    set selectionMode(selectionMode) {
        this.selectionMode$$.next(selectionMode);
    }
    get selectionMode() {
        return this.selectionMode$$.value;
    }
    set value(value) {
        waitUntilExistsFrom(() => this.$calendar, 20, 50).then($calendar => {
            $calendar.writeValue(value);
        });
    }
    get value() {
        return this.$calendar.value;
    }
    writeValue(value) {
        waitUntilExistsFrom(() => this.$calendar, 20, 50).then($calendar => {
            $calendar.writeValue(value);
        });
    }
    registerOnChange(fn) {
        waitUntilExistsFrom(() => this.$calendar, 20, 50).then($calendar => {
            $calendar.registerOnChange(fn);
        });
    }
    registerOnTouched(fn) {
        waitUntilExistsFrom(() => this.$calendar, 20, 50).then($calendar => {
            $calendar.registerOnTouched(fn);
        });
    }
    setDisabledState(isDisabled) {
        waitUntilExistsFrom(() => this.$calendar, 20, 50).then($calendar => {
            $calendar.setDisabledState(isDisabled);
        });
    }
    onOpen() {
        this.showing$$.next(true);
        this.addRangeInteractions();
    }
    onMonthChange() {
        this.addRangeInteractions();
    }
    onYearChange() {
        this.addRangeInteractions();
    }
    onClose() {
        this.showing$$.next(false);
    }
    clear() {
        var _a, _b, _c;
        (_a = this.$calendar) === null || _a === void 0 ? void 0 : _a.updateModel(null);
        (_b = this.$calendar) === null || _b === void 0 ? void 0 : _b.updateInputfield();
        if (this.selectionMode === 'single') {
            (_c = this.$calendar) === null || _c === void 0 ? void 0 : _c.toggle();
        }
    }
    setRange(item, e) {
        const range = Object.values(DATEPICKER_RANGES).find(x => x.label === item.label);
        if (range) {
            if (this.selectionMode === 'range') {
                this.$calendar.updateModel([]);
                range.range.forEach(date => {
                    this.$calendar.onDateSelect(e, {
                        year: date.getFullYear(),
                        month: date.getMonth(),
                        day: date.getUTCDate(),
                        selectable: true
                    });
                });
                this.$calendar.updateUI();
            }
            else {
                this.$calendar.updateModel(range.single);
            }
        }
        this.updateActiveMenuItem(item.label);
    }
    asNumber(x) {
        if (!x)
            return 0;
        return x;
    }
    addRangeInteractions() {
        if (this.selectionMode !== 'range')
            return;
        waitUntilExistsFrom(() => { var _a; return (_a = this.$calendar.contentViewChild) === null || _a === void 0 ? void 0 : _a.nativeElement; }).then(($contentViewChild) => {
            let $showHoverFor;
            let showHoverFor;
            this.updateActiveMenuItemOnOpen();
            $contentViewChild.querySelectorAll('table td > span').forEach(($date) => {
                $date.addEventListener('click', () => {
                    const $highlighted = $contentViewChild.querySelectorAll('table td span.p-highlight:not(.p-disabled)');
                    if (($highlighted === null || $highlighted === void 0 ? void 0 : $highlighted.length) === 1) {
                        $showHoverFor = $highlighted[0].parentNode;
                        showHoverFor = multiplyDayDependingOnGroup(Number($highlighted[0].textContent), $showHoverFor);
                    }
                    else {
                        showHoverFor = 0;
                        $showHoverFor = null;
                        $contentViewChild.querySelectorAll('table td').forEach(($x) => {
                            $x.classList.remove('-highlighted', '-highlighted-start', '-highlighted-end');
                        });
                    }
                });
                $date.addEventListener('mouseover', e => {
                    if (showHoverFor) {
                        const current = multiplyDayDependingOnGroup(Number(e.target.textContent), e.target);
                        if (current > showHoverFor) {
                            $contentViewChild.querySelectorAll('table td:not(.p-datepicker-other-month)').forEach(($x) => {
                                const day = multiplyDayDependingOnGroup(Number($x.textContent), $x);
                                if (current > showHoverFor && day < current && day > showHoverFor) {
                                    $x.classList.add('-highlighted');
                                }
                                else {
                                    $x.classList.remove('-highlighted');
                                }
                                if (day === current) {
                                    $x.classList.add('-highlighted-end');
                                }
                                else {
                                    $x.classList.remove('-highlighted-end');
                                }
                                if (day === showHoverFor) {
                                    $x.classList.add('-highlighted-start');
                                }
                                else {
                                    $x.classList.remove('-highlighted-start');
                                }
                            });
                        }
                    }
                });
            });
            $contentViewChild.addEventListener('mouseout', () => {
                $contentViewChild.querySelectorAll('table td').forEach(($x) => {
                    $x.classList.remove('-highlighted', '-highlighted-start', '-highlighted-end');
                });
            });
        });
    }
    updateActiveMenuItem(label) {
        var _a, _b, _c;
        const $range = ((_c = (_b = (_a = this.$predefinedRangesMenu) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.nativeElement) === null || _c === void 0 ? void 0 : _c.querySelectorAll('.p-menuitem-link')) || [];
        let foundMatch = false;
        $range.forEach(($link) => {
            if ($link.textContent === label) {
                $link.classList.add('-active');
                foundMatch = true;
            }
            else {
                $link.classList.remove('-active');
            }
        });
        if (!foundMatch && $range.length) {
            $range[$range.length - 1].classList.add('-active');
        }
    }
    updateActiveMenuItemOnOpen() {
        this.predefinedRanges.forEach(item => {
            var _a, _b;
            const range = Object.values(DATEPICKER_RANGES).find(x => x.label === item.label);
            if (this.selectionMode === 'range') {
                if (range && ((_a = this.$calendar.value) === null || _a === void 0 ? void 0 : _a[0]) === range.range[0] && ((_b = this.$calendar.value) === null || _b === void 0 ? void 0 : _b[1]) === range.range[1]) {
                    this.updateActiveMenuItem(item.label);
                }
            }
            else {
                if (range && this.$calendar.value === range.single) {
                    this.updateActiveMenuItem(item.label);
                }
            }
        });
    }
}
DatepickerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: DatepickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
DatepickerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.16", type: DatepickerComponent, selector: "pa-ui-datepicker", inputs: { showPredefinedRanges: "showPredefinedRanges", clearable: "clearable", inputId: "inputId", selectionMode: "selectionMode", value: "value", predefinedRanges: "predefinedRanges" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true,
        },
    ], viewQueries: [{ propertyName: "$calendar", first: true, predicate: ["calendar"], descendants: true }, { propertyName: "$predefinedRangesMenu", first: true, predicate: ["predefinedRangesMenu"], descendants: true }], ngImport: i0, template: "<p-calendar #calendar class=\"datepicker -{{ selectionMode }}\" [class.-showing]=\"showing$ | async\" [inputId]=\"inputId\" [selectionMode]=\"selectionMode\" (onShow)=\"onOpen()\" (onMonthChange)=\"onMonthChange()\" (onYearChange)=\"onYearChange()\" (onClose)=\"onClose()\" [numberOfMonths]=\"asNumber(numberOfMonths$ | async)\" panelStyleClass=\"{{ showPredefinedRanges ? '-has-ranges' : '' }}\"  dateFormat=\"dd/mm/yy\">\n  <ng-template pTemplate=\"header\">\n    <ng-container [ngTemplateOutlet]=\"header\"></ng-container>\n  </ng-template>\n\n  <ng-template pTemplate=\"footer\">\n    <ng-container [ngTemplateOutlet]=\"footer\"></ng-container>\n  </ng-template>\n</p-calendar>\n\n<ng-template #header>\n  <p-menu #predefinedRangesMenu class=\"datepicker__predefined-ranges\" *ngIf=\"showPredefinedRanges && selectionMode === 'range'\" [model]=\"predefinedRanges\"></p-menu>\n</ng-template>\n\n<ng-template #footer>\n  <div class=\"datepicker__actions\">\n    <button type=\"button\" (click)=\"$calendar.toggle()\" class=\"btn btn-primary btn-sm datepicker__btn order-2\">Close</button>\n    <button *ngIf=\"clearable\" type=\"button\" (click)=\"clear()\" class=\"btn btn-link btn-sm datepicker__btn -clear order-1\">Clear</button>\n  </div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";:root{--text-color: $black;--text-color-secondary: $gray-500;--primary-color: $primary-600;--primary-color-text: $white;--font-family: $font-family-sans-serif}.datepicker{display:block}::ng-deep .datepicker .p-inputtext{min-width:265px}::ng-deep .datepicker .p-calendar:after{content:\"\\e927\";font-family:\"primeicons\";position:absolute;top:.5em;right:.5em;font-size:1.3em;color:#168c8e;cursor:pointer;pointer-events:none}::ng-deep .datepicker .p-calendar .p-datepicker{top:calc(100% - 1px)!important;right:0;font-size:.875rem;padding-top:0}::ng-deep .datepicker .p-calendar .p-datepicker.p-datepicker-multiple-month{right:auto}::ng-deep .datepicker .p-datepicker .p-datepicker-header{border-bottom:none;padding-bottom:0;padding-top:0;margin-bottom:-.75em}::ng-deep .datepicker .p-link,::ng-deep .datepicker .p-component,::ng-deep .datepicker .p-datepicker table{font-size:inherit}::ng-deep .datepicker .p-datepicker{padding:0}::ng-deep .datepicker .p-datepicker table th{text-align:center;font-weight:600}::ng-deep .datepicker .p-datepicker table th,::ng-deep .datepicker .p-datepicker table td{padding:.25em .1em}::ng-deep .datepicker .p-datepicker table th>span,::ng-deep .datepicker .p-datepicker table td>span{width:2em;height:2em}::ng-deep .datepicker .p-datepicker table td.p-datepicker-today>span{background-color:#cdefef}::ng-deep .datepicker .p-datepicker table td>span.p-highlight,::ng-deep .datepicker .p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):hover{color:#fff;background-color:#007f80;font-weight:500}::ng-deep .datepicker .p-datepicker table td.-highlighted,::ng-deep .datepicker .p-datepicker table td.-highlighted-start,::ng-deep .datepicker .p-datepicker table td.-highlighted-end{position:relative}::ng-deep .datepicker .p-datepicker table td.-highlighted:before,::ng-deep .datepicker .p-datepicker table td.-highlighted-start:before,::ng-deep .datepicker .p-datepicker table td.-highlighted-end:before{content:\"\";position:absolute;top:.25em;left:0;right:0;bottom:.25em;background-color:#d9eef0;z-index:-1}::ng-deep .datepicker .p-datepicker table td.-highlighted-start:before{left:50%}::ng-deep .datepicker .p-datepicker table td.-highlighted-end:before{right:50%}::ng-deep .datepicker.-showing .p-inputtext{border-bottom-left-radius:0;border-bottom-right-radius:0;border-color:#007f80;box-shadow:0 0 0 1px #007f80}::ng-deep .datepicker.-showing .p-inputtext+.p-datepicker{border-top-left-radius:0;border-top-right-radius:0;border-top:2px solid #007F80}::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-month{margin-right:0}::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-prev,::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-next{width:1.5em;height:1.5em}::ng-deep .datepicker .p-datepicker.-has-ranges.p-datepicker-multiple-month{display:inline-grid;grid-template-columns:1fr 1fr;max-width:100vw;overflow-x:auto}::ng-deep .datepicker .p-datepicker.-has-ranges.p-datepicker-multiple-month .p-datepicker-group{padding-right:.5em}::ng-deep .datepicker__predefined-ranges .p-menu{border:none;border-radius:0;border-right:1px solid #CED1D5;background-color:#f7f7f8;font-size:.875rem;width:auto;min-width:150px;margin-right:.25em;height:100%;padding-top:.5em}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link{padding:.7em 2em .7em 1em;color:#007f80;font-weight:500}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link .p-menuitem-text{color:inherit}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link.-active{background-color:#d9eef0}.datepicker__actions{grid-column:span 3;display:flex;align-items:center;justify-content:flex-end;padding:1em;border-top:1px solid #CED1D5}.datepicker__btn{margin-left:.25em;font-weight:500}.datepicker__btn.btn-link{text-decoration:none}.datepicker__btn.btn-link:hover{text-decoration:underline}.datepicker__btn.-clear{margin-right:auto;margin-left:-.25em}\n"], components: [{ type: i1.Calendar, selector: "p-calendar", inputs: ["style", "styleClass", "inputStyle", "inputId", "name", "inputStyleClass", "placeholder", "ariaLabelledBy", "iconAriaLabel", "disabled", "dateFormat", "multipleSeparator", "rangeSeparator", "inline", "showOtherMonths", "selectOtherMonths", "showIcon", "icon", "appendTo", "readonlyInput", "shortYearCutoff", "monthNavigator", "yearNavigator", "hourFormat", "timeOnly", "stepHour", "stepMinute", "stepSecond", "showSeconds", "required", "showOnFocus", "showWeek", "dataType", "selectionMode", "maxDateCount", "showButtonBar", "todayButtonStyleClass", "clearButtonStyleClass", "autoZIndex", "baseZIndex", "panelStyleClass", "panelStyle", "keepInvalid", "hideOnDateTimeSelect", "numberOfMonths", "view", "touchUI", "timeSeparator", "focusTrap", "firstDayOfWeek", "showTransitionOptions", "hideTransitionOptions", "tabindex", "defaultDate", "minDate", "maxDate", "disabledDates", "disabledDays", "yearRange", "showTime", "locale"], outputs: ["onFocus", "onBlur", "onClose", "onSelect", "onInput", "onTodayClick", "onClearClick", "onMonthChange", "onYearChange", "onClickOutside", "onShow"] }, { type: i2.Menu, selector: "p-menu", inputs: ["model", "popup", "style", "styleClass", "appendTo", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions"], outputs: ["onShow", "onHide"] }], directives: [{ type: i3.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "async": i4.AsyncPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: DatepickerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'pa-ui-datepicker',
                    templateUrl: './datepicker.component.html',
                    styleUrls: ['./datepicker.component.scss'],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DatepickerComponent),
                            multi: true,
                        },
                    ],
                }]
        }], propDecorators: { showPredefinedRanges: [{
                type: Input
            }], clearable: [{
                type: Input
            }], inputId: [{
                type: Input
            }], selectionMode: [{
                type: Input
            }], value: [{
                type: Input
            }], predefinedRanges: [{
                type: Input
            }], $calendar: [{
                type: ViewChild,
                args: ['calendar']
            }], $predefinedRangesMenu: [{
                type: ViewChild,
                args: ['predefinedRangesMenu']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wZXJtYXNzaXN0LXVpL3NyYy9saWIvY29tcG9uZW50cy9kYXRlcGlja2VyL2RhdGVwaWNrZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcGVybWFzc2lzdC11aS9zcmMvbGliL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9kYXRlcGlja2VyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXpFLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDbkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7QUFFN0UsU0FBUywyQkFBMkIsQ0FBQyxHQUFXLEVBQUUsSUFBaUI7O0lBQ2pFLE1BQU0sTUFBTSxHQUFHLE1BQUEsWUFBWSxDQUFDLElBQUksRUFBRSxxQkFBcUIsQ0FBQywwQ0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5RCxJQUFJLENBQUMsTUFBTTtRQUFFLE9BQU8sR0FBRyxDQUFDO0lBRXhCLE9BQU8sR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztB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RFIsS0FBSztnQkFXRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBU2lCLFNBQVM7c0JBQS9CLFNBQVM7dUJBQUMsVUFBVTtnQkFDYyxxQkFBcUI7c0JBQXZELFNBQVM7dUJBQUMsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgZm9yd2FyZFJlZiwgSW5wdXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWVudUl0ZW0gfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBDYWxlbmRhciB9IGZyb20gJ3ByaW1lbmcvY2FsZW5kYXInO1xuaW1wb3J0IHsgTWVudSB9IGZyb20gJ3ByaW1lbmcvbWVudSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGRheXNBZ28sIG1vbnRoc0FnbyB9IGZyb20gJy4uLy4uL0BoZWxwZXJzL2RhdGVzJztcbmltcG9ydCB7IGdldFBhcmVudHNPZiwgd2FpdFVudGlsRXhpc3RzRnJvbSB9IGZyb20gJy4uLy4uL0BoZWxwZXJzL3V0aWxpdGllcyc7XG5cbmZ1bmN0aW9uIG11bHRpcGx5RGF5RGVwZW5kaW5nT25Hcm91cChkYXk6IG51bWJlciwgJGRheTogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgJGdyb3VwID0gZ2V0UGFyZW50c09mKCRkYXksICcucC1kYXRlcGlja2VyLWdyb3VwJyk/LlswXTtcblxuICBpZiAoISRncm91cCkgcmV0dXJuIGRheTtcblxuICByZXR1cm4gZGF5ICsgKDMyICogQXJyYXkuZnJvbSgkZ3JvdXAucGFyZW50Tm9kZSEuY2hpbGRyZW4pLmluZGV4T2YoJGdyb3VwKSk7XG59XG5cbmV4cG9ydCBjb25zdCBEQVRFUElDS0VSX1JBTkdFUyA9IHtcbiAgVG9kYXk6IHtcbiAgICBsYWJlbDogJ1RvZGF5JyxcbiAgICByYW5nZTogW25ldyBEYXRlKCksIG5ldyBEYXRlKCldLFxuICAgIHNpbmdsZTogbmV3IERhdGUoKSxcbiAgfSxcbiAgWWVzdGVyZGF5OiB7XG4gICAgbGFiZWw6ICdZZXN0ZXJkYXknLFxuICAgIHJhbmdlOiBbZGF5c0FnbygxKSwgZGF5c0FnbygxKV0sXG4gICAgc2luZ2xlOiBkYXlzQWdvKDEpLFxuICB9LFxuICBMYXN0N0RheXM6IHtcbiAgICBsYWJlbDogJ0xhc3QgNyBEYXlzJyxcbiAgICByYW5nZTogW2RheXNBZ28oNyksIG5ldyBEYXRlKCldLFxuICAgIHNpbmdsZTogZGF5c0Fnbyg3KSxcbiAgfSxcbiAgTGFzdDMwRGF5czoge1xuICAgIGxhYmVsOiAnTGFzdCAzMCBEYXlzJyxcbiAgICByYW5nZTogW2RheXNBZ28oMzApLCBuZXcgRGF0ZSgpXSxcbiAgICBzaW5nbGU6IGRheXNBZ28oMzApLFxuICB9LFxuICBUaGlzTW9udGg6IHtcbiAgICBsYWJlbDogJ1RoaXMgTW9udGgnLFxuICAgIHJhbmdlOiBbZGF5c0FnbygtMSwgbW9udGhzQWdvKDAsIDEpKSwgZGF5c0FnbygtMSwgbW9udGhzQWdvKDAsIDApKV0sXG4gICAgc2luZ2xlOiBtb250aHNBZ28oMCwgMSksXG4gIH0sXG4gIExhc3RNb250aDoge1xuICAgIGxhYmVsOiAnTGFzdCBNb250aCcsXG4gICAgcmFuZ2U6IFtkYXlzQWdvKC0xLCBtb250aHNBZ28oMSwgMSkpLCBkYXlzQWdvKDAsIG1vbnRoc0FnbygwLCAwKSldLFxuICAgIHNpbmdsZTogbW9udGhzQWdvKDEsIDEpLFxuICB9LFxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYS11aS1kYXRlcGlja2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGVwaWNrZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9kYXRlcGlja2VyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVwaWNrZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRGF0ZXBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgQElucHV0KCkgc2hvd1ByZWRlZmluZWRSYW5nZXMgPSB0cnVlO1xuICBASW5wdXQoKSBjbGVhcmFibGUgPSB0cnVlO1xuICBASW5wdXQoKSBpbnB1dElkID0gJyc7XG5cbiAgQElucHV0KClcbiAgc2V0IHNlbGVjdGlvbk1vZGUoc2VsZWN0aW9uTW9kZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25Nb2RlJCQubmV4dChzZWxlY3Rpb25Nb2RlKTtcbiAgfVxuXG4gIGdldCBzZWxlY3Rpb25Nb2RlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSQkLnZhbHVlO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHZhbHVlKHZhbHVlOiBEYXRlIHwgRGF0ZVtdIHwgbnVsbCl7XG4gICAgd2FpdFVudGlsRXhpc3RzRnJvbSgoKSA9PiB0aGlzLiRjYWxlbmRhciwgMjAsIDUwKS50aGVuKCRjYWxlbmRhciA9PiB7XG4gICAgICAkY2FsZW5kYXIud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuJGNhbGVuZGFyLnZhbHVlO1xuICB9XG5cbiAgQElucHV0KCkgcHJlZGVmaW5lZFJhbmdlczogTWVudUl0ZW1bXSA9IFtcbiAgICB7IGxhYmVsOiBEQVRFUElDS0VSX1JBTkdFUy5Ub2RheS5sYWJlbCwgY29tbWFuZDogZSA9PiB0aGlzLnNldFJhbmdlKGUuaXRlbSwgZS5vcmlnaW5hbEV2ZW50KSB9LFxuICAgIHsgbGFiZWw6IERBVEVQSUNLRVJfUkFOR0VTLlllc3RlcmRheS5sYWJlbCwgY29tbWFuZDogZSA9PiB0aGlzLnNldFJhbmdlKGUuaXRlbSwgZS5vcmlnaW5hbEV2ZW50KSB9LFxuICAgIHsgbGFiZWw6IERBVEVQSUNLRVJfUkFOR0VTLkxhc3Q3RGF5cy5sYWJlbCwgY29tbWFuZDogZSA9PiB0aGlzLnNldFJhbmdlKGUuaXRlbSwgZS5vcmlnaW5hbEV2ZW50KSB9LFxuICAgIHsgbGFiZWw6IERBVEVQSUNLRVJfUkFOR0VTLkxhc3QzMERheXMubGFiZWwsIGNvbW1hbmQ6IGUgPT4gdGhpcy5zZXRSYW5nZShlLml0ZW0sIGUub3JpZ2luYWxFdmVudCkgfSxcbiAgICB7IGxhYmVsOiBEQVRFUElDS0VSX1JBTkdFUy5UaGlzTW9udGgubGFiZWwsIGNvbW1hbmQ6IGUgPT4gdGhpcy5zZXRSYW5nZShlLml0ZW0sIGUub3JpZ2luYWxFdmVudCkgfSxcbiAgICB7IGxhYmVsOiBEQVRFUElDS0VSX1JBTkdFUy5MYXN0TW9udGgubGFiZWwsIGNvbW1hbmQ6IGUgPT4gdGhpcy5zZXRSYW5nZShlLml0ZW0sIGUub3JpZ2luYWxFdmVudCkgfSxcbiAgXTtcblxuICBAVmlld0NoaWxkKCdjYWxlbmRhcicpICRjYWxlbmRhciE6IENhbGVuZGFyO1xuICBAVmlld0NoaWxkKCdwcmVkZWZpbmVkUmFuZ2VzTWVudScpICRwcmVkZWZpbmVkUmFuZ2VzTWVudSE6IE1lbnU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBzaG93aW5nJCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcbiAgc2hvd2luZyQgPSB0aGlzLnNob3dpbmckJC5hc09ic2VydmFibGUoKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHNlbGVjdGlvbk1vZGUkJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoJ3NpbmdsZScpO1xuICBzZWxlY3Rpb25Nb2RlJCA9IHRoaXMuc2VsZWN0aW9uTW9kZSQkLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIG51bWJlck9mTW9udGhzJDogT2JzZXJ2YWJsZTxudW1iZXI+ID0gdGhpcy5zZWxlY3Rpb25Nb2RlJC5waXBlKG1hcCh4ID0+IHggPT09ICdyYW5nZScgPyAyIDogMSkpO1xuXG4gIHdyaXRlVmFsdWUodmFsdWU6IHVua25vd24pOiB2b2lkIHtcbiAgICB3YWl0VW50aWxFeGlzdHNGcm9tKCgpID0+IHRoaXMuJGNhbGVuZGFyLCAyMCwgNTApLnRoZW4oJGNhbGVuZGFyID0+IHtcbiAgICAgICRjYWxlbmRhci53cml0ZVZhbHVlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IG5ldmVyKTogdm9pZCB7XG4gICAgd2FpdFVudGlsRXhpc3RzRnJvbSgoKSA9PiB0aGlzLiRjYWxlbmRhciwgMjAsIDUwKS50aGVuKCRjYWxlbmRhciA9PiB7XG4gICAgICAkY2FsZW5kYXIucmVnaXN0ZXJPbkNoYW5nZShmbik7XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogbmV2ZXIpOiB2b2lkIHtcbiAgICB3YWl0VW50aWxFeGlzdHNGcm9tKCgpID0+IHRoaXMuJGNhbGVuZGFyLCAyMCwgNTApLnRoZW4oJGNhbGVuZGFyID0+IHtcbiAgICAgICRjYWxlbmRhci5yZWdpc3Rlck9uVG91Y2hlZChmbik7XG4gICAgfSk7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB3YWl0VW50aWxFeGlzdHNGcm9tKCgpID0+IHRoaXMuJGNhbGVuZGFyLCAyMCwgNTApLnRoZW4oJGNhbGVuZGFyID0+IHtcbiAgICAgICRjYWxlbmRhci5zZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIHRoaXMuc2hvd2luZyQkLm5leHQodHJ1ZSk7XG4gICAgdGhpcy5hZGRSYW5nZUludGVyYWN0aW9ucygpO1xuICB9XG5cbiAgb25Nb250aENoYW5nZSgpIHtcbiAgICB0aGlzLmFkZFJhbmdlSW50ZXJhY3Rpb25zKCk7XG4gIH1cblxuICBvblllYXJDaGFuZ2UoKSB7XG4gICAgdGhpcy5hZGRSYW5nZUludGVyYWN0aW9ucygpO1xuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICB0aGlzLnNob3dpbmckJC5uZXh0KGZhbHNlKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuJGNhbGVuZGFyPy51cGRhdGVNb2RlbChudWxsKTtcbiAgICB0aGlzLiRjYWxlbmRhcj8udXBkYXRlSW5wdXRmaWVsZCgpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgIHRoaXMuJGNhbGVuZGFyPy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICBzZXRSYW5nZShpdGVtOiBNZW51SXRlbSwgZT86IEV2ZW50KSB7XG4gICAgY29uc3QgcmFuZ2UgPSBPYmplY3QudmFsdWVzKERBVEVQSUNLRVJfUkFOR0VTKS5maW5kKHggPT4geC5sYWJlbCA9PT0gaXRlbS5sYWJlbCk7XG5cbiAgICBpZiAocmFuZ2UpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdyYW5nZScpIHtcbiAgICAgICAgdGhpcy4kY2FsZW5kYXIudXBkYXRlTW9kZWwoW10pO1xuXG4gICAgICAgIHJhbmdlLnJhbmdlLmZvckVhY2goZGF0ZSA9PiB7XG4gICAgICAgICAgdGhpcy4kY2FsZW5kYXIub25EYXRlU2VsZWN0KGUsIHtcbiAgICAgICAgICAgIHllYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoOiBkYXRlLmdldE1vbnRoKCksXG4gICAgICAgICAgICBkYXk6IGRhdGUuZ2V0VVRDRGF0ZSgpLFxuICAgICAgICAgICAgc2VsZWN0YWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRjYWxlbmRhci51cGRhdGVVSSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kY2FsZW5kYXIudXBkYXRlTW9kZWwocmFuZ2Uuc2luZ2xlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUFjdGl2ZU1lbnVJdGVtKGl0ZW0ubGFiZWwpO1xuICB9XG5cbiAgYXNOdW1iZXIoeDogdW5rbm93bikge1xuICAgIGlmICgheCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIHggYXMgbnVtYmVyO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRSYW5nZUludGVyYWN0aW9ucygpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlICE9PSAncmFuZ2UnKSByZXR1cm47XG5cbiAgICB3YWl0VW50aWxFeGlzdHNGcm9tKCgpID0+IHRoaXMuJGNhbGVuZGFyLmNvbnRlbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpLnRoZW4oKCRjb250ZW50Vmlld0NoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgICBsZXQgJHNob3dIb3ZlckZvcjogSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgICAgbGV0IHNob3dIb3ZlckZvcjogbnVtYmVyO1xuXG4gICAgICB0aGlzLnVwZGF0ZUFjdGl2ZU1lbnVJdGVtT25PcGVuKCk7XG5cbiAgICAgICRjb250ZW50Vmlld0NoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlIHRkID4gc3BhbicpLmZvckVhY2goKCRkYXRlOiBFbGVtZW50KSA9PiB7XG4gICAgICAgICRkYXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0ICRoaWdobGlnaHRlZDogSFRNTEVsZW1lbnRbXSA9ICRjb250ZW50Vmlld0NoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlIHRkIHNwYW4ucC1oaWdobGlnaHQ6bm90KC5wLWRpc2FibGVkKScpIGFzIHVua25vd24gYXMgSFRNTEVsZW1lbnRbXTtcblxuICAgICAgICAgIGlmICgkaGlnaGxpZ2h0ZWQ/Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgJHNob3dIb3ZlckZvciA9ICRoaWdobGlnaHRlZFswXS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgc2hvd0hvdmVyRm9yID0gbXVsdGlwbHlEYXlEZXBlbmRpbmdPbkdyb3VwKE51bWJlcigkaGlnaGxpZ2h0ZWRbMF0udGV4dENvbnRlbnQpLCAkc2hvd0hvdmVyRm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hvd0hvdmVyRm9yID0gMDtcbiAgICAgICAgICAgICRzaG93SG92ZXJGb3IgPSBudWxsO1xuICAgICAgICAgICAgJGNvbnRlbnRWaWV3Q2hpbGQucXVlcnlTZWxlY3RvckFsbCgndGFibGUgdGQnKS5mb3JFYWNoKCgkeDogRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAkeC5jbGFzc0xpc3QucmVtb3ZlKCctaGlnaGxpZ2h0ZWQnLCAnLWhpZ2hsaWdodGVkLXN0YXJ0JywgJy1oaWdobGlnaHRlZC1lbmQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRhdGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZSA9PiB7XG4gICAgICAgICAgaWYgKHNob3dIb3ZlckZvcikge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IG11bHRpcGx5RGF5RGVwZW5kaW5nT25Hcm91cChOdW1iZXIoKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS50ZXh0Q29udGVudCksIChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkpO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudCA+IHNob3dIb3ZlckZvcikge1xuICAgICAgICAgICAgICAkY29udGVudFZpZXdDaGlsZC5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZSB0ZDpub3QoLnAtZGF0ZXBpY2tlci1vdGhlci1tb250aCknKS5mb3JFYWNoKCgkeDogRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRheSA9IG11bHRpcGx5RGF5RGVwZW5kaW5nT25Hcm91cChOdW1iZXIoJHgudGV4dENvbnRlbnQpLCAkeCBhcyBIVE1MRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHNob3dIb3ZlckZvciAmJiBkYXkgPCBjdXJyZW50ICYmIGRheSA+IHNob3dIb3ZlckZvcikge1xuICAgICAgICAgICAgICAgICAgJHguY2xhc3NMaXN0LmFkZCgnLWhpZ2hsaWdodGVkJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICR4LmNsYXNzTGlzdC5yZW1vdmUoJy1oaWdobGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkYXkgPT09IGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICR4LmNsYXNzTGlzdC5hZGQoJy1oaWdobGlnaHRlZC1lbmQnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgJHguY2xhc3NMaXN0LnJlbW92ZSgnLWhpZ2hsaWdodGVkLWVuZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkYXkgPT09IHNob3dIb3ZlckZvcikge1xuICAgICAgICAgICAgICAgICAgJHguY2xhc3NMaXN0LmFkZCgnLWhpZ2hsaWdodGVkLXN0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICR4LmNsYXNzTGlzdC5yZW1vdmUoJy1oaWdobGlnaHRlZC1zdGFydCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAkY29udGVudFZpZXdDaGlsZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgJGNvbnRlbnRWaWV3Q2hpbGQucXVlcnlTZWxlY3RvckFsbCgndGFibGUgdGQnKS5mb3JFYWNoKCgkeDogRWxlbWVudCkgPT4ge1xuICAgICAgICAgICR4LmNsYXNzTGlzdC5yZW1vdmUoJy1oaWdobGlnaHRlZCcsICctaGlnaGxpZ2h0ZWQtc3RhcnQnLCAnLWhpZ2hsaWdodGVkLWVuZCcpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBY3RpdmVNZW51SXRlbShsYWJlbD86IHN0cmluZykge1xuICAgIGNvbnN0ICRyYW5nZSA9IHRoaXMuJHByZWRlZmluZWRSYW5nZXNNZW51Py5lbD8ubmF0aXZlRWxlbWVudD8ucXVlcnlTZWxlY3RvckFsbCgnLnAtbWVudWl0ZW0tbGluaycpIHx8IFtdO1xuICAgIGxldCBmb3VuZE1hdGNoID0gZmFsc2U7XG5cbiAgICAkcmFuZ2UuZm9yRWFjaCgoJGxpbms6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoJGxpbmsudGV4dENvbnRlbnQgPT09IGxhYmVsKSB7XG4gICAgICAgICRsaW5rLmNsYXNzTGlzdC5hZGQoJy1hY3RpdmUnKTtcbiAgICAgICAgZm91bmRNYXRjaCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkbGluay5jbGFzc0xpc3QucmVtb3ZlKCctYWN0aXZlJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIWZvdW5kTWF0Y2ggJiYgJHJhbmdlLmxlbmd0aCkge1xuICAgICAgKCRyYW5nZVskcmFuZ2UubGVuZ3RoIC0gMV0gYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdC5hZGQoJy1hY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFjdGl2ZU1lbnVJdGVtT25PcGVuKCkge1xuICAgIHRoaXMucHJlZGVmaW5lZFJhbmdlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgcmFuZ2UgPSBPYmplY3QudmFsdWVzKERBVEVQSUNLRVJfUkFOR0VTKS5maW5kKHggPT4geC5sYWJlbCA9PT0gaXRlbS5sYWJlbCk7XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdyYW5nZScpIHtcbiAgICAgICAgaWYgKHJhbmdlICYmIHRoaXMuJGNhbGVuZGFyLnZhbHVlPy5bMF0gPT09IHJhbmdlLnJhbmdlWzBdICYmIHRoaXMuJGNhbGVuZGFyLnZhbHVlPy5bMV0gPT09IHJhbmdlLnJhbmdlWzFdKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVBY3RpdmVNZW51SXRlbShpdGVtLmxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJhbmdlICYmIHRoaXMuJGNhbGVuZGFyLnZhbHVlID09PSByYW5nZS5zaW5nbGUpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUFjdGl2ZU1lbnVJdGVtKGl0ZW0ubGFiZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsIjxwLWNhbGVuZGFyICNjYWxlbmRhciBjbGFzcz1cImRhdGVwaWNrZXIgLXt7IHNlbGVjdGlvbk1vZGUgfX1cIiBbY2xhc3MuLXNob3dpbmddPVwic2hvd2luZyQgfCBhc3luY1wiIFtpbnB1dElkXT1cImlucHV0SWRcIiBbc2VsZWN0aW9uTW9kZV09XCJzZWxlY3Rpb25Nb2RlXCIgKG9uU2hvdyk9XCJvbk9wZW4oKVwiIChvbk1vbnRoQ2hhbmdlKT1cIm9uTW9udGhDaGFuZ2UoKVwiIChvblllYXJDaGFuZ2UpPVwib25ZZWFyQ2hhbmdlKClcIiAob25DbG9zZSk9XCJvbkNsb3NlKClcIiBbbnVtYmVyT2ZNb250aHNdPVwiYXNOdW1iZXIobnVtYmVyT2ZNb250aHMkIHwgYXN5bmMpXCIgcGFuZWxTdHlsZUNsYXNzPVwie3sgc2hvd1ByZWRlZmluZWRSYW5nZXMgPyAnLWhhcy1yYW5nZXMnIDogJycgfX1cIiAgZGF0ZUZvcm1hdD1cImRkL21tL3l5XCI+XG4gIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJoZWFkZXJcIj5cbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImhlYWRlclwiPjwvbmctY29udGFpbmVyPlxuICA8L25nLXRlbXBsYXRlPlxuXG4gIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJmb290ZXJcIj5cbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvb3RlclwiPjwvbmctY29udGFpbmVyPlxuICA8L25nLXRlbXBsYXRlPlxuPC9wLWNhbGVuZGFyPlxuXG48bmctdGVtcGxhdGUgI2hlYWRlcj5cbiAgPHAtbWVudSAjcHJlZGVmaW5lZFJhbmdlc01lbnUgY2xhc3M9XCJkYXRlcGlja2VyX19wcmVkZWZpbmVkLXJhbmdlc1wiICpuZ0lmPVwic2hvd1ByZWRlZmluZWRSYW5nZXMgJiYgc2VsZWN0aW9uTW9kZSA9PT0gJ3JhbmdlJ1wiIFttb2RlbF09XCJwcmVkZWZpbmVkUmFuZ2VzXCI+PC9wLW1lbnU+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2Zvb3Rlcj5cbiAgPGRpdiBjbGFzcz1cImRhdGVwaWNrZXJfX2FjdGlvbnNcIj5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiJGNhbGVuZGFyLnRvZ2dsZSgpXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIGRhdGVwaWNrZXJfX2J0biBvcmRlci0yXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICA8YnV0dG9uICpuZ0lmPVwiY2xlYXJhYmxlXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJjbGVhcigpXCIgY2xhc3M9XCJidG4gYnRuLWxpbmsgYnRuLXNtIGRhdGVwaWNrZXJfX2J0biAtY2xlYXIgb3JkZXItMVwiPkNsZWFyPC9idXR0b24+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==