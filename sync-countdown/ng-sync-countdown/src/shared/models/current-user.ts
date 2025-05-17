export interface CurrentUser {
  token: string;
  username: string;
  authorities: { authority: string }[];
}
