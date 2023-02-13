import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {MatTableDataSource} from "@angular/material/table";
import {ResizeEvent} from 'angular-resizable-element';
import {ToastService, JhcsService} from 'src/app/core';

export interface CodeData {
  tableId: number;
  unNumber: string;
  properShippingName: string;
  hazardClass: string;
  hazardDivision: string;
  compatibilityGroup: string;
  packingGroup: string;
  subsidiary: string;
  packageRequired: string;
  shippingLabelOne: string;
  shippingLabelTwo: string;
  shippingLabelThree: string;
  isEditable: boolean;
  isNewData: boolean;
}

// TODO: REMOVE STATIC DATA AFTER DEMO
/** Constants used to fill up our data base. */
const UNNUMBERS: string[] = [
  '28589',
  '14',
  '28592',
  '28595',
  '32503',
  '32507',
  '67',
  '96',
  '70',
  '71',
  '74',
  '72',
  '69',
  '66',
  '89',
  '127',
  '248',
  '32510',
  '103',
  '104',
];

const SHIPPINGMNAME: string[] = [
  'Shipped by Tommy Nguyen',
  'Shipped by Asher Jean',
  'Shipped by Olivia Rean',
  'Shipped by Atticus Ato',
  'Shipped by Amelia Bing',
  'Shipped by Jack Smith',
  'Shipped by Charlotte Chan',
  'Shipped by Theodore Roose',
  'Shipped by Isla Richard',
  'Shipped by Oliver Dean',
  'Shipped by Isabella Isvelz',
  'Shipped by Jasper Smith',
  'Shipped by Cora Fell',
  'Shipped by Levi Ackerman',
  'Shipped by Violet Evergarden',
  'Shipped by Arthur Son',
  'Shipped by Mia Khan',
  'Shipped by Thomas Welling',
  'Shipped by Elizabeth Raney',
  'Shipped by Naruto Uzumaki',
];

const HAZARDCLASS: string[] = [
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

const HAZARDDIVISON: string[] = [
  'Z',
  'P',
  'R',
  'RE',
  'T',
  'W',
  'A',
  'C',
  'DE',
  'Q',
  'DP',
  'E',
  'B',
  'A',
  'U',
  'E',
  'LE',
  'B',
  'M',
  'DE',
];

const COMPAYIBILITYGROUP: string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'O',
  'P',
  'Q',
  'R',
  'T',
  'U',
  'V',
];

const PACKINGGROUP: string[] = [
  'I',
  'II',
  'III',
  'I',
  'II',
  'I',
  'II',
  'III',
  'I',
  'II',
  'I',
  'III',
  'I',
  'II',
  'II',
  'III',
  'III',
  'I',
  'II',
  'III',
];

const SUBSIDIARY: string[] = [
  '2.8 5,8',
  '1.4',
  '2.8 , 5.9',
  '2.8595',
  '3.2503',
  '3.2507',
  '6.7',
  '9.6',
  '7.0',
  '7.1',
  '7.4',
  '7.2',
  '6.9',
  '6.6',
  '8.9',
  '1.27',
  '2.48',
  '3.2510',
  '1.03',
  '1.04',
];


const PACKINGREQUIRED: string[] = [
  '285.89',
  '14',
  '285.92',
  '285.95',
  '32.503',
  '32.507',
  '6.7',
  '9.6',
  '7.0',
  '7.1',
  '7.4',
  '7.2',
  '6.9',
  '6.6',
  '8.9',
  '12.7',
  '24.8',
  '325.10',
  '10.3',
  '10.4',
];

const SHIPPINGLABEL: string[] = [
  'EXPLO 1.1',
  'EXPLO 1.2',
  'EXPLO 1.3',
  'EXPLO 1.4',
  'Class 9',
  'POISON',
  'NONE',
  'CORROSIVE',
  'EXPLO 1.3',
  'EXPLO 1.3',
  'EXPLO 1.2',
  'EXPLO 1.2',
  'EXPLO 1.3',
  'EXPLO 1.4',
  'EXPLO 1.4',
  'EXPLO 1.4',
  'Class 9',
  'EXPLO 1.2',
  'EXPLO 1.3',
  'EXPLO 1.4',
];


