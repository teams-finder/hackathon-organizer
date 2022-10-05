export interface Tag {
  id: number;
  name: string;
}

export interface TeamRequest {
   ownerId: number;
   hackathonId: number;
   name: string;
   description: string;
   tags: Tag[];
}

export interface TeamResponse {
  id: number;
  ownerId: number;
  hackathonId: number;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  isOpen: boolean;
  tags: Tag[];
}
