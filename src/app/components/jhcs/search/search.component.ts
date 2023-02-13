import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SearchService} from '../../../core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']

})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  errors: Object = {};
  isSubmitting = false;
  searchedItem: any | null = null;
  additionalFields = false;
  filteredOptions: Observable<any> | undefined;
  searchFields = [
    {
      value: "nsn",
      text: "NSN"
    },
    {
      value: "dodic",
      text: "DODIC"
    },
    {
      value: "techName",
      text: "Technical Name"
    },
    {
      value: "dotLetter.fileName",
      text: "DOT Reference (EX) No."
    },
    {
      value: "dotLetter.expirationDate",
      text: "DOT Exp. Date"
    },
    {
      value: "actionType",
      text: "Action"
    },
    {
      value: "typeClass",
      text: "Method of Classification"
    },
    {
      value: "dateLastChanged",
      text: "Date Last Modified"
    },
    {
      value: "jhcsUnSerNum.hazardClass",
      text: "DOD Hazard Class"
    },
    {
      value: "jhcsUnSerNum.hazardDivision",
      text: "Division"
    },
    /*{
      value: "dodHds",//
      text: "Sub-division"
    },*/
    {
      value: "jhcsUnSerNum.shipName",
      text: "Proper Shipping Name"
    },
    {
      value: "jhcsUnSerNum.compatibilityGroup",
      text: "Competability Group"
    },
    {
      value: "jhcsUnSerNum.unoSerialNo",
      text: "UN Number"
    },
    {
      value: "dodComp",
      text: "DOD Component"
    },
    {
      value: "triSvrCoord",
      text: "Tri-Service Coordination"
    },
    /*{
      value: "sensitivityGroup",//
      text: "Sensitivity Group"
    },*/
    {
      value: "inhabitedBldgDistance",
      text: "Inhabited Building Distance"
    },
    {
      value: "originator",
      text: "Originator"
    },
    {
      value: "groupName",//
      text: "Group Name"
    },
    {
      value: "hazardSymbolCode",
      text: "AF Hazard Symbols"
    },
    {
      value: "fileNumber",
      text: "File Number"
    },
    /*{
      value: "shippingLabels",//
      text: "Shipping Labels"
    },*/
    {
      value: "additionalNotes",
      text: "Additional Notes"
    },
    {
      value: "packData",
      text: "Packaging Data"
    },
    {
      value: "packingRequired",
      text: "Packaging Required"
    },
    {
      value: "adminRemarks",
      text: "Remarks"
    },
    {
      value: "jhcsWeights.weightLb",
      text: "Weight(Lb)",
    },
    {
      value: "jhcsWeights.weightKg",
      text: "Weight(Kg)",
    },
  ]

  constructor(
    private router: Router,
    private searchService: SearchService,
    private fb: FormBuilder,
  ) {
    // create form group using the form builder
    this.searchForm = this.fb.group({
      id: null,
      fields: new FormArray([]),
    });
  }

  ngOnInit() {
    this.reset();
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.searchFields.filter(option => option.text.toLowerCase().includes(filterValue));
  }

  onFocusSelectFieldInput(index: number) {
    const fields = this.searchForm.get("fields") as FormArray;
    this.filteredOptions = fields.at(index).get('name')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    )
  }

  get fields(): FormArray {
    return this.searchForm.get('fields') as FormArray;
  }

  addField(e: Event | null) {
    e?.preventDefault();
    console.log("add_search_field");
    this.fields.push(this.fb.group({
      name: '',
      op: 1,
      value: '',
    }));
  }

  deleteSearchFiled(e: Event, index: number) {
    e?.preventDefault();
    this.fields.removeAt(index);
    if (this.fields.length <= 0) {
      this.reset();
    }
  }

  submitForm() {
    console.log("submitForm", this.searchForm.value);
    if (this.isSubmitting) {
      return;
    }

    /*if (this.searchForm.invalid) {
      return;
    }*/


    const fields = this.searchForm.value.fields
      .map((it: any) => {
        const field = this.searchFields.find(f => f.text === it.name)
        return { ...it, name: field?.value }
      })
      .filter((it: any) => it.name && it.value);

    if (fields.length <= 0) {
      return;
    }

    const payload = {
      ...this.searchForm.value,
      fields
    }
    console.log("payload", payload);

    this.isSubmitting = true;

    this.searchService
      .advancedSearch(payload)
      .subscribe({
        next: (item) => {
          console.log("search~ok", item)
          this.searchedItem = item;
          this.isSubmitting = false;
        },
        error: (err) => {
          console.log("searcherr", err)
          this.errors = err;
          this.isSubmitting = false;
        },
        complete: () => console.log("advaned search completed")
      });
  }

  getRecordMatchItem() {
    return [this.searchedItem.recordMatch];
  }

  navigate(item: any) {
    console.log('navigate', item);
    const url = this.router.serializeUrl(this.router.createUrlTree([`/jhcs/view/${item.id}`]));
    window.open(url, '_blank');
  }

  reset() {
    this.fields.clear();
    this.addField(null);
  }

  onclickItemDetail(e: Event, item: any) {
    e.preventDefault();
    this.navigate(item);
  }

  updateAdditionalFields() {
    this.additionalFields = !this.additionalFields;
  }

  isEmptySearchResult() {
    return (
      !this.searchedItem?.recordMatch?.id &&
      !this.searchedItem?.bestMatches?.length &&
      !this.searchedItem?.otherMatches?.length
    )
  }
}
