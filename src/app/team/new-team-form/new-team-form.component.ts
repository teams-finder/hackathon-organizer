import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../core/services/user-service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TeamService} from "../../core/services/team-service/team.service";
import {Tag, TeamRequest} from "../model/TeamRequest";
import {HackathonRequest} from "../../hackathon/model/HackathonRequest";
import {Subscription} from "rxjs";

@Component({
  selector: 'ho-new-team-form',
  templateUrl: './new-team-form.component.html',
  styleUrls: ['./new-team-form.component.scss']
})
export class NewTeamFormComponent implements OnInit {

  private routeSubscription: Subscription = new Subscription();

  newTeamForm!: FormGroup;
  hackathon!: HackathonRequest;
  tags: Tag[] = [];
  errorMsg = '';
  hackathonId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.routeSubscription = this.route.params.subscribe(params => {

     this.hackathonId = params['id'];
    });

    this.teamService.getAvailableTags().subscribe(result => this.tags = result);

    this.newTeamForm = this.formBuilder.group({
      teamName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      tags: this.buildTagsFormGroup(this.tags)
    });

    //this.newTeamForm.addControl('tagsFormGroup',) )
  }

  buildTagsFormGroup(tags: Tag[], selectedTagsIds: number[] = []): FormGroup {
    let group = this.formBuilder.group({});

    tags.forEach(tag => {
      let isSelected = selectedTagsIds.some(id => id === tag.id);
      group.addControl(String(tag.id), this.formBuilder.control(isSelected));
    });
    return group;
  }

  createTeam() {

    const team: TeamRequest = {
      ownerId: this.userService.getUserId(),
      hackathonId: this.hackathonId,
      name: this.newTeamForm.get('teamName')?.value,
      description: this.newTeamForm.get('description')?.value,
      tags: this.tags,
    };

    console.log('sending');
    console.log(team);
    console.log('');

    this.teamService.createTeam(team).subscribe(res => {
      console.log(res);

      this.router.navigateByUrl('/team/' + res.id);
    });
  }

}
