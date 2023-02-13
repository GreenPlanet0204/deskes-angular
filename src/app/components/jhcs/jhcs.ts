export interface JhcsWeight {
  jhcsId: number;
  weightType: string;
  weightLb: number | undefined;
  weightKg: number | undefined;
}

export interface JhcsDrawing {
  jhcsId: number;
  no: number;
  file: File;
  filePath: string
  blobFile: any
}

export interface JhcsLabelCode {
  id: number;
}

export interface JhcsLabels {
  jhcsLabelCode: JhcsLabelCode; 
}

export interface JhcsUnSerNum {
  id: number;
  unoSerialNo: string;
}

export interface GroupName {
  id: number;
  jhcsGroupName: string;
}

export interface Jhcs {
  id: number;
  nsn: string;
  jhcsWeights: JhcsWeight[];
  jhcsDrawings: JhcsDrawing[];
  jhcsLabel1: JhcsLabels;
  jhcsLabel2: JhcsLabels;
  jhcsLabel3: JhcsLabels;
  jhcsUnSerNum: JhcsUnSerNum;
  groupNames: GroupName[];
}
