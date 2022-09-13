(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('primeng/calendar'), require('primeng/menu'), require('@angular/forms'), require('rxjs'), require('rxjs/operators'), require('primeng/api')) :
    typeof define === 'function' && define.amd ? define('permassist-ui', ['exports', '@angular/core', '@angular/common', 'primeng/calendar', 'primeng/menu', '@angular/forms', 'rxjs', 'rxjs/operators', 'primeng/api'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["permassist-ui"] = {}, global.ng.core, global.ng.common, global.i1, global.i2, global.ng.forms, global.rxjs, global.rxjs.operators, global.i3));
})(this, (function (exports, i0, i4, i1, i2, forms, rxjs, operators, i3) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var i4__namespace = /*#__PURE__*/_interopNamespace(i4);
    var i1__namespace = /*#__PURE__*/_interopNamespace(i1);
    var i2__namespace = /*#__PURE__*/_interopNamespace(i2);
    var i3__namespace = /*#__PURE__*/_interopNamespace(i3);

    function daysAgo(days, date) {
        if (days === void 0) { days = 0; }
        date = date || new Date();
        date.setDate(date.getDate() - days);
        return date;
    }
    function monthsAgo(months, day) {
        if (months === void 0) { months = 0; }
        if (day === void 0) { day = 1; }
        return new Date(new Date().getFullYear(), new Date().getMonth() - months, day);
    }
    function daysInMonthAgo(months) {
        if (months === void 0) { months = 0; }
        return new Date(new Date().getFullYear(), new Date().getMonth() - months, 0).getDate();
    }
    function dayRange(from, to) {
        if (from === void 0) { from = 0; }
        if (to === void 0) { to = 0; }
        var range = [];
        for (var i = from; i <= to; i++) {
            var date = new Date();
            date.setDate(date.getDate() - i);
            range.push(date);
        }
        return range;
    }
    function monthRange(from, to) {
        if (from === void 0) { from = 0; }
        if (to === void 0) { to = 0; }
        var range = [];
        var year = new Date().getFullYear();
        var month = to;
        for (var i = from; i <= month; i++) {
            var daysInMonth = new Date(year, month, 0).getDate();
            for (var j = 0; j < daysInMonth; j++) {
                range.push(new Date(year, month, j));
            }
        }
        return range;
    }

    function waitUntilExistsFrom(fn, maxRetries, timeout) {
        if (maxRetries === void 0) { maxRetries = 20; }
        if (timeout === void 0) { timeout = 10; }
        return new Promise(function (resolve) {
            retry(fn, resolve, maxRetries, timeout);
        });
    }
    function getParentsOf($element, selector) {
        if (selector === void 0) { selector = ''; }
        var $parents = [];
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
    function retry(fn, resolve, maxRetries, timeout, retries) {
        if (maxRetries === void 0) { maxRetries = 20; }
        if (timeout === void 0) { timeout = 10; }
        if (retries === void 0) { retries = 0; }
        retries++;
        setTimeout(function () {
            var response = fn();
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
        var $group = (_a = getParentsOf($day, '.p-datepicker-group')) === null || _a === void 0 ? void 0 : _a[0];
        if (!$group)
            return day;
        return day + (32 * Array.from($group.parentNode.children).indexOf($group));
    }
    var DATEPICKER_RANGES = {
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
    var DatepickerComponent = /** @class */ (function () {
        function DatepickerComponent() {
            var _this = this;
            this.showPredefinedRanges = true;
            this.clearable = true;
            this.inputId = '';
            this.placeholder = '';
            this.predefinedRanges = [
                { label: DATEPICKER_RANGES.Today.label, command: function (e) { return _this.setRange(e.item, e.originalEvent); } },
                { label: DATEPICKER_RANGES.Yesterday.label, command: function (e) { return _this.setRange(e.item, e.originalEvent); } },
                { label: DATEPICKER_RANGES.Last7Days.label, command: function (e) { return _this.setRange(e.item, e.originalEvent); } },
                { label: DATEPICKER_RANGES.Last30Days.label, command: function (e) { return _this.setRange(e.item, e.originalEvent); } },
                { label: DATEPICKER_RANGES.ThisMonth.label, command: function (e) { return _this.setRange(e.item, e.originalEvent); } },
                { label: DATEPICKER_RANGES.LastMonth.label, command: function (e) { return _this.setRange(e.item, e.originalEvent); } },
            ];
            this.showing$$ = new rxjs.BehaviorSubject(false);
            this.showing$ = this.showing$$.asObservable();
            this.selectionMode$$ = new rxjs.BehaviorSubject('single');
            this.selectionMode$ = this.selectionMode$$.asObservable();
            this.numberOfMonths$ = this.selectionMode$.pipe(operators.map(function (x) { return x === 'range' ? 2 : 1; }));
        }
        Object.defineProperty(DatepickerComponent.prototype, "selectionMode", {
            get: function () {
                return this.selectionMode$$.value;
            },
            set: function (selectionMode) {
                this.selectionMode$$.next(selectionMode);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatepickerComponent.prototype, "value", {
            get: function () {
                return this.$calendar.value;
            },
            set: function (value) {
                var _this = this;
                waitUntilExistsFrom(function () { return _this.$calendar; }, 20, 50).then(function ($calendar) {
                    $calendar.writeValue(value);
                });
            },
            enumerable: false,
            configurable: true
        });
        DatepickerComponent.prototype.writeValue = function (value) {
            var _this = this;
            waitUntilExistsFrom(function () { return _this.$calendar; }, 20, 50).then(function ($calendar) {
                $calendar.writeValue(value);
            });
        };
        DatepickerComponent.prototype.registerOnChange = function (fn) {
            var _this = this;
            waitUntilExistsFrom(function () { return _this.$calendar; }, 20, 50).then(function ($calendar) {
                $calendar.registerOnChange(fn);
            });
        };
        DatepickerComponent.prototype.registerOnTouched = function (fn) {
            var _this = this;
            waitUntilExistsFrom(function () { return _this.$calendar; }, 20, 50).then(function ($calendar) {
                $calendar.registerOnTouched(fn);
            });
        };
        DatepickerComponent.prototype.setDisabledState = function (isDisabled) {
            var _this = this;
            waitUntilExistsFrom(function () { return _this.$calendar; }, 20, 50).then(function ($calendar) {
                $calendar.setDisabledState(isDisabled);
            });
        };
        DatepickerComponent.prototype.onOpen = function () {
            this.showing$$.next(true);
            this.addRangeInteractions();
        };
        DatepickerComponent.prototype.onMonthChange = function () {
            this.addRangeInteractions();
        };
        DatepickerComponent.prototype.onYearChange = function () {
            this.addRangeInteractions();
        };
        DatepickerComponent.prototype.onClose = function () {
            this.showing$$.next(false);
        };
        DatepickerComponent.prototype.clear = function () {
            var _a, _b, _c;
            (_a = this.$calendar) === null || _a === void 0 ? void 0 : _a.updateModel(null);
            (_b = this.$calendar) === null || _b === void 0 ? void 0 : _b.updateInputfield();
            if (this.selectionMode === 'single') {
                (_c = this.$calendar) === null || _c === void 0 ? void 0 : _c.toggle();
            }
        };
        DatepickerComponent.prototype.setRange = function (item, e) {
            var _this = this;
            var range = Object.values(DATEPICKER_RANGES).find(function (x) { return x.label === item.label; });
            if (range) {
                if (this.selectionMode === 'range') {
                    this.$calendar.updateModel([]);
                    range.range.forEach(function (date) {
                        _this.$calendar.onDateSelect(e, {
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
        };
        DatepickerComponent.prototype.asNumber = function (x) {
            if (!x)
                return 0;
            return x;
        };
        DatepickerComponent.prototype.addRangeInteractions = function () {
            var _this = this;
            if (this.selectionMode !== 'range')
                return;
            waitUntilExistsFrom(function () { var _a; return (_a = _this.$calendar.contentViewChild) === null || _a === void 0 ? void 0 : _a.nativeElement; }).then(function ($contentViewChild) {
                var $showHoverFor;
                var showHoverFor;
                _this.updateActiveMenuItemOnOpen();
                $contentViewChild.querySelectorAll('table td > span').forEach(function ($date) {
                    $date.addEventListener('click', function () {
                        var $highlighted = $contentViewChild.querySelectorAll('table td span.p-highlight:not(.p-disabled)');
                        if (($highlighted === null || $highlighted === void 0 ? void 0 : $highlighted.length) === 1) {
                            $showHoverFor = $highlighted[0].parentNode;
                            showHoverFor = multiplyDayDependingOnGroup(Number($highlighted[0].textContent), $showHoverFor);
                        }
                        else {
                            showHoverFor = 0;
                            $showHoverFor = null;
                            $contentViewChild.querySelectorAll('table td').forEach(function ($x) {
                                $x.classList.remove('-highlighted', '-highlighted-start', '-highlighted-end');
                            });
                        }
                    });
                    $date.addEventListener('mouseover', function (e) {
                        if (showHoverFor) {
                            var current_1 = multiplyDayDependingOnGroup(Number(e.target.textContent), e.target);
                            if (current_1 > showHoverFor) {
                                $contentViewChild.querySelectorAll('table td:not(.p-datepicker-other-month)').forEach(function ($x) {
                                    var day = multiplyDayDependingOnGroup(Number($x.textContent), $x);
                                    if (current_1 > showHoverFor && day < current_1 && day > showHoverFor) {
                                        $x.classList.add('-highlighted');
                                    }
                                    else {
                                        $x.classList.remove('-highlighted');
                                    }
                                    if (day === current_1) {
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
                $contentViewChild.addEventListener('mouseout', function () {
                    $contentViewChild.querySelectorAll('table td').forEach(function ($x) {
                        $x.classList.remove('-highlighted', '-highlighted-start', '-highlighted-end');
                    });
                });
            });
        };
        DatepickerComponent.prototype.updateActiveMenuItem = function (label) {
            var _a, _b, _c;
            var $range = ((_c = (_b = (_a = this.$predefinedRangesMenu) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.nativeElement) === null || _c === void 0 ? void 0 : _c.querySelectorAll('.p-menuitem-link')) || [];
            var foundMatch = false;
            $range.forEach(function ($link) {
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
        };
        DatepickerComponent.prototype.updateActiveMenuItemOnOpen = function () {
            var _this = this;
            this.predefinedRanges.forEach(function (item) {
                var _a, _b;
                var range = Object.values(DATEPICKER_RANGES).find(function (x) { return x.label === item.label; });
                if (_this.selectionMode === 'range') {
                    if (range && ((_a = _this.$calendar.value) === null || _a === void 0 ? void 0 : _a[0]) === range.range[0] && ((_b = _this.$calendar.value) === null || _b === void 0 ? void 0 : _b[1]) === range.range[1]) {
                        _this.updateActiveMenuItem(item.label);
                    }
                }
                else {
                    if (range && _this.$calendar.value === range.single) {
                        _this.updateActiveMenuItem(item.label);
                    }
                }
            });
        };
        return DatepickerComponent;
    }());
    DatepickerComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: DatepickerComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
    DatepickerComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.16", type: DatepickerComponent, selector: "pa-ui-datepicker", inputs: { showPredefinedRanges: "showPredefinedRanges", clearable: "clearable", inputId: "inputId", placeholder: "placeholder", selectionMode: "selectionMode", value: "value", predefinedRanges: "predefinedRanges" }, providers: [
            {
                provide: forms.NG_VALUE_ACCESSOR,
                useExisting: i0.forwardRef(function () { return DatepickerComponent; }),
                multi: true,
            },
        ], viewQueries: [{ propertyName: "$calendar", first: true, predicate: ["calendar"], descendants: true }, { propertyName: "$predefinedRangesMenu", first: true, predicate: ["predefinedRangesMenu"], descendants: true }], ngImport: i0__namespace, template: "<p-calendar #calendar class=\"datepicker -{{ selectionMode }} -pa-ui\" [class.-showing]=\"showing$ | async\" [inputId]=\"inputId\" [selectionMode]=\"selectionMode\" (onShow)=\"onOpen()\" (onMonthChange)=\"onMonthChange()\" (onYearChange)=\"onYearChange()\" (onClose)=\"onClose()\" [numberOfMonths]=\"asNumber(numberOfMonths$ | async)\" panelStyleClass=\"-pa-ui {{ showPredefinedRanges ? '-has-ranges' : '' }}\"  dateFormat=\"dd/mm/yy\" [placeholder]=\"placeholder\">\n  <ng-template pTemplate=\"header\">\n    <ng-container [ngTemplateOutlet]=\"header\"></ng-container>\n  </ng-template>\n\n  <ng-template pTemplate=\"footer\">\n    <ng-container [ngTemplateOutlet]=\"footer\"></ng-container>\n  </ng-template>\n</p-calendar>\n\n<ng-template #header>\n  <p-menu #predefinedRangesMenu class=\"datepicker__predefined-ranges\" *ngIf=\"showPredefinedRanges && selectionMode === 'range'\" [model]=\"predefinedRanges\"></p-menu>\n</ng-template>\n\n<ng-template #footer>\n  <div class=\"datepicker__actions\">\n    <button type=\"button\" (click)=\"$calendar.toggle()\" class=\"btn btn-primary btn-sm datepicker__btn order-2\">Close</button>\n    <button *ngIf=\"clearable\" type=\"button\" (click)=\"clear()\" class=\"btn btn-link btn-sm datepicker__btn -clear order-1\">Clear</button>\n  </div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";.-pa-ui{--text-color: #081932;--text-color-secondary: #667180;--primary-color: #007F80;--primary-color-text: #ffffff;--font-family: Inter var, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Noto Sans, Liberation Sans, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji}.datepicker{display:block}::ng-deep .datepicker .p-inputtext{min-width:265px}::ng-deep .datepicker .p-calendar:after{content:\"\\e927\";font-family:\"primeicons\";position:absolute;top:.5em;right:.5em;font-size:1.3em;color:#168c8e;cursor:pointer;pointer-events:none}::ng-deep .datepicker .p-calendar .p-datepicker{top:calc(100% - 1px)!important;right:0;font-size:.875rem;padding-top:0}::ng-deep .datepicker .p-calendar .p-datepicker.p-datepicker-multiple-month{right:auto}::ng-deep .datepicker .p-datepicker .p-datepicker-header{border-bottom:none;padding-bottom:0;padding-top:0;margin-bottom:-.75em}::ng-deep .datepicker .p-link,::ng-deep .datepicker .p-component,::ng-deep .datepicker .p-datepicker table{font-size:inherit}::ng-deep .datepicker .p-datepicker{padding:0}::ng-deep .datepicker .p-datepicker table th{text-align:center;font-weight:600}::ng-deep .datepicker .p-datepicker table th,::ng-deep .datepicker .p-datepicker table td{padding:.25em .1em}::ng-deep .datepicker .p-datepicker table th>span,::ng-deep .datepicker .p-datepicker table td>span{width:2em;height:2em}::ng-deep .datepicker .p-datepicker table td.p-datepicker-today>span{background-color:#cdefef}::ng-deep .datepicker .p-datepicker table td>span.p-highlight,::ng-deep .datepicker .p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):hover{color:#fff;background-color:#007f80;font-weight:500}::ng-deep .datepicker .p-datepicker table td.-highlighted,::ng-deep .datepicker .p-datepicker table td.-highlighted-start,::ng-deep .datepicker .p-datepicker table td.-highlighted-end{position:relative}::ng-deep .datepicker .p-datepicker table td.-highlighted:before,::ng-deep .datepicker .p-datepicker table td.-highlighted-start:before,::ng-deep .datepicker .p-datepicker table td.-highlighted-end:before{content:\"\";position:absolute;top:.25em;left:0;right:0;bottom:.25em;background-color:#d9eef0;z-index:-1}::ng-deep .datepicker .p-datepicker table td.-highlighted-start:before{left:50%}::ng-deep .datepicker .p-datepicker table td.-highlighted-end:before{right:50%}::ng-deep .datepicker.-showing .p-inputtext{border-bottom-left-radius:0;border-bottom-right-radius:0;border-color:#007f80;box-shadow:0 0 0 1px #007f80}::ng-deep .datepicker.-showing .p-inputtext+.p-datepicker{border-top-left-radius:0;border-top-right-radius:0;border-top:2px solid #007F80}::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-month{margin-right:0}::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-prev,::ng-deep .datepicker .p-datepicker .p-datepicker-header .p-datepicker-next{width:1.5em;height:1.5em}::ng-deep .datepicker .p-datepicker.-has-ranges.p-datepicker-multiple-month{display:inline-grid;grid-template-columns:1fr 1fr;max-width:100vw;overflow-x:auto}::ng-deep .datepicker .p-datepicker.-has-ranges.p-datepicker-multiple-month .p-datepicker-group{padding-right:.5em}::ng-deep .datepicker__predefined-ranges .p-menu{border:none;border-radius:0;border-right:1px solid #CED1D5;background-color:#f7f7f8;font-size:.875rem;width:auto;min-width:150px;margin-right:.25em;height:100%;padding-top:.5em}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link{padding:.7em 2em .7em 1em;color:#007f80;font-weight:500}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link .p-menuitem-text{color:inherit}::ng-deep .datepicker__predefined-ranges .p-menu .p-menuitem-link.-active{background-color:#d9eef0}.datepicker__actions{grid-column:span 3;display:flex;align-items:center;justify-content:flex-end;padding:1em;border-top:1px solid #CED1D5}.datepicker__btn{margin-left:.25em;font-weight:500}.datepicker__btn.btn-link{text-decoration:none}.datepicker__btn.btn-link:hover{text-decoration:underline}.datepicker__btn.-clear{margin-right:auto;margin-left:-.25em}\n"], components: [{ type: i1__namespace.Calendar, selector: "p-calendar", inputs: ["style", "styleClass", "inputStyle", "inputId", "name", "inputStyleClass", "placeholder", "ariaLabelledBy", "iconAriaLabel", "disabled", "dateFormat", "multipleSeparator", "rangeSeparator", "inline", "showOtherMonths", "selectOtherMonths", "showIcon", "icon", "appendTo", "readonlyInput", "shortYearCutoff", "monthNavigator", "yearNavigator", "hourFormat", "timeOnly", "stepHour", "stepMinute", "stepSecond", "showSeconds", "required", "showOnFocus", "showWeek", "dataType", "selectionMode", "maxDateCount", "showButtonBar", "todayButtonStyleClass", "clearButtonStyleClass", "autoZIndex", "baseZIndex", "panelStyleClass", "panelStyle", "keepInvalid", "hideOnDateTimeSelect", "numberOfMonths", "view", "touchUI", "timeSeparator", "focusTrap", "firstDayOfWeek", "showTransitionOptions", "hideTransitionOptions", "tabindex", "defaultDate", "minDate", "maxDate", "disabledDates", "disabledDays", "yearRange", "showTime", "locale"], outputs: ["onFocus", "onBlur", "onClose", "onSelect", "onInput", "onTodayClick", "onClearClick", "onMonthChange", "onYearChange", "onClickOutside", "onShow"] }, { type: i2__namespace.Menu, selector: "p-menu", inputs: ["model", "popup", "style", "styleClass", "appendTo", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions"], outputs: ["onShow", "onHide"] }], directives: [{ type: i3__namespace.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { type: i4__namespace.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i4__namespace.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "async": i4__namespace.AsyncPipe }, changeDetection: i0__namespace.ChangeDetectionStrategy.OnPush });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: DatepickerComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'pa-ui-datepicker',
                        templateUrl: './datepicker.component.html',
                        styleUrls: ['./datepicker.component.scss'],
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        providers: [
                            {
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: i0.forwardRef(function () { return DatepickerComponent; }),
                                multi: true,
                            },
                        ],
                    }]
            }], propDecorators: { showPredefinedRanges: [{
                    type: i0.Input
                }], clearable: [{
                    type: i0.Input
                }], inputId: [{
                    type: i0.Input
                }], placeholder: [{
                    type: i0.Input
                }], selectionMode: [{
                    type: i0.Input
                }], value: [{
                    type: i0.Input
                }], predefinedRanges: [{
                    type: i0.Input
                }], $calendar: [{
                    type: i0.ViewChild,
                    args: ['calendar']
                }], $predefinedRangesMenu: [{
                    type: i0.ViewChild,
                    args: ['predefinedRangesMenu']
                }] } });

    var PermassistUIModule = /** @class */ (function () {
        function PermassistUIModule() {
        }
        return PermassistUIModule;
    }());
    PermassistUIModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: PermassistUIModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    PermassistUIModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: PermassistUIModule, declarations: [DatepickerComponent], imports: [i4.CommonModule,
            i1.CalendarModule,
            i2.MenuModule], exports: [DatepickerComponent,
            i1.CalendarModule,
            i2.MenuModule] });
    PermassistUIModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: PermassistUIModule, imports: [[
                i4.CommonModule,
                i1.CalendarModule,
                i2.MenuModule
            ], i1.CalendarModule,
            i2.MenuModule] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: PermassistUIModule, decorators: [{
                type: i0.NgModule,
                args: [{
                        declarations: [
                            DatepickerComponent
                        ],
                        imports: [
                            i4.CommonModule,
                            i1.CalendarModule,
                            i2.MenuModule
                        ],
                        exports: [
                            DatepickerComponent,
                            i1.CalendarModule,
                            i2.MenuModule,
                        ]
                    }]
            }] });

    /*
     * Public API Surface of permassist-ui
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.DATEPICKER_RANGES = DATEPICKER_RANGES;
    exports.DatepickerComponent = DatepickerComponent;
    exports.PermassistUIModule = PermassistUIModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=permassist-ui.umd.js.map
