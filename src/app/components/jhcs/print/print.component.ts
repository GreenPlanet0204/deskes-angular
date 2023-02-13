import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JhcsService} from '../../../core';
import * as constants from '../constants';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  private id: string | null;
  jhcs: any;

  private actions = constants.ActionNames;
  private dodComponents = constants.DodComponentNames;
  private triServiceCoordinations = constants.TriServiceCoordinationNames;

  constructor(
    private route: ActivatedRoute,
    private jhcsService: JhcsService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("id", this.id);
    this.initialize();
    setTimeout(() => {
      this.printWindow();
    }, 1000)
  }

  ngOnInit(): void {
  }

  private initialize() {
    if (this.id) {
      this.jhcsService
        .get('jhcs', this.id)
        .subscribe({
          next: (item) => {
            console.log("getitem", item)
            this.jhcs = item;
          },
          error: (err) => {
            console.log("geterr", err)
          },
          complete: () => console.log("Get item completed")
        });
    }
  }

  private printWindow() {
    window.print();
  }

  showResultsCheck(attr: any) {
    return true;
  }

  getActionName(actionType: any) {
    if (!actionType) return 'empty'
    const found = this.actions.find((i: any) => i.key == actionType)
    if (!found) return 'empty'
    return found.value;
  }

  getDodComponentName(dodComp: any) {
    if (!dodComp) return 'empty'
    if (!this.dodComponents.hasOwnProperty(dodComp)) return 'empty'
    return this.dodComponents[dodComp]
  }

  getTriServiceCoordinationName(tsc: any) {
    if (!tsc) return 'empty'
    if (tsc <= 0 || tsc >= this.triServiceCoordinations.length) return 'empty'
    return this.triServiceCoordinations[tsc]
  }
}
