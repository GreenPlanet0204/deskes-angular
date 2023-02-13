import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {JhcsService, ToastService} from 'src/app/core';
import { MeetingDialogComponent } from './meeting-dialog/meeting-dialog.component';

@Component({
  selector: 'jhcs-activity-haz',
  templateUrl: './activity-haz.component.html',
  styleUrls: ['./activity-haz.component.css'],
})
export class ActivityHazComponent implements OnInit {
  loading = false;
  totalDataCount = 0
  dataSource: any[] = [];
  itemColumns = [
    { name: 'Minutes', key: 'minutes', width: '35%', maxLength: 40, tooltip: true },
    { name: 'Filename', key: 'filename', width: '35%', maxLength: 40, tooltip: true, link: true },
    { name: 'Location ', key: 'location', width: '20%', tooltip: true },
    { name: 'Action', key: 'action_edit', width: '10%' },
  ];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private alertService: ToastService,
    private jhcsService: JhcsService
  ) {
    this.fetch();
  }

  ngOnInit() {}

  fetch() {
    this.updatePage({pageIndex: 1, pageSize: 10});

    /*this.loading = true;
    setTimeout(() => {
      const items = [{
        id: 1024,
        minutes: 'MINUTES OF THE JOINT HAARD',
        filename: 'JHCS Minutes 9.pdf',
        location: 'DDESB'
      },{
        id: 1025,
        minutes: 'MINUTES OF THE JOINT HAARD 2323123',
        filename: 'JHCS Minutes 11.pdf',
        location: 'DDESC'
      }]
      this.dataSource = items;
      this.loading = false;
    }, 2000)*/
  }

  updatePage(page: any) {
    if (!this.loading) {
      this.loading = true;

      const {pageIndex, pageSize} = page;

      this.jhcsService.getCustom(`report/hazClassMeetings?page=${pageIndex}&size=${pageSize}`)
        .subscribe({
          next: (items) => {
            this.dataSource = items.content;
            console.log("~~~~~~~~~~~~~~~~~", this.dataSource)
            this.totalDataCount = items.totalElements
          },
          error: () => {
            this.loading = false;
            this.alertService.error('Failed to get haz class meetings.')
          },
          complete: () => {
            this.loading = false;
          }
        });
    }
  }

  createNewMetting() {
    const dialogRef = this.dialog.open(MeetingDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      result && this.fetch();
    });
  }

  editMeeting(e: any) {
    console.log("edit-meeting", e)
    if (e.action === 'link') {
      this.downloadFile(e.item.fileId);
    }
    else {
      const dialogRef = this.dialog.open(MeetingDialogComponent, {
        data: {
          meeting: e.item
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        result && this.fetch();
      });
    }
  }

  private downloadFile(fileId: number) {
    console.log("downloadFile", fileId);
    this.jhcsService.get('meeting/files', 110) //TODO
      .subscribe({
        next: (item) => {
          console.log("downloadFile-success", item)

          const extension = this.getFileExtension(item.filename);
          console.log("extension", extension)

          const byteCharacters = atob(item.blobFile);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const newBlob = new Blob([byteArray], { type: this.createFileType(extension) })

          // Create a link pointing to the ObjectURL containing the blob.
          const data = window.URL.createObjectURL(newBlob);
          const link = document.createElement('a');
          link.href = data;
          link.download = item.filename || 'download.pdf';
          link.click();
          setTimeout(() => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
          }, 400)
        },
        error: () => {
          this.alertService.error('Failed to download file.')
        },
        complete: () => {
        }
      })
  }

  private getFileExtension(filename: string) {
    if (filename) {
      const tokens = filename.split('.');
      if (tokens.length >=2) {
        return tokens[1].toLowerCase();
      }
    }
    return '';
  }

  private createFileType(e: any): string {
    let fileType: string = "";
    if (e == 'pdf' || e == 'csv') {
      fileType = `application/${e}`;
    }
    else if (e == 'jpeg' || e == 'jpg' || e == 'png') {
      fileType = `image/${e}`;
    }
    else if (e == 'txt') {
      fileType = 'text/plain';
    }

    else if (e == 'ppt' || e == 'pot' || e == 'pps' || e == 'ppa') {
      fileType = 'application/vnd.ms-powerpoint';
    }
    else if (e == 'pptx') {
      fileType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    }
    else if (e == 'doc' || e == 'dot') {
      fileType = 'application/msword';
    }
    else if (e == 'docx') {
      fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    else if (e == 'xls' || e == 'xlt' || e == 'xla') {
      fileType = 'application/vnd.ms-excel';
    }
    else if (e == 'xlsx') {
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    return fileType;
  }
}
