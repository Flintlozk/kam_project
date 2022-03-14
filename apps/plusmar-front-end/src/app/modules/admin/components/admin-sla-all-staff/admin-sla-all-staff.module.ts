import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSlaAllStaffComponent } from './admin-sla-all-staff.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AdminSlaAllStaffComponent],
  imports: [CommonModule, FormsModule, MatSliderModule, TranslateModule],
  exports: [AdminSlaAllStaffComponent],
})
export class AdminSlaAllStaffModule {}
