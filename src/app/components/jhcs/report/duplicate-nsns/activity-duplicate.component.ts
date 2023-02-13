import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {JhcsService, ToastService} from 'src/app/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'jhcs-activity-duplicate',
  templateUrl: './activity-duplicate.component.html',
  styleUrls: ['./activity-duplicate.component.css'],
})
export class ActivityDuplicateComponent implements OnInit {
  loading = false;
  totalDataCount = 0

  displayedColumns1 = ['service', 'records', 'nsns'];
  dataSource1!: MatTableDataSource<any>;

  dataSource2: any = [];
  itemColumns2 = [
    { name: 'ID', key: 'id', width: '5%' },
    { name: 'DODIC', key: 'dodic', width: '5%' },
    { name: 'NSN', key: 'nsn', width: '12%' },
    { name: 'Nomenclature ', key: 'nomenclature', maxLength: 32, tooltip: true },
    { name: 'DOD', key: 'dodComp', width: '5%' },
    { name: 'TRI', key: 'triSvrCoord', width: '5%' },
    { name: 'Special Remarks', key: 'specRemarks', maxLength: 40, tooltip: true },
    { name: 'Code', key: 'code', width: '5%' },
    { name: 'Action', key: 'action', width: '10%' },
  ];

  form: FormGroup = new FormGroup({
    id: new FormControl(true),
    status: new FormControl(true),
    nomenclature: new FormControl(true),
    changes: new FormControl(true),
    action: new FormControl(true),
  });

  flags: any[] = [];
  records: any[] = [];
  totalRecords = 0;
  dataCount = 0;

  constructor(
    private router: Router,
    private alertService: ToastService,
    private jhcsService: JhcsService
  ) {
    this.fetch();
  }

  ngOnInit() {}

  fetch() {
    this.jhcsService.getCustom('report/duplicateNsnSummary').subscribe({
      next: (items) => {
        this.dataSource1 = new MatTableDataSource(items);
      },
      error: () =>
        this.alertService.error('Failed to get duplicated nsns.'),
    });

    this.updatePage({pageIndex: 1, pageSize: 10});
  }

  updatePage(page: any) {
    if (!this.loading) {
      this.loading = true;
      
      const {pageIndex, pageSize} = page;
      this.jhcsService.getCustom(`report/duplicateNsnDetails?page=${pageIndex}&size=${pageSize}`)
        .subscribe({
          next: (res) => {
            this.dataSource2 = res.content;
            this.totalDataCount = res.totalElements
          },
          error: () => {
            this.loading = false;
            this.alertService.error('Failed to get duplicated nsn details.')
          },
          complete: () => {
            this.loading = false;
          }
        });
    }
  }
}
