import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDrawer} from '@angular/material/sidenav';
import {serialize} from 'object-to-formdata';
import {JhcsService, MatDrawerService} from 'src/app/core';
import {AppInjector} from 'src/app/utils/app.injector';
import {ToastService} from 'src/app/utils/ui/toast.service';
import {Jhcs, JhcsDrawing} from '../jhcs';
import {JhcsDataService, WeightTypes, WeightUnits} from '../jhcs.data.service';
import {map, startWith} from "rxjs/operators";
import {UserService} from "../../../session/user.service";

@Component({
  selector: 'app-jhcs-form',
  templateUrl: './jhcs-form.component.html',
  styleUrls: ['./jhcs-form.component.css'],
})
export class JhcsFormComponent implements OnInit {
  form: FormGroup;
  jhcs: Jhcs = {} as Jhcs;
  jhcsLabelCodes: Array<any> = [];
  allNsn: Array<any> = [];
  filteredNsn: Array<any> = [];
  nsnAutoCompleteControlHeight: string | undefined;

  allGroupNames: Array<any> = [];
  filteredGroupName: Array<any> = [];
  groupNameAutoCompleteControlHeight: string | undefined;

  private readonly userService: UserService;

  @Input() edit: boolean = false;
  @Input() jhcsId: string | null = null;
  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatDrawer) drawer!: MatDrawer;

  weightUnits = WeightUnits;
  weightTypes = WeightTypes;

  // expansion panel control
  step = 0;
  hasError = false;

  constructor(
    private fb: FormBuilder,
    private jhcsService: JhcsService,
    private drawerService: MatDrawerService,
    private alertService: ToastService,
    private store: JhcsDataService
  ) {
    const appInjector = AppInjector.getInjector();
    this.userService = appInjector.get<UserService>(UserService);

    this.form = this.createForm();
    this.store.setForm(this.form);
    this.store.setItem({} as Jhcs);
  }

  ngOnInit(): void {
    const itemId = this.jhcsId ? this.jhcsId : 0;
    this.jhcsService
      .getCustom(`jhcs/editOrCreate?id=${itemId}`)
      .subscribe({
        next: (result) => {
          console.log("Jhcs", result);
          this.jhcsLabelCodes = result.allLabelCodes;
          this.allNsn = result.allNsn;
          this.allGroupNames = result.allGroupNames;

          if (result.jhcs) {
            this.jhcs = result.jhcs;
            this.store.setItem(this.jhcs);
          }
          this.patchForm();
        },
        error: (err) => console.error(err),
      });
  }

  ngAfterViewInit(): void {
    this.edit && this.drawerService.setDrawer(this.drawer);

    this.form
      .get('nsn')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => {
          if (value) {
            // @ts-ignore
            this.filteredNsn = this.allNsn.filter(
              (nsn) => nsn && nsn.toLowerCase().startsWith(value.toLowerCase())
            );
            this.nsnAutoCompleteControlHeight =
              Math.min(this.filteredNsn.length, 5) * 50 + 'px';
          }
        })
      )
      .subscribe();

    this.form
      .get('groupNameId')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => {
          if (value) {
            const search = `${value}`.toLowerCase();
            // @ts-ignore
            this.filteredGroupName = this.allGroupNames.filter((groupName) => {
              return (
                groupName.jhcsGroupName.toLowerCase().startsWith(search) ||
                groupName.id == value)
            });
            this.groupNameAutoCompleteControlHeight =
              Math.min(this.filteredGroupName.length, 5) * 50 + 'px';
          }
        })
      )
      .subscribe();
  }

  counter(i: number) {
    return new Array(i).fill(0).map((it: any, index: number) => index);
  }

  private createForm() {
    const weightControls = this.weightTypes.reduce((controls: any, it: any) => {
      controls[this.weightControlName(it.type, 'lbs')] = null
      controls[this.weightControlName(it.type, 'kgs')] = null
      return controls
    }, {})

    const drawingControls = this.counter(10).reduce((controls: any, no: number) => {
      controls[this.drawingControlName(no + 1)] = new FormGroup({
        no: new FormControl(no + 1),
        filePath: new FormControl(null),
        blobFile: new FormControl(null),
        file: new FormControl(null),
      })
      return controls
    }, {})

    return this.fb.group({
      ...weightControls,
      ...drawingControls,
      id: null,
      nomenclature: [null, Validators.required],
      adminRemarks: null,
      actionType: null,
      additionalNotes: null,
      adminComments: null,
      afApproved: null,
      afFileNumber: null,
      afdate: null,
      armyDate: null,
      dateLastChanged: null,
      dodComp: null,
      dodic: null,
      dotTrackingNumber: null,
      editor: null,
      fhc: null,
      fileNumber: null,
      inhabitedBldgDistance: null,
      navyFileNumber: null,
      navydate: null,
      nsn: null,
      originator: null,
      packData: null,
      packingRequired: new FormControl(0),
      techActionOfficer: null,
      techName: null,
      triSvrCoord: null,
      typeClass: null,

      dotLetter: new FormGroup({
        id: new FormControl(null),
        dotTracking: new FormControl(null),
        fileName: new FormControl(null),
        fileDate: new FormControl(null),
        expirationDate: new FormControl(null),
        dateAdded: new FormControl(null),
        editor: new FormControl(null),
        blobFile: new FormControl(null),
        file: new FormControl(null),
        filePath: new FormControl(null),
        dotRev: new FormControl(null),
        dotIssueDate: new FormControl(null),
        dotExReg: new FormControl(null),
      }),
      jhcsUnSerNum: new FormGroup({
        id: new FormControl(null),
        unoSerialNo: new FormControl(null),
        shipName: new FormControl(null),
        hazardClass: new FormControl(null),
        hazardDivision: new FormControl(null),
        compatibilityGroup: new FormControl(null),
        subsidiary: new FormControl(null),
        pkgRequire: new FormControl(null),
        packGroup: new FormControl(null),
      }),

      shipLabel1: null,
      shipLabel2: null,
      shipLabel3: null,

      weightUnit: new FormControl('lbs'),

      afHazardSymbol: null, //TODO
      groupNameId: null,
      shippingDescription: null, //TODO
      scansFileName: null,
    });
  }

  private patchForm() {
    if (this.edit && this.jhcs) {
      const obj = this.store.getPatchObject();
      this.form.patchValue(obj);
    }
  }

  weightControlName(weightType: string, weightUnit: string | undefined = undefined) {
    const unit: string = weightUnit || this.form.value.weightUnit
    return this.store.weightControlName(weightType, unit);
  }

  drawingControlName(no: number) {
    return this.store.drawingControlName(no);
  }

  drawingFileName(no: number) {
    const name = this.drawingControlName(no);
    return this.form.value[name]?.filePath;
  }

  uploadDotFile(e: any) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const dotLetter = {
        ...this.form.value.dotLetter,
        blobFile: null,
        file: file,
        fileName: file.name,
      };
      this.form.patchValue({ dotLetter });
    }
  }

  uploadDrawingFile(e: any, no: number) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const property = this.drawingControlName(no)
      this.form.patchValue({
        [property]: {
          blobFile: null,
          file: file,
          filePath: file.name,
        }
      });
    }
  }

  getGroupName(groupNameId: number) {
    const groupName = this.allGroupNames.find(it => it.id == groupNameId);
    return groupName?.jhcsGroupName;
  }

  submitForm() {
    console.log('submitForm', this.form.value);

    if (this.form.invalid) {
      this.alertService.error('Validation error!');
      return;
    }

    const payload = this.createJhcs();
    console.log('payload', payload);

    const formData = this.objectToFormData(payload);
    this.submitEvent?.emit({
      payload,
      formData,
    });
  }

  private createJhcs() {
    const formValues: any = this.form.value;
    console.log("formValues", formValues)

    // Update form values
    this.store.updateItem(formValues);

    // Apply weights values
    this.weightTypes.forEach(({ type: weightType }: { type: string }) => {
      const weightLb = formValues[this.weightControlName(weightType, 'lbs')];
      const weightKg = formValues[this.weightControlName(weightType, 'kgs')];
      this.store.updateWeight({
        weightType,
        weightLb,
        weightKg,
      });
    });

    // Apply drawing values
    this.counter(10).forEach((no: number) => {
      const drawing = formValues[this.drawingControlName(no + 1)];
      drawing && this.store.updateDrawing(drawing as JhcsDrawing);
    });

    // Update labels
    this.counter(3).forEach((index: number) => {
      const labelId = formValues[`shipLabel${index + 1}`];
      const labelCode = this.jhcsLabelCodes.find((it) => it.id == labelId);
      if (labelCode) {
        this.store.updateLabel(index + 1, labelCode);
      }
    });

    if (formValues.groupNameId) {
      const groupName = this.allGroupNames.find(it => it.id == formValues.groupNameId);
      this.store.updateGroupName({
        ...groupName,
        createdDate: null,
        lastModifiedDate: null,
      });
    }

    const payload: any = this.store.getItem();
    payload.editor = this.userService.getUsername();

    delete payload['createdDate'];
    delete payload['lastModifiedDate'];

    // Remove invalid fields
    Object.keys(payload).forEach((key: string) => {
      if (!this.validKey(key)) {
        delete payload[key]
      }
    })
    return payload;
  }

  private validKey(key: string) {
    return !(
      key === 'weightUnit' ||
      key.startsWith('weights_') ||
      key.startsWith('drawings_') ||
      key.startsWith('shipLabel')
    );
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

  applyChange(item: any) {
    if (item.apply) {
      item.apply(this.form);
      this.jhcs = this.createJhcs();
    }
  }

  /* #region expansion panel control */
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  /* #endregion */
}
