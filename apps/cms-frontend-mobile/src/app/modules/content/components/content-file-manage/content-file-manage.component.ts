import { Component, OnInit } from '@angular/core';
import { FileUploadTypeEnums } from '@reactor-room/cms-models-lib';
import { ContentFileType, ContentFileExtension } from './content-file-manage.model';

@Component({
  selector: 'cms-next-content-file-manage',
  templateUrl: './content-file-manage.component.html',
  styleUrls: ['./content-file-manage.component.scss'],
})
export class ContentFileManageComponent implements OnInit {
  sortNameStatus = false;
  groupViewStatus = false;
  contentFileType = ContentFileType;
  acceptType = FileUploadTypeEnums.ACCEPT_IMAGE_FILE;

  fileManageData = [
    {
      fileType: ContentFileType.IMAGE,
      fileName: 'Sacura',
      fileContent: '/assets/images/shared/sample.jpg',
      fileExtension: ContentFileExtension.JPEG,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.FILE,
      fileName: 'Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.PDF,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.FILE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.XLS,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.IMAGE,
      fileName: 'Sacura',
      fileContent: '/assets/images/shared/sample.jpg',
      fileExtension: ContentFileExtension.PNG,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.FILE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.DOC,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.FILE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.DOCX,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.IMAGE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.JPEG,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.FILE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.XLSX,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.FILE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.DOC,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.IMAGE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.JPEG,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.FILE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.DOC,
      toggleStatus: false,
    },
    {
      fileType: ContentFileType.FILE,
      fileName: 'Sacura Sacura Sacura Sacura',
      fileContent: null,
      fileExtension: ContentFileExtension.PDF,
      toggleStatus: false,
    },
  ];
  isViewFileDetail = false;

  constructor() {}

  ngOnInit(): void {}

  toggleSortNameStatus(): void {
    this.sortNameStatus = !this.sortNameStatus;
  }

  toggleGroupViewStatus(): void {
    this.groupViewStatus = !this.groupViewStatus;
  }

  onActiveToggleLayout(index: number): void {
    this.fileManageData[index].toggleStatus = true;
    if (this.fileManageData[index].fileType === this.contentFileType.IMAGE) {
      this.isViewFileDetail = true;
    } else this.isViewFileDetail = false;
  }
  optionToggleLayoutStatusEvent(status: boolean, index: number): void {
    this.fileManageData[index].toggleStatus = status;
  }
  trackByIndex(index: number): number {
    return index;
  }
}
