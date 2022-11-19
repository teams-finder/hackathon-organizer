import {Component, OnInit} from '@angular/core';
import {UserService} from "../../core/services/user-service/user.service";
import {TeamService} from "../../core/services/team-service/team.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {Team, TeamResponse} from "../model/TeamRequest";
import {UserResponseDto} from "../../user/model/UserResponseDto";

@Component({
  selector: 'ho-team-profile',
  templateUrl: './team-profile.component.html',
  styleUrls: ['./team-profile.component.scss']
})
export class TeamProfileComponent implements OnInit {

  private routeSubscription: Subscription = new Subscription();

  searchUser: string = "";
  hackathonId: number = 0;
  teamId: number = 0;
  team!: Team;
  teamMembers: UserResponseDto[] = [];

  editMode = false;


  constructor(private userService: UserService, private teamService: TeamService, private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {

    this.routeSubscription = this.route.params.subscribe(params => {
      this.hackathonId = params['id'];
      this.teamId = params['teamId'];
    });

    this.teamService.getTeamById(this.teamId).subscribe(team => {
      this.team = team;

      this.getTeamMembers();
    });
  }


  joinToTeam() {
    this.teamService.addUserToTeam(this.teamId, this.userService.getUserId()).subscribe(res => console.log(res));
  }

  openOrCloseTeamForMembers() {

    const isOpen = !this.team.isOpen;

    this.teamService.openOrCloseTeamForMembers(this.teamId, isOpen).subscribe((isOpen) => {
      this.team.isOpen = isOpen;
    });
  }

  getTeamMembers() {
    return this.userService.getMembersByTeamId(this.teamId).subscribe(members => this.teamMembers = members);
  }

  get isOwner() {
    return true;
  }

  redirectToTeamEdit() {
     this.router.navigate([`/hackathon/${this.hackathonId}/team/${this.teamId}/edit`]);
  }
}
