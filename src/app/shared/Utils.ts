import {UserResponseDto} from "../user/model/UserResponseDto";

export class Utils {

  public static get currentUserFromLocalStorage(): UserResponseDto {

      const user = localStorage.getItem("user") as string;

      if (user) {
        return JSON.parse(user) as UserResponseDto;
      } else {
        throw new Error("Can't obtain user data from local storage. Try refreshing the page.");
      }
  }

  public static updateUserInLocalStorage(user: UserResponseDto): void {
      localStorage.setItem("user", JSON.stringify(user));
  }
}