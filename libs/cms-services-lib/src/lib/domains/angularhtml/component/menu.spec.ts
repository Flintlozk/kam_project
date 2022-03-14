import { JSDOM } from 'jsdom';
import * as domain from './menu.domain';
describe('test menuoption', () => {
  //<is-shadow type=''>false</is-shadow>
  const htmlShadow = `<shadow>
    <is-shadow>false</is-shadow>
    <color>#123456</color>
    <opacity>100</opacity>
    <x-axis>0</x-axis>
    <y-axis>0</y-axis>
    <distance>0</distance>
    <blur>0</blur>
</shadow>`;
  const htmlShadowDOM = new JSDOM(htmlShadow);
  const documentShadow = htmlShadowDOM.window.document;
  const expectShadowResult = { blur: 0, color: '#123456', distance: 0, isShadow: false, opacity: 100, xAxis: 0, yAxis: 0 };
  test('test shadow', () => {
    const result = domain.generateMenuLevelSettingShadow(documentShadow.getElementsByTagName('shadow')[0]);
    expect(result).toStrictEqual(expectShadowResult);
  });
  const htmlColorStyle = `<active><style>COLOR</style>
  <color>
      <value>#123456</value>
      <opacity>100</opacity>
  </color>
  <gradient-color>
      <type>LINEAR</type>
      <colors>#123456</colors>
  </gradient-color>
  <menu-image>testImage</menu-image></active>`;
  const htmlColorDOM = new JSDOM(htmlColorStyle);
  const documentColor = htmlColorDOM.window.document;
  const expectColorResult = {
    color: { opacity: 100, value: '#123456' },
    gradientColor: {
      colors: ['#123456'],
      type: 'LINEAR',
    },
    image: 'testImage',
    style: 'COLOR',
  };
  test('test ColorStyle', () => {
    const result = domain.generateMenuLevelSettingColorStyle(documentColor.getElementsByTagName('active')[0]);
    expect(result).toStrictEqual(expectColorResult);
  });
  const htmlLevelSettingStyle = `<one>
  <size>10</size>
  <style>REGULAR</style>
  <text>
      <normal>
          <style>COLOR</style>
          <color>
              <value>#123456</value>
              <opacity>100</opacity>
          </color>
          <gradient-color>
              <type>LINEAR</type>
              <colors>#123456</colors>

          </gradient-color>
          <menu-image>testImage</menu-image>
      </normal>
      <hover>
          <style>COLOR</style>
          <color>
              <value>#123456</value>
              <opacity>100</opacity>
          </color>
          <gradient-color>
              <type>LINEAR</type>
              <colors>#123456</colors>
          </gradient-color>
          <menu-image>testImage</menu-image>
      </hover>
      <active>
          <style>COLOR</style>
          <color>
              <value>#123456</value>
              <opacity>100</opacity>
          </color>
          <gradient-color>
              <type>LINEAR</type>
              <colors>#123456</colors>

          </gradient-color>
          <menu-image>testImage</menu-image>                       
      </active>
  </text>
  <background>
      <normal>
          <style>COLOR</style>
          <color>
              <value>#123456</value>
              <opacity>100</opacity>
          </color>
          <gradient-color>
              <type>LINEAR</type>
              <colors>#123456</colors>

          </gradient-color>
          <menu-image>testImage</menu-image>
      </normal>
      <hover>
          <style>COLOR</style>
          <color>
              <value>#123456</value>
              <opacity>100</opacity>
          </color>
          <gradient-color>
              <type>LINEAR</type>
              <colors>#123456</colors>

          </gradient-color>
          <menu-image>testImage</menu-image>
      </hover>
      <active>
          <style>COLOR</style>
          <color>
              <value>#123456</value>
              <opacity>100</opacity>
          </color>
          <gradient-color>
              <type>LINEAR</type>
              <colors>#123456</colors>

          </gradient-color>
          <menu-image>testImage</menu-image>                       
      </active>
  </background>
  <shadow>
      <is-shadow>false</is-shadow>
      <color>#123456</color>
      <opacity>100</opacity>
      <x-axis>0</x-axis>
      <y-axis>0</y-axis>
      <distance>0</distance>
      <blur>0</blur>
  </shadow>
  <text-animation>STYLE_1</text-animation>
  <background-animation>FADE</background-animation>
</one>`;
  const htmlLevelSettingDOM = new JSDOM(htmlLevelSettingStyle);
  const documentLevelSetting = htmlLevelSettingDOM.window.document;
  const expectLevelSettingResult = {
    backGround: {
      active: {
        color: {
          opacity: 100,
          value: '#123456',
        },
        gradientColor: {
          colors: ['#123456'],
          type: 'LINEAR',
        },
        image: 'testImage',
        style: 'COLOR',
      },
      hover: {
        color: {
          opacity: 100,
          value: '#123456',
        },
        gradientColor: {
          colors: ['#123456'],
          type: 'LINEAR',
        },
        image: 'testImage',
        style: 'COLOR',
      },
      normal: {
        color: {
          opacity: 100,
          value: '#123456',
        },
        gradientColor: {
          colors: ['#123456'],
          type: 'LINEAR',
        },
        image: 'testImage',
        style: 'COLOR',
      },
    },
    backgroundAnimation: 'overlay-fade',
    shadow: {
      blur: 0,
      color: '#123456',
      distance: 0,
      isShadow: false,
      opacity: 100,
      xAxis: 0,
      yAxis: 0,
    },
    size: 10,
    style: 'Regular',
    text: {
      active: {
        color: {
          opacity: 100,
          value: '#123456',
        },
        gradientColor: {
          colors: ['#123456'],
          type: 'LINEAR',
        },
        image: 'testImage',
        style: 'COLOR',
      },
      hover: {
        color: {
          opacity: 100,
          value: '#123456',
        },
        gradientColor: {
          colors: ['#123456'],
          type: 'LINEAR',
        },
        image: 'testImage',
        style: 'COLOR',
      },
      normal: {
        color: {
          opacity: 100,
          value: '#123456',
        },
        gradientColor: {
          colors: ['#123456'],
          type: 'LINEAR',
        },
        image: 'testImage',
        style: 'COLOR',
      },
    },
    textAnimation: 'text-hover-style-1',
  };
  test('test Level setting', () => {
    const result = domain.generateMenuLevelSetting(documentLevelSetting.getElementsByTagName('one')[0]);
    expect(result).toStrictEqual(expectLevelSettingResult);
  });
});
