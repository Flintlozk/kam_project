import gql from 'graphql-tag';

export const GET_LANDING_COMPONENT = gql`
  query getLandingComponent($webPageID: String, $previousWebPageID: String, $componentId: String, $contentId: String) {
    getLandingComponent(webPageID: $webPageID, previousWebPageID: $previousWebPageID, componentId: $componentId, contentId: $contentId) {
      webPageID
      angularHTML
      components {
        isActive
        componentType
        prevId
        ... on ComponentContentManagementLandingRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            pattern {
              _id
              patternUrl
              patternName
              html
              css
            }
            landing {
              _id
              option {
                isView
                isComment
                isPublishDate
                isSocialShare
                isRightContent
                rightContent {
                  type
                  title
                  categoryIds
                  contentSortBy
                  isPinContentFirst
                  isMaxItem
                  maxItemNumber
                  moreTitle
                }
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentTextRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            quillHTMLs {
              quillHTML
              cultureUI
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentLayoutRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            setting {
              column
              gap
            }
            containerSettings {
              border {
                corner {
                  topLeft
                  topRight
                  bottomLeft
                  bottomRight
                }
                color
                opacity
                thickness
                position {
                  left
                  top
                  right
                  bottom
                }
              }
              shadow {
                isShadow
                color
                opacity
                xAxis
                yAxis
                distance
                blur
              }
              hover {
                style
                textHover
              }
              effect {
                scrollEffect
                xAxis
                yAxis
                isStretch
                margin
              }
              background {
                currentStyle
                layoutSettingBackgroundColorForm {
                  color
                  opacity
                }
                layoutSettingBackgroundImageForm {
                  imgUrl
                  position
                  imageScale
                  opacity
                  colorOverlay
                  colorOverlayOpacity
                  width
                  height
                  repeat
                }
                layoutSettingBackgroundVideoForm {
                  videoUrl
                  position
                  playInLoop
                  videoSpeed
                  videoScale
                  opacity
                  colorOverlay
                  colorOverlayOpacity
                  width
                  height
                }
              }
              advance {
                margin {
                  left
                  top
                  right
                  bottom
                }
                padding {
                  left
                  top
                  right
                  bottom
                }
                horizontalPosition
                verticalPosition
              }
              customize {
                cssStyle
                elementId
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentMediaGalleryRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            gallery {
              galleryPatternId
              galleryPatternUrl
              galleryGap
              gallleryList {
                url
                fileType
                title
                setting {
                  generalBackgroundSetting {
                    currentStyle
                    layoutSettingBackgroundColorForm {
                      color
                      opacity
                    }
                    layoutSettingBackgroundImageForm {
                      imgUrl
                      position
                      imageScale
                      opacity
                      colorOverlay
                      colorOverlayOpacity
                      width
                      height
                      repeat
                    }
                    layoutSettingBackgroundVideoForm {
                      videoUrl
                      position
                      playInLoop
                      videoSpeed
                      videoScale
                      opacity
                      colorOverlay
                      colorOverlayOpacity
                      width
                      height
                    }
                  }
                  generalTextSetting {
                    text {
                      isText
                      text {
                        cultureUI
                        title
                        description
                      }
                      isFontDefault
                      isFontIndexDefault
                      isStyleDefault
                      isTextColorDefault
                      isTextOpacityDefault
                      isLineHeightDefault
                      isLetterSpacingDefault
                      fontFamily
                      fontStyle
                      titleFontSize
                      descriptionFontSize
                      textColor
                      textOpacity
                      textAlignment
                      lineHeight
                      letterSpacing
                      textAnimation
                    }
                    overlay {
                      isOverlay
                      isOverlayFullWidth
                      overlayColor
                      overlayOpacity
                      overlayAnimation
                    }
                    horizontalPosition
                    verticalPosition
                    isApplyAll
                  }
                  generalLinkSetting {
                    linkType
                    linkValue
                    parentID
                  }
                }
              }
              galleryMaxHeight
              isChangePattern
            }
            control {
              isPageSlide
              isAutoSlide
              isPageButton
              pageButtonSize
              pageButtonOffset
              isPageArrow
              pageArrowSize
              pageArrowOffset
              slideSpeed
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentButtonRendering {
          _id
          themeOption {
            themeIdentifier
          }
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            buttonSetting {
              background {
                backgroundColor
                backgroundColorOpacity
              }
              padding {
                left
                top
                right
                bottom
              }
            }
            buttonBorder {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            buttonText {
              text
              isFontDefault
              isFontIndexDefault
              isStyleDefault
              isTextColorDefault
              isTextOpacityDefault
              isLineHeightDefault
              isLetterSpacingDefault
              fontFamily
              fontStyle
              fontSize
              textColor
              textOpacity
              textAlignment
              lineHeight
              letterSpacing
              isIcon
              iconCode
              iconBeforeText
              iconSize
              iconColor
              iconColorOpacity
            }
            generalLinkSetting {
              linkType
              linkValue
              parentID
            }
            buttonHover {
              isHover
              buttonHoverColor
              buttonHoverColorOpacity
              borderHoverColor
              borderHoverColorOpacity
              textHoverColor
              textHoverColorOpacity
              textHoverTransform
              hoverEffect
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentContentManagementRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            general {
              pattern {
                _id
                patternName
                patternUrl
                patternStyle {
                  container {
                    gridTemplateColumns
                    gridTemplateRows
                    gridGap
                  }
                  primary {
                    maxContent
                    grid {
                      gridTemplateColumns
                      gridTemplateRows
                      gridGap
                    }
                    status
                  }
                  secondary {
                    maxContent
                    grid {
                      gridTemplateColumns
                      gridTemplateRows
                      gridGap
                    }
                    status
                  }
                  css
                }
              }
              advance {
                display {
                  ... on ContentManagementGeneralDisplayNone {
                    displayType
                  }
                  ... on ContentManagementGeneralDisplayTab {
                    displayType
                    array {
                      title
                      value
                    }
                  }
                  ... on ContentManagementGeneralDisplayLink {
                    displayType
                    displayTitle
                    array {
                      title
                      value
                    }
                  }
                }
                isContentGroup
                bottom {
                  ... on ContentManagementGeneralBottomButton {
                    bottomType
                    name
                    link {
                      linkType
                      linkValue
                      parentID
                    }
                    isNewWindow
                  }
                  ... on ContentManagementGeneralBottomPagination {
                    bottomType
                    type
                    position
                  }
                  ... on ContentManagementGeneralBottomNone {
                    bottomType
                  }
                }
              }
            }
            contents {
              categoryIds
              contentSortBy
              isPinContentFirst
              isShortDescription
              isView
              isPublishedDate
              isShare
            }
            landing {
              _id
              option {
                isView
                isComment
                isPublishDate
                isSocialShare
                isRightContent
                rightContent {
                  type
                  title
                  categoryIds
                  contentSortBy
                  isPinContentFirst
                  isMaxItem
                  maxItemNumber
                  moreTitle
                }
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentMenuRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            source {
              menuGroupId
              sourceType
              parentMenuId
            }
            setting {
              sticky
              animation
              alignment
              style
              icon {
                isIcon
                size
                color {
                  value
                  opacity
                }
                status
                position
              }
              mega {
                size
                color {
                  value
                  opacity
                }
              }
            }
            mobile {
              hamburger {
                icon {
                  iconGroup
                  activeIcon
                  inactiveIcon
                }
                isText
                text
                position
              }
              featureIcon {
                icons
                isSearch
                isLanguage
              }
            }
            level {
              one {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
              two {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
              three {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }

              four {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
      }
    }
  }
`;

