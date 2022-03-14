import { gql } from '@apollo/client/core';

export const ComponentTypeDefs = gql`
  type LayoutSettingBorderCorner {
    topLeft: Int
    topRight: Int
    bottomLeft: Int
    bottomRight: Int
  }
  input InputLayoutSettingBorderCorner {
    topLeft: Int
    topRight: Int
    bottomLeft: Int
    bottomRight: Int
  }

  type LayoutSettingBorderPosition {
    left: Boolean
    top: Boolean
    right: Boolean
    bottom: Boolean
  }
  input InputLayoutSettingBorderPosition {
    left: Boolean
    top: Boolean
    right: Boolean
    bottom: Boolean
  }

  type LayoutSettingBorder {
    corner: LayoutSettingBorderCorner
    color: String
    opacity: Int
    thickness: Int
    position: LayoutSettingBorderPosition
  }
  input InputLayoutSettingBorder {
    corner: InputLayoutSettingBorderCorner
    color: String
    opacity: Int
    thickness: Int
    position: InputLayoutSettingBorderPosition
  }

  type LayoutSettingShadow {
    isShadow: Boolean
    color: String
    opacity: Int
    xAxis: Int
    yAxis: Int
    distance: Int
    blur: Int
  }
  input InputLayoutSettingShadow {
    isShadow: Boolean
    color: String
    opacity: Int
    xAxis: Int
    yAxis: Int
    distance: Int
    blur: Int
  }

  type LayoutSettingHover {
    style: String
    textHover: String
  }
  input InputLayoutSettingHover {
    style: String
    textHover: String
  }

  type LayoutDesignEffect {
    scrollEffect: String
    xAxis: Int
    yAxis: Int
    isStretch: Boolean
    margin: Int
  }
  input InputLayoutDesignEffect {
    scrollEffect: String
    xAxis: Int
    yAxis: Int
    isStretch: Boolean
    margin: Int
  }

  type LayoutSettingBackgroundColor {
    color: String
    opacity: Int
  }
  input InputLayoutSettingBackgroundColor {
    color: String
    opacity: Int
  }

  type LayoutSettingBackgroundImage {
    imgUrl: String
    position: String
    imageScale: String
    opacity: Int
    colorOverlay: String
    colorOverlayOpacity: Int
    width: Int
    height: Int
    repeat: Boolean
  }
  input InputLayoutSettingBackgroundImage {
    imgUrl: String
    position: String
    imageScale: String
    opacity: Int
    colorOverlay: String
    colorOverlayOpacity: Int
    width: Int
    height: Int
    repeat: Boolean
  }

  type LayoutSettingBackgroundVideo {
    videoUrl: String
    position: String
    playInLoop: Boolean
    videoSpeed: Int
    videoScale: String
    opacity: Int
    colorOverlay: String
    colorOverlayOpacity: Int
    width: Int
    height: Int
  }
  input InputLayoutSettingBackgroundVideo {
    videoUrl: String
    position: String
    playInLoop: Boolean
    videoSpeed: Int
    videoScale: String
    opacity: Int
    colorOverlay: String
    colorOverlayOpacity: Int
    width: Int
    height: Int
  }

  type LayoutSettingBackground {
    currentStyle: String
    layoutSettingBackgroundColorForm: LayoutSettingBackgroundColor
    layoutSettingBackgroundImageForm: LayoutSettingBackgroundImage
    layoutSettingBackgroundVideoForm: LayoutSettingBackgroundVideo
  }
  input InputLayoutSettingBackground {
    currentStyle: String
    layoutSettingBackgroundColorForm: InputLayoutSettingBackgroundColor
    layoutSettingBackgroundImageForm: InputLayoutSettingBackgroundImage
    layoutSettingBackgroundVideoForm: InputLayoutSettingBackgroundVideo
  }

  type LayoutSettingAdvanceDetail {
    left: Int
    top: Int
    right: Int
    bottom: Int
  }
  input InputLayoutSettingAdvanceDetail {
    left: Int
    top: Int
    right: Int
    bottom: Int
  }

  type LayoutSettingAdvance {
    margin: LayoutSettingAdvanceDetail
    padding: LayoutSettingAdvanceDetail
    horizontalPosition: String
    verticalPosition: String
  }
  input InputLayoutSettingAdvance {
    margin: InputLayoutSettingAdvanceDetail
    padding: InputLayoutSettingAdvanceDetail
    horizontalPosition: String
    verticalPosition: String
  }

  type LayoutSettingCustomize {
    cssStyle: String
    elementId: String
  }
  input InputLayoutSettingCustomize {
    cssStyle: String
    elementId: String
  }
  type CommonSettings {
    border: LayoutSettingBorder
    shadow: LayoutSettingShadow
    hover: LayoutSettingHover
    effect: LayoutDesignEffect
    background: LayoutSettingBackground
    advance: LayoutSettingAdvance
    customize: LayoutSettingCustomize
    className: String
  }
  input InputCommonSettings {
    border: InputLayoutSettingBorder
    shadow: InputLayoutSettingShadow
    hover: InputLayoutSettingHover
    effect: InputLayoutDesignEffect
    background: InputLayoutSettingBackground
    advance: InputLayoutSettingAdvance
    customize: InputLayoutSettingCustomize
  }
`;