@Component({
  selector: 'un-number-table',
  styleUrls: ['un-number-table.component.css'],
  templateUrl: 'un-number-table.component.html',
})
export class UnNumberTable implements AfterViewInit {
  displayedColumns: string[] = ['unNumber', 'properShippingName','hazardClass','hazardDivision','compatibilityGroup', 'subsidiary', 'packageRequired','packingGroup', 'shippingLabelOne','shippingLabelTwo','shippingLabelThree','action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  loading = false;
  totalDataCount = 0
  pageIndex = 0
  pageSize = 0

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private router: Router,
    private alertService: ToastService,
    private jhcsService: JhcsService
  ) {
    this.fetch();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetch() {
    this.getDetails({pageIndex: 1, pageSize: 10});
  }

  getDetails(page: any) {

    const pageIndex = page.pageIndex
    const pageSize = page.pageSize

    this.loading = true;
    this.pageIndex = pageIndex - 1
    this.pageSize = pageSize

    this.jhcsService.getCustom(`jhcs/getUNSerialNumberList?page=${pageIndex}&size=${pageSize}`)
      .subscribe({
        next: (items) => {
          console.log('getDetails', items)
          this.dataSource = new MatTableDataSource(items.content.map((x: any) => {
            return {
              ...x,
              unNumber: x.unoSerialNo,
              properShippingName: x.shipName,
              packageRequired: x.pkgRequire,
              packingGroup: x.packGroup,
              shippingLabelOne: x.description1,
              shippingLabelTwo: x.description2,
              shippingLabelThree: x.description3,
            };
          }))
          this.totalDataCount = items.totalElements
        },
        error: () => {
          this.alertService.error('Failed to getUNSerialNumberList.')
        },
        complete: () => {
          this.loading = false;
        }
      });
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
      // this.dataSource.data[codeData.tableId].description = codeData.description;
    }

    if(this.dataSource.data[codeData.tableId].isNewData){
      // this.dataSource.data[codeData.tableId].code = codeData.code;
      this.dataSource.data[codeData.tableId].isNewData = false;
    }

    this.dataSource.data[codeData.tableId].isEditable = !codeData.isEditable;
    // this.table.renderRows();
  }

  deleteCode(codeData: CodeData) {
    // this.router.navigate([`/jhcs/view/${codeData.id}`]);
    this.dataSource.data.splice(codeData.tableId, 1);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.table.renderRows();

  }

  // Adds new code.
  addRow() {
    this.dataSource.data.push(addNewCode(this.dataSource.data.length + 1));
    this.dataSource.filter = "";
  }

  onResizeEnd(event: ResizeEvent, columnName: string): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): CodeData {
  const unnumber = UNNUMBERS[id-1];
  const properShippingName = SHIPPINGMNAME[id-1];
  const hazardclass = HAZARDCLASS[id-1];
  const hazardDivision = HAZARDDIVISON[id-1];
  const compatibilityGroup = COMPAYIBILITYGROUP[id-1];
  const packingGroup = PACKINGGROUP[id-1];
  const subsidiary = SUBSIDIARY[id-1];
  const packageRequired = PACKINGREQUIRED[id-1];
  const shippingLabelOne = SHIPPINGLABEL[id-1];

  return {
    tableId: id-1,
    unNumber: unnumber,
    properShippingName: properShippingName,
    hazardClass: hazardclass,
    hazardDivision: hazardDivision,
    compatibilityGroup: compatibilityGroup,
    packingGroup: packingGroup,
    subsidiary: subsidiary,
    packageRequired: packageRequired,
    shippingLabelOne: shippingLabelOne,
    shippingLabelTwo: shippingLabelOne,
    shippingLabelThree: shippingLabelOne,
    isEditable: false,
    isNewData: false
  };
}

// Creates new user.
function addNewCode(id: number): CodeData {

  return {
    tableId: id-1,
    unNumber: '',
    properShippingName: '',
    hazardClass: '',
    hazardDivision: '',
    compatibilityGroup: '',
    packingGroup: '',
    subsidiary: '',
    packageRequired: '',
    shippingLabelOne: '',
    shippingLabelTwo: '',
    shippingLabelThree: '',
    isEditable: true,
    isNewData: true
  };
}



