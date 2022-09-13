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
        this.placeholder = '';
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
DatepickerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.16", type: DatepickerComponent, selector: "pa-ui-datepicker", inputs: { showPredefinedRanges: "showPredefinedRanges", clearable: "clearable", inputId: "inputId", placeholder: "placeholder", selectionMode: "selectionMode", value: "value", predefinedRanges: "predefinedRanges" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true,
        },
    ], viewQueries: [{ propertyName: "$calendar", first: true, predicate: ["calendar"], descendants: true }, { propertyName: "$predefinedRangesMenu", first: true, predicate: ["predefinedRangesMenu"], descendants: true }], ngImport: i0, template: "<p-calendar #calendar class=\"datepicker -{{ selectionMode }} -pa-ui\" [class.-showing]=\"showing$ | async\" [inputId]=\"inputId\" [selectionMode]=\"selectionMode\" (onShow)=\"onOpen()\" (onMonthChange)=\"onMonthChange()\" (onYearChange)=\"onYearChange()\" (onClose)=\"onClose()\" [numberOfMonths]=\"asNumber(numberOfMonths$ | async)\" panelStyleClass=\"-pa-ui {{ showPredefinedRanges ? '-has-ranges' : '' }}\"  dateFormat=\"dd/mm/yy\" [placeholder]=\"placeholder\">\n  <ng-template pTemplate=\"header\">\n    <ng-container [ngTemplateOutlet]=\"header\"></ng-container>\n  </ng-template>\n\n  <ng-template pTemplate=\"footer\">\n    <ng-container [ngTemplateOutlet]=\"footer\"></ng-container>\n  </ng-template>\n</p-calendar>\n\n<ng-template #header>\n  <p-menu #predefinedRangesMenu class=\"datepicker__predefined-ranges\" *ngIf=\"showPredefinedRanges && selectionMode === 'range'\" [model]=\"predefinedRanges\"></p-menu>\n</ng-template>\n\n<ng-template #footer>\n  <div class=\"datepicker__actions\">\n    <button type=\"button\" (click)=\"$calendar.toggle()\" class=\"btn btn-primary btn-sm datepicker__btn order-2\">Close</button>\n    <button *ngIf=\"clearable\" type=\"button\" (click)=\"clear()\" class=\"btn btn-link btn-sm datepicker__btn -clear order-1\">Clear</button>\n  </div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";.-pa-ui{--text-color: #081932;--text-color-secondary: #667180;--primary-color: #007F80;--primary-color-text: #ffffff;--font-family: Inter var, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Noto Sans, Liberation Sans, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji}.datepicker{display:block}::ng-deep .datepicker .p-inputtext{min-width:265px}::ng-deep .datepicker .p-calendar:after{content:\"\\e927\";font-family:\"primeicons\";position:absolute;top:.5em;right:.5em;font-size:1.3em;color:#168c8e;cursor:pointer;pointer-events:none}::ng-deep .datepicker .p-calendar .p-datepicker{top:calc(100% - 1px)!important;right:0;font-size:.875rem;padding-top:0}::ng-deep .datepicker .p-calendar .p-datepicker.p-datepicker-multiple-month{right:auto}::ng-deep .datepicker .p-datepicker .p-datepicker-header{border-bottom:none;padding-bottom:0;padding-top:0;margin-bottom:-.75em}::ng-deep .datepicker .p-link,::ng-deep .datepicker .p-component,::ng-deep .datepicker .p-datepicker table{font-size:inherit}::ng-deep .datepicker .p-datepicker{padding:0}::ng-deep .datepicker .p-datepicker table th{text-align:center;font-weight:600}::ng-deep .datepicker .p-datepicker table th,::ng-deep .datepicker .p-datepicker table td{padding:.25em .1em}::ng-deep .datepicker .p-datepicker table th>span,::ng-deep .datepicker .p-datepicker table td>span{width:2em;height:2em}::ng-deep .datepicker .p-datepicker table td.p-datepicker-today>span{background-color:#cdefef}::ng-deep .datepicker .p-datepicker table td>span.p-highlight,::ng-deep .datepicker .p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):hover{color:#fff;background-color:#007f80;font-weight:500}::ng-deep .datepicker .p-datepicker table td.-highlighted,::ng-deep .datepicker .p-datepicker table td.-highlighted-start,::ng-deep .datepicker .p-datepicker table td.-highlighted-end{position:relative}::ng-deep .datepicker .p-datepicker table td.-highlighted:before,::ng-deep .datepicker .p-datepicker table td.-highlighted-start:before,::ng-deep .datepicker .p-datepicker table td.-highlighted-end:before{content:\"\";position:absolute;top:.25em;left:0;right:0;bottom:.25em;background-color:#d9eef0;z-index:-1}::ng-deep .datepicker .p-datepicker table td.-highlighted-start:before{left:50%}::ng-deep .datepicker .p-datepicker table td.-highlighted-end:before{right:50%}::ng-deep .datepicker.-showing .p-inputtext{border-bottom-left-radius:0;border-bottom-right-radius:0;border-color:#007f80;box-shadow:0 0 0 1px #007f80}::ng-deep .datepicker.-showing .p-inputtext+.p-datepicker{border-top-left-radius:0;border-top-right-radius:0;border-top:2px solid #007F80}::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-month{margin-right:0}::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-prev,::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-next{width:1.5em;height:1.5em}::ng-deep .datepicker .p-datepicker.-has-ranges.p-datepicker-multiple-month{display:inline-grid;grid-template-columns:1fr 1fr;max-width:100vw;overflow-x:auto}::ng-deep .datepicker .p-datepicker.-has-ranges.p-datepicker-multiple-month .p-datepicker-group{padding-right:.5em}::ng-deep .datepicker__predefined-ranges .p-menu{border:none;border-radius:0;border-right:1px solid #CED1D5;background-color:#f7f7f8;font-size:.875rem;width:auto;min-width:150px;margin-right:.25em;height:100%;padding-top:.5em}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link{padding:.7em 2em .7em 1em;color:#007f80;font-weight:500}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link .p-menuitem-text{color:inherit}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link.-active{background-color:#d9eef0}.datepicker__actions{grid-column:span 3;display:flex;align-items:center;justify-content:flex-end;padding:1em;border-top:1px solid #CED1D5}.datepicker__btn{margin-left:.25em;font-weight:500}.datepicker__btn.btn-link{text-decoration:none}.datepicker__btn.btn-link:hover{text-decoration:underline}.datepicker__btn.-clear{margin-right:auto;margin-left:-.25em}\n"], components: [{ type: i1.Calendar, selector: "p-calendar", inputs: ["style", "styleClass", "inputStyle", "inputId", "name", "inputStyleClass", "placeholder", "ariaLabelledBy", "iconAriaLabel", "disabled", "dateFormat", "multipleSeparator", "rangeSeparator", "inline", "showOtherMonths", "selectOtherMonths", "showIcon", "icon", "appendTo", "readonlyInput", "shortYearCutoff", "monthNavigator", "yearNavigator", "hourFormat", "timeOnly", "stepHour", "stepMinute", "stepSecond", "showSeconds", "required", "showOnFocus", "showWeek", "dataType", "selectionMode", "maxDateCount", "showButtonBar", "todayButtonStyleClass", "clearButtonStyleClass", "autoZIndex", "baseZIndex", "panelStyleClass", "panelStyle", "keepInvalid", "hideOnDateTimeSelect", "numberOfMonths", "view", "touchUI", "timeSeparator", "focusTrap", "firstDayOfWeek", "showTransitionOptions", "hideTransitionOptions", "tabindex", "defaultDate", "minDate", "maxDate", "disabledDates", "disabledDays", "yearRange", "showTime", "locale"], outputs: ["onFocus", "onBlur", "onClose", "onSelect", "onInput", "onTodayClick", "onClearClick", "onMonthChange", "onYearChange", "onClickOutside", "onShow"] }, { type: i2.Menu, selector: "p-menu", inputs: ["model", "popup", "style", "styleClass", "appendTo", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions"], outputs: ["onShow", "onHide"] }], directives: [{ type: i3.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "async": i4.AsyncPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
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
            }], placeholder: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9wZXJtYXNzaXN0LXVpL3NyYy9saWIvY29tcG9uZW50cy9kYXRlcGlja2VyL2RhdGVwaWNrZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcGVybWFzc2lzdC11aS9zcmMvbGliL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9kYXRlcGlja2VyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXpFLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDbkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7QUFFN0UsU0FBUywyQkFBMkIsQ0FBQyxHQUFXLEVBQUUsSUFBaUI7O0lBQ2pFLE1BQU0sTUFBTSxHQUFHLE1BQUEsWUFBWSxDQUFDLElBQUksRUFBRSxxQkFBcUIsQ0FBQywwQ0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5RCxJQUFJLENBQUMsTUFBTTtRQUFFLE9BQU8sR0FBRyxDQUFDO0lBRXhCLE9BQU8sR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztB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O3NCQUFuQixLQUFLO2dCQUdGLGFBQWE7c0JBRGhCLEtBQUs7Z0JBVUYsS0FBSztzQkFEUixLQUFLO2dCQVdHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFTaUIsU0FBUztzQkFBL0IsU0FBUzt1QkFBQyxVQUFVO2dCQUNjLHFCQUFxQjtzQkFBdkQsU0FBUzt1QkFBQyxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBmb3J3YXJkUmVmLCBJbnB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNZW51SXRlbSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IENhbGVuZGFyIH0gZnJvbSAncHJpbWVuZy9jYWxlbmRhcic7XG5pbXBvcnQgeyBNZW51IH0gZnJvbSAncHJpbWVuZy9tZW51JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgZGF5c0FnbywgbW9udGhzQWdvIH0gZnJvbSAnLi4vLi4vQGhlbHBlcnMvZGF0ZXMnO1xuaW1wb3J0IHsgZ2V0UGFyZW50c09mLCB3YWl0VW50aWxFeGlzdHNGcm9tIH0gZnJvbSAnLi4vLi4vQGhlbHBlcnMvdXRpbGl0aWVzJztcblxuZnVuY3Rpb24gbXVsdGlwbHlEYXlEZXBlbmRpbmdPbkdyb3VwKGRheTogbnVtYmVyLCAkZGF5OiBIVE1MRWxlbWVudCkge1xuICBjb25zdCAkZ3JvdXAgPSBnZXRQYXJlbnRzT2YoJGRheSwgJy5wLWRhdGVwaWNrZXItZ3JvdXAnKT8uWzBdO1xuXG4gIGlmICghJGdyb3VwKSByZXR1cm4gZGF5O1xuXG4gIHJldHVybiBkYXkgKyAoMzIgKiBBcnJheS5mcm9tKCRncm91cC5wYXJlbnROb2RlIS5jaGlsZHJlbikuaW5kZXhPZigkZ3JvdXApKTtcbn1cblxuZXhwb3J0IGNvbnN0IERBVEVQSUNLRVJfUkFOR0VTID0ge1xuICBUb2RheToge1xuICAgIGxhYmVsOiAnVG9kYXknLFxuICAgIHJhbmdlOiBbbmV3IERhdGUoKSwgbmV3IERhdGUoKV0sXG4gICAgc2luZ2xlOiBuZXcgRGF0ZSgpLFxuICB9LFxuICBZZXN0ZXJkYXk6IHtcbiAgICBsYWJlbDogJ1llc3RlcmRheScsXG4gICAgcmFuZ2U6IFtkYXlzQWdvKDEpLCBkYXlzQWdvKDEpXSxcbiAgICBzaW5nbGU6IGRheXNBZ28oMSksXG4gIH0sXG4gIExhc3Q3RGF5czoge1xuICAgIGxhYmVsOiAnTGFzdCA3IERheXMnLFxuICAgIHJhbmdlOiBbZGF5c0Fnbyg3KSwgbmV3IERhdGUoKV0sXG4gICAgc2luZ2xlOiBkYXlzQWdvKDcpLFxuICB9LFxuICBMYXN0MzBEYXlzOiB7XG4gICAgbGFiZWw6ICdMYXN0IDMwIERheXMnLFxuICAgIHJhbmdlOiBbZGF5c0FnbygzMCksIG5ldyBEYXRlKCldLFxuICAgIHNpbmdsZTogZGF5c0FnbygzMCksXG4gIH0sXG4gIFRoaXNNb250aDoge1xuICAgIGxhYmVsOiAnVGhpcyBNb250aCcsXG4gICAgcmFuZ2U6IFtkYXlzQWdvKC0xLCBtb250aHNBZ28oMCwgMSkpLCBkYXlzQWdvKC0xLCBtb250aHNBZ28oMCwgMCkpXSxcbiAgICBzaW5nbGU6IG1vbnRoc0FnbygwLCAxKSxcbiAgfSxcbiAgTGFzdE1vbnRoOiB7XG4gICAgbGFiZWw6ICdMYXN0IE1vbnRoJyxcbiAgICByYW5nZTogW2RheXNBZ28oLTEsIG1vbnRoc0FnbygxLCAxKSksIGRheXNBZ28oMCwgbW9udGhzQWdvKDAsIDApKV0sXG4gICAgc2luZ2xlOiBtb250aHNBZ28oMSwgMSksXG4gIH0sXG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BhLXVpLWRhdGVwaWNrZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2RhdGVwaWNrZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZXBpY2tlckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBASW5wdXQoKSBzaG93UHJlZGVmaW5lZFJhbmdlcyA9IHRydWU7XG4gIEBJbnB1dCgpIGNsZWFyYWJsZSA9IHRydWU7XG5cbiAgQElucHV0KCkgaW5wdXRJZCA9ICcnO1xuICBASW5wdXQoKSBwbGFjZWhvbGRlciA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBzZWxlY3Rpb25Nb2RlKHNlbGVjdGlvbk1vZGU6IHN0cmluZykge1xuICAgIHRoaXMuc2VsZWN0aW9uTW9kZSQkLm5leHQoc2VsZWN0aW9uTW9kZSk7XG4gIH1cblxuICBnZXQgc2VsZWN0aW9uTW9kZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUkJC52YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCB2YWx1ZSh2YWx1ZTogRGF0ZSB8IERhdGVbXSB8IG51bGwpe1xuICAgIHdhaXRVbnRpbEV4aXN0c0Zyb20oKCkgPT4gdGhpcy4kY2FsZW5kYXIsIDIwLCA1MCkudGhlbigkY2FsZW5kYXIgPT4ge1xuICAgICAgJGNhbGVuZGFyLndyaXRlVmFsdWUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLiRjYWxlbmRhci52YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpIHByZWRlZmluZWRSYW5nZXM6IE1lbnVJdGVtW10gPSBbXG4gICAgeyBsYWJlbDogREFURVBJQ0tFUl9SQU5HRVMuVG9kYXkubGFiZWwsIGNvbW1hbmQ6IGUgPT4gdGhpcy5zZXRSYW5nZShlLml0ZW0sIGUub3JpZ2luYWxFdmVudCkgfSxcbiAgICB7IGxhYmVsOiBEQVRFUElDS0VSX1JBTkdFUy5ZZXN0ZXJkYXkubGFiZWwsIGNvbW1hbmQ6IGUgPT4gdGhpcy5zZXRSYW5nZShlLml0ZW0sIGUub3JpZ2luYWxFdmVudCkgfSxcbiAgICB7IGxhYmVsOiBEQVRFUElDS0VSX1JBTkdFUy5MYXN0N0RheXMubGFiZWwsIGNvbW1hbmQ6IGUgPT4gdGhpcy5zZXRSYW5nZShlLml0ZW0sIGUub3JpZ2luYWxFdmVudCkgfSxcbiAgICB7IGxhYmVsOiBEQVRFUElDS0VSX1JBTkdFUy5MYXN0MzBEYXlzLmxhYmVsLCBjb21tYW5kOiBlID0+IHRoaXMuc2V0UmFuZ2UoZS5pdGVtLCBlLm9yaWdpbmFsRXZlbnQpIH0sXG4gICAgeyBsYWJlbDogREFURVBJQ0tFUl9SQU5HRVMuVGhpc01vbnRoLmxhYmVsLCBjb21tYW5kOiBlID0+IHRoaXMuc2V0UmFuZ2UoZS5pdGVtLCBlLm9yaWdpbmFsRXZlbnQpIH0sXG4gICAgeyBsYWJlbDogREFURVBJQ0tFUl9SQU5HRVMuTGFzdE1vbnRoLmxhYmVsLCBjb21tYW5kOiBlID0+IHRoaXMuc2V0UmFuZ2UoZS5pdGVtLCBlLm9yaWdpbmFsRXZlbnQpIH0sXG4gIF07XG5cbiAgQFZpZXdDaGlsZCgnY2FsZW5kYXInKSAkY2FsZW5kYXIhOiBDYWxlbmRhcjtcbiAgQFZpZXdDaGlsZCgncHJlZGVmaW5lZFJhbmdlc01lbnUnKSAkcHJlZGVmaW5lZFJhbmdlc01lbnUhOiBNZW51O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc2hvd2luZyQkID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG4gIHNob3dpbmckID0gdGhpcy5zaG93aW5nJCQuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBzZWxlY3Rpb25Nb2RlJCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KCdzaW5nbGUnKTtcbiAgc2VsZWN0aW9uTW9kZSQgPSB0aGlzLnNlbGVjdGlvbk1vZGUkJC5hc09ic2VydmFibGUoKTtcblxuICBudW1iZXJPZk1vbnRocyQ6IE9ic2VydmFibGU8bnVtYmVyPiA9IHRoaXMuc2VsZWN0aW9uTW9kZSQucGlwZShtYXAoeCA9PiB4ID09PSAncmFuZ2UnID8gMiA6IDEpKTtcblxuICB3cml0ZVZhbHVlKHZhbHVlOiB1bmtub3duKTogdm9pZCB7XG4gICAgd2FpdFVudGlsRXhpc3RzRnJvbSgoKSA9PiB0aGlzLiRjYWxlbmRhciwgMjAsIDUwKS50aGVuKCRjYWxlbmRhciA9PiB7XG4gICAgICAkY2FsZW5kYXIud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBuZXZlcik6IHZvaWQge1xuICAgIHdhaXRVbnRpbEV4aXN0c0Zyb20oKCkgPT4gdGhpcy4kY2FsZW5kYXIsIDIwLCA1MCkudGhlbigkY2FsZW5kYXIgPT4ge1xuICAgICAgJGNhbGVuZGFyLnJlZ2lzdGVyT25DaGFuZ2UoZm4pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IG5ldmVyKTogdm9pZCB7XG4gICAgd2FpdFVudGlsRXhpc3RzRnJvbSgoKSA9PiB0aGlzLiRjYWxlbmRhciwgMjAsIDUwKS50aGVuKCRjYWxlbmRhciA9PiB7XG4gICAgICAkY2FsZW5kYXIucmVnaXN0ZXJPblRvdWNoZWQoZm4pO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgd2FpdFVudGlsRXhpc3RzRnJvbSgoKSA9PiB0aGlzLiRjYWxlbmRhciwgMjAsIDUwKS50aGVuKCRjYWxlbmRhciA9PiB7XG4gICAgICAkY2FsZW5kYXIuc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uT3BlbigpIHtcbiAgICB0aGlzLnNob3dpbmckJC5uZXh0KHRydWUpO1xuICAgIHRoaXMuYWRkUmFuZ2VJbnRlcmFjdGlvbnMoKTtcbiAgfVxuXG4gIG9uTW9udGhDaGFuZ2UoKSB7XG4gICAgdGhpcy5hZGRSYW5nZUludGVyYWN0aW9ucygpO1xuICB9XG5cbiAgb25ZZWFyQ2hhbmdlKCkge1xuICAgIHRoaXMuYWRkUmFuZ2VJbnRlcmFjdGlvbnMoKTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy5zaG93aW5nJCQubmV4dChmYWxzZSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLiRjYWxlbmRhcj8udXBkYXRlTW9kZWwobnVsbCk7XG4gICAgdGhpcy4kY2FsZW5kYXI/LnVwZGF0ZUlucHV0ZmllbGQoKTtcblxuICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICB0aGlzLiRjYWxlbmRhcj8udG9nZ2xlKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0UmFuZ2UoaXRlbTogTWVudUl0ZW0sIGU/OiBFdmVudCkge1xuICAgIGNvbnN0IHJhbmdlID0gT2JqZWN0LnZhbHVlcyhEQVRFUElDS0VSX1JBTkdFUykuZmluZCh4ID0+IHgubGFiZWwgPT09IGl0ZW0ubGFiZWwpO1xuXG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSAncmFuZ2UnKSB7XG4gICAgICAgIHRoaXMuJGNhbGVuZGFyLnVwZGF0ZU1vZGVsKFtdKTtcblxuICAgICAgICByYW5nZS5yYW5nZS5mb3JFYWNoKGRhdGUgPT4ge1xuICAgICAgICAgIHRoaXMuJGNhbGVuZGFyLm9uRGF0ZVNlbGVjdChlLCB7XG4gICAgICAgICAgICB5ZWFyOiBkYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICAgICAgICBtb250aDogZGF0ZS5nZXRNb250aCgpLFxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldFVUQ0RhdGUoKSxcbiAgICAgICAgICAgIHNlbGVjdGFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kY2FsZW5kYXIudXBkYXRlVUkoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGNhbGVuZGFyLnVwZGF0ZU1vZGVsKHJhbmdlLnNpbmdsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVBY3RpdmVNZW51SXRlbShpdGVtLmxhYmVsKTtcbiAgfVxuXG4gIGFzTnVtYmVyKHg6IHVua25vd24pIHtcbiAgICBpZiAoIXgpIHJldHVybiAwO1xuICAgIHJldHVybiB4IGFzIG51bWJlcjtcbiAgfVxuXG4gIHByaXZhdGUgYWRkUmFuZ2VJbnRlcmFjdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSAhPT0gJ3JhbmdlJykgcmV0dXJuO1xuXG4gICAgd2FpdFVudGlsRXhpc3RzRnJvbSgoKSA9PiB0aGlzLiRjYWxlbmRhci5jb250ZW50Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50KS50aGVuKCgkY29udGVudFZpZXdDaGlsZDogRWxlbWVudCkgPT4ge1xuICAgICAgbGV0ICRzaG93SG92ZXJGb3I6IEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICAgIGxldCBzaG93SG92ZXJGb3I6IG51bWJlcjtcblxuICAgICAgdGhpcy51cGRhdGVBY3RpdmVNZW51SXRlbU9uT3BlbigpO1xuXG4gICAgICAkY29udGVudFZpZXdDaGlsZC5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZSB0ZCA+IHNwYW4nKS5mb3JFYWNoKCgkZGF0ZTogRWxlbWVudCkgPT4ge1xuICAgICAgICAkZGF0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICBjb25zdCAkaGlnaGxpZ2h0ZWQ6IEhUTUxFbGVtZW50W10gPSAkY29udGVudFZpZXdDaGlsZC5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZSB0ZCBzcGFuLnAtaGlnaGxpZ2h0Om5vdCgucC1kaXNhYmxlZCknKSBhcyB1bmtub3duIGFzIEhUTUxFbGVtZW50W107XG5cbiAgICAgICAgICBpZiAoJGhpZ2hsaWdodGVkPy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICRzaG93SG92ZXJGb3IgPSAkaGlnaGxpZ2h0ZWRbMF0ucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIHNob3dIb3ZlckZvciA9IG11bHRpcGx5RGF5RGVwZW5kaW5nT25Hcm91cChOdW1iZXIoJGhpZ2hsaWdodGVkWzBdLnRleHRDb250ZW50KSwgJHNob3dIb3ZlckZvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNob3dIb3ZlckZvciA9IDA7XG4gICAgICAgICAgICAkc2hvd0hvdmVyRm9yID0gbnVsbDtcbiAgICAgICAgICAgICRjb250ZW50Vmlld0NoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlIHRkJykuZm9yRWFjaCgoJHg6IEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgJHguY2xhc3NMaXN0LnJlbW92ZSgnLWhpZ2hsaWdodGVkJywgJy1oaWdobGlnaHRlZC1zdGFydCcsICctaGlnaGxpZ2h0ZWQtZW5kJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkYXRlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGUgPT4ge1xuICAgICAgICAgIGlmIChzaG93SG92ZXJGb3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSBtdWx0aXBseURheURlcGVuZGluZ09uR3JvdXAoTnVtYmVyKChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkudGV4dENvbnRlbnQpLCAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBzaG93SG92ZXJGb3IpIHtcbiAgICAgICAgICAgICAgJGNvbnRlbnRWaWV3Q2hpbGQucXVlcnlTZWxlY3RvckFsbCgndGFibGUgdGQ6bm90KC5wLWRhdGVwaWNrZXItb3RoZXItbW9udGgpJykuZm9yRWFjaCgoJHg6IEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXkgPSBtdWx0aXBseURheURlcGVuZGluZ09uR3JvdXAoTnVtYmVyKCR4LnRleHRDb250ZW50KSwgJHggYXMgSFRNTEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBzaG93SG92ZXJGb3IgJiYgZGF5IDwgY3VycmVudCAmJiBkYXkgPiBzaG93SG92ZXJGb3IpIHtcbiAgICAgICAgICAgICAgICAgICR4LmNsYXNzTGlzdC5hZGQoJy1oaWdobGlnaHRlZCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkeC5jbGFzc0xpc3QucmVtb3ZlKCctaGlnaGxpZ2h0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF5ID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAkeC5jbGFzc0xpc3QuYWRkKCctaGlnaGxpZ2h0ZWQtZW5kJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICR4LmNsYXNzTGlzdC5yZW1vdmUoJy1oaWdobGlnaHRlZC1lbmQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF5ID09PSBzaG93SG92ZXJGb3IpIHtcbiAgICAgICAgICAgICAgICAgICR4LmNsYXNzTGlzdC5hZGQoJy1oaWdobGlnaHRlZC1zdGFydCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkeC5jbGFzc0xpc3QucmVtb3ZlKCctaGlnaGxpZ2h0ZWQtc3RhcnQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgJGNvbnRlbnRWaWV3Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgICRjb250ZW50Vmlld0NoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlIHRkJykuZm9yRWFjaCgoJHg6IEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAkeC5jbGFzc0xpc3QucmVtb3ZlKCctaGlnaGxpZ2h0ZWQnLCAnLWhpZ2hsaWdodGVkLXN0YXJ0JywgJy1oaWdobGlnaHRlZC1lbmQnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQWN0aXZlTWVudUl0ZW0obGFiZWw/OiBzdHJpbmcpIHtcbiAgICBjb25zdCAkcmFuZ2UgPSB0aGlzLiRwcmVkZWZpbmVkUmFuZ2VzTWVudT8uZWw/Lm5hdGl2ZUVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wLW1lbnVpdGVtLWxpbmsnKSB8fCBbXTtcbiAgICBsZXQgZm91bmRNYXRjaCA9IGZhbHNlO1xuXG4gICAgJHJhbmdlLmZvckVhY2goKCRsaW5rOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKCRsaW5rLnRleHRDb250ZW50ID09PSBsYWJlbCkge1xuICAgICAgICAkbGluay5jbGFzc0xpc3QuYWRkKCctYWN0aXZlJyk7XG4gICAgICAgIGZvdW5kTWF0Y2ggPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGxpbmsuY2xhc3NMaXN0LnJlbW92ZSgnLWFjdGl2ZScpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCFmb3VuZE1hdGNoICYmICRyYW5nZS5sZW5ndGgpIHtcbiAgICAgICgkcmFuZ2VbJHJhbmdlLmxlbmd0aCAtIDFdIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuYWRkKCctYWN0aXZlJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBY3RpdmVNZW51SXRlbU9uT3BlbigpIHtcbiAgICB0aGlzLnByZWRlZmluZWRSYW5nZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IHJhbmdlID0gT2JqZWN0LnZhbHVlcyhEQVRFUElDS0VSX1JBTkdFUykuZmluZCh4ID0+IHgubGFiZWwgPT09IGl0ZW0ubGFiZWwpO1xuXG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSAncmFuZ2UnKSB7XG4gICAgICAgIGlmIChyYW5nZSAmJiB0aGlzLiRjYWxlbmRhci52YWx1ZT8uWzBdID09PSByYW5nZS5yYW5nZVswXSAmJiB0aGlzLiRjYWxlbmRhci52YWx1ZT8uWzFdID09PSByYW5nZS5yYW5nZVsxXSkge1xuICAgICAgICAgIHRoaXMudXBkYXRlQWN0aXZlTWVudUl0ZW0oaXRlbS5sYWJlbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyYW5nZSAmJiB0aGlzLiRjYWxlbmRhci52YWx1ZSA9PT0gcmFuZ2Uuc2luZ2xlKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVBY3RpdmVNZW51SXRlbShpdGVtLmxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCI8cC1jYWxlbmRhciAjY2FsZW5kYXIgY2xhc3M9XCJkYXRlcGlja2VyIC17eyBzZWxlY3Rpb25Nb2RlIH19IC1wYS11aVwiIFtjbGFzcy4tc2hvd2luZ109XCJzaG93aW5nJCB8IGFzeW5jXCIgW2lucHV0SWRdPVwiaW5wdXRJZFwiIFtzZWxlY3Rpb25Nb2RlXT1cInNlbGVjdGlvbk1vZGVcIiAob25TaG93KT1cIm9uT3BlbigpXCIgKG9uTW9udGhDaGFuZ2UpPVwib25Nb250aENoYW5nZSgpXCIgKG9uWWVhckNoYW5nZSk9XCJvblllYXJDaGFuZ2UoKVwiIChvbkNsb3NlKT1cIm9uQ2xvc2UoKVwiIFtudW1iZXJPZk1vbnRoc109XCJhc051bWJlcihudW1iZXJPZk1vbnRocyQgfCBhc3luYylcIiBwYW5lbFN0eWxlQ2xhc3M9XCItcGEtdWkge3sgc2hvd1ByZWRlZmluZWRSYW5nZXMgPyAnLWhhcy1yYW5nZXMnIDogJycgfX1cIiAgZGF0ZUZvcm1hdD1cImRkL21tL3l5XCIgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCI+XG4gIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJoZWFkZXJcIj5cbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImhlYWRlclwiPjwvbmctY29udGFpbmVyPlxuICA8L25nLXRlbXBsYXRlPlxuXG4gIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJmb290ZXJcIj5cbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvb3RlclwiPjwvbmctY29udGFpbmVyPlxuICA8L25nLXRlbXBsYXRlPlxuPC9wLWNhbGVuZGFyPlxuXG48bmctdGVtcGxhdGUgI2hlYWRlcj5cbiAgPHAtbWVudSAjcHJlZGVmaW5lZFJhbmdlc01lbnUgY2xhc3M9XCJkYXRlcGlja2VyX19wcmVkZWZpbmVkLXJhbmdlc1wiICpuZ0lmPVwic2hvd1ByZWRlZmluZWRSYW5nZXMgJiYgc2VsZWN0aW9uTW9kZSA9PT0gJ3JhbmdlJ1wiIFttb2RlbF09XCJwcmVkZWZpbmVkUmFuZ2VzXCI+PC9wLW1lbnU+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2Zvb3Rlcj5cbiAgPGRpdiBjbGFzcz1cImRhdGVwaWNrZXJfX2FjdGlvbnNcIj5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiJGNhbGVuZGFyLnRvZ2dsZSgpXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIGRhdGVwaWNrZXJfX2J0biBvcmRlci0yXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICA8YnV0dG9uICpuZ0lmPVwiY2xlYXJhYmxlXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJjbGVhcigpXCIgY2xhc3M9XCJidG4gYnRuLWxpbmsgYnRuLXNtIGRhdGVwaWNrZXJfX2J0biAtY2xlYXIgb3JkZXItMVwiPkNsZWFyPC9idXR0b24+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==