import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';

import { AuthService } from 'app/core/services/auth.service';
import { AuthState } from 'app/core/state/auth-state/auth.state';

import { SharedModule } from '../../shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthPageComponent } from './pages/auth/auth.page';

@NgModule({
  imports: [AuthRoutingModule, SharedModule, NgxsModule.forFeature([AuthState])],
  declarations: [AuthPageComponent, LoginComponent, RegisterComponent],
  providers: [AuthService]
})
export class AuthModule {}
