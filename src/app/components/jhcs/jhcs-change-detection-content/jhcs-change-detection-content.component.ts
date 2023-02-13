import {DataSource} from '@angular/cdk/collections';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import * as moment from 'moment';
import {Observable, ReplaySubject} from 'rxjs';
import {AppInjector} from 'src/app/utils/app.injector';
import {MatDrawerService} from '../../../core';
import {JhcsDrawing, JhcsWeight} from '../jhcs';
import {JhcsDataService, WeightTypes} from '../jhcs.data.service';
import {UserService} from "../../../session/user.service";

export interface ItemRevision {
  id: string;
  jhcs: any;
  changedBy: string;
  dateChanged: string;
  revision: string;
}

export interface Detection {
  id: number;
  field: string;
  newData: string;
  changedBy: string;
  dateChanged: string;
  revision: string;
  reload: (to: any) => void;
  apply: (form: FormGroup) => void;
}

const weightTypes = WeightTypes;

@Component({
  selector: 'jhcs-change-detection-content',
  templateUrl: './jhcs-change-detection-content.component.html',
  styleUrls: ['./jhcs-change-detection-content.component.css']
})
export class JhcsChangeDetectionContentComponent implements OnInit {
  displayedColumns: string[] = ['field', 'newData', 'changedBy', 'dateChanged', 'revision', 'action'];

  items: Detection[] = [];
  dataSource = new WebsocketDataSource(this.items);

  private uniqueId = 1;

  private userService: UserService;

