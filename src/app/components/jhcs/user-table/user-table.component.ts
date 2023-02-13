import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';

export interface UserData {
  id: string;
  name: string;
  lastModified: string;
  nsn: string;
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

const LASTMODIFIED: string[] = [
  '01/25/2022',
  '12/04/2021',
  '10/10/2021',
  '09/09/2021',
  '05/16/2021',
  '02/28/2021',
  '10/14/2020',
  '10/14/2020',
  '10/14/2020',
  '10/14/2019',
  '10/14/2019',
  '10/14/2018',
  '10/14/2012',
  '10/14/2007',
  '10/14/2007',
  '10/14/2007',
  '10/14/2007',
  '10/14/2007',
  '10/14/2007',
  '10/14/2007',
];

const IDNO: string[] = [
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

const NAMES: string[] = [
  'Tommy Nguyen',
  'Asher Jean',
  'Olivia Rean',
  'Atticus Ato',
  'Amelia Bing',
  'Jack Smith',
  'Charlotte Chan',
  'Theodore Roose',
  'Isla Richard',
  'Oliver Dean',
  'Isabella Isvelz',
  'Jasper Smith',
  'Cora Fell',
  'Levi Ackerman',
  'Violet Evergarden',
  'Arthur Son',
  'Mia Khan',
  'Thomas Welling',
  'Elizabeth Raney',
  'Naruto Uzumaki',
];


@Component({
  selector: 'jhcs-user-table',
  styleUrls: ['user-table.component.css'],
  templateUrl: 'user-table.component.html',
})
export class JhcsUserTable implements AfterViewInit {
  displayedColumns: string[] = ['id', 'owners', 'lastModified', 'nsn', "action"];
  dataSource: MatTableDataSource<UserData>;

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

  editContact(userData: UserData) {
    this.router.navigate([`/jhcs/edit/${userData.id}`]);
  }

  viewContact(userData: UserData) {
    this.router.navigate([`/jhcs/view/${userData.id}`]);
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name = NAMES[id-1];
  const idNum = IDNO[id-1];
  const lastDate = LASTMODIFIED[id-1];
  const nsnNum = NSN[id-1];

  return {
    id: idNum,
    name: name,
    lastModified: lastDate,
    nsn: nsnNum,
  };
}
