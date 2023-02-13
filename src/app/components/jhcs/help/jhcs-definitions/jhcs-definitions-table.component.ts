import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface JhcsDefinition {
  definition: string;
  explanation: string;
}

// Check if we want to move this to db
const DEFINITIONS: string[] = [
  'DOD Component',
  'Tri Service Coordinated',
  'National Stock Number',
  'Department of Defense Identification Code (DODIC)',
  'Nomenclature',
  'Inhabited Building Distance',
  'Hazard Class',
  'Hazard Division',
  'DOD Hazard Subdivision for 1.2 items',
  'Compatibility Group',
  'Shipping Label 1',
  'Shipping Label 2',
  'Shipping Label 3',
  'United Nations (UN) Number',
  'Proper Shipping Name',
  'Technical Name',
  'DOT Reference Number',
  'DOT Letter',
  'High Explosive Weight in Pounds (HEW)',
  'High Explosive Weight in KG (HEW)',
  'Propellant Weight in Pounds (PW)',
  'Propellant Weight in KG (PW)',
  'Pyrotechnic Weight in pounds (PYW)',
  'Pyrotechnic Weight in kilograms (PYW)',
  'Net Explosive Weight in pounds (NEW)',
  'Net Explosive Weight in Kg (NEW)',
  'Net Explosive Weight Quantity Distance in Pounds (NEWQD)',
  'Net Explosive Weight Quantity Distance in Kg (NEWQD)',
  'Explosives Maximum Credible Event Weight in Pounds (MCE)',
  'Explosives Maximum Credible Event Weight in KG (MCE)',
  'Part 1/ Drawing Number 1',
  'Part 2/ Drawing Number 2',
  'Part 3/ Drawing Number 3',
  'Packing Group',
  'Special Remarks',
  'Proper Shipping Description',
  'Sensitivity Group',
  'DDESB FHC Date',
];

