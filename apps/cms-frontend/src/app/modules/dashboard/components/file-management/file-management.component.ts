import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss'],
})
export class FileManagementComponent implements OnInit {
  heading: IHeading = {
    title: 'File Management',
    subTitle: 'Dashboard / File Management',
  };
  containerStyle = { height: 'calc(100vh - 600px)' };
  constructor() {}

  ngOnInit(): void {}
}
