import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'jhcs-pagable-table',
  templateUrl: './pagable-table.component.html',
  styleUrls: ['./pagable-table.component.css']
})
export class PagableTableComponent implements OnInit {
  @Input() title: string = '';
  @Input() itemColumns: any[] = []
  @Input() items: any[] = [];
  @Input() loading = true;
  @Input() total = 0
  @Input() pageIndex = 0
  @Input() pageSize = 0
  @Input() filter = ''

  @Output() fetchDatas : EventEmitter<any> = new EventEmitter();

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;


  constructor(private router: Router) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: any) {
    console.log('ngOnChanges', changes)

    if (changes.itemColumns?.firstChange) {
      this.displayedColumns = changes.itemColumns.currentValue.map((it: any) => it.key)
    }
    if (changes.items) {
      this.dataSource = new MatTableDataSource(changes.items.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    if(changes.filter){
      this.dataSource.filter = changes.filter.currentValue;
  }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filter;
  }

  viewItem(item: any) {
    console.log('viewitem', item)
    const url = this.router.serializeUrl(this.router.createUrlTree([`/jhcs/view/${item}`]));
    window.open(url, '_blank');
  }

  editItem(item: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/jhcs/edit/${item}`]));
    window.open(url, '_blank');
  }

  pageEvent(event: any){
    console.log('page event', this.fetchDatas)
    this.fetchDatas?.emit({pageIndex: event.pageIndex + 1, pageSize: event.pageSize})
  }

}
