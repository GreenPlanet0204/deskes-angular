import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {FormControl, FormGroup,} from '@angular/forms';

import {MyTel} from "../nsn-formatter/nsn-formatter.component";

export interface HazardSymbol {
  tableId: number;
  nsn: string;
  afHSymbol: string;
  isEditable: boolean;
  isNewData: boolean;
}

// TODO: REMOVE STATIC DATA AFTER DEMO
/** Constants used to fill up our data base. */
const NSN: string[] = [
  '1410-01-483-6390',
  '0002-00-802-0448',
  '8140-01-490-2453',
  '1315-00-555-7391',
  '1315-00-977-6208',
  '1315-01-068-2403',
  '1376-01-489-1519',
  '1315-00-294-1751',
  '1410-01-483-6390',
  '0002-00-802-0448',
  '8140-01-490-2453',
  '1315-00-555-7391',
  '1315-00-977-6208',
  '1315-01-068-2403',
  '1376-01-489-1519',
  '1315-00-294-1751',
  '1315-00-977-6208',
  '1315-01-068-2403',
  '1376-01-489-1519',
  '1315-00-294-1751',
];

const AFHS: string[] = [
  'DE',
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

@Component({
  selector: 'hazard-symbol-table',
  templateUrl: './hazard-symbol.component.html',
  styleUrls: ['./hazard-symbol.component.css']
})

export class HazardSymbolTableComponent implements AfterViewInit {

  form: FormGroup = new FormGroup({
    tel: new FormControl(new MyTel('0000', '00', '000','0000')),
  });

  displayedColumns: string[] = [ 'nsn', 'afHSymbol' ,"action"];
  dataSource: MatTableDataSource<HazardSymbol>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {

    const symbols = Array.from({length: 20}, (_, k) => createNewSymbol(k + 1));


    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(symbols);
  }

  ngAfterViewInit(): void {
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

  editSymbol(hazardSymbol: HazardSymbol) {
    //TODO: capture data from the input

    if(this.dataSource.data[hazardSymbol.tableId].isEditable){
      this.dataSource.data[hazardSymbol.tableId].afHSymbol = hazardSymbol.afHSymbol;
    }

    if(this.dataSource.data[hazardSymbol.tableId].isNewData){
      this.dataSource.data[hazardSymbol.tableId].nsn = hazardSymbol.nsn;
      this.dataSource.data[hazardSymbol.tableId].isNewData = false;
    }

    this.dataSource.data[hazardSymbol.tableId].isEditable = !hazardSymbol.isEditable;
  }

  deleteSymbol(hazardSymbol: HazardSymbol) {
    // this.router.navigate([`/jhcs/view/${codeData.id}`]);
    this.dataSource.data.splice(hazardSymbol.tableId, 1);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.table.renderRows();

  }

  // Adds new code.
  addRow() {
    this.dataSource.data.push(addNewSymbol(this.dataSource.data.length + 1));
    this.dataSource.filter = "";
  }

}

/** Builds and returns a new User. */
function createNewSymbol(id: number): HazardSymbol {
  const afHSymbol = AFHS[id-1];
  const nsnNum = NSN[id-1];

  return {
    tableId: id-1,
    nsn: nsnNum,
    afHSymbol: afHSymbol,
    isEditable: false,
    isNewData: false
  };
}

// Creates new user.
function addNewSymbol(id: number): HazardSymbol {

  return {
    tableId: id-1,
    nsn: "",
    afHSymbol: "",
    isEditable: true,
    isNewData: true
  };
}


