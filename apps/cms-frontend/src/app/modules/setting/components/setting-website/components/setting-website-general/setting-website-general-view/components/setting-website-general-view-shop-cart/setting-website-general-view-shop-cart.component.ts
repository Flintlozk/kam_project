import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ColorPickerService } from 'ngx-color-picker';
import { ScaleAnimate } from '@reactor-room/animation';
import { EnumColorType } from '@reactor-room/cms-models-lib';
@Component({
  selector: 'cms-next-setting-website-general-view-shop-cart',
  templateUrl: './setting-website-general-view-shop-cart.component.html',
  styleUrls: ['./setting-website-general-view-shop-cart.component.scss'],
  animations: [ScaleAnimate.translateYAnimation],
})
export class SettingWebsiteGeneralViewShopCartComponent implements OnInit {
  iconColor = '#f76767';
  textColor = '#f767c6';
  @Input() dialogForm: FormGroup;
  toggleStatus = false;
  selectedIndex = 0;
  shopCartIcons = [
    {
      index: 0,
      image: 'assets/cms/setting/website/general/shop-cart/shop-cart-icon1.svg',
    },

    {
      index: 1,
      image: 'assets/cms/setting/website/general/shop-cart/shop-cart-icon2.svg',
    },
    {
      index: 2,
      image: 'assets/cms/setting/website/general/shop-cart/shop-cart-icon3.svg',
    },
    {
      index: 3,
      image: 'assets/cms/setting/website/general/shop-cart/shop-cart-icon4.svg',
    },
    {
      index: 4,
      image: 'assets/cms/setting/website/general/shop-cart/shop-cart-icon5.svg',
    },
    {
      index: 5,
      image: 'assets/cms/setting/website/general/shop-cart/shop-cart-icon6.svg',
    },
  ];
  constructor(private cp: ColorPickerService) {}
  get icon_color(): FormGroup {
    return this.dialogForm.get('icon_color') as FormGroup;
  }
  get text_color(): FormGroup {
    return this.dialogForm.get('text_color') as FormGroup;
  }
  get getRGBIconColor(): string {
    return this.dialogForm.get('icon_color.rgb').value;
  }

  get getAlphaIconColor(): number {
    return this.dialogForm.get('icon_color.alpha').value;
  }
  get getRGBTextColor(): string {
    return this.dialogForm.get('text_color.rgb').value;
  }
  get getIconAlpha(): FormControl {
    return this.dialogForm.get('icon_color.alpha') as FormControl;
  }
  get getTextAlpha(): FormControl {
    return this.dialogForm.get('text_color.alpha') as FormControl;
  }
  get getSelectedShopIcon(): number {
    return this.dialogForm.get('shopcart_icon').value;
  }

  get getSelectedShopIconForm(): FormControl {
    return this.dialogForm.get('shopcart_icon') as FormControl;
  }
  ngOnInit(): void {
    this.selectedIndex = this.getSelectedShopIcon;
  }
  convertColor(colorString: string): { hex: string; alpha: number } {
    const hsva = this.cp.stringToHsva(colorString, true);
    const alpha = Math.round(this.cp.stringToHsva(colorString, true).a * 100);
    const hex = this.cp.outputFormat(hsva, 'auto', 'always');
    return { hex: hex, alpha: alpha };
  }
  onChangeColor($event, colorType: EnumColorType): void {
    const newColor = $event;
    const convertedColor = this.convertColor(newColor);

    this.dialogForm.get(colorType + '.rgb').setValue(convertedColor.hex);
    this.dialogForm.get(colorType + '.alpha').setValue(convertedColor.alpha);
    this.dialogForm.get(colorType + '.rgb').markAsDirty();
    this.dialogForm.get(colorType + '.alpha').markAsDirty();
  }
  select(index: number): void {
    this.selectedIndex = index;
    this.getSelectedShopIconForm.setValue(this.selectedIndex);
    this.getSelectedShopIconForm.markAsDirty();
  }
  toggle(): void {
    this.toggleStatus = !this.toggleStatus;
  }
  onClickOutside(event: boolean): void {
    if (event) this.toggleStatus = false;
  }
}
