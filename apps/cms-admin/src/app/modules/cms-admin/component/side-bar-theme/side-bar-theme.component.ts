import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {
  EFontStyle,
  EnumSelectThemeSetting,
  EnumThemeDeviceIcon,
  fontListDefault,
  IThemeDevice,
  IThemeRenderingHtml,
  IThemeRenderingSettingColors,
  IThemeRenderingSettingFont,
  UnitEnum,
} from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ThemeService } from '../../services/theme.service';

import hexToRgba from 'hex-to-rgba';
@Component({
  selector: 'reactor-room-side-bar-theme',
  templateUrl: './side-bar-theme.component.html',
  styleUrls: ['./side-bar-theme.component.scss'],
})
export class SideBarThemeComponent implements OnInit {
  deviceResolution: number;
  selectedTheme = true;
  showMoreButton = false;
  imageSrc: string | ArrayBuffer;
  selectedTab = 'SELECTTHEMEINFO';
  selectedText = false;
  selectedColor = false;
  selectedIntegration = false;
  colorSelectedForm: FormArray;
  integrationForm = this.fb.group({
    googleFont: false,
    fontAwesome: false,
  });
  listOfColor: IThemeRenderingSettingColors[];
  listOfFont: IThemeRenderingSettingFont[];
  listOfDevices: IThemeDevice[];
  listOfHtmlFiles: IThemeRenderingHtml[];
  fontList: string[] = fontListDefault;
  fontUnit: string[] = ['px', 'rem'];
  fontSize: number[] = [9, 10, 11, 12, 13, 14, 18, 24, 36, 48, 64, 72, 96, 144];
  styleList: string[] = [EFontStyle.BOLD, EFontStyle.ITALIC, EFontStyle.REGULAR];
  fontSelectedForm: FormArray;
  selectedIndex: number;
  destroy$ = new Subject();
  typeOfFile: string;
  _id: string;
  htmlIndex: number;
  defaultFontFamilyCode: string;
  constructor(private fb: FormBuilder, private themeService: ThemeService) {
    this.themeService.getSelectedIndex.pipe(takeUntil(this.destroy$)).subscribe((index) => {
      this.selectedIndex = index;
    });
    this.themeService.editorOptionsSubject.pipe(takeUntil(this.destroy$)).subscribe((fileType) => {
      this.typeOfFile = fileType;
    });
    this.themeService.thumbnailUrl.pipe(takeUntil(this.destroy$)).subscribe((imageSrc) => {
      this.imageSrc = imageSrc;
    });
    this.themeService.htmlIndex.pipe(takeUntil(this.destroy$)).subscribe((index) => {
      this.htmlIndex = index;
    });
  }

