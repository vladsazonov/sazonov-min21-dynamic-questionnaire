import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeGuard } from 'app/core/shared/guards/home.guard';

import { MainPageComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [HomeGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomeGuard]
})
export class MainRoutingModule {}
