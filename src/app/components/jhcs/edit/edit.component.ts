import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JhcsService} from '../../../core';
import {MatDrawer} from '@angular/material/sidenav';
import {ToastService} from 'src/app/utils/ui/toast.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  id: string | null;

  @ViewChild(MatDrawer) drawer!: MatDrawer;

  constructor(
    private route: ActivatedRoute,
    private alertService: ToastService,
    private jhcsService: JhcsService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  counter(i: number) {
    return new Array(i).fill(0);
  }

  submit({payload, formData}: {payload: any, formData: FormData}) {
    this.jhcsService
        .update('jhcs', this.id as string, formData)
        .subscribe({
          next: (item) => {
            this.alertService.success("Record has been successfully saved.");
          },
          error: (err) => {
            console.log("geterr", err)
            this.alertService.error("Failed to update.");
          },
          complete: () => console.log("update completed")
        });
  }
}
