import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { Menu } from 'primeng/menu';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { daysAgo, monthsAgo } from 'src/app/@helpers/dates';
import { getParentsOf, waitUntilExistsFrom } from 'src/app/@helpers/utilities';

function multiplyDayDependingOnGroup(day: number, $day: HTMLElement) {
  const $group = getParentsOf($day, '.p-datepicker-group')?.[0];

  if (!$group) return day;

  return day + (32 * Array.from($group.parentNode!.children).indexOf($group));
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
}

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent {
  @Input() showPredefinedRanges = true;
  @Input() clearable = true;
  @Input() inputId = '';
  @Input() control!: FormControl;

  @Input()
  set selectionMode(selectionMode: string) {
    this.selectionMode$$.next(selectionMode);
  }

  get selectionMode(): string {
    return this.selectionMode$$.value;
  }

  @Input() predefinedRanges: MenuItem[] = [
    { label: DATEPICKER_RANGES.Today.label, command: e => this.setRange(e.item, e.originalEvent) },
    { label: DATEPICKER_RANGES.Yesterday.label, command: e => this.setRange(e.item, e.originalEvent) },
    { label: DATEPICKER_RANGES.Last7Days.label, command: e => this.setRange(e.item, e.originalEvent) },
    { label: DATEPICKER_RANGES.Last30Days.label, command: e => this.setRange(e.item, e.originalEvent) },
    { label: DATEPICKER_RANGES.ThisMonth.label, command: e => this.setRange(e.item, e.originalEvent) },
    { label: DATEPICKER_RANGES.LastMonth.label, command: e => this.setRange(e.item, e.originalEvent) },
  ];

  @Output() changed = new EventEmitter<unknown>();

  @ViewChild('calendar') $calendar!: Calendar;
  @ViewChild('predefinedRangesMenu') $predefinedRangesMenu!: Menu;

  private readonly showing$$ = new BehaviorSubject(false);
  showing$ = this.showing$$.asObservable();

  private readonly selectionMode$$ = new BehaviorSubject('single');
  selectionMode$ = this.selectionMode$$.asObservable();

  numberOfMonths$: Observable<number> = this.selectionMode$.pipe(map(x => x === 'range' ? 2 : 1));

  constructor() { }

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
    this.$calendar?.updateModel(null);
    this.control?.patchValue(null);

    if (this.selectionMode === 'single') {
      this.$calendar?.toggle();
    }
  }

  setRange(item: MenuItem, e?: Event) {
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
      } else {
        this.$calendar.updateModel(range.single);
      }
    }

    this.updateActiveMenuItem(item.label);
  }

  asNumber(x: unknown) {
    if (!x) return 0;
    return x as number;
  }

  private addRangeInteractions() {
    if (this.selectionMode !== 'range') return;

    waitUntilExistsFrom(() => this.$calendar.contentViewChild?.nativeElement).then($contentViewChild => {
      let $showHoverFor: HTMLElement | null;
      let showHoverFor: number;

      this.updateActiveMenuItemOnOpen();

      $contentViewChild.querySelectorAll('table td > span').forEach(($date: HTMLElement) => {
        $date.addEventListener('click', () => {
          const $highlighted: HTMLElement[] = $contentViewChild.querySelectorAll('table td span.p-highlight:not(.p-disabled)');

          if ($highlighted?.length === 1) {
            $showHoverFor = $highlighted[0].parentNode as HTMLElement;
            showHoverFor = multiplyDayDependingOnGroup(Number($highlighted[0].textContent), $showHoverFor);
          } else {
            showHoverFor = 0;
            $showHoverFor = null;
            $contentViewChild.querySelectorAll('table td').forEach(($x: HTMLElement) => {
              $x.classList.remove('-highlighted', '-highlighted-start', '-highlighted-end');
            });
          }
        });

        $date.addEventListener('mouseover', e => {
          if (showHoverFor) {
            const current = multiplyDayDependingOnGroup(Number((e.target as HTMLElement).textContent), (e.target as HTMLElement));

            if (current > showHoverFor) {
              $contentViewChild.querySelectorAll('table td:not(.p-datepicker-other-month)').forEach(($x: HTMLElement) => {
                const day = multiplyDayDependingOnGroup(Number($x.textContent), $x);

                if (current > showHoverFor && day < current && day > showHoverFor) {
                  $x.classList.add('-highlighted');
                } else {
                  $x.classList.remove('-highlighted');
                }

                if (day === current) {
                  $x.classList.add('-highlighted-end');
                } else {
                  $x.classList.remove('-highlighted-end');
                }

                if (day === showHoverFor) {
                  $x.classList.add('-highlighted-start');
                } else {
                  $x.classList.remove('-highlighted-start');
                }
              });
            }
          }
        });
      });

      $contentViewChild.addEventListener('mouseout', () => {
        $contentViewChild.querySelectorAll('table td').forEach(($x: HTMLElement) => {
          $x.classList.remove('-highlighted', '-highlighted-start', '-highlighted-end');
        });
      });
    });
  }

  private updateActiveMenuItem(label?: string) {
    const $range = this.$predefinedRangesMenu?.el?.nativeElement?.querySelectorAll('.p-menuitem-link') || [];
    let foundMatch = false;

    $range.forEach(($link: HTMLElement) => {
      if ($link.textContent === label) {
        $link.classList.add('-active');
        foundMatch = true;
      } else {
        $link.classList.remove('-active');
      }
    });

    if (!foundMatch && $range.length) {
      ($range[$range.length - 1] as HTMLElement).classList.add('-active');
    }
  }

  private updateActiveMenuItemOnOpen() {
    this.predefinedRanges.forEach(item => {
      const range = Object.values(DATEPICKER_RANGES).find(x => x.label === item.label);

      if (this.selectionMode === 'range') {
        if (range && this.$calendar.value?.[0] === range.range[0] && this.$calendar.value?.[1] === range.range[1]) {
          this.updateActiveMenuItem(item.label);
        }
      } else {
        if (range && this.$calendar.value === range.single) {
          this.updateActiveMenuItem(item.label);
        }
      }
    });
  }
}
