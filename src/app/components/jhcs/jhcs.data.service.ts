import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Jhcs, JhcsDrawing, JhcsLabelCode, JhcsUnSerNum, JhcsWeight,} from './jhcs';

@Injectable({
  providedIn: 'root',
})
export class JhcsDataService {
  private jhcs: Jhcs = {} as Jhcs;

  private form!: FormGroup;

  setForm(form: FormGroup) {
    this.form = form;
  }

  setItem(jhcs: Jhcs) {
    this.jhcs = jhcs;
  }

  updateItem(updatedItem: any) {
    if (this.jhcs) {
      this.jhcs = { ...this.jhcs, ...updatedItem }
    } else {
      this.jhcs = { ...updatedItem };
    }
  }

  getItem() {
    return this.jhcs;
  }

  getId() {
    return this.jhcs?.id;
  }

  private counter(i: number) {
    return new Array(i).fill(0).map((it: any, index: number) => index);
  }

  getPatchObject() {
    const obj: any = { ...this.jhcs };

    // Convert weights to form control values
    WeightTypes.forEach(({ type: weightType }: { type: string }) => {
      const weight = this.findWeight(weightType);
      obj[this.weightControlName(weightType, 'lbs')] = weight?.weightLb;
      obj[this.weightControlName(weightType, 'kgs')] = weight?.weightKg;
    });

    // Convert drawings to form control values
    this.counter(10).forEach((value: number, no: number) => {
      obj[this.drawingControlName(no + 1)] = this.findDrawing(no + 1);
    });

    let groupNameId = null;
    if (this.jhcs.groupNames && this.jhcs.groupNames.length > 0){
      groupNameId = this.jhcs.groupNames[0]?.id;
    }

    // Patch the value for a form group
    return {
      ...obj,
      groupNameId,
      shipLabel1: this.jhcs.jhcsLabel1?.jhcsLabelCode?.id || null,
      shipLabel2: this.jhcs.jhcsLabel2?.jhcsLabelCode?.id || null,
      shipLabel3: this.jhcs.jhcsLabel3?.jhcsLabelCode?.id || null,
    };
  }

  updateKeyValue(key: string, value: any) {
    (this.jhcs as any)[key] = value;
  }

  findWeight(weightType: string) {
    return this.jhcs.jhcsWeights?.find(
      (x: JhcsWeight) => x.weightType === weightType
    );
  }

  updateWeight({weightType, weightLb, weightKg}: {
    weightType: string;
    weightLb: number | undefined;
    weightKg: number | undefined;
  }) {
    const weights = this.jhcs.jhcsWeights || [];

    const curItem = this.findWeight(weightType);
    if (curItem) {
      curItem.weightLb = weightLb;
      curItem.weightKg = weightKg;
    }
    else if (weightLb || weightKg) { //If not exists, add new weight.
      weights.push({
        jhcsId: this.getId(),
        weightType,
        weightLb,
        weightKg,
      });
    }

    this.jhcs.jhcsWeights = weights;
  }

  updateWeightValue(updated: JhcsWeight, weightUnit: string) {
    const weight = this.findWeight(updated.weightType)
    if (weight) {
      weight.weightLb = (weightUnit == 'lbs') ? updated.weightLb : updated.weightKg;
    }
  }

  findDrawing(no: number) {
    return this.jhcs.jhcsDrawings?.find((x: JhcsDrawing) => x.no === no);
  }

  updateDrawing(item: JhcsDrawing) {
    this.jhcs.jhcsDrawings = this.jhcs.jhcsDrawings || [];

    const drawing = this.findDrawing(item.no);
    if (drawing) {
      drawing.file = item.file;
      drawing.filePath = item.filePath;
      drawing.blobFile = item.blobFile;
    }
    else if (item.filePath) { // If not exists, add new drawing.
      this.jhcs.jhcsDrawings.push({
        ...item,
        jhcsId: this.getId(),
      });
    }
  }

  updateDrawingFile(updated: JhcsDrawing) {
    const drawing = this.findDrawing(updated.no);
    if (drawing) {
      drawing.filePath = updated.filePath;
      drawing.blobFile = updated.blobFile;
    }
  }

  updateUnSerNum(item: JhcsUnSerNum) {}

  updateLabel(index: number, labelCode: JhcsLabelCode) {
    const jhcs: any = this.jhcs as any;

    const property: string = `jhcsLabel${index}`;
    if (jhcs[property]) {
      if (jhcs[property].jhcsLabelCode) {
        jhcs[property].jhcsLabelCode = labelCode;
        return;
      }
      //TODO
      console.error('Unknown Error');
    } else if (this.jhcs?.jhcsUnSerNum) {
      const jhcsUnSerNum = this.jhcs?.jhcsUnSerNum;
      const shipLabel = {
        unoSerialNo: jhcs.jhcsUnSerNum?.unoSerialNo,
        type: 'N',
        lno: index,
        unoId: jhcsUnSerNum.id,
        jhcsUnSerNum: jhcsUnSerNum,
        jhcsLabelCode: labelCode,
      };
      jhcs[property] = shipLabel;
    }
  }

  weightControlName(weightType: string, weightUnit: string) {
    return `weights_${weightType}_${weightUnit}`.toLowerCase()
  }

  drawingControlName(no: number) {
    return `drawings_${no}`.toLowerCase()
  }

  updateFormKeyValue(key: string, value: any) {
    this.form.patchValue({ [key]: value })
  }

  updateFormWeight(weight: JhcsWeight) {
    this.form.patchValue({
      [this.weightControlName(weight.weightType, 'lbs')]: weight.weightLb,
      [this.weightControlName(weight.weightType, 'kgs')]: weight.weightKg,
    })
  }

  updateFormWeightValue(weight: JhcsWeight, weightUnit: string) {
    const value = (weightUnit == 'lbs') ? weight.weightLb : weight.weightKg;
    this.form.patchValue({
      [this.weightControlName(weight.weightType, weightUnit)]: value,
    })
  }

  updateFormDrawing(drawing: JhcsDrawing) {
    this.form.patchValue({
      [this.drawingControlName(drawing.no)]: drawing
    })
  }

  updateGroupName(groupName: any) {
    this.jhcs.groupNames = [groupName];
  }
}

export const WeightUnits: any[] = [
  {
    label: 'Lbs',
    value: 'lbs',
  },
  {
    label: 'Kgs',
    value: 'kgs',
  },
];

export const WeightTypes: any[] = [
  {
    type: 'NEW',
    label: 'Net Explosive Weight',
  },
  {
    type: 'NEWQD',
    label: 'Net Explosive QD Weight',
  },
  {
    type: 'MCE',
    label: 'Explosives Max Credible Event Weight',
  },
  {
    type: 'HEW',
    label: 'High Explosive Weight',
  },
  {
    type: 'NPW',
    label: 'Net Propellant Weight',
  },
  {
    type: 'PYRO',
    label: 'Pyro Weight',
  },
  {
    type: 'ACH',
    label: 'Applicable HE Content',
  },
];
