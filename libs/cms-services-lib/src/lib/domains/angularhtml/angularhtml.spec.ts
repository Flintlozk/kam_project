import {
  EContentEditorComponentType,
  EContentSectionType,
  EnumGenerateMode,
  EnumLanguageCultureUI,
  IContentEditor,
  IContentEditorComponentText,
  IRenderingComponentData,
} from '@reactor-room/cms-models-lib';
import * as domain from './angularhtml.domain';

describe('transformComponentsToAngularHTML', () => {
  const sortedPageComponent = [
    {
      isActive: false,
      _id: '61433a179112b42c06645781',
      componentType: 'cms-next-cms-text-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
          color: '#aa3c3c',
          opacity: 100,
          thickness: 8,
          position: {
            left: true,
            top: true,
            right: true,
            bottom: true,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: {
          style: '',
          textHover: '',
        },
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#61433a179112b42c06645784{}',
          elementId: '61433a179112b42c06645784',
        },
        className: 'test',
      },
      options: {
        quillHTMLs: [
          {
            cultureUI: EnumLanguageCultureUI.TH,
            quillHTML: '',
          },
        ],
      },
      orderNumber: 0,
      layoutID: null,
      layoutPosition: null,
    },
    {
      isActive: false,
      _id: '61433a179112b42c06645784',
      componentType: 'cms-next-cms-text-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
          color: '#aa3c3c',
          opacity: 100,
          thickness: 8,
          position: {
            left: true,
            top: true,
            right: true,
            bottom: true,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: {
          style: '',
          textHover: '',
        },
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#61433a179112b42c06645784{}',
          elementId: '61433a179112b42c06645784',
        },
        className: 'test',
      },
      options: {
        quillHTMLs: [
          {
            cultureUI: EnumLanguageCultureUI.TH,
            quillHTML: '',
          },
        ],
      },
      orderNumber: 1,
      layoutID: null,
      layoutPosition: null,
    },
  ] as IRenderingComponentData[];
  const pageComponentWithLayout = [
    {
      isActive: false,
      _id: '61482f61d2bd7f23e1926580',
      componentType: 'cms-next-cms-layout-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 0,
            topRight: 0,
            bottomLeft: 0,
            bottomRight: 0,
          },
          color: '',
          opacity: 100,
          thickness: 0,
          position: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: null,
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 70,
            top: 20,
            right: 70,
            bottom: 20,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#layout-1632120619432{}',
          elementId: 'layout-1632120619432',
        },
        className: 'test',
      },
      options: {
        setting: {
          column: 'repeat(2, 1fr)',
          gap: 20,
        },
        containerSettings: [
          {
            border: {
              corner: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
              color: '',
              opacity: 100,
              thickness: 0,
              position: {
                left: false,
                top: false,
                right: false,
                bottom: false,
              },
            },
            shadow: {
              isShadow: false,
              color: '',
              opacity: 100,
              xAxis: 0,
              yAxis: 0,
              distance: 0,
              blur: 0,
            },
            hover: null,
            effect: null,
            background: {
              currentStyle: 'COLOR',
              layoutSettingBackgroundColorForm: {
                color: '',
                opacity: 100,
              },
              layoutSettingBackgroundImageForm: {
                imgUrl: '',
                position: 'center center',
                imageScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
                repeat: false,
              },
              layoutSettingBackgroundVideoForm: {
                videoUrl: '',
                position: 'center center',
                playInLoop: false,
                videoSpeed: 1,
                videoScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
              },
            },
            advance: {
              margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              horizontalPosition: 'flex-start',
              verticalPosition: 'flex-start',
            },
            customize: {
              cssStyle: '',
              elementId: '',
            },
            className: 'test',
          },
          {
            border: {
              corner: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
              color: '',
              opacity: 100,
              thickness: 0,
              position: {
                left: false,
                top: false,
                right: false,
                bottom: false,
              },
            },
            shadow: {
              isShadow: false,
              color: '',
              opacity: 100,
              xAxis: 0,
              yAxis: 0,
              distance: 0,
              blur: 0,
            },
            hover: null,
            effect: null,
            background: {
              currentStyle: 'COLOR',
              layoutSettingBackgroundColorForm: {
                color: '',
                opacity: 100,
              },
              layoutSettingBackgroundImageForm: {
                imgUrl: '',
                position: 'center center',
                imageScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
                repeat: false,
              },
              layoutSettingBackgroundVideoForm: {
                videoUrl: '',
                position: 'center center',
                playInLoop: false,
                videoSpeed: 1,
                videoScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
              },
            },
            advance: {
              margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              horizontalPosition: 'flex-start',
              verticalPosition: 'flex-start',
            },
            customize: {
              cssStyle: '',
              elementId: '',
            },
            className: 'test',
          },
          {
            border: {
              corner: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
              color: '',
              opacity: 100,
              thickness: 0,
              position: {
                left: false,
                top: false,
                right: false,
                bottom: false,
              },
            },
            shadow: {
              isShadow: false,
              color: '',
              opacity: 100,
              xAxis: 0,
              yAxis: 0,
              distance: 0,
              blur: 0,
            },
            hover: null,
            effect: null,
            background: {
              currentStyle: 'COLOR',
              layoutSettingBackgroundColorForm: {
                color: '',
                opacity: 100,
              },
              layoutSettingBackgroundImageForm: {
                imgUrl: '',
                position: 'center center',
                imageScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
                repeat: false,
              },
              layoutSettingBackgroundVideoForm: {
                videoUrl: '',
                position: 'center center',
                playInLoop: false,
                videoSpeed: 1,
                videoScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
              },
            },
            advance: {
              margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              horizontalPosition: 'flex-start',
              verticalPosition: 'flex-start',
            },
            customize: {
              cssStyle: '',
              elementId: '',
            },
            className: 'test',
          },
          {
            border: {
              corner: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
              color: '',
              opacity: 100,
              thickness: 0,
              position: {
                left: false,
                top: false,
                right: false,
                bottom: false,
              },
            },
            shadow: {
              isShadow: false,
              color: '',
              opacity: 100,
              xAxis: 0,
              yAxis: 0,
              distance: 0,
              blur: 0,
            },
            hover: null,
            effect: null,
            background: {
              currentStyle: 'COLOR',
              layoutSettingBackgroundColorForm: {
                color: '',
                opacity: 100,
              },
              layoutSettingBackgroundImageForm: {
                imgUrl: '',
                position: 'center center',
                imageScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
                repeat: false,
              },
              layoutSettingBackgroundVideoForm: {
                videoUrl: '',
                position: 'center center',
                playInLoop: false,
                videoSpeed: 1,
                videoScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
              },
            },
            advance: {
              margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              horizontalPosition: 'flex-start',
              verticalPosition: 'flex-start',
            },
            customize: {
              cssStyle: '',
              elementId: '',
            },
            className: 'test',
          },
        ],
      },
      orderNumber: 0,
      layoutID: null,
      layoutPosition: null,
    },
    {
      isActive: false,
      _id: '61433a179112b42c06645781',
      componentType: 'cms-next-cms-text-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
          color: '#aa3c3c',
          opacity: 100,
          thickness: 8,
          position: {
            left: true,
            top: true,
            right: true,
            bottom: true,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: {
          style: '',
          textHover: '',
        },
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#61433a179112b42c06645784{}',
          elementId: '61433a179112b42c06645784',
        },
        className: 'test',
      },
      options: {
        quillHTMLs: [
          {
            cultureUI: EnumLanguageCultureUI.TH,
            quillHTML: '',
          },
        ],
      },
      orderNumber: 1,
      layoutID: '61482f61d2bd7f23e1926580',
      layoutPosition: 0,
    },
    {
      isActive: false,
      _id: '61433a179112b42c06645784',
      componentType: 'cms-next-cms-text-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
          color: '#aa3c3c',
          opacity: 100,
          thickness: 8,
          position: {
            left: true,
            top: true,
            right: true,
            bottom: true,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: {
          style: '',
          textHover: '',
        },
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#61433a179112b42c06645784{}',
          elementId: '61433a179112b42c06645784',
        },
        className: 'test',
      },
      options: {
        quillHTMLs: [
          {
            cultureUI: EnumLanguageCultureUI.TH,
            quillHTML: '',
          },
        ],
      },
      orderNumber: 2,
      layoutID: '61482f61d2bd7f23e1926580',
      layoutPosition: 1,
    },
  ] as IRenderingComponentData[];
  const pageComponentWithLayout2 = [
    {
      isActive: false,
      _id: '61482f61d2bd7f23e1926580',
      componentType: 'cms-next-cms-layout-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 0,
            topRight: 0,
            bottomLeft: 0,
            bottomRight: 0,
          },
          color: '',
          opacity: 100,
          thickness: 0,
          position: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: null,
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 70,
            top: 20,
            right: 70,
            bottom: 20,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#layout-1632120619432{}',
          elementId: 'layout-1632120619432',
        },
        className: 'test',
      },
      options: {
        setting: {
          column: 'repeat(2, 1fr)',
          gap: 20,
        },
        containerSettings: [
          {
            border: {
              corner: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
              color: '',
              opacity: 100,
              thickness: 0,
              position: {
                left: false,
                top: false,
                right: false,
                bottom: false,
              },
            },
            shadow: {
              isShadow: false,
              color: '',
              opacity: 100,
              xAxis: 0,
              yAxis: 0,
              distance: 0,
              blur: 0,
            },
            hover: null,
            effect: null,
            background: {
              currentStyle: 'COLOR',
              layoutSettingBackgroundColorForm: {
                color: '',
                opacity: 100,
              },
              layoutSettingBackgroundImageForm: {
                imgUrl: '',
                position: 'center center',
                imageScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
                repeat: false,
              },
              layoutSettingBackgroundVideoForm: {
                videoUrl: '',
                position: 'center center',
                playInLoop: false,
                videoSpeed: 1,
                videoScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
              },
            },
            advance: {
              margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              horizontalPosition: 'flex-start',
              verticalPosition: 'flex-start',
            },
            customize: {
              cssStyle: '',
              elementId: '',
            },
            className: 'test',
          },
          {
            border: {
              corner: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
              color: '',
              opacity: 100,
              thickness: 0,
              position: {
                left: false,
                top: false,
                right: false,
                bottom: false,
              },
            },
            shadow: {
              isShadow: false,
              color: '',
              opacity: 100,
              xAxis: 0,
              yAxis: 0,
              distance: 0,
              blur: 0,
            },
            hover: null,
            effect: null,
            background: {
              currentStyle: 'COLOR',
              layoutSettingBackgroundColorForm: {
                color: '',
                opacity: 100,
              },
              layoutSettingBackgroundImageForm: {
                imgUrl: '',
                position: 'center center',
                imageScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
                repeat: false,
              },
              layoutSettingBackgroundVideoForm: {
                videoUrl: '',
                position: 'center center',
                playInLoop: false,
                videoSpeed: 1,
                videoScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
              },
            },
            advance: {
              margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              horizontalPosition: 'flex-start',
              verticalPosition: 'flex-start',
            },
            customize: {
              cssStyle: '',
              elementId: '',
            },
            className: 'test',
          },
          {
            border: {
              corner: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
              color: '',
              opacity: 100,
              thickness: 0,
              position: {
                left: false,
                top: false,
                right: false,
                bottom: false,
              },
            },
            shadow: {
              isShadow: false,
              color: '',
              opacity: 100,
              xAxis: 0,
              yAxis: 0,
              distance: 0,
              blur: 0,
            },
            hover: null,
            effect: null,
            background: {
              currentStyle: 'COLOR',
              layoutSettingBackgroundColorForm: {
                color: '',
                opacity: 100,
              },
              layoutSettingBackgroundImageForm: {
                imgUrl: '',
                position: 'center center',
                imageScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
                repeat: false,
              },
              layoutSettingBackgroundVideoForm: {
                videoUrl: '',
                position: 'center center',
                playInLoop: false,
                videoSpeed: 1,
                videoScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
              },
            },
            advance: {
              margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              horizontalPosition: 'flex-start',
              verticalPosition: 'flex-start',
            },
            customize: {
              cssStyle: '',
              elementId: '',
            },
            className: 'test',
          },
          {
            border: {
              corner: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
              color: '',
              opacity: 100,
              thickness: 0,
              position: {
                left: false,
                top: false,
                right: false,
                bottom: false,
              },
            },
            shadow: {
              isShadow: false,
              color: '',
              opacity: 100,
              xAxis: 0,
              yAxis: 0,
              distance: 0,
              blur: 0,
            },
            hover: null,
            effect: null,
            background: {
              currentStyle: 'COLOR',
              layoutSettingBackgroundColorForm: {
                color: '',
                opacity: 100,
              },
              layoutSettingBackgroundImageForm: {
                imgUrl: '',
                position: 'center center',
                imageScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
                repeat: false,
              },
              layoutSettingBackgroundVideoForm: {
                videoUrl: '',
                position: 'center center',
                playInLoop: false,
                videoSpeed: 1,
                videoScale: 'unset',
                opacity: 100,
                colorOverlay: '',
                colorOverlayOpacity: 100,
                width: null,
                height: null,
              },
            },
            advance: {
              margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              horizontalPosition: 'flex-start',
              verticalPosition: 'flex-start',
            },
            customize: {
              cssStyle: '',
              elementId: '',
            },
            className: 'test',
          },
        ],
      },
      orderNumber: 0,
      layoutID: null,
      layoutPosition: null,
    },
    {
      isActive: false,
      _id: '61433a179112b42c06645782',
      componentType: 'cms-next-cms-text-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
          color: '#aa3c3c',
          opacity: 100,
          thickness: 8,
          position: {
            left: true,
            top: true,
            right: true,
            bottom: true,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: {
          style: '',
          textHover: '',
        },
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#61433a179112b42c06645784{}',
          elementId: '61433a179112b42c06645784',
        },
        className: 'test',
      },
      options: {
        quillHTMLs: [
          {
            cultureUI: EnumLanguageCultureUI.TH,
            quillHTML: '',
          },
        ],
      },
      orderNumber: 1,
      layoutID: '61482f61d2bd7f23e1926580',
      layoutPosition: 0,
    },
    {
      isActive: false,
      _id: '61433a179112b42c06645781',
      componentType: 'cms-next-cms-text-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
          color: '#aa3c3c',
          opacity: 100,
          thickness: 8,
          position: {
            left: true,
            top: true,
            right: true,
            bottom: true,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: {
          style: '',
          textHover: '',
        },
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#61433a179112b42c06645784{}',
          elementId: '61433a179112b42c06645784',
        },
        className: 'test',
      },
      options: {
        quillHTMLs: [
          {
            cultureUI: EnumLanguageCultureUI.TH,
            quillHTML: '',
          },
        ],
      },
      orderNumber: 1,
      layoutID: '61482f61d2bd7f23e1926580',
      layoutPosition: 0,
    },
    {
      isActive: false,
      _id: '61433a179112b42c06645784',
      componentType: 'cms-next-cms-text-rendering',
      commonSettings: {
        border: {
          corner: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
          color: '#aa3c3c',
          opacity: 100,
          thickness: 8,
          position: {
            left: true,
            top: true,
            right: true,
            bottom: true,
          },
        },
        shadow: {
          isShadow: false,
          color: '',
          opacity: 100,
          xAxis: 0,
          yAxis: 0,
          distance: 0,
          blur: 0,
        },
        hover: {
          style: '',
          textHover: '',
        },
        effect: null,
        background: {
          currentStyle: 'COLOR',
          layoutSettingBackgroundColorForm: {
            color: '',
            opacity: 100,
          },
          layoutSettingBackgroundImageForm: {
            imgUrl: '',
            position: 'center center',
            imageScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
            repeat: false,
          },
          layoutSettingBackgroundVideoForm: {
            videoUrl: '',
            position: 'center center',
            playInLoop: false,
            videoSpeed: 1,
            videoScale: 'unset',
            opacity: 100,
            colorOverlay: '',
            colorOverlayOpacity: 100,
            width: null,
            height: null,
          },
        },
        advance: {
          margin: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          padding: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          horizontalPosition: 'flex-start',
          verticalPosition: 'flex-start',
        },
        customize: {
          cssStyle: '#61433a179112b42c06645784{}',
          elementId: '61433a179112b42c06645784',
        },
        className: 'test',
      },
      options: {
        quillHTMLs: [
          {
            cultureUI: EnumLanguageCultureUI.TH,
            quillHTML: '',
          },
        ],
      },
      orderNumber: 3,
      layoutID: null,
      layoutPosition: null,
    },
  ] as IRenderingComponentData[];
  const angularHTML =
    '<cms-next-cms-text-rendering *cmsNextEmbeddedView class="cms-component test" id="61433a179112b42c06645781" column="null"></cms-next-cms-text-rendering>' +
    '<cms-next-cms-text-rendering *cmsNextEmbeddedView class="cms-component test" id="61433a179112b42c06645784" column="null"></cms-next-cms-text-rendering>';
  const angularHTMLWithLayout =
    '<cms-next-cms-layout-rendering *cmsNextEmbeddedView class="cms-component test" id="61482f61d2bd7f23e1926580">' +
    '<cms-next-cms-text-rendering *cmsNextEmbeddedView class="cms-component test" id="61433a179112b42c06645781" column="0"></cms-next-cms-text-rendering>' +
    '<cms-next-cms-text-rendering *cmsNextEmbeddedView class="cms-component test" id="61433a179112b42c06645784" column="1"></cms-next-cms-text-rendering>' +
    '</cms-next-cms-layout-rendering>';
  const angularHTMLWithLayout2 =
    '<cms-next-cms-layout-rendering *cmsNextEmbeddedView class="cms-component test" id="61482f61d2bd7f23e1926580">' +
    '<cms-next-cms-text-rendering *cmsNextEmbeddedView class="cms-component test" id="61433a179112b42c06645782" column="0"></cms-next-cms-text-rendering>' +
    '<cms-next-cms-text-rendering *cmsNextEmbeddedView class="cms-component test" id="61433a179112b42c06645781" column="0"></cms-next-cms-text-rendering>' +
    '</cms-next-cms-layout-rendering>' +
    '<cms-next-cms-text-rendering *cmsNextEmbeddedView class="cms-component test" id="61433a179112b42c06645784" column="null"></cms-next-cms-text-rendering>';
  //have the same propblem with htmlsanitize
  test('transform to angular html', async () => {
    const result = await domain.transformComponentsToAngularHTML(sortedPageComponent, EnumGenerateMode.PAGECOMPONENT);
    expect(result).toBe(angularHTML);
  });
  test('transform to angular html with layout', async () => {
    const result = await domain.transformComponentsToAngularHTML(pageComponentWithLayout, EnumGenerateMode.PAGECOMPONENT);
    expect(result).toBe(angularHTMLWithLayout);
  });
  test('transform to angular html with layout2', async () => {
    const result = await domain.transformComponentsToAngularHTML(pageComponentWithLayout2, EnumGenerateMode.PAGECOMPONENT);
    expect(result).toBe(angularHTMLWithLayout2);
  });

  describe('contentEditorToAngularHTML', () => {
    const contentsResponse: IContentEditor = {
      _id: '1',
      name: '',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      isPublish: true,
      customCSS: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [
                {
                  type: EContentEditorComponentType.TEXT,
                  quillHTMLs: [
                    {
                      cultureUI: EnumLanguageCultureUI.TH,
                      quillHTML: 'abc',
                    },
                  ],
                } as IContentEditorComponentText,
              ],
            },
          ],
        },
      ],
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [
                {
                  type: EContentEditorComponentType.TEXT,
                  quillHTMLs: [
                    {
                      cultureUI: EnumLanguageCultureUI.TH,
                      quillHTML: 'abc',
                    },
                  ],
                } as IContentEditorComponentText,
              ],
            },
          ],
        },
      ],
    };
    test('contentEditorToAngularHTML WithData', async () => {
      const expectedValue = `<cms-next-cms-content-editor-rendering><cms-next-cms-content-section-rendering *cmsNextEmbeddedView><cms-next-cms-content-column-rendering *cmsNextEmbeddedView><cms-next-cms-content-text-rendering *cmsNextEmbeddedView></cms-next-cms-content-text-rendering></cms-next-cms-content-column-rendering></cms-next-cms-content-section-rendering></cms-next-cms-content-editor-rendering>`;
      const result = await domain.contentEditorToAngularHTML(contentsResponse);
      expect(result).toEqual(expectedValue);
    });

    test('contentEditorToAngularHTML WithoutData', async () => {
      const expectedValue = `<cms-next-cms-content-editor-rendering></cms-next-cms-content-editor-rendering>`;
      const result = await domain.contentEditorToAngularHTML(null);
      expect(result).toEqual(expectedValue);
    });
  });
});
