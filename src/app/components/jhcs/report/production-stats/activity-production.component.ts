import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {JhcsService, ToastService} from 'src/app/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'jhcs-activity-production',
  templateUrl: './activity-production.component.html',
  styleUrls: ['./activity-production.component.css'],
})
export class ActivityProductionComponent implements OnInit {
  displayedColumns1 = ['dod', 'count'];
  dataSource1!: MatTableDataSource<any>;

  loading3 = false;
  totalDataCount3 = 0
  pageIndex3 = 0
  pageSize3 = 0

  loading4 = false;
  totalDataCount4 = 0
  pageIndex4 = 0
  pageSize4 = 0

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      datalabels: {
        formatter: (value: number, ctx: any) => {
          if (this.totalRecords) {
            const percent = Math.ceil((100 * value) / this.totalRecords);
            return percent >= 5 ? `${percent}%` : '';
          }
          return '';
        },
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  displayedColumns2 = ['flag', 'type', 'count', 'description'];
  dataSource2!: MatTableDataSource<any>;
  dataSource3: any = [];
  itemColumns3 = [
    { name: 'Hazard Class', key: 'class' },
    { name: 'Count ', key: 'count' },
  ];

  dataSource4: any = [];
  itemColumns4 = [
    { name: 'UN Number', key: 'un' },
    { name: 'Hazard Class', key: 'class' },
    { name: 'Label', key: 'label' },
    { name: 'Count ', key: 'count' },
  ];

  form: FormGroup = new FormGroup({
    id: new FormControl(true),
    status: new FormControl(true),
    nomenclature: new FormControl(true),
    changes: new FormControl(true),
    action: new FormControl(true),
  });

  dodDatas: any[] = [];
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
    this.getDetails(1, 10);
    this.getHazardDetails({pageIndex: 1, pageSize: 10});
    this.getUnDetails({pageIndex: 1, pageSize: 10});
  }

  getDetails(page: number, size: number) {
    this.loading3 = true
    this.loading4 = true

    this.jhcsService
      .getCustom(`report/dodComponentStats?page=${page}&size=${size}`)
      .subscribe({
        next: (items) => {
          this.updateDodComponentStats(items.content);
        },
        error: () => {
          this.alertService.error('Failed to get dod component stats.');
        },
        complete: () => {
        },
      });

    this.jhcsService
      .getCustom(`report/flagStats?page=${page}&size=${size}`)
      .subscribe({
        next: (items) => {
          this.updateFlagStats(items.content);
        },
        error: () => {
          this.alertService.error('Failed to get flag stats.');
        },
        complete: () => {
        },
      });
  }

  getHazardDetails(page: any) {

    const pageIndex = page.pageIndex
    const pageSize = page.pageSize

    this.loading3 = true;
    this.pageIndex3 = pageIndex - 1
    this.pageSize3 = pageSize

    this.jhcsService
      .getCustom(`report/hazardClassStats?page=${pageIndex}&size=${pageSize}`)
      .subscribe({
        next: (items) => {
          this.updateHazardClassStats(items.content);
          this.totalDataCount3 = items.totalElements
        },
        error: () => {
          this.alertService.error('Failed to get hazard class stats.');
        },
        complete: () => {
          this.loading3 = false;
        },
      });
  }

  getUnDetails(page: any) {

    const pageIndex = page.pageIndex
    const pageSize = page.pageSize

    this.loading4 = true;
    this.pageIndex4 = pageIndex - 1
    this.pageSize4 = pageSize

    this.jhcsService
      .getCustom(`report/unstats?page=${pageIndex}&size=${pageSize}`)
      .subscribe({
        next: (items) => {
          this.updateUnStats(items.content);
          this.totalDataCount4 = items.totalElements
        },
        error: () => {
          this.alertService.error('Failed to get hazard class stats.');
        },
        complete: () => {
          this.loading4 = false;
        },
      });
  }

  updateDodComponentStats(records: any[]) {
    console.log('updateDodComponentStats', records);
    records = records.map((row: any) => {
      return { dod: row.definition, count: row.records };
    });

    this.dodDatas = records

    const labels = this.dodDatas.map((it: any) => it.dod);
    this.pieChartData.labels?.push.apply(this.pieChartData.labels, labels);
    const dataset = this.pieChartData.datasets[0].data;
    dataset?.push.apply(dataset, this.dodDatas.map((it: any) => it.count));
    this.chart?.update();

    this.totalRecords = records
      .map((x) => x.count)
      .reduce((prev: number, next: number) => prev + next, 0);

    records.push({ dod: 'Total', count: this.totalRecords });
    this.dataSource1 = new MatTableDataSource(records);
  }

  updateFlagStats(records: any[]) {
    console.log('updateFlagStats', records);
    records = records.map((row: any) => {
      return { ...row, type: row.actionType, count: row.records };
    });
    this.dataSource2 = new MatTableDataSource(records);
  }

  updateHazardClassStats(records: any[]) {
    console.log('updateHazardClassStats', records);

    const makeHazardClass = (dodHc: string, dodHd: string, dodHds: string) => {
      var hcd = dodHc + '.' + dodHd + '.' + dodHds;
      hcd = hcd.split("null").join("");
      if (hcd == '..') hcd = 'Undefined';
      hcd = hcd.replace('..', '.');
      if (hcd[0] == '.') hcd = hcd.substring(1, hcd.length);
      if (hcd[hcd.length - 1] == '.') hcd = hcd.substring(0, hcd.length - 1);
      return hcd;
    };

    records = records.map((row: any) => {
      return {
        ...row,
        class: makeHazardClass(row.dodHc, row.dodHd, row.dodHds),
        count: row.records,
      };
    });
    this.dataSource3 = records;
  }

  updateUnStats(records: any[]) {
    console.log('updateUnStats', records);

    const makeHazardClass = (
      dodHc: string,
      dodHd: string,
      dodHds: string,
      cg: string
    ) => {
      var hcd = dodHc + '.' + dodHd + '.' + dodHds;
      hcd = hcd.split("null").join("");
      if (hcd == '..') hcd = '';
      hcd = hcd.replace('..', '.');
      if (hcd[0] == '.') hcd = hcd.substring(1, hcd.length);
      if (hcd[hcd.length - 1] == '.') hcd = hcd.substring(0, hcd.length - 1);
      hcd += cg;
      return hcd;
    };

    const makeLabel = (label: string, dodhc: string) => {
      return dodhc == 'N' ? 'NOT REGULATED' : label;
    };

    records = records.map((row: any) => {
      return {
        un: row.unoSerNo,
        class: makeHazardClass(row.dodHc, row.dodHd, row.dodHds, row.cg),
        label: makeLabel(row.label1, row.dodHc),
        count: row.records,
      };
    });
    this.dataSource4 = records;
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
}
