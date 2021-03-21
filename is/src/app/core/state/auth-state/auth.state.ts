import { Injectable } from '@angular/core';

import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { catchError, filter, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from 'app/core/services/auth.service';

import {
  CheckSession,
  Login,
  LoginFailed,
  LoginSuccess,
  Logout,
  Register,
  RegisterFailed,
  RegisterSuccess
} from './auth.actions';
import { AuthStateModel } from './auth.model';
import { SocketService } from 'app/core/services/socket.service';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    isAuthed: false,
    loading: false
  }
})
@Injectable()
export class AuthState implements NgxsOnInit {
  constructor(private authService: AuthService, private socketService: SocketService) {}

  @Selector() public static user({ user }: AuthStateModel) {
    return user;
  }

  @Selector() public static loading({ loading }: AuthStateModel) {
    return loading;
  }

  @Selector() public static isAuthed({ isAuthed }: AuthStateModel) {
    return isAuthed;
  }

  public ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    ctx.dispatch(new CheckSession());
  }

  @Action(Login)
  public login(ctx: StateContext<AuthStateModel>, { authData }: Login) {
    ctx.patchState({ loading: true });

    return this.authService.login(authData).pipe(
      filter(user => !!user),
      tap(user => {
        ctx.patchState({ user, isAuthed: true });
        this.socketService.emit('joinRoom', user.id);
      }),
      tap(() => ctx.dispatch(new LoginSuccess())),
      catchError(error => {
        ctx.dispatch(new LoginFailed(error));
        return throwError(error);
      })
    );
  }

  @Action(Register)
  public register(ctx: StateContext<AuthStateModel>, { authData }: Register) {
    ctx.patchState({ loading: true });

    return this.authService.register(authData).pipe(
      filter(resp => !!resp),
      tap(() => ctx.dispatch(new RegisterSuccess())),
      catchError(error => {
        ctx.dispatch(new RegisterFailed(error));
        return throwError(error);
      })
    );
  }

  @Action(Logout)
  public logout(ctx: StateContext<AuthStateModel>) {
    const { user } = ctx.getState();

    ctx.patchState({ user: null, isAuthed: false });

    if (user) {
      return this.authService.logout(user.id).pipe(
        tap(() => {
          this.socketService.emit('leaveRoom', user.id);
        }),
        catchError(error => {
          return throwError(error);
        })
      );
    }

    ctx.patchState({ loading: false });

    ctx.dispatch(new Navigate(['/auth/login']));
  }

  @Action(CheckSession)
  public checkSession(ctx: StateContext<AuthStateModel>) {
    const { user } = ctx.getState();

    if (user) {
      return this.authService.checkSession(user.id).pipe(
        tap(resp => {
          if (resp) {
            this.socketService.emit('joinRoom', user.id);
          } else {
            ctx.dispatch(new Logout());
          }
        })
      );
    } else {
      ctx.dispatch(new Logout());
    }
  }
  @Action(LoginSuccess)
  public onLoginSuccess(ctx: StateContext<AuthStateModel>) {
    // tslint:disable-next-line: no-console
    console.log('Вы вошли в систему');
    ctx.patchState({ loading: false });
    ctx.dispatch(new Navigate(['/home']));
  }

  @Action(RegisterSuccess)
  public onRegisterSuccess(ctx: StateContext<AuthStateModel>) {
    // tslint:disable-next-line: no-console
    console.log('Вы успешно зарегистрировались');
    ctx.patchState({ loading: false });
    ctx.dispatch(new Navigate(['/auth/login']));
  }

  @Action(LoginFailed)
  public onLoginFailed(ctx: StateContext<AuthStateModel>, { message }: LoginFailed) {
    if (message.error === 'wrong email or password') {
      alert('Неверный email или пароль');
    }

    if (message.error === 'user already authorized') {
      alert('Пользователь уже авторизован');
    }
    // tslint:disable-next-line: no-console
    console.log('Ошибка при входе');
    ctx.patchState({ loading: false });
  }

  @Action(RegisterFailed)
  public onRegisterFailed(ctx: StateContext<AuthStateModel>, { message }: RegisterFailed) {
    if (message.error === 'user already exists') {
      alert('Пользователь уже существует');
    }
    // tslint:disable-next-line: no-console
    console.log('Ошибка при регистрации');
    ctx.patchState({ loading: false });
  }
}
