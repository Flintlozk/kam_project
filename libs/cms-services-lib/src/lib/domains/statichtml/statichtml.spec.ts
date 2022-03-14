/* eslint-disable max-len */
import {
  EMenuSourceType,
  EnumGenerateMode,
  EnumGenerateType,
  EnumLanguageCultureUI,
  EnumTypeMode,
  IGeneralText,
  IHistoryType,
  IMenuRenderingSetting,
  IRenderingComponentData,
  IThemeAssets,
  IThemeDevice,
  IThemeRendering,
  IWebPage,
} from '@reactor-room/cms-models-lib';
import { mock } from '@reactor-room/itopplus-back-end-helpers';
import { generateCloseTagUntillFindParent } from '../angularhtml';
import { generateStaticHTMLGeneralText } from './media-gallery/statichtml-media-gallery';
import * as domain from './statichtml.domain';
import * as domainMenu from '../menu';
import * as domainPublish from '../publish';
import { createMenuJavaScriptGenerator, generateScripFromThemeAndWebPage } from './statichtml.domain';
jest.mock('../menu');
jest.mock('../publish');
describe('generateStaticHTML', () => {
  const components = {
    _id: '617a26ab1a351a4b38695ee1',
    catagoriesID: [],
    name: 'test menu',
    html: [
      {
        _id: '617a26ab1a351a4b38695ee0',
        name: 'Index.html',
        html: '<section id="THEME_HEADER" >\n    <div class="itp-header" data-cmp="THEME_MENU" data-id="1">\n        <menu-source>\n            <menu-group-id>1</menu-group-id>\n            <source-type>ROOT_MENU</source-type>\n            <parent-menu-id>1</parent-menu-id>\n        </menu-source>\n        <setting>\n            <sticky>NONE</sticky>\n            <animation>FADE</animation>\n            <alignment>LEFT</alignment>\n            <style>HORIZONTAL</style>\n            <icon>\n                <is-icon>true</is-icon>\n                <size>10</size>\n                <color>\n                    <value>#FFA500</value>\n                    <opacity>100</opacity>\n                </color>\n                <status>true</status>\n                <position>LEFT</position>\n            </icon>\n            <mega>\n                <size>10</size>\n                <color>\n                    <value>#FFA500</value>\n                    <opacity>100</opacity>\n                </color>\n            </mega>\n        </setting>\n        <mobile>\n            <hamburger>\n                <icon>\n                    <icon-group>GROUP_1</icon-group>\n                    <active-icon>testactive</active-icon>\n                    <in-active-icon>testinactive</in-active-icon>\n                </icon>\n                <is-text>true</is-text>\n                <text>test</text>\n                <position>LEFT</position>\n            </hamburger>\n            <feature-icon>\n                <icons>FACEBOOK</icons>\n                <icons>LINE</icons>\n                <is-search>true</is-search>\n                <is-language>true</is-language>\n            </feature-icon>\n        </mobile>\n        <level>\n            <one>\n                <size>10</size>\n                <style>REGULAR</style>\n                <text>\n                    <normal>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFA500</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFA500</colors>\n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </normal>\n                    <hover>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFA500</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFA500</colors>\n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </hover>\n                    <active>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFA500</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFA500</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>                       \n                    </active>\n                </text>\n                <background>\n                    <normal>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </normal>\n                    <hover>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </hover>\n                    <active>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>                       \n                    </active>\n                </background>\n                <shadow>\n                    <is-shadow>false</is-shadow>\n                    <color>#FFA500</color>\n                    <opacity>100</opacity>\n                    <x-axis>0</x-axis>\n                    <y-axis>0</y-axis>\n                    <distance>0</distance>\n                    <blur>0</blur>\n                </shadow>\n                <text-animation>STYLE_1</text-animation>\n                <background-animation>FADE</background-animation>\n            </one>\n            <two>\n                <size>10</size>\n                <style>REGULAR</style>\n                <text>\n                    <normal>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#960018</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#960018</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </normal>\n                    <hover>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#960018</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#960018</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </hover>\n                    <active>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#960018</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#960018</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>                       \n                    </active>\n                </text>\n                <background>\n                    <normal>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </normal>\n                    <hover>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </hover>\n                    <active>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>                       \n                    </active>\n                </background>\n                <shadow>\n                    <is-shadow>false</is-shadow>\n                    <color>#FFA500</color>\n                    <opacity>100</opacity>\n                    <x-axis>0</x-axis>\n                    <y-axis>0</y-axis>\n                    <distance>0</distance>\n                    <blur>0</blur>\n                </shadow>\n                <text-animation>STYLE_1</text-animation>\n                <background-animation>FADE</background-animation>\n            </two>\n            <three>\n                <size>10</size>\n                <style>REGULAR</style>\n                <text>\n                    <normal>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#ed2939</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#ed2939</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </normal>\n                    <hover>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#ed2939</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#ed2939</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </hover>\n                    <active>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#ed2939</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#ed2939</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>                       \n                    </active>\n                </text>\n                <background>\n                    <normal>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </normal>\n                    <hover>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </hover>\n                    <active>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>                       \n                    </active>\n                </background>\n                <shadow>\n                    <is-shadow>false</is-shadow>\n                    <color>#FFA500</color>\n                    <opacity>100</opacity>\n                    <x-axis>0</x-axis>\n                    <y-axis>0</y-axis>\n                    <distance>0</distance>\n                    <blur>0</blur>\n                </shadow>\n                <text-animation>STYLE_1</text-animation>\n                <background-animation>FADE</background-animation>\n            </three>\n            <four>\n                <size>10</size>\n                <style>REGULAR</style>\n                <text>\n                    <normal>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#ff0000</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#ff0000</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </normal>\n                    <hover>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#ff0000</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#ff0000</colors>\n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </hover>\n                    <active>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#ff0000</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#ff0000</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>                       \n                    </active>\n                </text>\n                <background>\n                    <normal>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </normal>\n                    <hover>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>\n                    </hover>\n                    <active>\n                        <style>COLOR</style>\n                        <color>\n                            <value>#FFFF00</value>\n                            <opacity>100</opacity>\n                        </color>\n                        <gradient-color>\n                            <type>LINEAR</type>\n                            <colors>#FFFF00</colors>\n   \n                        </gradient-color>\n                        <menu-image>testImage</menu-image>                       \n                    </active>\n                </background>\n                <shadow>\n                    <is-shadow>false</is-shadow>\n                    <color>#FFA500</color>\n                    <opacity>100</opacity>\n                    <x-axis>0</x-axis>\n                    <y-axis>0</y-axis>\n                    <distance>0</distance>\n                    <blur>0</blur>\n                </shadow>\n                <text-animation>STYLE_1</text-animation>\n                <background-animation>FADE</background-animation>\n            </four>\n        </level>\n        <css>test</css>\n        <culture-ui-html>\n            <culture-ui>testculture</culture-ui>\n            <menu-html>test</menu-html>\n        </culture-ui-html>\n        <culture-ui-html>\n            <culture-ui>testculture</culture-ui>\n            <menu-html>test</menu-html>\n        </culture-ui-html>\n    </div>\n    <div class="itp-header">test itp-header</div>\n    <div class="itp-sub_header">test itp-sub-header</div>\n    <div class="itp-detail">test itp-detail</div>\n    <div class="itp-sub_detail">test itp-sub-detail</div>\n    <div class="itp-header">test itp-header</div>\n    <div class="itp-sub_header">test itp-sub-header</div>\n    <div class="itp-detail">test itp-detail</div>\n    <div class="itp-sub_detail">test itp-sub-detail</div>\n    <div class="itp-header">test itp-header</div>\n    <div class="itp-sub_header">test itp-sub-header</div>\n    <div class="itp-detail">test itp-detail</div>\n    <div class="itp-sub_detail">test itp-sub-detail</div>\n</section>\n<section id="CONTENT"></section>\n<section id="THEME_FOOTER"></section>',
        thumbnail: {
          path: 'https://linestorage.more-commerce.com/cms-theme-storage-staging/617a26ab1a351a4b38695ee1/1635401273573_Screenshot_from_2021-10-06_14-12-05.png',
          stream: null,
        },
      },
    ],
    image: [
      {
        _id: '617a26ab1a351a4b38695ee1',
        type: 'IMAGE',
        name: 'Screenshot from 2021-10-26 13-26-42.png',
        url: '617a26ab1a351a4b38695ee1/Screenshot from 2021-10-26 13-26-42.png',
      },
      {
        _id: '617a26ab1a351a4b38695ee1',
        type: 'IMAGE',
        name: 'Screenshot from 2021-10-26 13-26-42.png',
        url: '617a26ab1a351a4b38695ee1/Screenshot from 2021-10-26 13-26-42.png',
      },
    ],
    style: [
      {
        _id: '617a26ab1a351a4b38695ee4',
        type: 'CSS',
        name: 'site.css',
        plaintext: '',
        url: '617a26ab1a351a4b38695ee1/site.css',
      },
      {
        _id: '617a26ab1a351a4b38695ee1',
        type: 'CSS',
        name: 'testupdate.css',
        url: '617a26ab1a351a4b38695ee1/testupdate.css',
        plaintext:
          '.right-area {\n  margin: 30px 40px;\n}\n.title-text {\n  position: relative;\n  font-size: 16px;\n  line-height: 24px;\n  color: #797f8c;\n}\n.line {\n  position: absolute;\n  bottom: 0;\n  width: 25px;\n  border-bottom: 2px solid #2ec639;\n}\n.file {\n  border-bottom: 1px solid #bcc4d6;\n  padding: 0 20px 5px 20px;\n}\n.editor-area {\n  width: 50vw;\n  height: 78vh;\n  background: #ffffff;\n  border: 1px solid #f1f2f6;\n  box-sizing: border-box;\n  border-radius: 4px;\n  padding: 24px;\n}\n.editor {\n  height: 100%;\n}\n\n.theme-assets {\n  width: 30%;\n  margin-left: 15px;\n  background: #ffffff;\n  border: 1px solid #f1f2f6;\n  box-sizing: border-box;\n  border-radius: 4px;\n  height: 50%;\n  padding: 24px;\n}\n.test-class {\n    background-color: red;\n}',
      },
    ],
    javascript: [
      {
        _id: '617a26ab1a351a4b38695ee1',
        type: 'JS',
        name: 'testlFET1183786827537 (copy).js',
        url: 'testlFET1183786827537 (copy).js',
        plaintext:
          'function msg() {\n  alert("Hello Javatpoint");\n  console.log("test");\n  console.log("testasetasdfasdfasdfsdafasdf");\n  consoel.log("test single Upload")\n}\n',
      },
    ],
    themeComponents: [
      {
        themeComponent: [
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cb5',
            componentType: 'cms-next-cms-header-container-rendering',
            commonSettings: {
              _id: '618387d3a0cd4574a7fb8cfb',
              border: {
                _id: '618387d3a0cd4574a7fb8cfc',
                color: '#FFFFFF',
                opacity: 0,
                corner: {
                  _id: '618387d3a0cd4574a7fb8cfd',
                  bottomLeft: 0,
                  bottomRight: 0,
                  topLeft: 0,
                  topRight: 0,
                },
                thickness: 0,
                position: {
                  _id: '618387d3a0cd4574a7fb8cfe',
                  left: false,
                  right: false,
                  top: false,
                  bottom: false,
                },
              },
              shadow: {
                _id: '618387d3a0cd4574a7fb8cff',
                isShadow: false,
                xAxis: 0,
                yAxis: 0,
                blur: 0,
                distance: 0,
                color: '#FFFFFF',
                opacity: 0,
              },
              background: {
                _id: '618387d3a0cd4574a7fb8d00',
                layoutSettingBackgroundImageForm: null,
                layoutSettingBackgroundVideoForm: null,
                currentStyle: 'COLOR',
                layoutSettingBackgroundColorForm: {
                  _id: '618387d3a0cd4574a7fb8d01',
                  color: '#FFFFFF',
                  opacity: 0,
                },
              },
              advance: {
                _id: '618387d3a0cd4574a7fb8d02',
                margin: {
                  _id: '618387d3a0cd4574a7fb8d03',
                  bottom: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                },
                padding: {
                  _id: '618387d3a0cd4574a7fb8d04',
                  bottom: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                },
                horizontalPosition: 'flex-start',
                verticalPosition: 'flex-start',
              },
              effect: {
                _id: '618387d3a0cd4574a7fb8d05',
                scrollEffect: '',
                xAxis: 0,
                yAxis: 0,
                isStretch: false,
                margin: 0,
              },
              customize: {
                _id: null,
                cssStyle: '',
                elementId: '',
              },
              hover: {
                _id: '618387d3a0cd4574a7fb8d07',
                style: '',
                textHover: '',
              },
              className: null,
            },
            themeOption: {
              themeIdentifier: 'THEME_HEADER',
            },
            orderNumber: 0,
            layoutID: null,
            layoutPosition: null,
          },

          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cb7',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-header">test itp-header',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cb7',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 1,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cb8',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-sub_header">test itp-sub-header',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cb8',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 2,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cb9',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-detail">test itp-detail',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cb9',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 3,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cba',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-sub_detail">test itp-sub-detail',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cba',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 4,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cbb',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-header">test itp-header',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cbb',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 5,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cbc',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-sub_header">test itp-sub-header',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cbc',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 6,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cbd',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-detail">test itp-detail',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cbd',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 7,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cbe',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-sub_detail">test itp-sub-detail',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cbe',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 8,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cbf',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-header">test itp-header',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cbf',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 9,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cc0',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-sub_header">test itp-sub-header',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cc0',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 10,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cc1',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-detail">test itp-detail',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cc1',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 11,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cc2',
            componentType: 'cms-next-cms-plain-html-rendering',
            section: 'cms-next-cms-header-container-rendering',
            outterHTML: '<div class="itp-sub_detail">test itp-sub-detail',
            themeOption: {
              themeIdentifier: '618387d3a0cd4574a7fb8cc2',
            },
            themeLayoutID: null,
            layoutPosition: null,
            orderNumber: 12,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cc3',
            componentType: 'cms-next-cms-content-container-rendering',
            commonSettings: {
              _id: '618387d3a0cd4574a7fb8d15',
              border: {
                _id: '618387d3a0cd4574a7fb8d16',
                color: '#FFFFFF',
                opacity: 0,
                corner: {
                  _id: '618387d3a0cd4574a7fb8d17',
                  bottomLeft: 0,
                  bottomRight: 0,
                  topLeft: 0,
                  topRight: 0,
                },
                thickness: 0,
                position: {
                  _id: '618387d3a0cd4574a7fb8d18',
                  left: false,
                  right: false,
                  top: false,
                  bottom: false,
                },
              },
              shadow: {
                _id: '618387d3a0cd4574a7fb8d19',
                isShadow: false,
                xAxis: 0,
                yAxis: 0,
                blur: 0,
                distance: 0,
                color: '#FFFFFF',
                opacity: 0,
              },
              background: {
                _id: '618387d3a0cd4574a7fb8d1a',
                layoutSettingBackgroundImageForm: null,
                layoutSettingBackgroundVideoForm: null,
                currentStyle: 'COLOR',
                layoutSettingBackgroundColorForm: {
                  _id: '618387d3a0cd4574a7fb8d1b',
                  color: '#FFFFFF',
                  opacity: 0,
                },
              },
              advance: {
                _id: '618387d3a0cd4574a7fb8d1c',
                margin: {
                  _id: '618387d3a0cd4574a7fb8d1d',
                  bottom: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                },
                padding: {
                  _id: '618387d3a0cd4574a7fb8d1e',
                  bottom: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                },
                horizontalPosition: 'flex-start',
                verticalPosition: 'flex-start',
              },
              effect: {
                _id: '618387d3a0cd4574a7fb8d1f',
                scrollEffect: '',
                xAxis: 0,
                yAxis: 0,
                isStretch: false,
                margin: 0,
              },
              customize: {
                _id: null,
                cssStyle: '',
                elementId: '',
              },
              hover: {
                _id: '618387d3a0cd4574a7fb8d21',
                style: '',
                textHover: '',
              },
              className: null,
            },
            themeOption: {
              themeIdentifier: 'CONTENT',
            },
            orderNumber: 1,
            layoutID: null,
            layoutPosition: null,
          },
          {
            isActive: true,
            _id: '618387d3a0cd4574a7fb8cc4',
            componentType: 'cms-next-cms-footer-container-rendering',
            commonSettings: {
              _id: '618387d3a0cd4574a7fb8d22',
              border: {
                _id: '618387d3a0cd4574a7fb8d23',
                color: '#FFFFFF',
                opacity: 0,
                corner: {
                  _id: '618387d3a0cd4574a7fb8d24',
                  bottomLeft: 0,
                  bottomRight: 0,
                  topLeft: 0,
                  topRight: 0,
                },
                thickness: 0,
                position: {
                  _id: '618387d3a0cd4574a7fb8d25',
                  left: false,
                  right: false,
                  top: false,
                  bottom: false,
                },
              },
              shadow: {
                _id: '618387d3a0cd4574a7fb8d26',
                isShadow: false,
                xAxis: 0,
                yAxis: 0,
                blur: 0,
                distance: 0,
                color: '#FFFFFF',
                opacity: 0,
              },
              background: {
                _id: '618387d3a0cd4574a7fb8d27',
                layoutSettingBackgroundImageForm: null,
                layoutSettingBackgroundVideoForm: null,
                currentStyle: 'COLOR',
                layoutSettingBackgroundColorForm: {
                  _id: '618387d3a0cd4574a7fb8d28',
                  color: '#FFFFFF',
                  opacity: 0,
                },
              },
              advance: {
                _id: '618387d3a0cd4574a7fb8d29',
                margin: {
                  _id: '618387d3a0cd4574a7fb8d2a',
                  bottom: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                },
                padding: {
                  _id: '618387d3a0cd4574a7fb8d2b',
                  bottom: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                },
                horizontalPosition: 'flex-start',
                verticalPosition: 'flex-start',
              },
              effect: {
                _id: '618387d3a0cd4574a7fb8d2c',
                scrollEffect: '',
                xAxis: 0,
                yAxis: 0,
                isStretch: false,
                margin: 0,
              },
              customize: {
                _id: null,
                cssStyle: '',
                elementId: '',
              },
              hover: {
                _id: '618387d3a0cd4574a7fb8d2e',
                style: '',
                textHover: '',
              },
              className: null,
            },
            themeOption: {
              themeIdentifier: 'THEME_FOOTER',
            },
            orderNumber: 2,
            layoutID: null,
            layoutPosition: null,
          },
        ],
      },
    ],
    isActive: true,
    devices: [
      {
        minwidth: 1920,
        icon: 'EXTRA_WILD',
        default: true,
        baseFontSize: 30,
      },
      {
        minwidth: 1360,
        icon: 'WILD',
        default: true,
        baseFontSize: 25,
      },
      {
        minwidth: 1024,
        icon: 'NORMAL',
        default: true,
        baseFontSize: 20,
      },
      {
        minwidth: 720,
        icon: 'TABLET',
        default: true,
        baseFontSize: 15,
      },
      {
        minwidth: 320,
        icon: 'TABLET',
        default: true,
        baseFontSize: 10,
      },
    ],
    settings: {
      _id: '618387d3a0cd4574a7fb8d30',
      font: [
        {
          type: 'HEADER',
          familyCode: 'prompt',
          size: 1.2,
          unit: 'em',
          style: 'Regular',
          lineHeight: 'unset',
          letterSpacing: 'unset',
        },
        {
          type: 'SUB_HEADER',
          familyCode: 'quantico',
          size: 1,
          unit: 'em',
          style: 'Regular',
          lineHeight: 'unset',
          letterSpacing: 'unset',
        },
        {
          type: 'DETAIL',
          familyCode: 'arial',
          size: 0.8,
          unit: 'em',
          style: 'Regular',
          lineHeight: 'unset',
          letterSpacing: 'unset',
        },
        {
          type: 'SUB_DETAIL',
          familyCode: 'prompt',
          size: 0.5,
          unit: 'em',
          style: 'Regular',
          lineHeight: 'unset',
          letterSpacing: 'unset',
        },
      ],
      color: [
        {
          type: 'HEADER',
          dark: {
            color: '#5832de',
            opacity: 100,
          },
          light: {
            color: '#501616',
            opacity: 100,
          },
        },
        {
          type: 'SUB_HEADER',
          dark: {
            color: 'rgba(155,8,189,0.6)',
            opacity: 100,
          },
          light: {
            color: '#f50404',
            opacity: 100,
          },
        },
        {
          type: 'DETAIL',
          dark: {
            color: '#7d03de',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
          light: {
            color: '#2b0101',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
        },
        {
          type: 'SUB_DETAIL',
          dark: {
            color: 'rgba(183,40,174,0.75)',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
          light: {
            color: '#742e2e',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
        },
        {
          type: 'BACKGROUND_COLOR',
          dark: {
            color: '#dddddd',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
          light: {
            color: '#dddddd',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
        },
        {
          type: 'ASSERT1',
          dark: {
            color: '#dddddd',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
          light: {
            color: '#dddddd',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
        },
        {
          type: 'ASSERT2',
          dark: {
            color: '#dddddd',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
          light: {
            color: '#dddddd',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
        },
        {
          type: 'ASSERT3',
          dark: {
            color: '#dddddd',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
          light: {
            color: '#dddddd',
            opacity: 100,
            bgColor: '#7d03de',
            bgOpacity: 100,
          },
        },
      ],
      integration: {
        googleFont: false,
        fontAwesome: false,
      },
      defaultFontFamily: 'prompt',
    },
  } as IThemeRendering;
  const mockResult = {
    css: '',
    html: '<div class="light itp-theme itp-font-default"><div class="itp-theme-header null" id="THEME_HEADER" style="padding:20px"><div id="618387d3a0cd4574a7fb8cb7" column="null" class="itp-header">test itp-header</div><div id="618387d3a0cd4574a7fb8cb8" column="null" class="itp-sub_header">test itp-sub-header</div><div id="618387d3a0cd4574a7fb8cb9" column="null" class="itp-detail">test itp-detail</div><div id="618387d3a0cd4574a7fb8cba" column="null" class="itp-sub_detail">test itp-sub-detail</div><div id="618387d3a0cd4574a7fb8cbb" column="null" class="itp-header">test itp-header</div><div id="618387d3a0cd4574a7fb8cbc" column="null" class="itp-sub_header">test itp-sub-header</div><div id="618387d3a0cd4574a7fb8cbd" column="null" class="itp-detail">test itp-detail</div><div id="618387d3a0cd4574a7fb8cbe" column="null" class="itp-sub_detail">test itp-sub-detail</div><div id="618387d3a0cd4574a7fb8cbf" column="null" class="itp-header">test itp-header</div><div id="618387d3a0cd4574a7fb8cc0" column="null" class="itp-sub_header">test itp-sub-header</div><div id="618387d3a0cd4574a7fb8cc1" column="null" class="itp-detail">test itp-detail</div><div id="618387d3a0cd4574a7fb8cc2" column="null" class="itp-sub_detail">test itp-sub-detail</div></div><div class="itp-theme-content null" id="CONTENT" style="padding:20px" >[CONTENT]</div><div class="itp-theme-footer null" id="THEME_FOOTER" style="padding:20px"></div></div>',
    js: [],
  };
  test('generateStaticHTML', async () => {
    const themeComponent = components.themeComponents;
    const result = await domain.generateStaticHtmlCssJsFromCoponents(
      themeComponent[0].themeComponent,
      EnumGenerateMode.THEME,
      [],
      [],
      EnumLanguageCultureUI.TH,
      EnumTypeMode.PUBLISH,
      '',
    );
    expect(result).toEqual(mockResult);
  });

  const themeAsset = [
    {
      _id: '617a26ab1a351a4b38695ee4',
      type: 'CSS',
      name: 'site.css',
      plaintext: '',
      url: 'http://localhost:3000/617a26ab1a351a4b38695ee1/site.css',
    },
    {
      _id: '617a26ab1a351a4b38695ee1',
      type: 'CSS',
      name: 'testupdate.css',
      url: 'http://localhost:3000/617a26ab1a351a4b38695ee1/testupdate.css',
      plaintext:
        '.right-area {\n' +
        '  margin: 30px 40px;\n' +
        '}\n' +
        '.title-text {\n' +
        '  position: relative;\n' +
        '  font-size: 16px;\n' +
        '  line-height: 24px;\n' +
        '  color: #797f8c;\n' +
        '}\n' +
        '.line {\n' +
        '  position: absolute;\n' +
        '  bottom: 0;\n' +
        '  width: 25px;\n' +
        '  border-bottom: 2px solid #2ec639;\n' +
        '}\n' +
        '.file {\n' +
        '  border-bottom: 1px solid #bcc4d6;\n' +
        '  padding: 0 20px 5px 20px;\n' +
        '}\n' +
        '.editor-area {\n' +
        '  width: 50vw;\n' +
        '  height: 78vh;\n' +
        '  background: #ffffff;\n' +
        '  border: 1px solid #f1f2f6;\n' +
        '  box-sizing: border-box;\n' +
        '  border-radius: 4px;\n' +
        '  padding: 24px;\n' +
        '}\n' +
        '.editor {\n' +
        '  height: 100%;\n' +
        '}\n' +
        '\n' +
        '.theme-assets {\n' +
        '  width: 30%;\n' +
        '  margin-left: 15px;\n' +
        '  background: #ffffff;\n' +
        '  border: 1px solid #f1f2f6;\n' +
        '  box-sizing: border-box;\n' +
        '  border-radius: 4px;\n' +
        '  height: 50%;\n' +
        '  padding: 24px;\n' +
        '}\n' +
        '.test-class {\n' +
        '    background-color: red;\n' +
        '}\n' +
        '.center {\n' +
        '    display: flex;\n' +
        '    flex-direction: column;\n' +
        '    align-content: center;\n' +
        '    justify-content: center;\n' +
        '    align-items: center;\n' +
        '}',
    },
  ] as IThemeAssets[];
  const style =
    '<link href="http://localhost:3000/617a26ab1a351a4b38695ee1/site.css" rel="stylesheet" /><link href="http://localhost:3000/617a26ab1a351a4b38695ee1/site-d6a243a3-c326-4cce-b0d7-dfaa17866eb2.css" rel="stylesheet" /><link href="http://localhost:3000/617a26ab1a351a4b38695ee1/testupdate.css" rel="stylesheet" />';
  const mockResultGenerateStaticHTMLGeneralText = `<div
    style="
      tab-size: 4;
      -webkit-text-size-adjust: 100%;
      line-height: inherit;
      font-family: 'Prompt-Light', 'Prompt Light', 'Prompt', sans-serif;
      --tw-text-opacity: 1;
      color: rgba(55, 65, 81, var(--tw-text-opacity));
      --tw-bg-opacity: 1;
      font-size: 16px;
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
  
      border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      height: 100%;
      width: 100%;
    "
  >
    <a
      style="
        tab-size: 4;
        -webkit-text-size-adjust: 100%;
        line-height: inherit;
        font-family: 'Prompt-Light', 'Prompt Light', 'Prompt', sans-serif;
        --tw-text-opacity: 1;
        --tw-bg-opacity: 1;
        font-size: 16px;
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        --tw-border-opacity: 1;
        border-color: rgba(229, 231, 235, var(--tw-border-opacity));
        --tw-shadow: 0 0 #0000;
        --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-color: rgba(59, 130, 246, 0.5);
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        color: inherit;
        text-decoration: inherit;
        display: flex;
        height: 100%;
        width: 100%;
      "
    >
      <div
        style="
          line-height: inherit;
          font-family: 'Prompt-Light', 'Prompt Light', 'Prompt', sans-serif;
          font-size: 16px;
          color: inherit;
          box-sizing: border-box;
          border-width: 0;
          border-style: solid;
          border-color: rgba(229, 231, 235, var(--tw-border-opacity));
          z-index: 0;
          width: 100%;
        "
      >
        <section
          style="
            tab-size: 4;
            line-height: inherit;
            font-family: 'Prompt-Light', 'Prompt Light', 'Prompt', sans-serif;
            font-size: 16px;
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            border-color: rgba(229, 231, 235, var(--tw-border-opacity));
            position: relative;
            display: flex;
            height: 100%;
            width: 100%;
            overflow: hidden;
            justify-content: center;
            align-items: flex-end;
          "
        >
          <div
          class=""
            style=
             font-size:16px;color:inherit;box-sizing:border-box;border-width:0;border-style:solid;padding:0.5rem;line-height:unset;letter-spacing:unset;font-weight:unset;font-style:normal;;opacity:NaN;;text-align:center;font-family:prompt 
         >
           <div style=font-size:32;color:#ffffff;opacity:1 >from admin</div>
           <div style=font-size:32;color:#ffffff;opacity:1></div>
         </div>
       </section>       
      </div>
    </a>
  </div>
  `;
  test('generateStyleLink', () => {
    const pageUUID = 'd6a243a3-c326-4cce-b0d7-dfaa17866eb2';
    const result = domain.generateStyleLinkFromUploadCss(themeAsset, pageUUID);
    expect(result).toBe(style);
  });
  const textSetting = {
    text: {
      isText: true,
      text: [
        {
          cultureUI: null,
          title: 'from admin',
          description: '',
        },
      ],
      isFontDefault: false,
      isFontIndexDefault: 0,
      isStyleDefault: false,
      isTextColorDefault: false,
      isTextOpacityDefault: false,
      isLineHeightDefault: false,
      isLetterSpacingDefault: false,
      fontFamily: 'prompt',
      fontStyle: 'Regular',
      titleFontSize: '32',
      descriptionFontSize: '32',
      textColor: '#ffffff',
      textOpacity: '100',
      textAlignment: 'center',
      lineHeight: 'unset',
      letterSpacing: 'unset',
      textAnimation: 'tracking-in-expand',
    },
    overlay: {
      isOverlay: true,
      isOverlayFullWidth: true,
      overlayColor: '#113C72',
      overlayOpacity: '100',
      overlayAnimation: 'overlay-fade',
    },
    horizontalPosition: 'center',
    verticalPosition: 'flex-end',
    isApplyAll: false,
  } as IGeneralText;
  //
  xtest('generateStaticHTMLGeneralText', () => {
    const result = generateStaticHTMLGeneralText(textSetting, EnumLanguageCultureUI.TH, EnumLanguageCultureUI.TH);
    expect(result.replace(/\s/g, '')).toBe(mockResultGenerateStaticHTMLGeneralText.replace(/\s/g, ''));
  });
});
describe('test closetag', () => {
  const mockResultCloseTag1 = { history: [], html: '<div class="dark itp-theme">' };
  const mockHTML1 = '<div class="dark itp-theme">';
  const history1 = [];
  test('closeTag1', async () => {
    const result = await generateCloseTagUntillFindParent(mockHTML1, history1, undefined, EnumGenerateType.STATICHTML);
    expect(result).toStrictEqual(mockResultCloseTag1);
  });
  const mockResultCloseTag2 = { history: [], html: '<div class="dark itp-theme"><div class="itp-theme-header null" id="THEME_HEADER">' };
  const mockHTML2 = '<div class="dark itp-theme"><div class="itp-theme-header null" id="THEME_HEADER">';
  const history2 = [];
  test('closeTag2', async () => {
    const result = await generateCloseTagUntillFindParent(mockHTML2, history2, null, EnumGenerateType.STATICHTML);
    expect(result).toStrictEqual(mockResultCloseTag2);
  });
  const mockResultCloseTag3 = {
    history: [
      {
        _id: 'THEME_LAYOUT_1',
        componentType: 'cms-next-cms-layout-rendering',
        layoutPositionNumber: 1,
      },
    ],
    html: '<div class="dark itp-theme"><div class="itp-theme-header null" id="THEME_HEADER"><div id="THEME_LAYOUT_1" class="two-column" style="border-color:rgba(255, 255, 255, 0);border-style:solid;  border-top-left-radius:0px;border-top-right-radius:0px  ;border-bottom-left-radius:0px;border-bottom-right-radius:0px;  border-bottom-width:0px;border-top-width:0px;border-left-width:0px;border-right-width:0px;box-shadow:none;margin-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0px          ;padding-left:100px;padding-top:0px;padding-right:0px;padding-bottom:0px;top:0px;left:0px;background-color:rgba(255, 255, 255, 0);width:100%;column-gap:0px"><div style="border-color:rgba(255, 255, 255, 0);border-style:solid;  border-top-left-radius:0px;border-top-right-radius:0px  ;border-bottom-left-radius:0px;border-bottom-right-radius:0px;  border-bottom-width:0px;border-top-width:0px;border-left-width:0px;border-right-width:0px;box-shadow:none;margin-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0px          ;padding-left:20px;padding-top:0px;padding-right:0px;padding-bottom:0px;top:0px;left:0px;background-color:rgba(255, 255, 255, 0);">',
  };
  const mockHTML3 =
    '<div class="dark itp-theme"><div class="itp-theme-header null" id="THEME_HEADER"><div id="THEME_LAYOUT_1" class="two-column" style="border-color:rgba(255, 255, 255, 0);border-style:solid;  border-top-left-radius:0px;border-top-right-radius:0px  ;border-bottom-left-radius:0px;border-bottom-right-radius:0px;  border-bottom-width:0px;border-top-width:0px;border-left-width:0px;border-right-width:0px;box-shadow:none;margin-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0px          ;padding-left:100px;padding-top:0px;padding-right:0px;padding-bottom:0px;top:0px;left:0px;background-color:rgba(255, 255, 255, 0);width:100%;column-gap:0px"><div style="border-color:rgba(255, 255, 255, 0);border-style:solid;  border-top-left-radius:0px;border-top-right-radius:0px  ;border-bottom-left-radius:0px;border-bottom-right-radius:0px;  border-bottom-width:0px;border-top-width:0px;border-left-width:0px;border-right-width:0px;box-shadow:none;margin-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0px          ;padding-left:20px;padding-top:0px;padding-right:0px;padding-bottom:0px;top:0px;left:0px;background-color:rgba(255, 255, 255, 0);">';
  const history3 = [
    {
      _id: 'THEME_LAYOUT_1',
      componentType: 'cms-next-cms-layout-rendering',
      layoutPositionNumber: 1,
    },
  ] as IHistoryType[];
  test('closeTag3', async () => {
    const result = await generateCloseTagUntillFindParent(mockHTML3, history3, 'THEME_LAYOUT_1', EnumGenerateType.STATICHTML);
    expect(result).toStrictEqual(mockResultCloseTag3);
  });
  const mockResultCloseTag4 = {
    history: [],
    html: '<div id="THEME_LAYOUT_1"></div>',
  };
  const mockHTML4 = '<div id="THEME_LAYOUT_1">';
  const history4 = [
    {
      _id: 'THEME_LAYOUT_1',
      componentType: 'cms-next-cms-layout-rendering',
      layoutPositionNumber: 1,
    },
  ] as IHistoryType[];
  test('closeTag4', async () => {
    const result = await generateCloseTagUntillFindParent(mockHTML4, history4, null, EnumGenerateType.STATICHTML);
    expect(result).toStrictEqual(mockResultCloseTag4);
  });
  const mockResultCloseTag5 = {
    history: [],
    html: '<div id="THEME_LAYOUT_1"><div></div></div>',
  };
  const mockHTML5 = '<div id="THEME_LAYOUT_1"><div>';
  const history5 = [
    {
      _id: 'THEME_LAYOUT_1',
      componentType: 'cms-next-cms-layout-rendering',
      layoutPositionNumber: 1,
    },
    {
      _id: '61935f0273e235515db3b831',
      componentType: 'cms-next-cms-plain-html-rendering',
    },
  ] as IHistoryType[];
  test('closeTag5', async () => {
    const result = await generateCloseTagUntillFindParent(mockHTML5, history5, null, EnumGenerateType.STATICHTML);
    expect(result).toStrictEqual(mockResultCloseTag5);
  });
  const mockResultCloseTag6 = {
    history: [
      {
        _id: 'THEME_LAYOUT_1',
        componentType: 'cms-next-cms-layout-rendering',
        layoutPositionNumber: 1,
      },
      {
        _id: '61935f0273e235515db3b831',
        componentType: 'cms-next-cms-plain-html-rendering',
      },
    ],
    html: '<div id="THEME_LAYOUT_1"><div>',
  };
  const mockHTML6 = '<div id="THEME_LAYOUT_1"><div>';
  const history6 = [
    {
      _id: 'THEME_LAYOUT_1',
      componentType: 'cms-next-cms-layout-rendering',
      layoutPositionNumber: 1,
    },
    {
      _id: '61935f0273e235515db3b831',
      componentType: 'cms-next-cms-plain-html-rendering',
    },
  ] as IHistoryType[];
  test('closeTag6', async () => {
    const result = await generateCloseTagUntillFindParent(mockHTML6, history6, '61935f0273e235515db3b831', EnumGenerateType.STATICHTML);
    expect(result).toStrictEqual(mockResultCloseTag6);
  });
  const mockResultCloseTag7 = {
    history: [
      {
        _id: 'THEME_LAYOUT_1',
        componentType: 'cms-next-cms-layout-rendering',
        layoutPositionNumber: 1,
      },
    ],
    html: '<div id="THEME_LAYOUT_1"><div></div>',
  };
  const mockHTML7 = '<div id="THEME_LAYOUT_1"><div>';
  const history7 = [
    {
      _id: 'THEME_LAYOUT_1',
      componentType: 'cms-next-cms-layout-rendering',
      layoutPositionNumber: 1,
    },
    {
      _id: '61935f0273e235515db3b831',
      componentType: 'cms-next-cms-plain-html-rendering',
    },
  ] as IHistoryType[];
  test('closeTag7', async () => {
    const result = await generateCloseTagUntillFindParent(mockHTML7, history7, 'THEME_LAYOUT_1', EnumGenerateType.STATICHTML);
    expect(result).toStrictEqual(mockResultCloseTag7);
  });
});

describe('generateScripFromThemeAndWebPage', () => {
  test('success generateScripFromThemeAndWebPage', () => {
    const javascriptArray = [
      '/js/theme-0/menu-THEME_MENU_1-sitcky.js',
      '/js/theme-0/menu-THEME_MENU_1-hamberger.js',
      '/js/theme-0/menu-THEME_MENU_1-featureicon.js',
      '/js/theme-0/menu-THEME_MENU_1-hover.js',
    ];
    const javascriptWebPages = [];
    const mockResult =
      '<script type="module" src="/js/theme-0/menu-THEME_MENU_1-sitcky.js" async></script><script type="module" src="/js/theme-0/menu-THEME_MENU_1-hamberger.js" run="getMenuJsMobileHamburger" async></script><script type="module" src="/js/theme-0/menu-THEME_MENU_1-featureicon.js" async></script><script type="module" src="/js/theme-0/menu-THEME_MENU_1-hover.js" async></script>';
    const result = generateScripFromThemeAndWebPage(javascriptArray, javascriptWebPages);
    expect(result).toBe(mockResult);
  });
});
describe('createMenuJavaScriptGenerator', () => {
  test('success createMenuJavaScriptGenerator', () => {
    const id = '621f1200180dd2fe7511b186';
    const jsPath = '/Users/Shared/fileStorage/2022-3-2_1/js/webpage-61d6b868e6c93a6b8971816d';
    const menuSettings = {
      source: { sourceType: EMenuSourceType.ROOT_MENU, menuGroupId: '', parentMenuId: '' },
      setting: {
        sticky: 'NONE',
        animation: '',
        alignment: '',
        style: 'HORIZONTAL',
        icon: { isIcon: true, size: '14px', color: { value: '', opacity: 100 }, status: false, position: 'left' },
        mega: { size: '', color: { value: '#000000', opacity: 100 } },
      },
      mobile: {
        hamburger: { icon: { iconGroup: 'GROUP_1', activeIcon: 'fas fa-bars', inactiveIcon: 'fas fa-times' }, isText: true, text: 'MENU', position: 'left' },
        featureIcon: { icons: ['fab fa-facebook'], isSearch: false, isLanguage: false },
      },
      level: {
        one: {
          size: '20px',
          style: 'Regular',
          text: {
            normal: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          backGround: {
            normal: { style: 'COLOR', color: { value: '#343444', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#eeeeee', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#eeeeee', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          textAnimation: 'text-hover-style-1',
          backgroundAnimation: '',
        },
        two: {
          size: '14px',
          style: 'Regular',
          text: {
            normal: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          backGround: {
            normal: { style: 'COLOR', color: { value: '#eeeeee', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#666666', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#666666', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          textAnimation: 'text-hover-style-1',
          backgroundAnimation: '',
        },
        three: {
          size: '14px',
          style: 'Regular',
          text: {
            normal: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          backGround: {
            normal: { style: 'COLOR', color: { value: '#b1b1b1', opacity: 100 } },
            hover: { style: 'COLOR', color: { value: '#666666', opacity: 100 } },
            active: { style: 'COLOR', color: { value: '#666666', opacity: 100 } },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          textAnimation: 'text-hover-style-1',
          backgroundAnimation: '',
        },
        four: {
          size: '14px',
          style: 'Regular',
          text: {
            normal: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          backGround: {
            normal: { style: 'COLOR', color: { value: '#878787', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#666666', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#666666', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          textAnimation: 'text-hover-style-1',
          backgroundAnimation: '',
        },
      },
    } as IMenuRenderingSetting;
    const resultMock = [
      '/js/webpage-61d6b868e6c93a6b8971816d/menu-621f1200180dd2fe7511b186-sitcky.js',
      '/js/webpage-61d6b868e6c93a6b8971816d/menu-621f1200180dd2fe7511b186-hamberger.js',
      '/js/webpage-61d6b868e6c93a6b8971816d/menu-621f1200180dd2fe7511b186-featureicon.js',
      '/js/webpage-61d6b868e6c93a6b8971816d/menu-621f1200180dd2fe7511b186-hover.js',
    ];
    const result = createMenuJavaScriptGenerator(menuSettings, id, jsPath);
    mock(domainMenu, 'createMenuSettingStickyJavaScript', jest.fn().mockReturnValue(null));
    mock(domainMenu, 'createMenuMobileHamburgerJavaScript', jest.fn().mockReturnValue(null));
    mock(domainMenu, 'createMenuFeatureIconJavaScript', jest.fn().mockReturnValue(null));
    mock(domainMenu, 'createMenuHoverJavaScript', jest.fn().mockReturnValue(null));
    mock(domainPublish, 'createFile', jest.fn().mockReturnValue(null));
    expect(result).toStrictEqual(resultMock);
  });
});
describe('createMenuJavaScriptGenerator', () => {
  test('success createMenuJavaScriptGenerator', () => {
    const id = '621f1200180dd2fe7511b186';
    const jsPath = '/Users/Shared/fileStorage/2022-3-2_1/js/webpage-61d6b868e6c93a6b8971816d';
    const menuSettings = {
      source: { sourceType: EMenuSourceType.ROOT_MENU, menuGroupId: '', parentMenuId: '' },
      setting: {
        sticky: 'NONE',
        animation: '',
        alignment: '',
        style: 'HORIZONTAL',
        icon: { isIcon: true, size: '14px', color: { value: '', opacity: 100 }, status: false, position: 'left' },
        mega: { size: '', color: { value: '#000000', opacity: 100 } },
      },
      mobile: {
        hamburger: { icon: { iconGroup: 'GROUP_1', activeIcon: 'fas fa-bars', inactiveIcon: 'fas fa-times' }, isText: true, text: 'MENU', position: 'left' },
        featureIcon: { icons: ['fab fa-facebook'], isSearch: false, isLanguage: false },
      },
      level: {
        one: {
          size: '20px',
          style: 'Regular',
          text: {
            normal: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          backGround: {
            normal: { style: 'COLOR', color: { value: '#343444', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#eeeeee', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#eeeeee', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          textAnimation: 'text-hover-style-1',
          backgroundAnimation: '',
        },
        two: {
          size: '14px',
          style: 'Regular',
          text: {
            normal: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          backGround: {
            normal: { style: 'COLOR', color: { value: '#eeeeee', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#666666', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#666666', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          textAnimation: 'text-hover-style-1',
          backgroundAnimation: '',
        },
        three: {
          size: '14px',
          style: 'Regular',
          text: {
            normal: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          backGround: {
            normal: { style: 'COLOR', color: { value: '#b1b1b1', opacity: 100 } },
            hover: { style: 'COLOR', color: { value: '#666666', opacity: 100 } },
            active: { style: 'COLOR', color: { value: '#666666', opacity: 100 } },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          textAnimation: 'text-hover-style-1',
          backgroundAnimation: '',
        },
        four: {
          size: '14px',
          style: 'Regular',
          text: {
            normal: { style: 'COLOR', color: { value: '#000000', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          backGround: {
            normal: { style: 'COLOR', color: { value: '#878787', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            hover: { style: 'COLOR', color: { value: '#666666', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
            active: { style: 'COLOR', color: { value: '#666666', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          textAnimation: 'text-hover-style-1',
          backgroundAnimation: '',
        },
      },
    } as IMenuRenderingSetting;
    const resultMock = [
      '/js/webpage-61d6b868e6c93a6b8971816d/menu-621f1200180dd2fe7511b186-sitcky.js',
      '/js/webpage-61d6b868e6c93a6b8971816d/menu-621f1200180dd2fe7511b186-hamberger.js',
      '/js/webpage-61d6b868e6c93a6b8971816d/menu-621f1200180dd2fe7511b186-featureicon.js',
      '/js/webpage-61d6b868e6c93a6b8971816d/menu-621f1200180dd2fe7511b186-hover.js',
    ];
    const result = createMenuJavaScriptGenerator(menuSettings, id, jsPath);
    mock(domainMenu, 'createMenuSettingStickyJavaScript', jest.fn().mockReturnValue(null));
    mock(domainMenu, 'createMenuMobileHamburgerJavaScript', jest.fn().mockReturnValue(null));
    mock(domainMenu, 'createMenuFeatureIconJavaScript', jest.fn().mockReturnValue(null));
    mock(domainMenu, 'createMenuHoverJavaScript', jest.fn().mockReturnValue(null));
    mock(domainPublish, 'createFile', jest.fn().mockReturnValue(null));
    expect(result).toStrictEqual(resultMock);
  });
});
describe('generateStaticHtmlCssJsFromCoponents', () => {
  test('success generateStaticHtmlCssJsFromCoponents', async () => {
    const mode = 'THEME' as EnumGenerateMode;
    const devices = [
      {
        minwidth: 1920,
        icon: 'EXTRA_WILD',
        default: true,
        baseFontSize: 16,
      },
      { minwidth: 1360, icon: 'WILD', default: true, baseFontSize: 14 },
      { minwidth: 1024, icon: 'NORMAL', default: true, baseFontSize: 10 },
      { minwidth: 720, icon: 'TABLET', default: true, baseFontSize: 5 },
      { minwidth: 320, icon: 'TABLET', default: true, baseFontSize: 3 },
    ] as IThemeDevice[];
    const defaultCultureUI = 'TH' as EnumLanguageCultureUI;
    const action = 'PREVIEW' as EnumTypeMode;
    const iframe = 'http://localhost:3334/themes/6217426d0e07d59a2318a834/0/432/';
    const webPages = [
      { _id: '617ba83bb7f868b6d33ecf5d', level: 2, pages: [], userID: 432 },
      { _id: '617ba84db7f868b6d33ed77f', level: 3, pages: [], userID: 432 },
      { _id: '617ba865b7f868b6d33ee14b', level: 4, pages: [], userID: 432 },
      {
        _id: '6180ffe0b7f868b6d3b1d19e',
        level: 1,
        pages: [
          {
            _id: '61d6b868e6c93a6b8971816d',
            parentID: null,
            orderNumber: 0,
            masterPageID: null,
            name: 'new PAGE',
            isHide: false,
            isHomepage: true,
            setting: {
              mega: {
                primaryType: 'IMAGE_TEXT',
                footerType: 'IMAGE_TEXT',
                primaryOption: { image: '', imagePosition: 'center center', linkType: 'link-to-url', linkParent: '', linkUrl: '', isTopTitle: false, isHTML: true, textImage: '' },
                footerOption: { isFooterHTML: true, textImage: '' },
              },
              _id: '621dbdac00c01dfa5936b118',
              isOpenNewTab: false,
              isMaintenancePage: false,
              isIcon: false,
              pageIcon: '',
              isMega: false,
              socialShare: '',
            },
            permission: { option: { password: '', onlyPaidMember: true }, _id: '621dbdac00c01dfa5936b11a', type: 'EVERYONE' },
            configs: [
              {
                seo: { title: '', shortUrl: '', description: '', keyword: '' },
                _id: '621dbdac00c01dfa5936b11c',
                cultureUI: 'TH',
                displayName: 'หนักหลัก',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
              {
                seo: { title: '', shortUrl: '', description: '', keyword: '' },
                _id: '61d6b868e6c93a6b89718171',
                cultureUI: 'EN',
                displayName: 'homePage',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
              {
                seo: { title: '', shortUrl: '', description: '', keyword: '' },
                _id: '61d6b868e6c93a6b89718171',
                cultureUI: 'JP',
                displayName: 'ホームページ',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
            ],
            themeLayoutMode: null,
          },
          {
            _id: '61de856d369bd61a51df1103',
            parentID: null,
            orderNumber: 1,
            masterPageID: null,
            name: 'secondaryPage',
            isHide: false,
            isHomepage: false,
            setting: {
              mega: {
                primaryType: 'IMAGE_TEXT',
                footerType: 'IMAGE_TEXT',
                primaryOption: { linkType: 'link-to-url', linkParent: '', linkUrl: '', image: '', imagePosition: 'center center', isTopTitle: false, textImage: '', isHTML: true },
                footerOption: { isFooterHTML: true, textImage: '' },
              },
              _id: '61de856d369bd61a51df1105',
              isOpenNewTab: false,
              isMaintenancePage: false,
              isIcon: false,
              pageIcon: '',
              isMega: false,
              socialShare: '',
            },
            permission: { option: { password: '', onlyPaidMember: false }, _id: '61de856d369bd61a51df1106', type: 'EVERYONE' },
            configs: [
              {
                seo: { title: 'testTitile', shortUrl: '', description: 'testDescription', keyword: 'testKeyword' },
                _id: '61de856d369bd61a51df1107',
                cultureUI: 'TH',
                displayName: 'หน้าที่สอง',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
              {
                seo: { title: 'testTitle', shortUrl: '', description: 'testDes', keyword: '' },
                _id: '61de856d369bd61a51df1107',
                cultureUI: 'EN',
                displayName: 'secondaryPage',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
              {
                seo: { title: '', shortUrl: '', description: '', keyword: '' },
                _id: '61de856d369bd61a51df1107',
                cultureUI: 'JP',
                displayName: '2ページ目',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
            ],
            themeLayoutMode: null,
          },
          {
            _id: '621f428309801c1dbf756b53',
            parentID: null,
            orderNumber: 2,
            masterPageID: null,
            name: 'newpage',
            isHide: false,
            isHomepage: false,
            setting: {
              mega: {
                primaryType: 'IMAGE_TEXT',
                footerType: 'IMAGE_TEXT',
                primaryOption: { image: '', imagePosition: 'center center', linkType: 'link-to-url', linkParent: '', linkUrl: '', isTopTitle: false, isHTML: true, textImage: '' },
                footerOption: { isFooterHTML: true, textImage: '' },
              },

              isOpenNewTab: false,
              isMaintenancePage: false,
              isIcon: false,
              pageIcon: '',
              isMega: false,
              socialShare: '',
            },
            permission: { option: { password: '', onlyPaidMember: true }, type: 'EVERYONE' },
            configs: [
              {
                seo: { title: 'newpage', shortUrl: '', description: '', keyword: '' },
                _id: '621f429209801c1dbf756bdc',
                cultureUI: 'TH',
                displayName: 'awfsdfasdf',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
              {
                seo: { title: 'newpage', shortUrl: '', description: '', keyword: '' },
                _id: '621f429209801c1dbf756bde',
                cultureUI: 'EN',
                displayName: 'zcxvzcxvzcxv',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
              {
                seo: { title: 'newpage', shortUrl: '', description: '', keyword: '' },
                cultureUI: 'JP',
                displayName: 'uuuuuuuuuuuu',
                primaryMega: { topTitle: '', description: '', html: '', textImage: '' },
                footerMega: { html: '', textImage: '' },
              },
            ],
            themeLayoutMode: null,
          },
        ],
      },
    ] as IWebPage[];
    const components = [
      {
        isActive: true,
        _id: '621f61dcd4aa73032089ba08',
        componentType: 'cms-next-cms-header-container-rendering',
        commonSettings: {
          border: {
            corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
            color: '',
            opacity: 100,
            thickness: 0,
            position: { left: false, top: false, right: false, bottom: false },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          background: {
            currentStyle: 'COLOR',
            layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
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
            margin: { left: 0, top: 0, right: 0, bottom: 0 },
            padding: { left: 20, top: 20, right: 20, bottom: 20 },
            horizontalPosition: 'flex-start',
            verticalPosition: 'flex-start',
          },
          effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: false, margin: 0 },
          customize: { cssStyle: '', elementId: '' },
          hover: { textHover: '', style: '' },
          className: null,
        },
        themeOption: { themeIdentifier: 'THEME_HEADER' },
        orderNumber: 0,
        layoutID: null,
        layoutPosition: null,
        nextId: 'THEME_MENU_1',
      },
      {
        isActive: true,
        _id: '621f61dcd4aa73032089ba09',
        componentType: 'cms-next-cms-menu-rendering',
        section: 'cms-next-cms-header-container-rendering',
        themeOption: { themeIdentifier: 'THEME_MENU_1' },
        options: {
          source: { sourceType: 'ROOT_MENU', menuGroupId: '', parentMenuId: '' },
          level: {
            one: {
              size: '20px',
              style: 'Regular',
              text: {
                normal: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                active: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                hover: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
              },
              backGround: {
                normal: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                active: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                hover: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
              },
              shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
              textAnimation: 'text-hover-style-1',
              backgroundAnimation: '',
            },
            two: {
              size: '20px',
              style: 'Regular',
              text: {
                normal: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                active: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                hover: { style: 'COLOR', color: { value: '#ffffff', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
              },
              backGround: {
                normal: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                active: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                hover: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
              },
              shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
              textAnimation: 'text-hover-style-1',
              backgroundAnimation: '',
            },
            three: {
              size: '20px',
              style: 'Regular',
              text: {
                normal: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                active: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                hover: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
              },
              backGround: {
                normal: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                active: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                hover: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
              },
              shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
              textAnimation: 'text-hover-style-1',
              backgroundAnimation: '',
            },
            four: {
              size: '20px',
              style: 'Regular',
              text: {
                normal: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                active: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                hover: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
              },
              backGround: {
                normal: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                active: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
                hover: { style: 'COLOR', color: { value: '#000033', opacity: 100 }, gradientColor: { type: 'LINEAR', colors: ['#ffffff', '#000000'] }, image: '' },
              },
              shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
              textAnimation: 'text-hover-style-1',
              backgroundAnimation: '',
            },
          },
          mobile: {
            hamburger: { icon: { iconGroup: 'GROUP_1', activeIcon: 'fas fa-bars', inactiveIcon: 'fas fa-times' }, isText: true, text: 'MENU', position: 'left' },
            featureIcon: { icons: ['fab fa-facebook'], isSearch: false, isLanguage: false },
          },
          setting: {
            sticky: 'NONE',
            animation: '',
            alignment: '',
            style: 'HORIZONTAL',
            icon: { isIcon: true, size: '14px', color: { value: '', opacity: 100 }, status: false, position: 'left' },
            mega: { size: '', color: { value: '#000000', opacity: 100 } },
          },
        },
        commonSettings: {
          border: {
            corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
            color: '',
            opacity: 100,
            thickness: 0,
            position: { left: false, top: false, right: false, bottom: false },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          background: {
            currentStyle: 'COLOR',
            layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
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
            margin: { left: 0, top: 0, right: 0, bottom: 0 },
            padding: { left: 20, top: 20, right: 20, bottom: 20 },
            horizontalPosition: 'flex-start',
            verticalPosition: 'flex-start',
          },
          effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: false, margin: 0 },
          customize: { cssStyle: '', elementId: '' },
          hover: { textHover: '', style: '' },
          className: null,
        },
        themeLayoutID: null,
        layoutPosition: null,
      },
      {
        isActive: true,

        componentType: 'cms-next-cms-content-container-rendering',
        commonSettings: {
          border: {
            corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
            color: '',
            opacity: 100,
            thickness: 0,
            position: { left: false, top: false, right: false, bottom: false },
          },
          shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
          background: {
            currentStyle: 'COLOR',
            layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
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
            margin: { left: 0, top: 0, right: 0, bottom: 0 },
            padding: { left: 20, top: 20, right: 20, bottom: 20 },
            horizontalPosition: 'flex-start',
            verticalPosition: 'flex-start',
          },
          effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: false, margin: 0 },
          customize: { cssStyle: '', elementId: '' },
          hover: { textHover: '', style: '' },
          className: null,
        },
        themeOption: { themeIdentifier: 'CONTENT' },
        orderNumber: 1,
        layoutID: null,
        layoutPosition: null,
      },
    ] as IRenderingComponentData[];
    const mockResult = {
      html: '<div class="light itp-theme itp-font-default"><div class="itp-theme-header null" id="THEME_HEADER" style="padding:20px"><div class="primary-menu null"  id="THEME_MENU_1" style="" column="null"></div></div><div class="itp-theme-content null" id="CONTENT" style="padding:20px" >[CONTENT]</div></div>',
      css: '',
      js: [],
    };
    const result = await domain.generateStaticHtmlCssJsFromCoponents(components, mode, devices, webPages, defaultCultureUI, action, iframe);
    expect(result).toStrictEqual(mockResult);
  });
});
