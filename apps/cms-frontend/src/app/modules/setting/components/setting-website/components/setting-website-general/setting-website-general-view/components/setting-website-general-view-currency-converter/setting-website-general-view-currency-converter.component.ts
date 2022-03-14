import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EnumCurrency } from '@reactor-room/cms-models-lib';
import { SettingGeneralService } from 'apps/cms-frontend/src/app/modules/setting/services/setting-general/setting-general-service';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ScaleAnimate } from '@reactor-room/animation';

interface Currency {
  index: number;
  isoCode: EnumCurrency;
  selected: boolean;
  fullName: string;
  country: string;
  symbol: string;
  icon: string;
}

@Component({
  selector: 'cms-next-setting-website-general-view-currency-converter',
  templateUrl: './setting-website-general-view-currency-converter.component.html',
  styleUrls: ['./setting-website-general-view-currency-converter.component.scss'],
  animations: [ScaleAnimate.translateYAnimation],
})
export class SettingWebsiteGeneralViewCurrencyConverterComponent implements OnInit {
  selectedConverter;
  @Input() dialogForm: FormGroup;
  searchField: FormControl;
  toggleStatus = false;
  selectedCurrency = [];
  list: Currency[] = [];
  mainConverter: Currency[] = [
    {
      index: 0,
      isoCode: EnumCurrency.THB,
      selected: false,
      fullName: 'Thai Baht',
      country: 'Thailand',
      symbol: '฿',
      icon: 'assets/lang/th.svg',
    },
    {
      index: 1,
      isoCode: EnumCurrency.USD,
      selected: false,
      fullName: 'US Dollar',
      country: 'United States of America',
      symbol: '$',
      icon: 'assets/lang/us.svg',
    },
    {
      index: 2,
      isoCode: EnumCurrency.JPY,
      selected: false,
      fullName: 'Yen',
      country: 'Japan',
      symbol: '¥',
      icon: 'assets/lang/jp.svg',
    },
  ];

  constructor(private fb: FormBuilder, private settingService: SettingGeneralService) {}
  get getSelectedConverterList(): FormArray {
    return this.dialogForm.get('selected_main_converter') as FormArray;
  }
  get getSelectedMainConverter(): FormControl {
    return this.dialogForm.get('main_converter') as FormControl;
  }

  ngOnInit(): void {
    this.selectedConverter = this.findCurrencyByIsoCode(this.getSelectedMainConverter.value);
    this.selectedCurrency = this.settingService.selectedCurrency;
    this.patchSelectedConverter();
    this.searchField = new FormControl();
    this.onSearch();
  }

  onSearch(): void {
    this.searchField.valueChanges.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((res) => {
      const filteredList = this.getSelectedConverterList.value.filter((item) => {
        return (
          item.isoCode.toLowerCase().includes(res.toLowerCase()) ||
          item.fullName.toLowerCase().includes(res.toLowerCase()) ||
          item.country.toLowerCase().includes(res.toLowerCase())
        );
      });
      this.list = filteredList;
    });
  }
  patchSelectedConverter(): void {
    this.getSelectedConverterList.clear();
    try {
      this.mainConverter.forEach((item) => {
        const languages = this.fb.group({
          index: item.index,
          isoCode: item.isoCode,
          selected: item.selected,
          fullName: item.fullName,
          country: item.country,
          symbol: item.symbol,
          icon: item.icon,
        });

        if (this.selectedCurrency.includes(languages.value.isoCode)) {
          languages.patchValue({ selected: true });
        }
        this.getSelectedConverterList.push(languages);
      });
      this.list = this.getSelectedConverterList.value;
    } catch (error) {
      console.log('generalView => Currency converter => patchSelectedConverter : ', error);
    }
  }

  toggle(): void {
    this.toggleStatus = !this.toggleStatus;
  }

  onClickOutside(event: boolean): void {
    if (event) this.toggleStatus = false;
  }
  findCurrencyByIsoCode(isoCode: string): Currency {
    let converter: Currency;
    this.mainConverter.forEach((item) => {
      if (item.isoCode === isoCode) {
        converter = item;
      }
    });
    return converter;
  }
  onConverterChange(converter: number): void {
    this.selectedConverter = this.mainConverter[converter];
    this.getSelectedMainConverter.patchValue(this.selectedConverter.isoCode);
    this.getSelectedMainConverter.markAsDirty();
  }
}
