import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {JhcsService, ToastService} from 'src/app/core';

@Component({
  selector: 'jhcs-activity-missing',
  templateUrl: './activity-missing.component.html',
  styleUrls: ['./activity-missing.component.css'],
})
export class ActivityMissingComponent implements OnInit {
  loading = false;
  totalDataCount = 0;
  dataSource: any = [];
  itemColumns = [
    { name: 'ID No', key: 'id', width: '10%' },
    { name: 'DODIC', key: 'dodic', width: '10%' },
    { name: 'NSNs', key: 'nsn', width: '15%' },
    { name: 'Nomenclature ', key: 'nomenclature', maxLength: '40', tooltip: true },
    { name: 'Action', key: 'action', width: '10%' },
  ];

  constructor(
    private router: Router,
    private alertService: ToastService,
    private jhcsService: JhcsService
  ) {
    this.fetch();
  }

  ngOnInit() {}

  fetch() {
    this.updatePage({ pageIndex: 1, pageSize: 10 });
  }

  updatePage(page: any) {
    if (!this.loading) {
      this.loading = true;

      const {pageIndex, pageSize} = page;
      this.jhcsService
        .getCustom(`report/missingDOTLetters?page=${pageIndex}&size=${pageSize}`)
        .subscribe({
          next: (items) => {
            this.dataSource = items.content;
            this.totalDataCount = items.totalElements;
          },
          error: () => {
            this.alertService.error('Failed to get duplicated nsns.');
          },
          complete: () => {
            this.loading = false;
          },
        });
    }
  }
}
