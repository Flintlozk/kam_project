import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupBoardComponent } from './group-board.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [GroupBoardComponent],
  imports: [CommonModule, MatCardModule],
  exports: [GroupBoardComponent],
})
export class GroupBoardModule {}
