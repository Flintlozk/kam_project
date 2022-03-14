import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { queryRemove } from '@reactor-room/itopplus-front-end-helpers';
import { getFileNameFromPath } from '@reactor-room/itopplus-helpers';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'reactor-room-display-image',
  templateUrl: './display-image.component.html',
  styleUrls: ['./display-image.component.scss'],
})
export class DisplayImageComponent implements OnInit {
  zoom = 1;
  @ViewChild('imageRef') imageRef: ElementRef;
  constructor(public dialogRef: MatDialogRef<DisplayImageComponent>, @Inject(MAT_DIALOG_DATA) public data: { url: string; type: string }) {}
  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  download(resource: string): void {
    if (resource.search('linestorage.more-commerce.com') !== -1) {
      const url = queryRemove(resource);
      const filename = getFileNameFromPath(url);
      FileSaver.saveAs(url, filename);
    } else {
      const filename = getFileNameFromPath(resource);
      FileSaver.saveAs(resource, filename);
    }
  }

  zoomPan(event: WheelEvent): void {
    // if (event.deltaY >= 0) {
    //   this.zoom += 0.25;
    // } else {
    //   this.zoom -= 0.25;
    // }
    // this.imageRef.nativeElement.style.transform = `scale(${this.zoom})`;
  }
}
