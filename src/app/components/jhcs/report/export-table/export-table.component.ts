import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {merge, Observable, of} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ExportToCsv} from 'export-to-csv';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'jhcs-export-table',
  templateUrl: './export-table.component.html',
  styleUrls: ['./export-table.component.css']
})
export class ExportTableComponent implements OnInit {
  @Input() loading = true;
  @Input() title: string = '';
  @Input() columns: any[] = [];
  @Input() userData: any[] = [];
  @Input() totalCount: number = 0;
  @Input() pagination: boolean = true;
  @Input() filterable: boolean = false;
  @Output() updatePage : EventEmitter<any> = new EventEmitter();
  @Output() actionEvent : EventEmitter<any> = new EventEmitter();
  
  pageIndex = 0
  pageSize = 10
  filter: string | undefined = undefined;
  displayedColumns$!: Observable<string[]>
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;

  form: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes?.columns?.firstChange) {
      this.displayedColumns$ = of(this.columns.map(c => c.key))
      console.log("ngOnChanges", this.displayedColumns$);

      this.columns.forEach(c => {
        this.form.addControl(c.key, new FormControl(true))
      })

      const values = this.columns.map(c => this.form.get(c.key)?.valueChanges).filter(i => i)
      console.log("values", values);
      merge(...values).subscribe(()=>{
        this.displayedColumns$ = of(this.columns.filter(c => this.form.get(c.key)?.value).map(c => c.key))
        console.log("this.displayedColumns$", this.displayedColumns$)
      })
    }

    console.log("changes?.userData", changes?.userData);
    if (this.userData?.length > 0) {
      this.dataSource = new MatTableDataSource(this.userData);
      this.dataSource.sort = this.sort;
    }
  }

  columnCount() {
    return this.columns.filter(c => this.form.get(c.key)?.value).length;
  }

  counter(i: number) {
    return new Array(i).fill(0);
  }

  convertContent(element: any, item: any) {
    const text = element[item.key];
    if (text) {
      if (item.maxLength && text.length > item.maxLength) {
        return text.substring(0, item.maxLength) + '...'
      }
    }
    return text;
  }

  viewItem(item: any) {
    if (this.actionEvent) {
      this.actionEvent.emit({ action: 'view', item })
    } else {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/jhcs/view/${item.id}`]));
      window.open(url, '_blank');
    }
  }

  editItem(item: any) {
    if (this.actionEvent) {
      this.actionEvent.emit({ action: 'edit', item })
    } else {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/jhcs/edit/${item.id}`]));
      window.open(url, '_blank');
    }
  }

  linkItem(e: any, item: any) {
    e.preventDefault();
    this.actionEvent?.emit({ action: 'link', item })
  }

  printItem(item: any) {
    if (this.actionEvent) {
      this.actionEvent.emit({ action: 'print', item })
    }
  }

  exportToCsv(filter: boolean) {
    let data = this.userData
    if (filter) {
      data = this.userData.map((data: any) => {
        const item = {} as any;
        Object.keys(this.form.value).forEach((key: string) => {
          if (this.form.value[key]) {
            item[key] = data[key]
          }
        })
      })
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    new ExportToCsv(options).generateCsv(data);
  }

  pageEvent(event: any){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePage?.emit(event)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filter

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