  @Input() buttonName: string = 'Reload';
  @Input() currentItem: any;
  @Output() applyChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private rxStompService: RxStompService,
    private drawerService: MatDrawerService,
    private store: JhcsDataService,
  ) {
      const appInjector = AppInjector.getInjector();
      this.userService = appInjector.get<UserService>(UserService);
  }

  ngOnInit() {
    this.rxStompService.watch('/message').subscribe((message: Message) => {
      const item: ItemRevision = JSON.parse(message.body);
      this.handleItemRevision(item);
    });
  }

  converNewData(newData: String) {
    if (!newData) return 'empty';
    if (newData.length > 8) {
      return newData.substring(0, 11) + '...';
    }
    return newData;
  }

  applyChanges(item: Detection) {
    this.applyChange?.emit(item);

    const index = this.items.findIndex(it => it.id == item.id);
    index >= 0 && this.items.splice(index, 1);
    this.dataSource.setData(this.items);
    this.items.length <= 0 && this.drawerService.close();
  }

  handleItemRevision(revision: ItemRevision) {
    if (this.currentItem?.id != revision.id) {
      return;
    }

    const jhcs = revision.jhcs;

    if (this.buttonName === 'Apply') {
      const username = this.userService.getUsername();
      if (username == jhcs.editor) {
        return;
      }
    }

    const updatedItems = [
      ...this.getUpdateRootProperties(jhcs),
      ...this.getUpdatedWeights(jhcs),
      ...this.getUpdatedDrawings(jhcs),
      ...this.getUpdatedDotLetter(jhcs),
    ]

    const detections = updatedItems.map(it => {
      return {
        ...it,
        id: this.uniqueId++,
        changedBy: revision.changedBy,
        dateChanged: revision.dateChanged,
        revision: revision.revision
      } as Detection
    })
    detections.forEach(it => {
      const found = this.items.find(x => x.field == it.field)
      if (found) {
        it.id = found.id
      }
    })

    // Remove newly updated items.
    const resultItems = this.items.filter((it: any) => !detections.find((x: any) => x.field == it.field))
    this.items = resultItems.concat(detections).sort((a: any, b: any) => a.id - b.id);

    this.dataSource.setData(this.items);

    if (detections?.length > 0) {
      console.log("detections~~~~~~~~~", detections);
      this.drawerService.open();
    }
  }

  private getUpdateRootProperties(jhcs: any) {
    return Object.keys(jhcs)
      .filter(key => typeof jhcs[key] !== 'object')
      .filter(key => !this.currentItem.hasOwnProperty(key) || this.currentItem[key] !== jhcs[key])
      .map(field => {
        const newData= jhcs[field]
        return {
          field,
          newData,
          reload: () => this.store.updateKeyValue(field, jhcs[field]),
          apply: () => this.store.updateFormKeyValue(field, newData),
        }
      })
  }

  private getUpdatedWeights(jhcs: any) {
    return (jhcs.jhcsWeights as Array<JhcsWeight>)
      ?.map((weight: JhcsWeight) => {
        const old = this.currentItem.jhcsWeights?.find((x: any) => x.weightType === weight.weightType);
        if (!old) {
          return {
            field: this.getWeightFieldName(weight),
            newData: weight.weightLb || weight.weightKg,
            reload: () => this.store.updateWeight(weight),
            apply:  () => this.store.updateFormWeight(weight),
          }
        }
        if (weight.weightLb != old.weightLb) {
          return {
            field: this.getWeightFieldName(weight, 'Lb'),
            newData: weight.weightLb,
            reload: () => this.store.updateWeightValue(weight, 'lbs'),
            apply:  () => this.store.updateFormWeightValue(weight, 'lbs'),
          }
        }
        if (weight.weightKg != old.weightKg) {
          return {
            field: this.getWeightFieldName(weight, 'Kg'),
            newData: weight.weightKg,
            reload: () => this.store.updateWeightValue(weight, 'kgs'),
            apply:  () => this.store.updateFormWeightValue(weight, 'kgs'),
          }
        }
        return undefined;
      })
      .filter(it => it)
  }

  private getWeightFieldName(weight: JhcsWeight, unit: string | undefined = undefined) {
    const wwl = weightTypes.find(it => it.type == weight.weightType);
    if (!wwl) return 'Weight'
    return unit? `${wwl.label}(${unit})` : wwl.label;
  }

  private getUpdatedDrawings(jhcs: any) {
    return (jhcs.jhcsDrawings as Array<JhcsDrawing>)
      ?.map((drawing: JhcsDrawing) => {
        const old = this.currentItem.jhcsDrawings?.find((x: JhcsDrawing) => x.no === drawing.no);
        if (!old) {
          return {
            field: `Drawing ${drawing.no}`,
            newData: drawing.filePath,
            reload: () => this.store.updateDrawing(drawing),
            apply: () => this.store.updateFormDrawing(drawing)
          }
        }
        if (drawing.filePath != old.filePath || drawing.blobFile != old.blobFile) {
          return {
            field: `Drawing ${drawing.no}`,
            newData: drawing.filePath,
            reload: () => this.store.updateDrawingFile(drawing),
            apply: () => this.store.updateFormDrawing(drawing)
          }
        }

        return undefined;
      })
      .filter(it => it)
  }

  private getUpdatedDotLetter(jhcs: any) {
    const oldLetter = this.currentItem.dotLetter;
    const newLetter = jhcs.dotLetter as any;

    if (oldLetter && newLetter) {
      const createUpdater = (field: string, property: string, time: boolean) => {
        let newData = newLetter[property]
        if (time) {
          newData = moment(newData).format('YYYY-MM-DD');
        }
        return {
          field,
          newData,
          reload: (to: any) => {
            if (to.dotLetter) {
              to.dotLetter[property] = newData;
            }
          },
          apply: (form: FormGroup) => {
            form.patchValue({
              dotLetter: {
                ...form.value.dotLetter,
                [property]: newData
              }
            })
          }
        }
      }

      const updates = []
      if (oldLetter.fileName != newLetter.fileName) {
        updates.push(createUpdater('DOT Letter File', 'fileName', false))
      }
      if (oldLetter.dotTracking != newLetter.dotTracking) {
        updates.push(createUpdater('DOT Tracking No', 'dotTracking', false))
      }
      if (moment(oldLetter.fileDate).diff(newLetter.fileDate, 'seconds') != 0) {
        updates.push(createUpdater('DOT Letter File Date', 'fileDate', true))
      }
      if (moment(oldLetter.expirationDate).diff(newLetter.expirationDate, 'seconds') != 0) {
        updates.push(createUpdater('DOT Letter Expiration Date', 'expirationDate', true))
      }
      return updates
    }
    else if (oldLetter && !newLetter) {
      return [{
        field: 'Dot Letter',
        newData: 'Removed',
        reload: () => this.store.updateKeyValue('dotLetter', null),
        apply: () => this.store.updateFormKeyValue('dotLetter', null),
      }]
    }
    else if (!oldLetter && newLetter) {
      return [{
        field: 'Dot Letter',
        newData: newLetter.fileName,
        reload: () => this.store.updateKeyValue('dotLetter', newLetter),
        apply: () => this.store.updateFormKeyValue('dotLetter', newLetter),
      }]
    }

    return []
  }
}

class WebsocketDataSource extends DataSource<Detection> {
  private _dataStream = new ReplaySubject<Detection[]>();

  constructor(initialData: Detection[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Detection[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Detection[]) {
    this._dataStream.next(data);
  }
}
