export interface IButtonStyle {
  container: IButtonContainerStyle;
  settingBorder: IButtonSettingBorderStyle;
  text: IButtonTextStyle;
  icon: IButtonIconStyle;
}

export interface IButtonContainerStyle {
  display: string;
  justifyContent: string;
  alignItems: string;
}

export interface IButtonSettingBorderStyle extends IButtonBorderStyle {
  backgroundColor: string;
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
}

export interface IButtonBorderStyle {
  borderStyle: string;
  borderLeftWidth: string;
  borderRightWidth: string;
  borderTopWidth: string;
  borderBottomWidth: string;
  borderColor: string;
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
}

export interface IButtonTextStyle {
  fontStyle: string;
  fontWeight: string;
  fontSize: string;
  textDecoration: string;
  color: string;
}

export interface IButtonIconStyle {
  fontSize: string;
  color: string;
}
