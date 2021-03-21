import { HttpErrorResponse } from '@angular/common/http';
import { IAuthData } from 'lib/interfaces/auth-data';

export class Login {
  public static readonly type = '[Auth] Login';
  constructor(public readonly authData: IAuthData) {}
}

export class Register {
  public static readonly type = '[Auth] Register';
  constructor(public readonly authData: IAuthData) {}
}

export class Logout {
  public static readonly type = '[Auth] Logout';
}

export class CheckSession {
  public static readonly type = '[Auth] CheckSession';
}

export class LoginSuccess {
  public static readonly type = '[Auth] LoginSuccess';
}

export class RegisterSuccess {
  public static readonly type = '[Auth] RegisterSuccess';
}

export class LoginFailed {
  public static readonly type = '[Auth] LoginFailed';
  constructor(public readonly message: HttpErrorResponse) {}
}

export class RegisterFailed {
  public static readonly type = '[Auth] RegisterFailed';
  constructor(public readonly message: HttpErrorResponse) {}
}
