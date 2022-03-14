import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'reactor-room-setting-lead-pipeline-message',
  templateUrl: './setting-lead-pipeline-message.component.html',
  styleUrls: ['./setting-lead-pipeline-message.component.scss'],
})
export class SettingLeadPipelineMessageComponent implements OnInit {
  @Input() isAllowed: boolean;
  leadPipelineMessage: FormGroup;

  constructor(private matDialog: MatDialog, private toastr: ToastrService, private fromBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.leadPipelineMessage = this.fromBuilder.group({
      termTH: ['', Validators.required],
      termENG: ['', Validators.required],
    });
  }

  saveSetting(): void {
    alert('save');
  }
}
