import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import moment from 'moment';

export interface RevisionDialogData {
  revisions: any
}

@Component({
  selector: 'jhcs-revision-dialog',
  templateUrl: './revision-dialog.component.html',
  styleUrls: ['./revision-dialog.component.css'],
})
export class RevisionDialogComponent implements OnInit {
  dataSource: any[] = [];
  displayedColumns = ['editor', 'lastChanged', 'fieldChanged', 'oldValue', 'newValue'];

  revisions: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RevisionDialogData,
    private dialogRef: MatDialogRef<RevisionDialogComponent>,
  ) {
    this.revisions = this.data.revisions;
    this.initialize();
  }

  ngOnInit() {}

  private initialize() {
    const sorted = this.revisions.sort((a: any, b: any) => {
      return a.lastModifiedDate - b.lastModifiedDate;
    })

    let result: any[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const currItem = sorted[i];
      const nextItem = sorted[i + 1];

      const changes = this.compareObject(currItem, nextItem);
      if (changes.length > 0) {
        result = result.concat(changes);
      }
    }

    this.dataSource = result;
  }

  private compareObject(currItem: any, nextItem: any): any[] {
    let result: any[] = [];

    Object.keys(currItem).forEach((fieldName: string) => {
      if (fieldName === 'createdDate' || fieldName === 'createdBy' || 
        fieldName === 'lastModifiedDate' || fieldName === 'lastModifiedBy' ||
        fieldName === 'editor') {
        return;
      }

      const currValue = currItem[fieldName];
      const nextValue = nextItem[fieldName];
      
      if (currValue && !nextValue) {
        result.push({
          editor: nextItem.editor,
          lastChanged: this.formatDate(nextItem.lastModifiedDate),
          fieldChanged: fieldName,
          oldValue: this.getItemValue(currValue),
          newValue: 'Removed',
        })
      }
      else if (!currValue && nextValue) {
        result.push({
          editor: nextItem.editor,
          lastChanged: this.formatDate(nextItem.lastModifiedDate),
          fieldChanged: fieldName,
          oldValue: '',
          newValue: this.getItemValue(nextValue),
        })
      }
      else if (currValue && nextValue) {
        if (typeof currValue === 'object') {
          const changes = this.compareObject(currValue, nextValue);
          if (changes.length > 0) {
            result = result.concat(changes);
          }
        }
        else if (currValue != nextValue) {
          result.push({
            editor: nextItem.editor,
            lastChanged: this.formatDate(nextItem.lastModifiedDate),
            fieldChanged: fieldName,
            oldValue: this.getItemValue(currValue),
            newValue: this.getItemValue(nextValue),
          })
        }
      }
    })

    return result;
  }

  private getItemValue(item: any) {
    if (typeof item === 'undefined') {
      return 'undefined';
    }
    if (typeof item !== 'object') {
      return item;
    }
    return 'object';
  }
  
  formatDate(value: number) {
    return moment(value).format('DD/MM/YYYY')
  }
}
