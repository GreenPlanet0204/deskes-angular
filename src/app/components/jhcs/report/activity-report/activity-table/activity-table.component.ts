import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import moment from 'moment';
import {JhcsService, ToastService} from 'src/app/core';
import {RevisionDialogComponent} from '../revision-dialog/revision-dialog.component';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'jhcs-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.css']
})
export class ActivityTableComponent implements OnInit {
  columns = [
    {name: 'Status', key: 'status', width: '8%' },
    {name: 'ID No', key: 'id', width: '6%' },
    {name: 'Nomenclature', key: 'nomenclature', width: '20%', maxLength: 20, tooltip: true },
    {name: 'Changes', key: 'changes', width: '50%', maxLength: 80, tooltip: true },
    {name: 'Action', key: 'view_print', width: '10%' },
  ];
  dataSource: any = [];
  totalCount = 0;
  loading = false;

  startDate: any = moment().subtract(1, 'day').toISOString();
  endDate: any = moment().toISOString();

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private alertService: ToastService,
    private jhcsService: JhcsService,
  ) {
    
  }

  ngOnInit() {

  }

  counter(i: number) {
    return new Array(i).fill(0);
  }

  getDate() {
    return moment().format('DD/MM/YYYY')
  }

  searchByDate() {
    //this.fetchData(0, 5);

    this.loading = true;
    setTimeout(() => {
      const items = [];
      for (let i = 0; i < 5; i++) {
        items.push({
          status: 'Updated',
          id: (i + 1),
          nomenclature: `Nomen${i + 1}`,
          changes: 'dodic,nomenclature'
        })
      }
      this.dataSource = items;
      this.totalCount = 20;
      this.loading = false;
    }, 2000)
  }

  private fetchData(pageIndex: number, pageSize: number) {
    if (!this.loading) {
      this.loading = true;
      const start = moment(this.startDate).toISOString()
      const end = moment(this.endDate).toISOString()

      this.jhcsService
        .post('report/searchByDate', {start, end})
        .subscribe({
          next: (items) => {
            this.dataSource = items.map((it: any) => {
              return {
                ...it,
                changes: it.changes.join(', ')
              }
            })
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.alertService.error("Failed to get activity records.")
          },
        });
    }
  }

  updatePage(page: any) {
    console.log("updatePage", page)
    this.fetchData(page.pageIndex, page.pageSize);
  }

  actionEvent(e: any) {
    console.log("actionEvent", e)
    if (e.action === 'view') {
      this.jhcsService.getCustom(`jhcs/history/${e.item.id}`)
        .subscribe({
          next: (items) => {
            console.log("revisions", items)
            this.openRevisionDialog(items);
          },
          error: () => {
            this.alertService.error("Failed to get revision records.")
          },
        });
    }
  }

  private openRevisionDialog(revisions: any) {
    const dialogRef = this.dialog.open(RevisionDialogComponent, {
      data: { revisions },
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
