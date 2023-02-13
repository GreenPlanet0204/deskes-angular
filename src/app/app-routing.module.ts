import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Location} from '@angular/common';
import {AppAuthGuard} from "./auth/app-auth.guard";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {FullySharedComponent} from "./components/fully-shared/fully-shared.component";
import {RoleService} from "./session/role.service";
import {AccessDeniedComponent} from "./components/access-denied/access-denied.component";
import {PartiallySharedComponent} from "./components/partially-shared/partially-shared.component";
import {environment} from 'src/environments/environment';

const AuthGuards = (environment.local) ? [] : [AppAuthGuard];

const routes: Routes = [
  {
    path: 'jhcs',
    loadChildren: () => import('./components/jhcs/jhcs.module').then(m => m.JhcsModule),
    component: FullySharedComponent,
    canActivate: AuthGuards,
    data: {
      roles: [
        RoleService.ROLE_DESKES_USER,
        RoleService.ROLE_DESKES_APPROVER,
        RoleService.ROLE_DESKES_ADMIN,

        RoleService.ROLE_JHCS_BASIC,
        RoleService.ROLE_JHCS_LOGISTICS,
        RoleService.ROLE_JHCS_HC,
        RoleService.ROLE_JHCS_HC_EDIT,
        RoleService.ROLE_JHCS_ADMIN
      ]
    }
  },
  {
    path: 'esmam',
    component: FullySharedComponent,
    canActivate: AuthGuards,
    data: {
      roles: [
        RoleService.ROLE_ESMAM_VIEWER,
        RoleService.ROLE_ESMAM_POWER_USER,
        RoleService.ROLE_ESMAM_ADMIN,
      ]
    }
  },
  {
    path: 'ssmm',
    component: FullySharedComponent,
    canActivate: AuthGuards,
    data: {
      roles: [
        RoleService.ROLE_DESKES_ADMIN
      ]
    }
  },
  {
    path: '',
    component: PartiallySharedComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AppAuthGuard]
      },
      {
        path: '**',
        component: AccessDeniedComponent
      }
    ]
  }
];

// Prevent stripping of trailing slash
// tslint:disable-next-line:typedef
Location.stripTrailingSlash = function stripTrailingSlashNew(url: string) {
  return url;
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})

export class AppRoutingModule {
}
