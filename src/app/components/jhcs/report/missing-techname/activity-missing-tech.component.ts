import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {JhcsService, ToastService} from 'src/app/core';

@Component({
  selector: 'jhcs-activity-missing-tech',
  templateUrl: './activity-missing-tech.component.html',
  styleUrls: ['./activity-missing-tech.component.css'],
})
export class ActivityMissingTechComponent implements OnInit {
  loading = false;
  totalDataCount = 0;
  dataSource: any = [];
  itemColumns = [
    { name: 'ID No', key: 'id', width: '8%' },
    { name: 'DODIC', key: 'dodic', width: '5%' },
    { name: 'NSNs', key: 'nsn', width: '15%' },
    { name: 'UN No ', key: 'unoSerialNo', width: '5%' },
    { name: 'Nomenclature ', key: 'nomenclature', maxLength: 18, tooltip: true },
    { name: 'Symbol ', key: 'symbol', width: '8%' },
    { name: 'Shipping Name', key: 'shipName', maxLength: 18, tooltip: true },
    { name: 'DOD ', key: 'dodcode', width: '10%' },
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
        .getCustom(`report/missingTechNames?page=${pageIndex}&size=${pageSize}`)
        .subscribe({
          next: (items) => {
            this.dataSource = items.content.map((x: any) => {
              return {
                ...x,
                dodcode: x.dod,
              };
            });
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
