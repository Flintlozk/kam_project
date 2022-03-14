import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CmsSidebarService } from '../../services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-manage-page',
  templateUrl: './cms-manage-page.component.html',
  styleUrls: ['./cms-manage-page.component.scss'],
})
export class CmsManagePageComponent implements OnInit {
  @Output() activeSiteMenuIndex = new EventEmitter<number>();
  constructor(private sidebar: CmsSidebarService) {}

  ngOnInit(): void {}

  onActiveCreatePage(): void {
    this.sidebar.setCreatePageStatus(true);
    this.activeSiteMenuIndex.emit(1);
  }
}
