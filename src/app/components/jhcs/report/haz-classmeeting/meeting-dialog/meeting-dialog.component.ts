import {Component, Inject, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {serialize} from 'object-to-formdata';
import {JhcsService, ToastService} from 'src/app/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface MeetingDialogData {
  meeting: any
}

@Component({
  selector: 'jhcs-activity-haz',
  templateUrl: './meeting-dialog.component.html',
  styleUrls: ['./meeting-dialog.component.css'],
})
export class MeetingDialogComponent implements OnInit {
  editMode: boolean = false;
  loading = false;
  meeting: any = {};
  form: FormGroup = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    title: new FormControl(),
    location: new FormControl(),
    filename: new FormControl(),
    file: new FormControl(),
  });
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MeetingDialogData,
    private dialogRef: MatDialogRef<MeetingDialogComponent>,
    private router: Router,
    private alertService: ToastService,
    private jhcsService: JhcsService,
  ) {
    console.log("meeting", this.data)

    if (this.data?.meeting) {
      this.editMode = true;
      this.fetch(this.data?.meeting?.id);
    }
  }

  ngOnInit() {}

  private fetch(id: number) {
    this.loading = true;
    this.jhcsService.get("meetings", id)
      .subscribe({
        next: (meeting) => {
          this.loading = false;
          this.patchMeeting(meeting);
        },
        error: () => {
          this.loading = false;
          this.alertService.error('Failed to get meeting data.')
        },
      })
  }

  private patchMeeting(meeting: any) {
    console.log("patchMeeting", meeting)
    this.meeting = meeting;
    this.form.patchValue({
      ...meeting,
      filename: this.meeting.jhcsMeetingFiles?.filename,
    })
  }

  uploadFile(e: any) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      this.form.patchValue({ 
        file,
        filename: file.name,
     });
    }
  }

  submit() {
    if (!this.loading) {
      this.editMode ? this.updateMeeting() :this.createMeeting();
    }
  }

  private createMeeting() {
    this.loading = true;

    const data = { ...this.form.value }
    if (data.file) {
      data['jhcsMeetingFiles'] = {
        filename: data.filename,
        file: data.file,
      }
      delete data.filename
      delete data.file
    }
    
    const payload = this.objectToFormData(data);
    console.log("create", payload)

    this.jhcsService.create("meetings", payload)
      .subscribe({
        next: (meeting) => {
          this.loading = false;
          this.meeting = meeting;
          this.alertService.success("Record has been successfully saved.");
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
          this.alertService.error('Failed to create meeting data.')
        },
      })
  }

  private updateMeeting() {
    this.loading = true;

    const data = {
      ...this.meeting,
      ...this.form.value,
    };
    if (data.filename && data.file) {
      const files = data.jhcsMeetingFiles || {};
      data['jhcsMeetingFiles'] = {
        ...files,
        filename: data.filename,
        file: data.file,
      }
      delete data.filename
      delete data.file
    }

    const payload = this.objectToFormData(data);
    console.log("update-meeting", data)

    this.jhcsService.update("meetings", this.meeting.id, payload)
      .subscribe({
        next: (meeting) => {
          this.loading = false;
          this.meeting = meeting;
          this.alertService.success("Record has been successfully saved.");
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
          this.alertService.error('Failed to update meeting data.')
        },
      })
  }

  private objectToFormData(payload: any) {
    const options = {
      indices: true,
      nullsAsUndefineds: true,
      booleansAsIntegers: true,
      allowEmptyArrays: false,
      noFilesWithArrayNotation: false,
      dotsForObjectNotation: true,
    };

    return serialize(payload, options);
  }
}
