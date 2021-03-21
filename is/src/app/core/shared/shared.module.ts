import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const MODULES = [FormsModule, ReactiveFormsModule, MaterialModule, CommonModule, NgxSkeletonLoaderModule];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class SharedModule {}
