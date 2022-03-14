import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginTestComponent } from './login-test.component';
import { ProcessModule } from '../process/process.module';

@NgModule({
  declarations: [LoginTestComponent],
  imports: [CommonModule, ProcessModule],
  exports: [LoginTestComponent],
})
export class LoginTestModule {}