export const GET_COMPONENT = gql`
  query getComponent($webPageID: String) {
    getComponent(webPageID: $webPageID) {
      webPageID
      angularHTML
      components {
        isActive
        componentType
        prevId
        ... on ComponentTextRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            quillHTMLs {
              quillHTML
              cultureUI
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentLayoutRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            setting {
              column
              gap
            }
            containerSettings {
              border {
                corner {
                  topLeft
                  topRight
                  bottomLeft
                  bottomRight
                }
                color
                opacity
                thickness
                position {
                  left
                  top
                  right
                  bottom
                }
              }
              shadow {
                isShadow
                color
                opacity
                xAxis
                yAxis
                distance
                blur
              }
              hover {
                style
                textHover
              }
              effect {
                scrollEffect
                xAxis
                yAxis
                isStretch
                margin
              }
              background {
                currentStyle
                layoutSettingBackgroundColorForm {
                  color
                  opacity
                }
                layoutSettingBackgroundImageForm {
                  imgUrl
                  position
                  imageScale
                  opacity
                  colorOverlay
                  colorOverlayOpacity
                  width
                  height
                  repeat
                }
                layoutSettingBackgroundVideoForm {
                  videoUrl
                  position
                  playInLoop
                  videoSpeed
                  videoScale
                  opacity
                  colorOverlay
                  colorOverlayOpacity
                  width
                  height
                }
              }
              advance {
                margin {
                  left
                  top
                  right
                  bottom
                }
                padding {
                  left
                  top
                  right
                  bottom
                }
                horizontalPosition
                verticalPosition
              }
              customize {
                cssStyle
                elementId
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentMediaGalleryRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            gallery {
              galleryPatternId
              galleryPatternUrl
              galleryGap
              gallleryList {
                url
                fileType
                title
                setting {
                  generalBackgroundSetting {
                    currentStyle
                    layoutSettingBackgroundColorForm {
                      color
                      opacity
                    }
                    layoutSettingBackgroundImageForm {
                      imgUrl
                      position
                      imageScale
                      opacity
                      colorOverlay
                      colorOverlayOpacity
                      width
                      height
                      repeat
                    }
                    layoutSettingBackgroundVideoForm {
                      videoUrl
                      position
                      playInLoop
                      videoSpeed
                      videoScale
                      opacity
                      colorOverlay
                      colorOverlayOpacity
                      width
                      height
                    }
                  }
                  generalTextSetting {
                    text {
                      isText
                      text {
                        cultureUI
                        title
                        description
                      }
                      isFontDefault
                      isFontIndexDefault
                      isStyleDefault
                      isTextColorDefault
                      isTextOpacityDefault
                      isLineHeightDefault
                      isLetterSpacingDefault
                      fontFamily
                      fontStyle
                      titleFontSize
                      descriptionFontSize
                      textColor
                      textOpacity
                      textAlignment
                      lineHeight
                      letterSpacing
                      textAnimation
                    }
                    overlay {
                      isOverlay
                      isOverlayFullWidth
                      overlayColor
                      overlayOpacity
                      overlayAnimation
                    }
                    horizontalPosition
                    verticalPosition
                    isApplyAll
                  }
                  generalLinkSetting {
                    linkType
                    linkValue
                    parentID
                  }
                }
              }
              galleryMaxHeight
              isChangePattern
            }
            control {
              isPageSlide
              isAutoSlide
              isPageButton
              pageButtonSize
              pageButtonOffset
              isPageArrow
              pageArrowSize
              pageArrowOffset
              slideSpeed
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ShoppingCartRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          layoutID
          layoutPosition
          isActive
          prevId
          options {
            pattern {
              type
              advanceSetting {
                options
                button {
                  name
                  openType
                  link {
                    linkType
                    linkValue
                    parentID
                  }
                }
                pagination {
                  type
                }
              }
            }
          }
        }
        ... on ComponentButtonRendering {
          _id
          themeOption {
            themeIdentifier
          }
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            buttonSetting {
              background {
                backgroundColor
                backgroundColorOpacity
              }
              padding {
                left
                top
                right
                bottom
              }
            }
            buttonBorder {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            buttonText {
              text
              isFontDefault
              isFontIndexDefault
              isStyleDefault
              isTextColorDefault
              isTextOpacityDefault
              isLineHeightDefault
              isLetterSpacingDefault
              fontFamily
              fontStyle
              fontSize
              textColor
              textOpacity
              textAlignment
              lineHeight
              letterSpacing
              isIcon
              iconCode
              iconBeforeText
              iconSize
              iconColor
              iconColorOpacity
            }
            generalLinkSetting {
              linkType
              linkValue
              parentID
            }
            buttonHover {
              isHover
              buttonHoverColor
              buttonHoverColorOpacity
              borderHoverColor
              borderHoverColorOpacity
              textHoverColor
              textHoverColorOpacity
              textHoverTransform
              hoverEffect
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentContentManagementRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            general {
              pattern {
                _id
                patternName
                patternUrl
                patternStyle {
                  container {
                    gridTemplateColumns
                    gridTemplateRows
                    gridGap
                  }
                  primary {
                    maxContent
                    grid {
                      gridTemplateColumns
                      gridTemplateRows
                      gridGap
                    }
                    status
                  }
                  secondary {
                    maxContent
                    grid {
                      gridTemplateColumns
                      gridTemplateRows
                      gridGap
                    }
                    status
                  }
                  css
                }
              }
              advance {
                display {
                  ... on ContentManagementGeneralDisplayNone {
                    displayType
                  }
                  ... on ContentManagementGeneralDisplayTab {
                    displayType
                    array {
                      title
                      value
                    }
                  }
                  ... on ContentManagementGeneralDisplayLink {
                    displayType
                    displayTitle
                    array {
                      title
                      value
                    }
                  }
                }
                isContentGroup
                bottom {
                  ... on ContentManagementGeneralBottomButton {
                    bottomType
                    name
                    link {
                      linkType
                      linkValue
                      parentID
                    }
                    isNewWindow
                  }
                  ... on ContentManagementGeneralBottomPagination {
                    bottomType
                    type
                    position
                  }
                  ... on ContentManagementGeneralBottomNone {
                    bottomType
                  }
                }
              }
            }
            contents {
              categoryIds
              contentSortBy
              isPinContentFirst
              isShortDescription
              isView
              isPublishedDate
              isShare
            }
            landing {
              _id
              option {
                isView
                isComment
                isPublishDate
                isSocialShare
                isRightContent
                rightContent {
                  type
                  title
                  categoryIds
                  contentSortBy
                  isPinContentFirst
                  isMaxItem
                  maxItemNumber
                  moreTitle
                }
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentMenuRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            source {
              menuGroupId
              sourceType
              parentMenuId
            }
            setting {
              sticky
              animation
              alignment
              style
              icon {
                isIcon
                size
                color {
                  value
                  opacity
                }
                status
                position
              }
              mega {
                size
                color {
                  value
                  opacity
                }
              }
            }
            mobile {
              hamburger {
                icon {
                  iconGroup
                  activeIcon
                  inactiveIcon
                }
                isText
                text
                position
              }
              featureIcon {
                icons
                isSearch
                isLanguage
              }
            }
            level {
              one {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
              two {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
              three {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }

              four {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
      }
    }
  }
`;

