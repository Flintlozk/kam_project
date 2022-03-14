import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [TaskCardComponent],
  imports: [CommonModule, MatChipsModule, MatCardModule, MatButtonModule, MatTooltipModule],
  exports: [TaskCardComponent],
})
export class TaskCardModule {}
