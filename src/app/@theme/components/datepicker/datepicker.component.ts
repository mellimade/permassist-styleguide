import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent {
  @Input() showPredefinedRanges = true;
  @Input() inputId = '';

  constructor() { }
}
