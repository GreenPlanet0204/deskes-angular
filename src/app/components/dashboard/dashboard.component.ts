import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../session/role.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private roleService: RoleService) {
  }

  ngOnInit(): void {
  }
}