  themeRenderingForm = this.fb.group({
    _id: [],
    name: [],
    settings: {
      font: [],
      color: [],
      integration: '',
      defaultFontFamily: '',
    },
    image: [],
    html: [],
    style: [],
    javascript: [],
    devices: [],
  });
  deviceForm = new FormControl('');
  get devices(): FormArray {
    return this.themeRenderingForm.get('devices') as FormArray;
  }
  get htmlFiles(): FormArray {
    return this.themeRenderingForm.get('html') as FormArray;
  }
  EnumSelectThemeSetting = EnumSelectThemeSetting;
  addDeviceStage = false;
  selectedSetting = -1;
  UnitEnum = UnitEnum;
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
      const updateThumnail = { _id: this._id, index: this.htmlIndex, thumbnail: { stream: file, path: '' } };
      this.themeService
        .updateThumnailByIndex(updateThumnail)
        .pipe(takeUntil(this.destroy$))
        .subscribe((IHTTPResult) => {});
    }
  }

  selectedThemeInfoTab(): void {
    this.selectedTab = EnumSelectThemeSetting.SELECTTHEMEINFO;
  }
  selectedMenuTab(): void {
    this.selectedTab = EnumSelectThemeSetting.SELECTMENU;
  }
  selectedGlobalSettingTab(): void {
    this.selectedTab = EnumSelectThemeSetting.SELECTGLOBALSETTING;
  }
  selectText(): void {
    this.selectedText = !this.selectedText;
  }
  selectColor(): void {
    this.selectedColor = !this.selectedColor;
  }
  selectTheme(): void {
    this.selectedTheme = !this.selectedTheme;
  }
  selectIntegration(): void {
    this.selectedIntegration = !this.selectedIntegration;
  }
  ngOnInit(): void {
    this.themeService.themeRendering.subscribe((themeData) => {
      this._id = themeData._id;
      this.listOfColor = themeData.settings.color;
      this.listOfFont = themeData.settings.font;
      this.listOfDevices = themeData.devices;
      this.listOfHtmlFiles = themeData.html;
      this.fontSelectedForm = this.initTextFormArray();
      this.colorSelectedForm = this.initColorFormArray();
      const deviesForm = this.initDevicesFormArray();
      const htmlForm = this.initHtmlFilesFormArray();
      this.themeService.updateDevices(deviesForm);
      this.themeRenderingForm.controls.devices = deviesForm;
      this.themeRenderingForm.controls.html = htmlForm;
      this.themeRenderingForm.valueChanges.subscribe((value) => {
        this.themeService.updatedTheme.next(value);
      });
      this.fontSelectedForm.valueChanges.subscribe((value) => {
        this.themeRenderingForm.controls.settings.value.font = value;
        this.themeService.updatedTheme.next(this.themeRenderingForm.value);
      });
      this.colorSelectedForm.valueChanges.subscribe((value) => {
        this.themeRenderingForm.controls.settings.value.color = value;
        this.themeService.updatedTheme.next(this.themeRenderingForm.value);
      });
      this.integrationForm.valueChanges.subscribe((value) => {
        this.themeRenderingForm.controls.settings.value.integration = value;
        this.themeService.updatedTheme.next(this.themeRenderingForm.value);
      });
      this.themeRenderingForm.controls.devices.valueChanges.subscribe((value) => {
        const themeRendering = this.themeRenderingForm.value;
        themeRendering.devices = value;
        this.themeService.updatedTheme.next(themeRendering);
      });
      this.initThemeRenderingForm();
      this.themeRenderingForm.patchValue(themeData);
      if (themeData.settings) {
        this.fontSelectedForm.patchValue(themeData.settings.font);
        const converColor = this.covertHexOpacityToRgba(themeData.settings.color);
        this.colorSelectedForm.patchValue(converColor);
        this.integrationForm.patchValue(themeData.settings.integration);
      } else {
        this.themeRenderingForm.patchValue({
          settings: { font: [], color: [], integration: [], defaultFontFamily: '' },
        });
      }
    });
  }
  initThemeRenderingForm(): void {
    this.themeRenderingForm.controls.settings.value.font = this.fontSelectedForm.value;
    this.themeRenderingForm.controls.settings.value.color = this.colorSelectedForm.value;
    this.themeRenderingForm.controls.settings.value.integration = this.integrationForm.value;
    this.themeService.updatedTheme.next(this.themeRenderingForm.value);
  }
  initTextFormGroup(): FormGroup {
    return new FormGroup({
      type: new FormControl('', Validators.required),
      familyCode: new FormControl('', Validators.required),
      style: new FormControl('', Validators.required),
      size: new FormControl(1, [Validators.pattern('^[0-9]*$'), Validators.max(3)]),
      unit: new FormControl('', Validators.required),
      lineHeight: new FormControl(1, [Validators.pattern('^[0-9]*$'), Validators.max(3)]),
      letterSpacing: new FormControl(1, [Validators.pattern('^[0-9]*$'), Validators.max(3)]),
    });
  }
  initColorFormGroup(): FormGroup {
    return this.fb.group({
      type: '',
      dark: this.fb.group({
        color: ['#000000', Validators.maxLength(22)],
        bgColor: ['#000000', Validators.maxLength(22)],
      }),
      light: this.fb.group({
        color: ['#000000', Validators.maxLength(22)],
        bgColor: ['#000000', Validators.maxLength(22)],
      }),
    });
  }
  initDeviceFormGroup(): FormGroup {
    return this.fb.group({
      minwidth: '',
      icon: '',
      baseFontSize: [16],
      default: [true],
    });
  }
  initHtmlFileFormGroup(): FormGroup {
    return this.fb.group({
      html: '',
      name: '',
      thumbnail: {
        path: '',
        stream: null,
      },
    });
  }

  initColorFormArray(): FormArray {
    const colorFormArray = this.fb.array([]);
    this.listOfColor.forEach((element) => {
      const colorFromGroup: FormGroup = this.initColorFormGroup();
      colorFromGroup.patchValue(element);
      colorFormArray.push(colorFromGroup);
    });
    return colorFormArray;
  }
  initTextFormArray(): FormArray {
    const fontFormArray = this.fb.array([]);
    this.listOfFont.forEach((element) => {
      const fontFromGroup: FormGroup = this.initTextFormGroup();
      fontFromGroup.patchValue(element);
      fontFormArray.push(fontFromGroup);
    });
    return fontFormArray;
  }
  initDevicesFormArray(): FormArray {
    const devicesFormArray = this.fb.array([]);
    this.listOfDevices.forEach((element) => {
      const deviceFromGroup: FormGroup = this.initDeviceFormGroup();
      deviceFromGroup.patchValue(element);
      devicesFormArray.push(deviceFromGroup);
    });
    return devicesFormArray;
  }
  initHtmlFilesFormArray(): FormArray {
    const htmlFilesFormArray = this.fb.array([]);
    this.listOfHtmlFiles.forEach((element) => {
      const deviceFromGroup: FormGroup = this.initHtmlFileFormGroup();
      deviceFromGroup.patchValue(element);
      htmlFilesFormArray.push(deviceFromGroup);
    });
    return htmlFilesFormArray;
  }
  showMoreMenu(isshowMore: boolean): void {
    this.showMoreButton = isshowMore;
  }
  onClickChangeDeviceStage(): void {
    this.addDeviceStage = !this.addDeviceStage;
  }
  onClickConfirmAddDevice(): void {
    this.addDeviceStage = !this.addDeviceStage;
    const formGroup = this.fb.group({
      minwidth: this.deviceForm.value,
      icon: EnumThemeDeviceIcon.CUSTOM,
      baseFontSize: 16,
      default: false,
    });
    const index = this.getTheInsertIndex(this.deviceForm.value);
    this.deviceForm.reset(0);
    if (index >= 0) {
      const formArray = this.themeRenderingForm.controls.devices as FormArray;
      formArray.insert(index, formGroup);
      const themeRendering = this.themeRenderingForm.value;
      themeRendering.devices = this.themeRenderingForm.controls.devices.value;
      this.themeService.updatedTheme.next(themeRendering);
    }
  }

  getTheInsertIndex(minwidth: number): number {
    const formArray = this.themeRenderingForm.controls.devices as FormArray;
    const minwidthList = [];
    formArray.controls.forEach((formGroup: FormGroup) => {
      minwidthList.push(formGroup.value.minwidth);
    });
    let indexMinwidth = -1;
    if (!minwidthList.includes(minwidth)) {
      minwidthList.push(minwidth);
      minwidthList.sort(function (a, b) {
        return b - a;
      });
      minwidthList.forEach((element, index) => {
        if (element === minwidth) indexMinwidth = index;
      });
    }
    return indexMinwidth;
  }
  onClickDevices(index: number): void {
    this.themeService.updateSelectedIndex(index);
  }
  onClickSetting(index: number): void {
    this.selectedSetting = index;
  }
  onClickUnSelectSetting(): void {
    this.selectedSetting = -1;
  }
  onClickUnselectPXUnit(index): void {
    this.fontSelectedForm.controls[index].patchValue({
      unit: UnitEnum.PX,
    });
  }
  onClickUnselectEMUnit(index): void {
    this.fontSelectedForm.controls[index].patchValue({
      unit: UnitEnum.EM,
    });
  }
  changeDefaultFontFamily(defaultFontFamily: string): void {
    this.themeRenderingForm.controls.settings.value.defaultFontFamily = defaultFontFamily;
    this.themeService.updatedTheme.next(this.themeRenderingForm.value);
  }
  covertHexOpacityToRgba(colors: IThemeRenderingSettingColors[]): IThemeRenderingSettingColors[] {
    colors.forEach((color) => {
      if (color?.dark?.opacity) {
        color.dark.color = hexToRgba(color.dark.color, color.dark.opacity);
      }
      if (color?.dark?.bgOpacity) {
        color.dark.bgColor = hexToRgba(color.dark.bgColor, color.dark.bgOpacity);
      }
      if (color?.light?.opacity) {
        color.light.color = hexToRgba(color.light.color, color.light.opacity);
      }
      if (color?.light?.bgOpacity) {
        color.light.bgColor = hexToRgba(color.light.bgColor, color.light.bgOpacity);
      }
    });
    return colors;
  }
}
