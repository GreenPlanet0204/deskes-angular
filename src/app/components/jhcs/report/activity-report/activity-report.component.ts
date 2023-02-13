import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import moment from 'moment';
import {JhcsService, ToastService} from 'src/app/core';

@Component({
  selector: 'jhcs-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.css'],
})
export class ActivityReportComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = ['summary', 'total', 'edited', 'added'];
  startDate: any;
  endDate: any;

  flags: any[] = [];
  records: any[] = [];
  totalRecords = 0;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Pie
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

  constructor(
    private router: Router,
    private alertService: ToastService,
    private jhcsService: JhcsService
  ) {}

  ngOnInit() {
    this.fetchFlags();
  }

  counter(i: number) {
    return new Array(i).fill(0);
  }

  getDate() {
    return moment().format('DD/MM/YYYY');
  }

  fetchFlags() {
    this.jhcsService.all('flags').subscribe({
      next: (items) => {
        this.flags = items;
        console.log('Flags', items);
        this.fetchReport();
      },
      error: () => this.alertService.error('Failed to get flags.'),
    });
  }

  fetchReport() {
    const start = moment().subtract(1, 'day').toISOString();
    const end = moment().toISOString();

    this.jhcsService.post('report/summary', { start, end }).subscribe({
      next: (items) => this.updateDataSource(items),
      error: () => this.alertService.error('Failed to get activity records.'),
    });
  }

  updateDataSource(records: any[]) {
    console.log('updateDataSource', records);
    const findRecord = (key: number, flag: string) => {
      return records.find((x) => x.key == key && x.actionType == flag);
    };

    this.totalRecords = records
      .filter((x) => x.key == 1)
      .map((x) => x.records)
      .reduce((prev: number, next: number) => prev + next, 0);
    console.log('totalRecords', this.totalRecords);

    this.dataSource = this.flags.map(
      ({ name, flag }: { name: string; flag: string }) => {
        return {
          name: name,
          total: findRecord(1, flag)?.records,
          added: findRecord(2, flag)?.records,
          edited: findRecord(3, flag)?.records,
        };
      }
    );

    this.dataSource = this.dataSource.filter((x: any) => x.total > 0);

    const labels = this.flags.map((it: any) => it.name);
    this.pieChartData.labels?.push.apply(this.pieChartData.labels, labels);

    const dataset = this.pieChartData.datasets[0].data;
    labels.forEach((label: string) => {
      const data = this.dataSource.find((it: any) => it.name == label);
      dataset?.push(data ? data.total : 0);
    });

    console.log('labels', this.pieChartData);
    this.chart?.update();
  }

  submit() {}
}
