import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';

import { AuthState } from 'app/core/state/auth-state/auth.state';

import { SharedModule } from '../../shared/shared.module';

import { MainRoutingModule } from './main-routing.module';

import { MainPageComponent } from './pages/main/main.component';

@NgModule({
  imports: [SharedModule, MainRoutingModule, NgxsModule.forFeature([AuthState])],
  declarations: [MainPageComponent]
})
export class MainModule {}
