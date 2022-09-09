import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';

import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DatepickerComponent
  ],
  imports: [
    CommonModule,
    CalendarModule,
    MenuModule,
    ReactiveFormsModule
  ],
  exports: [
    DatepickerComponent,
    CalendarModule,
    MenuModule,
    ReactiveFormsModule
  ]
})
export class ThemeModule { }
