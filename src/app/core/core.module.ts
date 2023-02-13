import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApiService, JhcsService, MatDrawerService, SearchService,} from './services';
import {ToastService} from '../utils/ui/toast.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ApiService,
    ToastService,
    JhcsService,
    SearchService,
    MatDrawerService,
  ],
  declarations: []
})
export class CoreModule { }
