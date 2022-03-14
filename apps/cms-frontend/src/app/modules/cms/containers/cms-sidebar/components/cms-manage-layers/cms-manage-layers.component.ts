import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CmsManageLayersDialogComponent } from './cms-manage-layers-dialog/cms-manage-layers-dialog.component';

@Component({
  selector: 'cms-next-cms-manage-layers',
  templateUrl: './cms-manage-layers.component.html',
  styleUrls: ['./cms-manage-layers.component.scss'],
})
export class CmsManageLayersComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onManageLayerDialog(): void {
    const dialogRef = this.dialog.open(CmsManageLayersDialogComponent, {});
    dialogRef.afterClosed().subscribe(() => {});
  }
}
