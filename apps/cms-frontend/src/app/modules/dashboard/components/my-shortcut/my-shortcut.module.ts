import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyShortcutComponent } from './my-shortcut.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MyShortcutDialogModule } from './components/my-shortcut-dialog/my-shortcut-dialog.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [MyShortcutComponent],
  imports: [CommonModule, RouterModule, MyShortcutDialogModule, MatDialogModule, DragDropModule, MatSnackBarModule],
  exports: [MyShortcutComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class MyShortcutModule {}
