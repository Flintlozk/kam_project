import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrationComponent } from './migration.component';
import { MigrationsRoutingModule } from './migration.routing';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MigrationComponent],
  imports: [CommonModule, FormsModule, MigrationsRoutingModule],
})
export class MigrationModule {}
