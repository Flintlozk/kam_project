import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-invite-link-troubleshoot',
  templateUrl: './invite-link-troubleshoot.component.html',
  styleUrls: ['./invite-link-troubleshoot.component.scss'],
})
export class InviteLinkTroubleshootComponent implements OnInit {
  constructor(public translate: TranslateService, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<InviteLinkTroubleshootComponent>) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }
}
