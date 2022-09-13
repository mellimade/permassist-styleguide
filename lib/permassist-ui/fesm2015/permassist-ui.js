import * as i0 from '@angular/core';
import { forwardRef, Component, ChangeDetectionStrategy, Input, ViewChild, NgModule } from '@angular/core';
import * as i4 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1 from 'primeng/calendar';
import { CalendarModule } from 'primeng/calendar';
import * as i2 from 'primeng/menu';
import { MenuModule } from 'primeng/menu';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i3 from 'primeng/api';

function daysAgo(days = 0, date) {
    date = date || new Date();
    date.setDate(date.getDate() - days);
    return date;
}
function monthsAgo(months = 0, day = 1) {
    return new Date(new Date().getFullYear(), new Date().getMonth() - months, day);
}
function daysInMonthAgo(months = 0) {
    return new Date(new Date().getFullYear(), new Date().getMonth() - months, 0).getDate();
}
function dayRange(from = 0, to = 0) {
    const range = [];
    for (let i = from; i <= to; i++) {
        var date = new Date();
        date.setDate(date.getDate() - i);
        range.push(date);
    }
    return range;
}
function monthRange(from = 0, to = 0) {
    const range = [];
    let year = new Date().getFullYear();
    let month = to;
    for (let i = from; i <= month; i++) {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let j = 0; j < daysInMonth; j++) {
            range.push(new Date(year, month, j));
        }
    }
    return range;
}

function waitUntilExistsFrom(fn, maxRetries = 20, timeout = 10) {
    return new Promise(resolve => {
        retry(fn, resolve, maxRetries, timeout);
    });
}
function getParentsOf($element, selector = '') {
    const $parents = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (; $element && $element !== document; $element = $element.parentNode) {
        if (selector) {
            if ($element.matches(selector)) {
                $parents.push($element);
            }
            continue;
        }
        $parents.push($element);
    }
    return $parents;
}
function retry(fn, resolve, maxRetries = 20, timeout = 10, retries = 0) {
    retries++;
    setTimeout(() => {
        const response = fn();
        if ((!response || response === undefined) && retries < maxRetries) {
            retry(fn, resolve, maxRetries, timeout, retries);
        }
        else {
            resolve(response);
        }
    }, timeout);
}

function multiplyDayDependingOnGroup(day, $day) {
    var _a;
    const $group = (_a = getParentsOf($day, '.p-datepicker-group')) === null || _a === void 0 ? void 0 : _a[0];
    if (!$group)
        return day;
    return day + (32 * Array.from($group.parentNode.children).indexOf($group));
}
const DATEPICKER_RANGES = {
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
class DatepickerComponent {
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

class PermassistUIModule {
}
PermassistUIModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: PermassistUIModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PermassistUIModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: PermassistUIModule, declarations: [DatepickerComponent], imports: [CommonModule,
        CalendarModule,
        MenuModule], exports: [DatepickerComponent,
        CalendarModule,
        MenuModule] });
PermassistUIModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: PermassistUIModule, imports: [[
            CommonModule,
            CalendarModule,
            MenuModule
        ], CalendarModule,
        MenuModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: PermassistUIModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        DatepickerComponent
                    ],
                    imports: [
                        CommonModule,
                        CalendarModule,
                        MenuModule
                    ],
                    exports: [
                        DatepickerComponent,
                        CalendarModule,
                        MenuModule,
                    ]
                }]
        }] });

/*
 * Public API Surface of permassist-ui
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DATEPICKER_RANGES, DatepickerComponent, PermassistUIModule };
//# sourceMappingURL=permassist-ui.js.map
