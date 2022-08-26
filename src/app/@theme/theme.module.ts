import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';

import { DatepickerComponent } from './components/datepicker/datepicker.component';

@NgModule({
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
    MenuModule
  ]
})
export class ThemeModule { }
