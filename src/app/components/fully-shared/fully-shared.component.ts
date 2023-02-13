import {AfterViewInit, Component, HostListener, Input, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {Router} from "@angular/router";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialog} from "@angular/material/dialog";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenuTrigger} from "@angular/material/menu";
import {onMainContentChange} from "../../animations/animation";
import {UserService} from "../../session/user.service";
import {SidenavService} from "../../core/services/sidenav.service";
import {AppInjector} from "../../utils/app.injector";
import {environment} from "../../../environments/environment";
import {DialogService} from "../../utils/ui/dialog.service";
import {RoleService} from "../../session/role.service";

const APP_ICON =
  `
    <svg viewBox="0 0 24 24">
      <path d="M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z" />
    </svg>
`;

const JHCS_ICON =
  `
    <svg width="24" color="red" height="24" viewBox="0 0 24 24">
      <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
    </svg>
  `;

const ESMAM_ICON =
  `
    <svg color="red" width="24" height="24" viewBox="0 0 24 24">
       <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
    </svg>
`;

const SSMM_ICON =
  `
    <svg color="red" width="24" height="24" viewBox="0 0 24 24">
      <path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z"/>
    </svg>
  `;

@Component({
  selector: 'home-root',
  templateUrl: './fully-shared.component.html',
  styleUrls: ['./fully-shared.component.css'],
  animations: [ onMainContentChange ]
})
export class FullySharedComponent implements AfterViewInit {
  activeBanner: any;
  public onSideNavChange: boolean = false;
  isOpen = false;

  @ViewChild('adminDialogTrigger')
  menuTrigger!: MatMenuTrigger;
  @ViewChild('topToolbar') topToolbar: MatToolbar  | undefined;
  @ViewChild('bottomToolbar') bottomToolbar: MatToolbar | undefined;
  mainContainerHeight: number | undefined;

  @Input()
  sidenav: MatSidenavModule = new MatSidenavModule;
  showMenu: boolean = false;

  private userService: UserService;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
              private router: Router,
              private _sidenavService: SidenavService,
              private roleService: RoleService,
              public dialog: MatDialog, location: Location,public adminDialog: MatDialog) {

    const appInjector = AppInjector.getInjector();
    this.userService = appInjector.get<UserService>(UserService);

    iconRegistry.addSvgIconLiteral('app-icon', sanitizer.bypassSecurityTrustHtml(APP_ICON));
    iconRegistry.addSvgIconLiteral('jhcs-icon', sanitizer.bypassSecurityTrustHtml(JHCS_ICON));
    iconRegistry.addSvgIconLiteral('esmam-icon', sanitizer.bypassSecurityTrustHtml(ESMAM_ICON));
    iconRegistry.addSvgIconLiteral('ssmm-icon', sanitizer.bypassSecurityTrustHtml(SSMM_ICON));
    this.activeBanner = environment.securityBanners.find(item => item.default === true);

    this._sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    })

    this.router.events.subscribe((val: any) => {
      this.showMenu = !location.path().startsWith('/jhcs/print')
    })
  }

  ngAfterViewInit(): void {
    this.updateMainContainerHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateMainContainerHeight();
  }

  getBannerText(): string {
    return this.activeBanner?.bannerName;
  }

  getBannerColor(): string {
    return this.activeBanner?.textColor;
  }

  getBannerBackgroundColor(): string {
    return this.activeBanner?.backgroundColor;
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }

  viewItem(item: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/jhcs/view/${item.id}`]));
    window.open(url, '_blank');
  }

  advancedSearch() {
    this.router.navigate([`/jhcs/search`]);
    // this.dialog.open(SearchComponent);
  }

  updateMainContainerHeight() {
    setTimeout(() => {
      let windowHeight = window.innerHeight;
      let topBannerHeight = this.topToolbar?._elementRef.nativeElement.offsetHeight;
      let bottomBannerHeight = this.bottomToolbar?._elementRef.nativeElement.offsetHeight;
      this.mainContainerHeight = windowHeight - topBannerHeight - bottomBannerHeight - 20 /* padding */;
    });
  }

  getMainContainerHeightStyle() {
    return {'height': this.mainContainerHeight + 'px'};
  }

  async logOut(): Promise<void> {
    await this.userService.logOut();
  }

  manageUserAccount(): void {
    this.userService.manageUserAccount();
  }

  getUserFullName(): string {
    return this.userService.getUserFullName();
  }

  goToActivityReports() {
    window.open('jhcs/report/activity', '_blank');
  }

  goToDuplicateNSNReport() {
    window.open('jhcs/report/duplicate', '_blank');
  }

  goToMissingDotLetters() {
    window.open('jhcs/report/missdotletter', '_blank');
  }

  goToMissingTechNames() {
    window.open('jhcs/report/misstechname', '_blank');
  }

  goToHazClassMettings() {
    window.open('jhcs/report/hazclass', '_blank');
  }

  goToRecordApprovalStatus() {
    window.open('jhcs/report/approval', '_blank');
  }

  goToJhcsStats() {
    window.open('jhcs/report/production', '_blank');
  }

  goToUnNumberTable() {
    window.open('jhcs/maintenance/unnumber', '_blank');
  }

  goToHazardSymbol() {
    window.open('jhcs/maintenance/hazardsymbol', '_blank');
  }

  goToManageDuplicates() {
    window.open('jhcs/maintenance/manageduplicatecodes', '_blank');
  }

  goToNsnAssociation() {
    window.open('jhcs/maintenance/nsnassociation', '_blank');
  }

  goToHelpDefinitions() {
    window.open('jhcs/help/definitions', '_blank');
  }

  openAdminDialog() {
    const dialogService = AppInjector.getInjector().get<DialogService>(DialogService);
    dialogService.showMessageDialog(environment.jhcsAdminInfoMessage.title, environment.jhcsAdminInfoMessage.message);
  }

  userHasAdminRole() {
    return this.roleService.isJhcsAdmin();
  }

  userHasHcEditRoleOrHigher() {
    let highestJhcsRole = this.roleService.getHighestJhcsRole();
    if (!highestJhcsRole) {
      return false;
    }

    return highestJhcsRole.value >= RoleService.ROLE_JHCS_HC_EDIT.value;
  }

  userHasHcRoleOrHigher() {
    let highestJhcsRole = this.roleService.getHighestJhcsRole();
    if (!highestJhcsRole) {
      return false;
    }

    return highestJhcsRole.value >= RoleService.ROLE_JHCS_HC.value;
  }
}


