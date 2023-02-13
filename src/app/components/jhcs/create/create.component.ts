import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from 'src/app/utils/ui/toast.service';
import {JhcsService} from '../../../core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  jhcs: any = null;

  constructor(
    private router: Router,
    private alertService: ToastService,
    private jhcsService: JhcsService,
  ) {
  }

  ngOnInit() {
  }

  counter(i: number) {
    return new Array(i).fill(0);
  }

  submit({payload, formData}: {payload: any, formData: FormData}) {
    this.jhcsService
        .create('jhcs', formData)
        .subscribe({
          next: (item) => this.onCreateSuccess(item),
          error: () => this.alertService.error("Failed to create."),
          complete: () => console.log("create completed")
        });
  }

  onCreateSuccess(item: any) {
    console.log("create", item)
    this.alertService.success(`Record ${item.id} has been successfully created.`);
    setTimeout(() => {
      this.router.navigate([`/jhcs/view/${item.id}`]);
    }, 500)
  }
}
