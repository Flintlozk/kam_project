import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  EFontFamily,
  EFontFamilyCode,
  EFontStyle,
  EnumThemeClass,
  EnumThemeDeviceIcon,
  EnumThemeRenderingSettingColorType,
  EnumThemeRenderingSettingFontType,
  FontFamily,
  IFont,
  IThemeDevice,
  IThemeRenderingSettingColors,
  IThemeRenderingSettingFont,
  IThemeRenderingSettings,
  UnitEnum,
} from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import hexToRgba from 'hex-to-rgba';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil, tap } from 'rxjs/operators';
import { devices, iframeHeader, settings } from './responsive-layout.model';

@Component({
  selector: 'reactor-room-responsive-layout',
  templateUrl: './responsive-layout.component.html',
  styleUrls: ['./responsive-layout.component.scss'],
})
export class ResponsiveLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  html: string;
  @ViewChild('iframe') iframe: ElementRef;
  @ViewChild('container') container: ElementRef;
  EnumThemeDeviceIcon = EnumThemeDeviceIcon;
  @Input() devices: IThemeDevice[] = deepCopy(devices);
  @Input() settings: IThemeRenderingSettings = deepCopy(settings);
  fontStyleData = [
    {
      value: EFontStyle.REGULAR,
      title: EFontStyle.REGULAR,
    },
    {
      value: EFontStyle.BOLD,
      title: EFontStyle.BOLD,
    },
    {
      value: EFontStyle.ITALIC,
      title: EFontStyle.ITALIC,
    },
  ];
  fontFamilyData: IFont[] = [
    {
      fontFamilyCode: EFontFamilyCode.PROMPT,
      title: EFontFamily.PROMPT,
    },
    {
      fontFamilyCode: EFontFamilyCode.NEUCHA,
      title: EFontFamily.NEUCHA,
    },
    {
      fontFamilyCode: EFontFamilyCode.POST_NO_BILLS_COLOMBO,
      title: EFontFamily.POST_NO_BILLS_COLOMBO,
    },
    {
      fontFamilyCode: EFontFamilyCode.QUANTICO,
      title: EFontFamily.QUANTICO,
    },
    {
      fontFamilyCode: EFontFamilyCode.RACING_SANS_ONE,
      title: EFontFamily.RACING_SANS_ONE,
    },
  ];

  darkModeFormControl = new FormControl(false);
  themeConfigFormGroup: FormGroup;
  destroy$ = new Subject();
  UnitEnum = UnitEnum;
  constructor(public dialogRef: MatDialogRef<ResponsiveLayoutComponent>, @Inject(MAT_DIALOG_DATA) private data, private fb: FormBuilder) {
    if (this.data) {
      this.html = this.data;
    }
  }

  ngOnInit(): void {
    this.themeConfigFormGroup = this.getThemeConfigFormGroup();
    this.setThemeConfigDeviceFormArray();
    this.setThemeConfigColorFormArray();
    this.setThemeConfigFontFormArray();
    this.themeConfigFormGroup.valueChanges
      .pipe(
        startWith(this.themeConfigFormGroup.value),
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(300),
        tap(() => {
          const defaultDevice = this.getDefaultDevice();
          if (defaultDevice) this.setIframeStyle(defaultDevice.minwidth, defaultDevice.baseFontSize);
          this.themeBackgroundHandler(this.themeConfigFormGroup.get('colors').value);
          this.themeColorHandler(this.themeConfigFormGroup.get('colors').value);
          this.themeFontHandler(this.themeConfigFormGroup.get('fonts').value);
        }),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    const iframe = this.iframe.nativeElement,
      iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    iframedoc.body.innerHTML = this.html;
    iframedoc.body.classList.add(EnumThemeClass.DEFAULT_COLOR);
    iframedoc.head.innerHTML = iframeHeader;
    this.onDarkModeHandler();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  onDarkModeHandler(): void {
    this.darkModeFormControl.valueChanges
      .pipe(
        startWith(false),
        takeUntil(this.destroy$),
        tap((isDarkMode) => {
          this.onDarkModeClassHandler(isDarkMode);
          this.themeBackgroundHandler(this.themeConfigFormGroup.get('colors').value);
          this.themeColorHandler(this.themeConfigFormGroup.get('colors').value);
        }),
      )
      .subscribe();
  }

  onDarkModeClassHandler(isDarkMode: boolean): void {
    const iframe = this.iframe.nativeElement,
      iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    if (isDarkMode) {
      iframedoc.body.classList.add('itp-dark');
      iframedoc.body.classList.remove('itp-light');
    } else {
      iframedoc.body.classList.remove('itp-dark');
      iframedoc.body.classList.add('itp-light');
    }
  }

  themeBackgroundHandler(colors: IThemeRenderingSettingColors[]) {
    const isDarkMode = this.darkModeFormControl.value;
    const backgroundColor = colors.find((color) => color.type === EnumThemeRenderingSettingColorType.DEFAULT_COLOR);
    const currentColor = isDarkMode ? backgroundColor.dark : backgroundColor.light;
    const iframe = this.iframe.nativeElement,
      iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    const themeElements = iframedoc.getElementsByClassName(EnumThemeClass.DEFAULT_COLOR);
    for (let index = 0; index < themeElements.length; index++) {
      const element = themeElements[index] as HTMLElement;
      element.style.backgroundColor = hexToRgba(currentColor.color, currentColor.opacity);
    }
  }

  themeColorHandler(colors: IThemeRenderingSettingColors[]): void {
    const isDarkMode = this.darkModeFormControl.value;
    colors.forEach((color) => {
      switch (color.type) {
        case EnumThemeRenderingSettingColorType.HEADER:
          this.themeElementColorHandler(isDarkMode, EnumThemeClass.HEADER, color);
          break;
        case EnumThemeRenderingSettingColorType.SUB_HEADER:
          this.themeElementColorHandler(isDarkMode, EnumThemeClass.SUB_HEADER, color);
          break;
        case EnumThemeRenderingSettingColorType.DETAIL:
          this.themeElementColorHandler(isDarkMode, EnumThemeClass.DETAIL, color);
          break;
        case EnumThemeRenderingSettingColorType.SUB_DETAIL:
          this.themeElementColorHandler(isDarkMode, EnumThemeClass.SUB_DETAIL, color);
          break;
        case EnumThemeRenderingSettingColorType.DEFAULT_COLOR:
          this.themeElementColorHandler(isDarkMode, EnumThemeClass.DEFAULT_COLOR, color);
          break;
        case EnumThemeRenderingSettingColorType.ASSERT1:
          this.themeElementColorHandler(isDarkMode, EnumThemeClass.ASSERT1, color);
          break;
        case EnumThemeRenderingSettingColorType.ASSERT2:
          this.themeElementColorHandler(isDarkMode, EnumThemeClass.ASSERT2, color);
          break;
        case EnumThemeRenderingSettingColorType.ASSERT3:
          this.themeElementColorHandler(isDarkMode, EnumThemeClass.ASSERT3, color);
          break;
        default:
          break;
      }
    });
  }

  themeFontHandler(fonts: IThemeRenderingSettingFont[]): void {
    fonts.forEach((font) => {
      switch (font.type) {
        case EnumThemeRenderingSettingFontType.HEADER:
          this.themeElementFontHandler(EnumThemeClass.HEADER, font);
          break;
        case EnumThemeRenderingSettingFontType.SUB_HEADER:
          this.themeElementFontHandler(EnumThemeClass.SUB_HEADER, font);
          break;
        case EnumThemeRenderingSettingFontType.DETAIL:
          this.themeElementFontHandler(EnumThemeClass.DETAIL, font);
          break;
        case EnumThemeRenderingSettingFontType.SUB_DETAIL:
          this.themeElementFontHandler(EnumThemeClass.SUB_DETAIL, font);
          break;
        default:
          break;
      }
    });
  }

  themeElementColorHandler(isDarkMode: boolean, className: EnumThemeClass, color: IThemeRenderingSettingColors): void {
    const iframe = this.iframe.nativeElement,
      iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    const themeElements = iframedoc.getElementsByClassName(className);
    for (let index = 0; index < themeElements.length; index++) {
      const element = themeElements[index] as HTMLElement;
      const currentColor = isDarkMode ? color.dark : color.light;
      element.style.color = hexToRgba(currentColor.color, currentColor.opacity);
    }
  }

  themeElementFontHandler(className: EnumThemeClass, font: IThemeRenderingSettingFont): void {
    const iframe = this.iframe.nativeElement,
      iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    const themeElements = iframedoc.getElementsByClassName(className);
    for (let index = 0; index < themeElements.length; index++) {
      const element = themeElements[index] as HTMLElement;
      element.style.fontSize = font.size + font.unit;
      element.style.lineHeight = font.lineHeight;
      element.style.letterSpacing = font.letterSpacing;
      switch (font.familyCode) {
        case EFontFamilyCode.PROMPT:
          element.style.fontFamily = FontFamily.PROMPT;
          break;
        case EFontFamilyCode.POST_NO_BILLS_COLOMBO:
          element.style.fontFamily = FontFamily.POST_NO_BILLS_COLOMBO;
          break;
        case EFontFamilyCode.NEUCHA:
          element.style.fontFamily = FontFamily.NEUCHA;
          break;
        case EFontFamilyCode.QUANTICO:
          element.style.fontFamily = FontFamily.QUANTICO;
          break;
        case EFontFamilyCode.RACING_SANS_ONE:
          element.style.fontFamily = FontFamily.RACING_SANS_ONE;
          break;
        default:
          break;
      }
      switch (font.style) {
        case EFontStyle.REGULAR:
          element.style.fontWeight = 'unset';
          element.style.fontStyle = 'unset';
          break;
        case EFontStyle.BOLD:
          element.style.fontWeight = 'bold';
          element.style.fontStyle = 'unset';
          break;
        case EFontStyle.ITALIC:
          element.style.fontWeight = 'unset';
          element.style.fontStyle = 'italic';
          break;

        default:
          break;
      }
    }
  }

  getThemeConfigFormGroup(): FormGroup {
    const group = this.fb.group({
      devices: this.fb.array([]),
      colors: this.fb.array([]),
      fonts: this.fb.array([]),
    });
    return group;
  }

  setThemeConfigDeviceFormArray(): void {
    const devicesFormArray = this.themeConfigFormGroup.get('devices') as FormArray;
    devicesFormArray.clear();
    this.devices.forEach((device) => {
      const deviceFormGroup = this.getThemeConfigDeviceFormGroup();
      deviceFormGroup.patchValue(device);
      devicesFormArray.push(deviceFormGroup);
    });
  }

  getThemeConfigDeviceFormGroup(): FormGroup {
    const group = this.fb.group({
      minwidth: [''],
      icon: [''],
      baseFontSize: [''],
      default: [''],
    });
    return group;
  }

  setThemeConfigColorFormArray(): void {
    const colorsFormArray = this.themeConfigFormGroup.get('colors') as FormArray;
    colorsFormArray.clear();
    this.settings.color.forEach((color) => {
      const colorFormGroup = this.getThemeConfigColorFormGroup();
      colorFormGroup.patchValue(color);
      colorsFormArray.push(colorFormGroup);
    });
  }

  getThemeConfigColorFormGroup(): FormGroup {
    const group = this.fb.group({
      type: [''],
      dark: this.getThemeConfigColorDetailFormGroup(),
      light: this.getThemeConfigColorDetailFormGroup(),
    });
    return group;
  }

  getThemeConfigColorDetailFormGroup(): FormGroup {
    const group = this.fb.group({
      color: [''],
      opacity: [1],
    });
    return group;
  }

  onDismiss() {
    this.dialogRef.close();
  }

  setThemeConfigFontFormArray(): void {
    const fontsFormArray = this.themeConfigFormGroup.get('fonts') as FormArray;
    fontsFormArray.clear();
    this.settings.font.forEach((font) => {
      const fontFormGroup = this.getThemeConfigFontFormGroup();
      fontFormGroup.patchValue(font);
      fontsFormArray.push(fontFormGroup);
    });
  }

  getThemeConfigFontFormGroup(): FormGroup {
    const group = this.fb.group({
      type: [''],
      familyCode: [''],
      size: [1],
      unit: [''],
      style: [''],
      lineHeight: [''],
      letterSpacing: [''],
    });
    return group;
  }

  onToggleFontUnit(unit: UnitEnum, index: number): void {
    const fontsFormArray = this.themeConfigFormGroup.get('fonts') as FormArray;
    const control = fontsFormArray.controls[index];
    control.get('unit').patchValue(unit);
    if (unit === UnitEnum.EM) control.get('size').patchValue(1);
    if (unit === UnitEnum.PX) control.get('size').patchValue(16);
  }

  onSelectDevice(index: number): void {
    const devicesFormArray = this.themeConfigFormGroup.get('devices') as FormArray;
    devicesFormArray.controls.forEach((control) => {
      control.get('default').patchValue(false);
    });
    devicesFormArray.controls[index].get('default').patchValue(true);
    const defaultDevice = this.getDefaultDevice();
    this.setIframeStyle(defaultDevice.minwidth, defaultDevice.baseFontSize);
  }

  getDefaultDevice(): IThemeDevice {
    const devicesFormArray = this.themeConfigFormGroup.get('devices') as FormArray;
    const control = devicesFormArray.value.find((device) => device.default === true);
    return control;
  }

  setIframeStyle(maxWidth: number, fontbase: number): void {
    const iframe = this.iframe.nativeElement,
      iframedoc = iframe.contentDocument || iframe.contentWindow.document;
    iframe.style.maxWidth = maxWidth + 'px';
    iframedoc.body.style.fontSize = fontbase + 'px';
  }
}
