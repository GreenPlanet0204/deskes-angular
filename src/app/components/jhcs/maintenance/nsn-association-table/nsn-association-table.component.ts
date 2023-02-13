import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {MatTableDataSource} from "@angular/material/table";

export interface CodeData {
  tableId: number;
  id: string;
  nsn: string;
  code: string;
  description: string;
  isEditable: boolean;
}

// TODO: REMOVE STATIC DATA AFTER DEMO
/** Constants used to fill up our data base. */
const NSN: string[] = [
  '1410014836390',
  '0002008020448',
  '8140014902453',
  '1315005557391',
  '1315009776208',
  '1315010682403',
  '1376014891519',
  '1315002941751',
  '1410014836390',
  '0002008020448',
  '8140014902453',
  '1315005557391',
  '1315009776208',
  '1315010682403',
  '1376014891519',
  '1315002941751',
  '1315009776208',
  '1315010682403',
  '1376014891519',
  '1315002941751',
];

const ID: string[] = [
  '14836390',
  '20448',
  '2453',
  '7391',
  '76208',
  '82403',
  '91519',
  '41751',
  '6390',
  '020448',
  '2453',
  '57391',
  '6208',
  '682403',
  '91519',
  '941751',
  '776208',
  '2403',
  '1519',
  '41751',
];

const CODES: string[] = [
  'SEAL',
  'E',
  'C',
  'DE',
  'E',
  'B',
  'A',
  'C',
  'DE',
  'E',
  'B',
  'E',
  'B',
  'A',
  'C',
  'E',
  'DE',
  'A',
  'C',
  'DE',
];

const DESCRIPTION: string[] = [
  'Some description made by Tommy Nguyen',
  'Some description made by Asher Jean',
  'Some description made by Olivia Rean',
  'Some description made by Atticus Ato',
  'Some description made by Amelia Bing',
  'Some description made by Jack Smith',
  'Some description made by Charlotte Chan',
  'Some description made by Theodore Roose',
  'Some description made by Isla Richard',
  'Some description made by Oliver Dean',
  'Some description made by Isabella Isvelz',
  'Some description made by Jasper Smith',
  'Some description made by Cora Fell',
  'Some description made by Levi Ackerman',
  'Some description made by Violet Evergarden',
  'Some description made by Arthur Son',
  'Some description made by Mia Khan',
  'Some description made by Thomas Welling',
  'Some description made by Elizabeth Raney',
  'Some description made by Naruto Uzumaki',
];


@Component({
  selector: 'nsn-association-table',
  styleUrls: ['nsn-association-table.component.css'],
  templateUrl: 'nsn-association-table.component.html',
})
export class NsnAssociationTable implements AfterViewInit {
  displayedColumns: string[] = ['id','nsn','code', 'description', 'action'];
  dataSource: MatTableDataSource<CodeData>;

  // @ViewChild(MatTable)
  // table!: MatTable<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private router: Router) {
    // Create 20 users
    const users = Array.from({length: 20}, (_, k) => createNewUser(k + 1));


    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCode(codeData: CodeData) {
    // this.router.navigate([`/jhcs/edit/${codeData.id}`]);
    //TODO: capture data from the input

    if(this.dataSource.data[codeData.tableId].isEditable){

      this.dataSource.data[codeData.tableId].description = codeData.description;
      this.dataSource.data[codeData.tableId].code = codeData.code;
    }

    this.dataSource.data[codeData.tableId].isEditable = !codeData.isEditable;
    // this.table.renderRows();
  }

  clearCode(codeData: CodeData) {
    // this.router.navigate([`/jhcs/view/${codeData.id}`]);
    this.dataSource.data[codeData.tableId].code = "";
    this.dataSource.data[codeData.tableId].description = "";

  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): CodeData {
  const code = CODES[id-1];
  const description = DESCRIPTION[id-1];
  const nsn = NSN[id-1];
  const ids = ID[id-1];

  return {
    tableId: id-1,
    id:ids,
    nsn: nsn,
    code: code,
    description: description,
    isEditable: false,
  };
}

