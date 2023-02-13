import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MatNativeDateModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';

import {CoreModule} from '../../core/core.module';
import {JhcsRoutingModule} from './jhcs-routing.module';
import {SearchComponent} from './search/search.component';
import {SearchBarComponent} from './search/search-bar/search-bar.component';
import {SearchTableComponent} from './search/search-table/search-table.component';
import {JhcsFormComponent} from "./jhcs-form/jhcs-form.component";
import {ReportComponent} from "./report/report.component";
import {ActivityReportComponent} from "./report/activity-report/activity-report.component";
import {ActivityTableComponent} from "./report/activity-report/activity-table/activity-table.component";
import {RevisionDialogComponent} from "./report/activity-report/revision-dialog/revision-dialog.component";
import {ActivityDuplicateComponent} from "./report/duplicate-nsns/activity-duplicate.component";
import {ActivityMissingComponent} from "./report/missing-dotletter/activity-missing.component";
import {ActivityMissingTechComponent} from "./report/missing-techname/activity-missing-tech.component";
import {ActivityHazComponent} from "./report/haz-classmeeting/activity-haz.component";
import {MeetingDialogComponent} from "./report/haz-classmeeting/meeting-dialog/meeting-dialog.component";
import {ActivityRecordComponent} from "./report/approval-status/activity-record.component";
import {ActivityProductionComponent} from "./report/production-stats/activity-production.component";
import {PagableTableComponent} from './report/pagable-table/pagable-table.component';
import {ExportTableComponent} from './report/export-table/export-table.component';

import {ViewComponent} from "./view/view.component";
import {EditComponent} from "./edit/edit.component";
import {CreateComponent} from "./create/create.component";
import {PrintComponent} from "./print/print.component";
import {MaterialModule} from '../../material-components';
import {JhcsChangeDetectionContentComponent} from './jhcs-change-detection-content/jhcs-change-detection-content.component';
import {JhcsUserTable} from "./user-table/user-table.component";
import {NgChartsModule} from 'ng2-charts';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from "@stomp/ng2-stompjs";
import {RxStompConfig} from "../../rx-stomp.config";
import {JhcsDefintionsTable} from "./help/jhcs-definitions/jhcs-definitions-table.component";
import {AlertMessageDialogComponent} from "../dialogs/alert-message-dialog/alert-message-dialog.component";
import {HazardSymbolTableComponent} from "./maintenance/hazard-symbol-table/hazard-symbol.component";
import {NsnInputFormat} from "./maintenance/nsn-formatter/nsn-formatter.component"
import {ManageDuplicateCodesTable} from "./maintenance/manage-duplicate-codes/manage-duplicate-codes.component";
import {NsnAssociationTable} from "./maintenance/nsn-association-table/nsn-association-table.component";
import {UnNumberTable} from "./maintenance/un-number-table/un-number-table.component";
import {ResizeColumnDirective} from './maintenance/un-number-table/resize-column.directive';
import {ResizableModule} from "angular-resizable-element";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        CoreModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatTableModule,
        MatDividerModule,
        MatNativeDateModule,
        JhcsRoutingModule,
        MaterialModule,
        NgChartsModule,
        ResizableModule,
    ],
  exports: [
    SearchBarComponent,
    SearchComponent
  ],
  declarations: [
    AlertMessageDialogComponent,
    SearchComponent,
    SearchBarComponent,
    SearchTableComponent,
    JhcsFormComponent,
    ReportComponent,
    ActivityReportComponent,
    ActivityDuplicateComponent,
    ActivityMissingComponent,
    ActivityMissingTechComponent,
    ActivityHazComponent,
    MeetingDialogComponent,
    ActivityRecordComponent,
    ActivityProductionComponent,
    ActivityTableComponent,
    RevisionDialogComponent,
    PagableTableComponent,
    ExportTableComponent,
    ViewComponent,
    EditComponent,
    CreateComponent,
    PrintComponent,
    JhcsChangeDetectionContentComponent,
    JhcsUserTable,
    JhcsDefintionsTable,
    HazardSymbolTableComponent,
    NsnInputFormat,
    ManageDuplicateCodesTable,
    NsnAssociationTable,
    UnNumberTable,
    ResizeColumnDirective
  ],
  providers: [
    {
      provide: InjectableRxStompConfig,
      useValue: RxStompConfig,
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
    MatDatepickerModule
  ],
})
export class JhcsModule {}
