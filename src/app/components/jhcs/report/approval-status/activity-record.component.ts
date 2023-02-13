import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {JhcsService, ToastService} from 'src/app/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ActionNames} from 'constants';

@Component({
  selector: 'jhcs-activity-record',
  templateUrl: './activity-record.component.html',
  styleUrls: ['./activity-record.component.css'],
})
export class ActivityRecordComponent implements OnInit {
  displayedColumns1 = ['type', 'army', 'navy', 'airforce', 'total'];
  dataSource1!: MatTableDataSource<any>;

  loading = false;

  dataSource2: any = [];

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
    this.getDetails();
  }

  getDetails(page: number, size: number) {
    this.loading = true;

    this.jhcsService.getCustom(`report/recordApprovalStatus`)
      .subscribe({
        next: (items) => {
          this.updateDataSource(items);
        },
        error: () => {
          this.alertService.error('Failed to get approval records.')
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  updateDataSource(records: any[]) {
    console.log('updateDataSource', records);
    const fromActionType = (ele: any, row: any) => {
      switch (row.key) {
        case 'army':
          ele.army = row.records;
          break;
        case 'navy':
          ele.navy = row.records;
          break;
        case 'af':
          ele.airforce = row.records;
          break;
      }
      return ele;
    };

    let results: any[] = [];
    records.forEach((row) => {
      const found = results.find((x) => x.actionType === row.actionType);
      if (found) {
        fromActionType(found, row);
      } else {
        const action = ActionNames.find((a: any) => a.key === row.actionType)
        if (action) {
          let element = {
            type: action.value,
            actionType: row.actionType,
            linkable: true
          };
          fromActionType(element, row);
          results.push(element);
        }
      }
    });

    results = records.map((item) => {
      let total = 0;
      if (item.army && !isNaN(item.army)) {
        total += item.army;
      }
      if (item.navy && !isNaN(item.navy)) {
        total += item.navy;
      }
      if (item.airforce && !isNaN(item.airforce)) {
        total += item.airforce;
      }
      return { ...item, total };
    })

    results.push({
      type: 'Totals',
      army: results.reduce((a, b) => a + b.army, 0),
      navy: results.reduce((a, b) => a + b.navy, 0),
      airforce: results.reduce((a, b) => a + b.airforce, 0),
      total: results.reduce((a, b) => a + b.total, 0),
    })

    console.log('changeDataSource', results);
    this.dataSource1 = new MatTableDataSource(results);
  }

  viewItem(item: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/jhcs/view/${item.id}`])
    );
    window.open(url, '_blank');
  }

  editItem(item: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/jhcs/edit/${item.id}`])
    );
    window.open(url, '_blank');
  }

  gotoDetails(e: any, item: any) {
    e.preventDefault();

    this.jhcsService.getCustom(`report/recordApprovalItems?page=${page}&size=${size}`)
      .subscribe({
        next: (items) => {
          this.updateDataSource(items);
        },
        error: () => {
          this.alertService.error('Failed to get approval records.')
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
