import { IUser } from 'lib/interfaces/user.interface';

export interface AuthStateModel {
  user: IUser;
  isAuthed: boolean;
  loading: boolean;
}
