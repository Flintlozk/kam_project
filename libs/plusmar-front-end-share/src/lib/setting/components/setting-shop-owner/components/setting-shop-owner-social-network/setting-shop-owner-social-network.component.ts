import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SettingModuleService } from '../../../../setting.module.service';
@Component({
  selector: 'reactor-room-setting-shop-owner-social-network',
  templateUrl: './setting-shop-owner-social-network.component.html',
  styleUrls: ['./setting-shop-owner-social-network.component.scss'],
})
export class SettingShopOwnerSocialNetworkComponent implements OnInit {
  socialNetworkForm: FormGroup;
  constructor(private leadFormBuilder: FormBuilder, private dialogRef: MatDialogRef<SettingShopOwnerSocialNetworkComponent>, private settingModuleService: SettingModuleService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.settingModuleService.fetchSocialNetwork.subscribe((result) => {
      this.socialNetworkForm.setValue({
        socialFacebook: result.social_facebook,
        socialLine: result.social_line,
        ////:: marketplace functionality commenting now
        // socialShopee: result.social_shopee,
        // socialLazada: result.social_lazada,
      });
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  initForm(): void {
    this.socialNetworkForm = this.leadFormBuilder.group({
      socialFacebook: [''],
      socialLine: [''],
      // socialShopee: [''],
      // socialLazada: [''],
    });
  }

  onConfirm(): void {
    this.dialogRef.close(this.socialNetworkForm.value);
  }
}
