import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user-service/user.service";
import {UserManager} from "../../shared/UserManager";
import {Notification} from "../../team/model/Notifications";

@Component({
  selector: 'ho-menu',
  templateUrl: './menu.component.html',
  styleUrls: []
})
export class MenuComponent implements OnInit {

  userHackathonId?: number;
  userTeamId?: number;
  currentUserId?: number;
  username = "";
  avatarUrl = "";
  notifications: Notification[] = [];
  isLoggedIn = false;
  user = UserManager.currentUserFromStorage;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {

    if (this.user) {

      this.currentUserId = this.user.id;
      this.userHackathonId = this.user.currentHackathonId;
      this.userTeamId = this.user.currentTeamId;

      this.avatarUrl = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${this.user.username}&length=1`;
    }

    this.userService.userNotificationsObservable.subscribe(notifications => {
      this.notifications = notifications
    });

    this.userService.isLoggedIn().then(isLogged => this.isLoggedIn = isLogged);
  }

  logout() {
    this.userService.logout();
  }

  login() {
    this.userService.login();
  }
}
