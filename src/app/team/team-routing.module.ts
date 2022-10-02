import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {TeamProfileComponent} from "./team-profile/team-profile.component";
import {UserSerachComponent} from "../shared/user-serach/user-serach.component";


const routes: Routes = [
  {path: '', component: TeamProfileComponent},
  {path: 'invite', component: UserSerachComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {
  static components = [
     TeamProfileComponent
  ];
}