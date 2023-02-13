import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';


export interface SearchItem {
  id: number;
  dodic: string;
  nsn: string;
  nomenclature: string;
  newLbs: string;
  dodHc: number;
}

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'dodic', 'nsn', 'nomenclature', 'newLbs', 'dodHc', 'action'];
  @Input() dataSource: any;

  constructor(private router: Router) {
  }

  ngOnInit() {
    console.log("dataSource", this.dataSource);
  }

  viewItem(item: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/jhcs/view/${item.id}`]));
    window.open(url, '_blank');
  }

  editItem(item: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/jhcs/edit/${item.id}`]));
    window.open(url, '_blank');
  }
}