export const GET_THEME_COMPONENTS = gql`
  query getThemeComponents($webPageThemelayoutIndex: InputWebPageThemeLayoutIndex) {
    getThemeComponents(webPageThemelayoutIndex: $webPageThemelayoutIndex) {
      angularHTML
      themeComponents {
        isActive
        componentType
        prevId
        ... on ComponentLayoutRendering {
          _id
          componentType
          themeOption {
            themeIdentifier
          }
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            setting {
              column
              gap
            }
            containerSettings {
              border {
                corner {
                  topLeft
                  topRight
                  bottomLeft
                  bottomRight
                }
                color
                opacity
                thickness
                position {
                  left
                  top
                  right
                  bottom
                }
              }
              shadow {
                isShadow
                color
                opacity
                xAxis
                yAxis
                distance
                blur
              }
              hover {
                style
                textHover
              }
              effect {
                scrollEffect
                xAxis
                yAxis
                isStretch
                margin
              }
              background {
                currentStyle
                layoutSettingBackgroundColorForm {
                  color
                  opacity
                }
                layoutSettingBackgroundImageForm {
                  imgUrl
                  position
                  imageScale
                  opacity
                  colorOverlay
                  colorOverlayOpacity
                  width
                  height
                  repeat
                }
                layoutSettingBackgroundVideoForm {
                  videoUrl
                  position
                  playInLoop
                  videoSpeed
                  videoScale
                  opacity
                  colorOverlay
                  colorOverlayOpacity
                  width
                  height
                }
              }
              advance {
                margin {
                  left
                  top
                  right
                  bottom
                }
                padding {
                  left
                  top
                  right
                  bottom
                }
                horizontalPosition
                verticalPosition
              }
              customize {
                cssStyle
                elementId
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentTextRendering {
          _id
          themeOption {
            themeIdentifier
          }
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            quillHTMLs {
              quillHTML
              cultureUI
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentMediaGalleryRendering {
          _id
          themeOption {
            themeIdentifier
          }
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            gallery {
              galleryPatternId
              galleryPatternUrl
              galleryGap
              gallleryList {
                url
                fileType
                title
                setting {
                  generalBackgroundSetting {
                    currentStyle
                    layoutSettingBackgroundColorForm {
                      color
                      opacity
                    }
                    layoutSettingBackgroundImageForm {
                      imgUrl
                      position
                      imageScale
                      opacity
                      colorOverlay
                      colorOverlayOpacity
                      width
                      height
                      repeat
                    }
                    layoutSettingBackgroundVideoForm {
                      videoUrl
                      position
                      playInLoop
                      videoSpeed
                      videoScale
                      opacity
                      colorOverlay
                      colorOverlayOpacity
                      width
                      height
                    }
                  }
                  generalTextSetting {
                    text {
                      isText
                      text {
                        cultureUI
                        title
                        description
                      }
                      isFontDefault
                      isFontIndexDefault
                      isStyleDefault
                      isTextColorDefault
                      isTextOpacityDefault
                      isLineHeightDefault
                      isLetterSpacingDefault
                      fontFamily
                      fontStyle
                      titleFontSize
                      descriptionFontSize
                      textColor
                      textOpacity
                      textAlignment
                      lineHeight
                      letterSpacing
                      textAnimation
                    }
                    overlay {
                      isOverlay
                      isOverlayFullWidth
                      overlayColor
                      overlayOpacity
                      overlayAnimation
                    }
                    horizontalPosition
                    verticalPosition
                    isApplyAll
                  }
                  generalLinkSetting {
                    linkType
                    linkValue
                    parentID
                  }
                }
              }
              galleryMaxHeight
              isChangePattern
            }
            control {
              isPageSlide
              isAutoSlide
              isPageButton
              pageButtonSize
              pageButtonOffset
              isPageArrow
              pageArrowSize
              pageArrowOffset
              slideSpeed
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentButtonRendering {
          _id
          themeOption {
            themeIdentifier
          }
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            buttonSetting {
              background {
                backgroundColor
                backgroundColorOpacity
              }
              padding {
                left
                top
                right
                bottom
              }
            }
            buttonBorder {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            buttonText {
              text
              isFontDefault
              isFontIndexDefault
              isStyleDefault
              isTextColorDefault
              isTextOpacityDefault
              isLineHeightDefault
              isLetterSpacingDefault
              fontFamily
              fontStyle
              fontSize
              textColor
              textOpacity
              textAlignment
              lineHeight
              letterSpacing
              isIcon
              iconCode
              iconBeforeText
              iconSize
              iconColor
              iconColorOpacity
            }
            generalLinkSetting {
              linkType
              linkValue
              parentID
            }
            buttonHover {
              isHover
              buttonHoverColor
              buttonHoverColorOpacity
              borderHoverColor
              borderHoverColorOpacity
              textHoverColor
              textHoverColorOpacity
              textHoverTransform
              hoverEffect
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentContentManagementRendering {
          _id
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            hover {
              style
              textHover
            }
            effect {
              scrollEffect
              xAxis
              yAxis
              isStretch
              margin
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            general {
              pattern {
                _id
                patternName
                patternUrl
                patternStyle {
                  container {
                    gridTemplateColumns
                    gridTemplateRows
                    gridGap
                  }
                  primary {
                    maxContent
                    grid {
                      gridTemplateColumns
                      gridTemplateRows
                      gridGap
                    }
                    status
                  }
                  secondary {
                    maxContent
                    grid {
                      gridTemplateColumns
                      gridTemplateRows
                      gridGap
                    }
                    status
                  }
                  css
                }
              }
              advance {
                display {
                  ... on ContentManagementGeneralDisplayNone {
                    displayType
                  }
                  ... on ContentManagementGeneralDisplayTab {
                    displayType
                    array {
                      title
                      value
                    }
                  }
                  ... on ContentManagementGeneralDisplayLink {
                    displayType
                    displayTitle
                    array {
                      title
                      value
                    }
                  }
                }
                isContentGroup
                bottom {
                  ... on ContentManagementGeneralBottomButton {
                    bottomType
                    name
                    link {
                      linkType
                      linkValue
                      parentID
                    }
                    isNewWindow
                  }
                  ... on ContentManagementGeneralBottomPagination {
                    bottomType
                    type
                    position
                  }
                  ... on ContentManagementGeneralBottomNone {
                    bottomType
                  }
                }
              }
            }
            contents {
              categoryIds
              contentSortBy
              isPinContentFirst
              isShortDescription
              isView
              isPublishedDate
              isShare
            }
            landing {
              _id
              option {
                isView
                isComment
                isPublishDate
                isSocialShare
                isRightContent
                rightContent {
                  type
                  title
                  categoryIds
                  contentSortBy
                  isPinContentFirst
                  isMaxItem
                  maxItemNumber
                  moreTitle
                }
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
        ... on ComponentMenuRendering {
          _id
          themeOption {
            themeIdentifier
          }
          componentType
          commonSettings {
            border {
              corner {
                topLeft
                topRight
                bottomLeft
                bottomRight
              }
              color
              opacity
              thickness
              position {
                left
                top
                right
                bottom
              }
            }
            shadow {
              isShadow
              color
              opacity
              xAxis
              yAxis
              distance
              blur
            }
            background {
              currentStyle
              layoutSettingBackgroundColorForm {
                color
                opacity
              }
              layoutSettingBackgroundImageForm {
                imgUrl
                position
                imageScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
                repeat
              }
              layoutSettingBackgroundVideoForm {
                videoUrl
                position
                playInLoop
                videoSpeed
                videoScale
                opacity
                colorOverlay
                colorOverlayOpacity
                width
                height
              }
            }
            advance {
              margin {
                left
                top
                right
                bottom
              }
              padding {
                left
                top
                right
                bottom
              }
              horizontalPosition
              verticalPosition
            }
            customize {
              cssStyle
              elementId
            }
            className
          }
          options {
            source {
              menuGroupId
              sourceType
              parentMenuId
            }
            setting {
              sticky
              animation
              alignment
              style
              icon {
                isIcon
                size
                color {
                  value
                  opacity
                }
                status
                position
              }
              mega {
                size
                color {
                  value
                  opacity
                }
              }
            }
            mobile {
              hamburger {
                icon {
                  iconGroup
                  activeIcon
                  inactiveIcon
                }
                isText
                text
                position
              }
              featureIcon {
                icons
                isSearch
                isLanguage
              }
            }
            level {
              one {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
              two {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
              three {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }

              four {
                size
                style
                text {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                backGround {
                  normal {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  hover {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                  active {
                    style
                    color {
                      value
                      opacity
                    }
                    gradientColor {
                      type
                      colors
                    }
                    image
                  }
                }
                shadow {
                  isShadow
                  color
                  opacity
                  xAxis
                  yAxis
                  distance
                  blur
                }
                textAnimation
                backgroundAnimation
              }
            }
          }
          layoutID
          layoutPosition
          isActive
          prevId
        }
      }
    }
  }
`;
