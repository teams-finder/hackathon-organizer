import {HackathonDto} from "../../hackathon/model/Hackathon";

export interface Tag {
  readonly id: number;
  readonly name: string;
  isSelected?: boolean;
}

export interface TeamRequest {
   ownerId: number;
   hackathonId: number;
   name: string;
   description: string;
   tags: Tag[];
}

export interface TeamResponse {
  content: Team[];
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  isOpen: boolean;
  teamChatRoomId: number;
  tags: Tag[];
}