const EXPLANATIONS: string[] = [
  'Designates Service proponent for the item\'s hazard classification: A = Army; F = Air Force; N = Navy; I = Undetermined. Note: The service that manages the item may be other than the proponent.',
  'Indicates whether hazard classification of the item was Tri-Service coordinated, as follows: Yes, No, Yes, by Panel in Jul 89, Not new, CFR 173.56(h).',
  'A number composed of 13 digits; a four digit Federal Supply Classification.',
  'A code assigned to the generic description of an item of supply in Federal Stock Group 13 (Ammunition and Explosives) and Federal Stock Group 14 (Guided Missiles). An Air Force Locally Assigned Ammunition Reporting Code (LARC) or a Navy Ammunition Logistic Code (NALC) may be used.',
  'A description consisting of a noun phrase or modifier used to identify the make, model, size, etc., of the item.',
  'The minimum separation distance, in hundreds of feet, for inhabited buildings and exposed personnel from hazardous fragments, or firebrands, produced by ammunition and explosive items, as determined by tests, in accordance with Technical Bulletin 700-2.',
  'Denotes the hazardous material (1 through 9), or predominate hazard material; such as Class 1 (explosives); Class 2 (gases); Class 3 (flammable liquids); Class 4 (flammable solids); Class 5 (oxidizing substances); Class 6 (poisonous); Class 7 (radioactive); Class 8 (corrosive); and Class 9 (miscellaneous hazardous material). For more information click here.',
  'Denotes that some classes are further subdivided into divisions.',
  'See DOD-STD-6055.9. Allowed values are 1, 2, or 3 (Commonly written as 1.2.1, 1.2.2 , or 1.2.3).',
  'In view of transportation and storage principles, the grouping of ammunition and explosives into groups deemed compatible per the regulations. All classes will include the CG in the JHCS, which may be one of the following: A, B, C, D, E, F, G, H, J, K, L, N, S. For more information click here',
  'The first label that must be applied to the shipping container(s) for a hazardous material per 49 CFR 172.101.',
  'The second label that may be applied, as required, to the shipping container(s) for a hazardous material per 49 CFR 172.101.',
  'The third label that may be applied, as required, to the shipping container(s) for a hazardous material per 49 CFR 172.101.',
  'The identification number assigned to each proper shipping name. It consists of a four-digit numeral, preceded by the letters UN (i.e. UN0012) to indicate that they are considered appropriate for international as well as for domestic transportation. The HD and CG must be in agreement with the UN number selected. For Not Regulated items, DOD uses all zeros, i.e., 0000. (NOTE: The letters NA preceding the four digit number indicates that the number is appropriate for transportation between the United States and Canada)',
  'A description specified by DOT in 49 CFR 172.101 to identify hazardous material. The PSN, HD, and CG must be in agreement with the UN number selected.',
  'Recognized chemical name used in association with the proper shipping name when required by 49 CFR 172.101.',
  'Number assigned by the Department of Transportation (DOT), when the Department of Defense (DOD) places an item on file with them as required per 49 CFR 173.56.',
  'This is the approval document, Titled ;CLASSIFICATION OF EXPLOSIVES;, issued by the US Department of Transportation as the Competent Authority for the United States. This document assigns the items\'s DOT Reference Number, which is commonly called the EX Number.',
  'The weight in pounds of explosive substances designed to function by detonation (e.g., main charge, booster or primary explosives).',
  'The weight in kilograms of explosive substances designed to function by detonation (e.g., main charge, booster or primary explosives).',
  'The weight in pounds of explosive substances designed to propel projectiles and missiles or to generate gases for powering auxiliary devices. (e.g., rocket motors or gas generators).',
  'The weight in kilograms of explosive substances designed to propel projectiles and missiles or to generate gases for powering auxiliary devices. (e.g., rocket motors or gas generators).',
  'The weight in pounds of explosive substances designed to produce heat, light, sound, smoke or a combination of these.',
  'The weight in kilograms of explosive substances designed to produce heat, light, sound, smoke or a combination of these.',
  'The total weight in pounds of all Class 1 material in an item. It has to equal the sum of the High Explosive Weight, the Propellant Weight, and Pyrotechnic Weight. Non-Class 1 items will use the sum of the High Explosive Weight, the Propellant Weight, and Pyrotechnic Weight. Non-regulated items will use 0.0. The value is used for transportation purposes.',
  'The total weight in kilograms of all Class 1 material in an item. It has to equal the sum of the High Explosive Weight, the Propellant Weight, and Pyrotechnic Weight. Non-Class 1 items will use the sum of the High Explosive Weight, the Propellant Weight, and Pyrotechnic Weight. Non-regulated items will use 0.0. The value is used for transportation purposes.',
  'The total weight in pounds of all explosive substances (HEW+PW+PYW) in the AE, unless testing has been conducted to support an approved different value due the contribution of the high explosives, propellants, or pyrotechnics.; For all H.D. 1.3 or H.D. 1.4 (other than CG S) AE, NEWQD is equal to NEW.; NEWQD is used for siting purposes.',
  'The total weight in kilograms of all explosive substances (HEW+PW+PYW) in the AE, unless testing has been conducted to support an approved different value due the contribution of the high explosives, propellants, or pyrotechnics.; For all H.D. 1.3 or H.D. 1.4 (other than CG S) AE, NEWQD is equal to NEW.; NEWQD is used for siting purposes.',
  'In hazards evaluation of Explosives, the MCE in pounds from a hypothesized accidental explosion, fire, or toxic chemical agent release (with explosives contribution) is the worst single event that is likely to occur from a given quantity and disposition of AE.; The event must be realistic with a reasonable probability of occurrence considering the explosion propagation, burning rate characteristics, and physical protection given to the items involved.; The MCE evaluated on this basis may then be used as a basis for effects calculations and casualty predictions.; For HD 1.2.1, the MCE is expressed as a weight which is the product of the NEWQD and the number of AE which react virtually instantaneously in the Sympathetic Reaction or Liquid Fuel/External',
  'In hazards evaluation of Explosives, the MCE in kilograms from a hypothesized accidental explosion, fire, or toxic chemical agent release (with explosives contribution) is the worst single event that is likely to occur from a given quantity and disposition of AE.; The event must be realistic with a reasonable probability of occurrence considering the explosion propagation, burning rate characteristics, and physical protection given to the items involved.; The MCE evaluated on this basis may then be used as a basis for effects calculations and casualty predictions.; For HD 1.2.1, the MCE is expressed as a weight which is the product of the NEWQD and the number of AE which react virtually instantaneously in the Sympathetic Reaction or Liquid Fuel/External',
  'The manufacturer\'s part number or the drawing number of the main assembly or top level configuration for the item.',
  'The manufacturer\'s part number or the drawing number of the main packaging drawing for the item. May be the "Combination of Adopted Items" drawing.',
  'The manufacturer\'s part number or the drawing number of a second packaging drawing for the item.',
  'Within certain hazard classes, assignment to a packing group is required by 49 CFR 172.101 according to the degree of danger presented. Packing Group (PG) I is high danger, PG II is medium danger, and PG III is low danger.',
  'Used to clarify, expand, or note additional information.',
  'The Proper Shipping Description consists of the Identification Number (UN), the Proper Shipping Name, the Technical Name (when required), the Hazard Class or Division, the Compatibility Group, and the Packing Group as required by 49 CFR 172.202. For example, ; UN2744, Cyclobutyl chloroformate, 6.1, (8, 3), PG II.; CFR 172.202(b)',
  'Originally defined to organize ordnance into similar hazard categories for storage in High Performance Magazines (HPM). These groups are consistent with compatibility groups, but also use explosive sensitivity, weapon type and construction, and damage mechanisms for obtaining similar groups. A High Performance Magazine is a partially buried, earth-bermed, 2-story, box-shaped magazine. Its main purpose is the reduction in the maximum credible event (MCE) to a detonation, explosion, or fire involving a fraction of the total quantity of explosives stored in the structure. This reduction is achieved by the use of nonpropagation walls and pit covers to segregate the ordnance and to prevent sympathetic reaction to closed storage cells. For more information, click here. The Sensitivity Group (SG) is also used for Substantial Dividing walls (SDW). For more information on the SDW application, click here.',
  'Date of Final Hazard Classification approval by DDESB',
];

@Component({
  selector: 'jhcs-definition-table',
  styleUrls: ['jhcs-definitions-table.component.css'],
  templateUrl: 'jhcs-definitions-table.component.html',
})
export class JhcsDefintionsTable implements AfterViewInit {
  displayedColumns: string[] = ['definition', 'explanation'];
  dataSource: MatTableDataSource<JhcsDefinition>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    // Create 38 definitions
    const definitions = Array.from({length: 38}, (_, k) => createNewUser(k + 1));


    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(definitions);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): JhcsDefinition {
  const definitionS = DEFINITIONS[id-1];
  const explanationS = EXPLANATIONS[id-1];
  return {
    definition: definitionS,
    explanation: explanationS,
  };
}
