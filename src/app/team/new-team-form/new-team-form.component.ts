import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../core/services/user-service/user.service";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {TeamService} from "../../core/services/team-service/team.service";
import {Tag, TeamRequest} from "../model/TeamRequest";
import {Subscription} from "rxjs";
import {Utils} from "../../shared/Utils";
import {ToastrService} from "ngx-toastr";
import {HackathonRequest} from "../../hackathon/model/Hackathon";

@Component({
  selector: 'ho-new-team-form',
  templateUrl: './new-team-form.component.html',
  styleUrls: []
})
export class NewTeamFormComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription = new Subscription();

  newTeamForm!: FormGroup;
  hackathon!: HackathonRequest;
  teamId?: number;
  tags: Tag[] = [];
  hackathonId: number = 0;
  editMode = false;
  currentUser = Utils.currentUserFromLocalStorage;

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {

    this.newTeamForm = this.formBuilder.group({
      teamName: ['', {
        validators: [Validators.required, Validators.minLength(5)], updateOn: 'blur'
      }],
      description: ['', {
        validators: [Validators.required, Validators.minLength(15)], updateOn: 'blur'
      }],
    });

    this.teamService.getAvailableTags().subscribe(tagsResponse => {

      this.tags = tagsResponse;
      this.newTeamForm.addControl("tags", this.buildTagsFormGroup(this.tags));
    });

    this.routeSubscription = this.route.params.subscribe(params => {

      this.hackathonId = params['id'];

      if (this.router.url.includes("edit")) {
        this.loadFormData(params['teamId']);
        this.teamId = params['teamId'];
        this.editMode = true;
      }
    });
  }

  buildTagsFormGroup(tags: Tag[]): FormGroup {
    let group = this.formBuilder.group({});

    tags.forEach(tag => {

      group.addControl(String(tag.id), this.formBuilder.control(tag.isSelected));
    });
    return group;
  }

  saveTeam() {

    if (this.hackathonId && this.currentUser) {

      const team: TeamRequest = this.buildTeam();

      if (this.editMode && this.teamId) {

        this.teamService.updateTeam(team, this.teamId).subscribe(updatedTeam => {

          this.router.navigateByUrl('/hackathon/' + this.hackathonId + '/team/' + updatedTeam.id);
          Utils.updateTeamInLocalStorage(updatedTeam);
          this.toastr.success("Team " + team.name + " updated successfully");
        });
      } else {

        this.teamService.createTeam(team).subscribe(createdTeam => {

          this.router.navigateByUrl('/hackathon/' + this.hackathonId + '/team/' + createdTeam.id);
          Utils.updateTeamInLocalStorage(createdTeam);

          this.userService.updateUserMembership({currentHackathonId: this.hackathonId, currentTeamId: createdTeam.id}).subscribe(() => {
            this.toastr.success("Team " + team.name + " created successfully");

          });
        });
      }
    }
  }

  loadFormData(teamId: number) {
    this.teamService.getTeamById(teamId).subscribe(team => {

      this.newTeamForm.get('teamName')?.patchValue(team.name);
      this.newTeamForm.get('description')?.patchValue(team.name);

      team.tags.forEach(teamTag => {

        const tagToMark = this.tags.find(tag => tag.id === teamTag.id);

        if (tagToMark) {
          tagToMark.isSelected = true;
        }
      });

      this.newTeamForm.get('tags')?.patchValue(this.buildTagsFormGroup(this.tags));
    })
}

  markTag(index: number) {
    this.tags[index].isSelected = !this.tags[index].isSelected;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private buildTeam() {

    return {
      ownerId: this.currentUser.id,
      hackathonId: this.hackathonId,
      name: this.newTeamForm.get('teamName')?.value,
      description: this.newTeamForm.get('description')?.value,
      tags: this.getSelectedTags(),
    };
  }

  private getSelectedTags(): Tag[] {
    return this.tags.filter(tag => tag.isSelected);
  }
}
