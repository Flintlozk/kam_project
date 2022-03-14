import { Component, OnInit } from '@angular/core';
import { ContentFileExtension } from '../../content-file-manage.model';

@Component({
  selector: 'cms-next-content-file-manage-detail',
  templateUrl: './content-file-manage-detail.component.html',
  styleUrls: ['./content-file-manage-detail.component.scss'],
})
export class ContentFileManageDetailComponent implements OnInit {
  imageData = {
    title: 'sakura48949',
    extension: ContentFileExtension.JPEG,
    file: 'assets/images/shared/sample.jpg',
  };
  optionToggleLayoutStatus = false;
  constructor() {}

  ngOnInit(): void {}

  onActiveToggleLayout(): void {
    this.optionToggleLayoutStatus = true;
  }

  optionToggleLayoutStatusEvent(status: boolean): void {
    this.optionToggleLayoutStatus = status;
  }
}
