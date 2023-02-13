import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewComponent} from "./view/view.component";
import {EditComponent} from "./edit/edit.component";
import {CreateComponent} from "./create/create.component";
import {PrintComponent} from "./print/print.component";
import {JhcsComponent} from "./jhcs.component";
import {ReportComponent} from "./report/report.component";
import {ActivityReportComponent} from "./report/activity-report/activity-report.component";
import {ActivityDuplicateComponent} from "./report/duplicate-nsns/activity-duplicate.component";
import {ActivityMissingComponent} from "./report/missing-dotletter/activity-missing.component";
import {ActivityMissingTechComponent} from "./report/missing-techname/activity-missing-tech.component";
import {ActivityHazComponent} from "./report/haz-classmeeting/activity-haz.component";
import {ActivityRecordComponent} from "./report/approval-status/activity-record.component";
import {ActivityProductionComponent} from "./report/production-stats/activity-production.component";
import {HazardSymbolTableComponent} from "./maintenance/hazard-symbol-table/hazard-symbol.component";
import {JhcsDefintionsTable} from "./help/jhcs-definitions/jhcs-definitions-table.component";
import {ManageDuplicateCodesTable} from "./maintenance/manage-duplicate-codes/manage-duplicate-codes.component";
import {NsnAssociationTable} from "./maintenance/nsn-association-table/nsn-association-table.component";
import {UnNumberTable} from "./maintenance/un-number-table/un-number-table.component";
import {RoleService} from "../../session/role.service";
import {AccessDeniedComponent} from "../access-denied/access-denied.component";
import {AppAuthGuard} from "../../auth/app-auth.guard";
import { environment } from 'src/environments/environment';

const AuthGuards = (environment.local) ? [] : [AppAuthGuard];

const routes: Routes = [
  {
    path: 'report',
    component: ReportComponent,
    canActivate: AuthGuards,
    children: [
      {
        path: 'activity',
        component: ActivityReportComponent,
      },
      {
        path: 'duplicate',
        component: ActivityDuplicateComponent,
      },
      {
        path: 'missdotletter',
        component: ActivityMissingComponent,
      },
      {
        path: 'misstechname',
        component: ActivityMissingTechComponent,
      },
      {
        path: 'hazclass',
        component: ActivityHazComponent,
      },
      {
        path: 'approval',
        component: ActivityRecordComponent,
      },
      {
        path: 'production',
        component: ActivityProductionComponent,
      },
    ],
    data: {
      roles: [
        RoleService.ROLE_JHCS_HC,
        RoleService.ROLE_JHCS_HC_EDIT,
        RoleService.ROLE_JHCS_ADMIN
      ]
    }
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: AuthGuards,
    data: {
      roles:[
        RoleService.ROLE_DESKES_APPROVER,
        RoleService.ROLE_DESKES_ADMIN,
        RoleService.ROLE_JHCS_ADMIN
      ]
    }
  },
  {
    path: 'maintenance',
    canActivate: AuthGuards,
    children: [
      {path: 'hazardsymbol', component: HazardSymbolTableComponent},
      {path: 'manageduplicatecodes', component: ManageDuplicateCodesTable},
      {path: 'nsnassociation', component: NsnAssociationTable},
      {path: 'unnumber', component: UnNumberTable}
    ],
    data: {
      roles: [
        RoleService.ROLE_JHCS_ADMIN
      ]
    }
  },
  { path: 'help/definitions', component: JhcsDefintionsTable },
  {
    path: 'view/:id',
    component: ViewComponent,
    canActivate: AuthGuards,
    data: {
      roles: [
        RoleService.ROLE_JHCS_BASIC,
        RoleService.ROLE_JHCS_LOGISTICS,
        RoleService.ROLE_JHCS_HC,
        RoleService.ROLE_JHCS_HC_EDIT,
        RoleService.ROLE_JHCS_ADMIN
      ]
    }
  },
  {
    path: 'edit/:id',
    canActivate: AuthGuards,
    component: EditComponent,
    data: {
      roles: [
        RoleService.ROLE_JHCS_HC_EDIT
      ]
    }
  },
  { path: 'print/:id', component: PrintComponent },
  { path: '', component: JhcsComponent },
  { path: '**', component: AccessDeniedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JhcsRoutingModule {}
