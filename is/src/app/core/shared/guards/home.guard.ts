import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Select } from '@ngxs/store';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthState } from 'app/core/state/auth-state/auth.state';

@Injectable({ providedIn: 'root' })
export class HomeGuard implements CanActivate {
  @Select(AuthState.isAuthed)
  private isAuthed$: Observable<boolean>;

  constructor(private router: Router) {}

  public canActivate() {
    return this.isAuthed$.pipe(
      tap(status => {
        if (!status) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        return true;
      })
    );
  }
}
