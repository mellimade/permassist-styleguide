import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import * as i0 from "@angular/core";
export class PermassistUIModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWFzc2lzdC11aS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wZXJtYXNzaXN0LXVpL3NyYy9saWIvcGVybWFzc2lzdC11aS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFMUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sOENBQThDLENBQUM7O0FBaUJuRixNQUFNLE9BQU8sa0JBQWtCOztnSEFBbEIsa0JBQWtCO2lIQUFsQixrQkFBa0IsaUJBYjNCLG1CQUFtQixhQUduQixZQUFZO1FBQ1osY0FBYztRQUNkLFVBQVUsYUFHVixtQkFBbUI7UUFDbkIsY0FBYztRQUNkLFVBQVU7aUhBR0Qsa0JBQWtCLFlBWHBCO1lBQ1AsWUFBWTtZQUNaLGNBQWM7WUFDZCxVQUFVO1NBQ1gsRUFHQyxjQUFjO1FBQ2QsVUFBVTs0RkFHRCxrQkFBa0I7a0JBZjlCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLG1CQUFtQjtxQkFDcEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osY0FBYzt3QkFDZCxVQUFVO3FCQUNYO29CQUNELE9BQU8sRUFBRTt3QkFDUCxtQkFBbUI7d0JBQ25CLGNBQWM7d0JBQ2QsVUFBVTtxQkFDWDtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBDYWxlbmRhck1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvY2FsZW5kYXInO1xuaW1wb3J0IHsgTWVudU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvbWVudSc7XG5cbmltcG9ydCB7IERhdGVwaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9kYXRlcGlja2VyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIERhdGVwaWNrZXJDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBDYWxlbmRhck1vZHVsZSxcbiAgICBNZW51TW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBEYXRlcGlja2VyQ29tcG9uZW50LFxuICAgIENhbGVuZGFyTW9kdWxlLFxuICAgIE1lbnVNb2R1bGUsXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgUGVybWFzc2lzdFVJTW9kdWxlIHsgfVxuIl19