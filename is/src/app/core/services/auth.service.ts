import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IAuthData } from 'lib/interfaces/auth-data';
import { IQuestionStructure } from 'lib/interfaces/question.interface';
import { IUser } from 'lib/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  public login(authData: IAuthData) {
    return this.httpClient.post<IUser>('/api/login', authData);
  }

  public register(authData: IAuthData) {
    return this.httpClient.post<IUser>('/api/register', authData);
  }

  public checkSession(userId: string) {
    return this.httpClient.post<IUser>('/api/checkSession', { userId });
  }

  public logout(userId: string) {
    return this.httpClient.post<IUser>('/api/logout', { userId });
  }

  public getQuestions() {
    return this.httpClient.get<IQuestionStructure>('/api/questions');
  }
}
