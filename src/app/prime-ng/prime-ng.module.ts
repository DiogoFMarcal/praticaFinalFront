import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';

/* 
  module used to import primeng components and make them available for all other modules ,
  it allows to controll the import of primeng components in a centralized spot of my application
*/

@NgModule({
  exports: [
    MenuModule,
    ButtonModule,
    CardModule,
    FieldsetModule,
    MenubarModule,
    PanelModule,
    TableModule,
    DividerModule,
    InputTextModule,
    InputSwitchModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    ChartModule
  ]
})
export class PrimeNgModule { }
