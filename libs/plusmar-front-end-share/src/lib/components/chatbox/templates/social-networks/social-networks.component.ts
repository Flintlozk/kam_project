import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Socials } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TemplatesService } from '../templates.service';

interface SocialData {
  imgUrl: string;
  label: string;
  status: boolean;
  controlName: string;
  data: string;
}

@Component({
  selector: 'reactor-room-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss'],
})
export class SocialNetworksComponent implements OnInit {
  updatedField = null;
  socialData: SocialData[] = [
    { imgUrl: 'assets/img/social/facebook.svg', label: 'Facebook', status: false, controlName: 'social_facebook', data: '' },
    { imgUrl: 'assets/img/social/line.svg', label: 'Line', status: false, controlName: 'social_line', data: '' },
    ////:: marketplace functionality commenting now
    // { imgUrl: 'assets/img/social/shopee.svg', label: 'Shopee', status: false, controlName: 'social_shopee', data: '' },
    // { imgUrl: 'assets/img/social/lazada.svg', label: 'Lazada', status: false, controlName: 'social_lazada', data: '' },

    // { imgUrl: 'assets/img/social/instagram.svg', label: 'Instagram', status: false, controlName: 'Instagram', data: '' },
    // { imgUrl: 'assets/img/social/twitter.svg', label: 'Twitter', status: false, controlName: 'Twitter', data: '' },
    // { imgUrl: 'assets/img/social/google.svg', label: 'Google', status: false, controlName: 'Google', data: '' },
    // { imgUrl: 'assets/img/social/youtube.svg', label: 'Youtube', status: false, controlName: 'Youtube', data: '' },
    // { imgUrl: 'assets/img/social/phone.svg', label: 'Phone', status: false, controlName: 'Phone', data: '' },
    // { imgUrl: 'assets/img/social/email.svg', label: 'Email', status: false, controlName: 'Email', data: '' },
    // { imgUrl: 'assets/img/social/address.svg', label: 'Address', status: false, controlName: 'Address', data: '' },
  ];
  filterForm;
  debounceInterval;
  fieldIsSaved = false;
  @Input() messageType: string;
  @Output() closeModal = new Subject<void>();

  constructor(private fb: FormBuilder, public translate: TranslateService, public templateService: TemplatesService) {}

  ngOnInit(): void {
    this.getFormsTemplates();
    this.initForm();
  }

  setChangesListener(): void {
    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.saveChanges();
    });
  }

  getFormsTemplates(): void {
    this.templateService.getSocials().subscribe(
      (result: Socials) => {
        this.filterForm.patchValue(result);
        this.setChangesListener();
      },
      (err) => {
        console.log(err);
      },
    );
  }

  saveChanges(): void {
    this.templateService.updateSocials(this.filterForm.value).subscribe(
      (result) => {
        this.fieldIsSaved = true;
        setTimeout(() => {
          this.updatedField = null;
          this.fieldIsSaved = false;
        }, 2000);
      },
      (err) => console.log,
    );
  }

  select(media): void {
    if (this.messageType === 'CHAT') this.templateService.changeMessage(this.filterForm?.value[media]);
    else this.templateService.returnMessage(this.filterForm?.value[media]);
    this.closeModal.next(null);
  }

  simpleDebounce = (callback, time = 500): void => {
    clearTimeout(this.debounceInterval);
    this.debounceInterval = setTimeout(() => {
      this.debounceInterval = null;
      callback();
    }, time);
  };

  updateField(field): void {
    this.simpleDebounce(() => (this.updatedField = field));
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      social_facebook: [null],
      social_line: [null],
      // social_shopee: [null],
      // social_lazada: [null],
      // Instagram: [null],
      // Twitter: [null],
      // Google: [null],
      // Youtube: [null],
      // Phone: [null],
      // Email: [null],
      // Address: [null],
    });
  }
}
