import { Component, OnInit } from '@angular/core';
import {HackathonService} from "../../core/services/hackathon-service/hackathon.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ho-hackathon-profile',
  templateUrl: './hackathon-profile.component.html',
  styleUrls: ['./hackathon-profile.component.scss']
})
export class HackathonProfileComponent implements OnInit {

  private routeSubscription: Subscription = new Subscription();

  hcTitle: string = '';
  hcId: number = 0;

  constructor(private hackathonService: HackathonService, private route: ActivatedRoute) { }

  ngOnInit(): void {


    this.routeSubscription = this.route.params.subscribe(params => {

      this.hackathonService.getHackathonDetailsById(params['id']).subscribe(hc => {
        this.hcTitle = hc.name;
        this.hcId = hc.id;
      });
    });
  }

  joinHackathon() {
     this.hackathonService.addUserToHackathon(this.hcId).subscribe(res => console.log("User added to hackathon" + this.hcId));
  }
}
