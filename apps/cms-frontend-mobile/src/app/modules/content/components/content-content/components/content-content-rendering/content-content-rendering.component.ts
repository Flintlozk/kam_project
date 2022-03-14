import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContentContentDialogComponent } from '../content-content-dialog/content-content-dialog.component';

@Component({
  selector: 'cms-next-content-content-rendering',
  templateUrl: './content-content-rendering.component.html',
  styleUrls: ['./content-content-rendering.component.scss'],
})
export class ContentContentRenderingComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onEditContentDialog(): void {
    const dialogRef = this.dialog.open(ContentContentDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
