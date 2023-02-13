import {Component, OnInit} from '@angular/core';
import {animateText, onSideNavChange} from '../../animations/animation'
import {SidenavService} from '../../core/services/sidenav.service'
import {Router} from "@angular/router";
import {RoleService} from "../../session/role.service";


interface Page {
  link: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit {

  public sideNavState: boolean = false;
  public linkText: boolean = false;

  public pages: Page[] = [
    {name: 'Joint Hazard Classification System', link:'/jhcs', icon: 'gps_fixed'},
    {name: 'Explosives Safety Mishap Analysis', link:'/esmam', icon: 'bolt'},
    {name: 'Hazard Classification', link:'/hc', icon: 'warning_amber'},
    {name: 'DDESB Tasker', link:'/tasker', icon: 'list_alt'},
    {name: 'Safety Submission Management', link:'/ssmm', icon: 'local_fire_department'},
  ]

  constructor(private _sidenavService: SidenavService,
              private router: Router,
              private roleService: RoleService) { }

  ngOnInit() {
  }

  onSinenavToggle(): void {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState)
  }

  redirectTo(url: string): void {
    this.router.navigate([url]);
  }

  disableLink(page: Page): boolean {
    if (page.link.startsWith('/jhcs')) {
      return !this.roleService.getHighestJhcsRole();
    }

    if (page.link.startsWith('/esmam')) {
      return !this.roleService.getHighestEsmamRole();
    }

    if (page.link.startsWith('/hc')
        || page.link.startsWith('/hc')
        || page.link.startsWith('/tasker')
        || page.link.startsWith('/ssmm')) {
      return !this.roleService.getHighestDeskesRole();
    }

    return false;
  }
}
