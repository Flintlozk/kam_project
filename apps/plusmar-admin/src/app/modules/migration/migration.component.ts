import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MigrationService } from './migration.service';

@Component({
  selector: 'admin-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss'],
})
export class MigrationComponent implements OnInit {
  pwd = '';
  show = true;

  constructor(private migrationService: MigrationService, private toastr: ToastrService) {}

  ngOnInit(): void {}

  unlock() {
    if (this.pwd === '!@#$%^&*()') {
      this.show = true;
    }
  }

  doMigratePageApplicationScope() {
    this.migrationService.doMigratePageApplicationScope().subscribe(
      () => {
        this.toastr.success('Success', 'Migration', { positionClass: 'toast-bottom-right' });
      },
      (err) => {
        this.toastr.error('Failed', 'Migration', { positionClass: 'toast-bottom-right' });
      },
    );
  }
}
