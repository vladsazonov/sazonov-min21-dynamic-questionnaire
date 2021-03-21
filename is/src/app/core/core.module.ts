import { NgModule } from '@angular/core';

import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'environments/environment';

import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

import { AuthState } from './state/auth-state/auth.state';

@NgModule({
  imports: [
    NgxsModule.forRoot([AuthState], { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot({
      key: ['auth']
    }),
    NgxsRouterPluginModule.forRoot()
  ],
  providers: [AuthService, SocketService]
})
export class CoreModule {}
