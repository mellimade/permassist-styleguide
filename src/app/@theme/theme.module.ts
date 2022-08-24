import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/calendar';

import { DatepickerComponent } from './components/datepicker/datepicker.component';

@NgModule({
  declarations: [
    DatepickerComponent
  ],
  imports: [
    CommonModule,
    CalendarModule
  ],
  exports: [
    DatepickerComponent,
    CalendarModule
  ]
})
export class ThemeModule { }
