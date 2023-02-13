import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JhcsService, MatDrawerService} from '../../../core';
import {FormControl} from '@angular/forms';
import {MatDrawer} from '@angular/material/sidenav';
import {JhcsDataService} from '../jhcs.data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  id: string | null;
  jhcs: any = {};

  weightType: number = 1;

  isLinear = false;
  date = new FormControl(new Date());
  selectedOption = 'two';

  @ViewChild(MatDrawer) drawer!: MatDrawer;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jhcsService: JhcsService,
    private drawerService: MatDrawerService,
    private store: JhcsDataService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.initialize();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.drawerService.setDrawer(this.drawer);
  }

  counter(i: number) {
    return new Array(i).fill(0);
  }

  private initialize() {
    if (this.id) {
      this.jhcsService
        .get('jhcs', this.id)
        .subscribe({
          next: (item) => {
            this.jhcs = item;
            this.store.setItem(this.jhcs);
          }
        });
    }
  }

  editItem() {
    if (this.jhcs) {
      this.router.navigate([`/jhcs/edit/${this.jhcs.id}`]);
    }
  }

  printPage(){
    this.router.navigate([`/jhcs/print/${this.jhcs.id}`]);
  }

  applyChange(item: any) {
    if (item.reload) {
      item.reload(this.jhcs);
    }
  }

  getJhcsWeight(weightType: string) {
    if (this.jhcs?.jhcsWeights) {
      const weight = this.jhcs.jhcsWeights.find((it: any) => it.weightType == weightType)
      if (weight) {
        return (this.weightType === 1) ? weight.weightLb : weight.weightKg
      }
    }
    return undefined
  }

  getPartOrDwg(num: number) {
    return this.jhcs?.jhcsDrawings?.find((it: any) => it.no == num)?.filePath
  }

  getGroupName() {
    return (this.jhcs.groupNames && this.jhcs.groupNames.length > 0) ?
      this.jhcs.groupNames[0].jhcsGroupName :
      undefined;
  }
}

