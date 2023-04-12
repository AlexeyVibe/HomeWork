export class ResultUsersDto {
  id: number;
  email: string;
  profile: {
    name: string;
    phone: string;
  }
  roles: { id: number; value: string }[];
}






