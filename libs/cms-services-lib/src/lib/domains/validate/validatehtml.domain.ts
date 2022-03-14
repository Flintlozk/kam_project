import { defaultHTMLTag, EDropzoneType, EnumThemeAttribute, EnumThemeComponentsType, MenuOptionEnum } from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { JSDOM } from 'jsdom';
import * as sanitizeHtml from 'sanitize-html';
export async function validateSectionOfHTML(html: string): Promise<IHTTPResult> {
  const htmlDOM = new JSDOM(html);
  const document = htmlDOM.window.document;
  const themeSectionConfig = [EDropzoneType.THEME_HEADER, EDropzoneType.CONTENT, EDropzoneType.THEME_FOOTER];
  const length = themeSectionConfig.length;
  if (await validateElementOutsideOfSection(document)) {
    if (document.getElementsByTagName('BODY')[0].getElementsByTagName('section').length === themeSectionConfig.length) {
      for (const section of themeSectionConfig) {
        if (!document.getElementById(`${section}`)) {
          return { status: 405, value: `PLEASE INSERT ${section} SECTION` };
        }
      }
      if (await validateLayoutInLayout(document)) {
        if (await validateDuplicateId(document)) {
          if (await validateAttribute(document, EnumThemeAttribute.DATAMODE, [EnumThemeComponentsType.LAYOUT])) {
            if (await validateLayout(document)) {
              const result = await validateXMLOfMenu(document);
              if (result) {
                return await validateCommonsetting(document);
              } else {
                return { status: 405, value: 'WRONG XML MENU COMPONENT' };
              }
            }
            return { status: 405, value: 'PLEASE INSERT DIV AS COMPONENT LAYOUT OPTION' };
          } else {
            return { status: 405, value: `PLEASE INSERT VALUE OF ${EnumThemeAttribute.DATAMODE} IN COMPONENT` };
          }
        } else {
          return { status: 405, value: 'PLEASE DONT USE DUPLICATE DATA ID' };
        }
      } else {
        return { status: 405, value: 'PLEASE DONT USE LAYOUT IN LAYOUT SECTION' };
      }
    } else {
      return { status: 405, value: `PLEASE INSERT ${length} SECTION` };
    }
  } else {
    return { status: 405, value: 'PLEASE INSERT ALL ELEMENT WITHIN SECTION' };
  }
}

export function validateCommonsetting(document: Document): Promise<IHTTPResult> {
  return new Promise((resolve) => {
    // if add more componentType add themeComponentConfig
    const themeComponentConfig = [EnumThemeComponentsType.TEXT, EnumThemeComponentsType.MEDIA_GALLERY, EnumThemeComponentsType.MENU];
    const sanitizeOptions = {
      allowedTags: defaultHTMLTag,
      allowedAttributes: {
        div: ['style', 'data-cmp', 'data-id', 'data-mode', 'class'],
        img: ['src', 'class'],
      },
      allowedStyles: {
        '*': {
          'border-color': [/rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), ((1.00)|0(\.\d{1,2}))\)$/],
          'border-style': [/^solid$/],
          'border-bottom-width': [/^\d+(px)$/],
          'border-width': [/^\d+(px)$/],
          'border-left': [/^none$/],
          'border-right': [/^none$/],
          'border-bottom': [/^none$/],
          'border-top': [/^none$/],
          'border-top-left-radius': [/^\d+(px)$/],
          'border-top-right-radius': [/^\d+(px)$/],
          'border-bottom-left-radius': [/^\d+(px)$/],
          'border-bottom-right-radius': [/^\d+(px)$/],
          'box-shadow': [/none|(^((\d{1,3}(px)) (\d{1,3}(px)) (\d{1,3}(px)) (\d{1,3}(px)) rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),((1.00)|0(\.\d{1,2}))\)))/],
          'margin-left': [/^\d+(px)$/],
          'margin-top': [/^\d+(px)$/],
          'margin-right': [/^\d+(px)$/],
          'margin-bottom': [/^\d+(px)$/],
          'padding-left': [/^\d+(px)$/],
          'padding-top': [/^\d+(px)$/],
          'padding-right': [/^\d+(px)$/],
          'padding-bottom': [/^\d+(px)$/],
          'background-color': [/rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), ((1.00)|0(\.\d{1,2}))\)$/],
        },
      },
    };
    const differenceList = [];
    for (const componentType of themeComponentConfig) {
      document.querySelectorAll(`[data-cmp="${componentType}"]`).forEach((component) => {
        const splitHTML = component.outerHTML.split('>');
        const beforeValidateHTML = splitHTML[0] + '>';
        const afterValidateHTMl = sanitizeHtml(component.outerHTML, sanitizeOptions);
        const difference = getDifference(afterValidateHTMl, beforeValidateHTML);
        if (difference) {
          const dataId = component.getAttribute('data-id');
          differenceList.push({ difference, dataId, componentType });
        }
      });
    }
    if (differenceList.length > 0) {
      resolve({ status: 400, value: JSON.stringify(differenceList) });
    }
    resolve({ status: 200, value: '' });
  });
}
export function validateElementOutsideOfSection(document: Document): Promise<boolean> {
  return new Promise((resolve) => {
    document.querySelectorAll('BODY').forEach((Element) => {
      Element.childNodes.forEach((child) => {
        if (child.nodeName !== 'SECTION') {
          if (child?.nodeValue?.trim().length !== 0) {
            resolve(false);
          }
        }
      });
      resolve(true);
    });
  });
}

export function validateLayoutInLayout(document: Document): Promise<boolean> {
  return new Promise((resolve) => {
    document.querySelectorAll('[data-cmp="THEME_LAYOUT"]').forEach((layOutComponent) => {
      const childlength = layOutComponent.querySelectorAll('[data-cmp="THEME_LAYOUT"]').length;
      if (childlength !== 0) {
        resolve(false);
      }
    });
    resolve(true);
  });
}
export function validateDuplicateId(document: Document): Promise<boolean> {
  return new Promise((resolve) => {
    const themeComponentConfig = [EnumThemeComponentsType.TEXT, EnumThemeComponentsType.LAYOUT, EnumThemeComponentsType.MEDIA_GALLERY];
    let idList = [];
    for (const componentType of themeComponentConfig) {
      document.querySelectorAll(`[data-cmp="${componentType}"]`).forEach((component) => {
        idList.push(component.getAttribute('data-id'));
      });
      const toFindDuplicates = idList.filter((item, index) => idList.indexOf(item) !== index);
      if (toFindDuplicates.length !== 0) resolve(false);
      idList = [];
    }
    resolve(true);
  });
}

export function validateNoChildInComponent(document: Document): Promise<boolean> {
  return new Promise((resolve) => {
    const themeComponentConfig = [EnumThemeComponentsType.TEXT];
    for (const componentType of themeComponentConfig) {
      document.querySelectorAll(`[data-cmp="${componentType}"]`).forEach((component) => {
        if (component.children.length !== 0) resolve(false);
      });
    }
    resolve(true);
  });
}
export function validateAttribute(document: Document, attribute: string, themeComponentConfigOption?: EnumThemeComponentsType[]): Promise<boolean> {
  return new Promise((resolve) => {
    let themeComponentConfig = [EnumThemeComponentsType.TEXT, EnumThemeComponentsType.LAYOUT];
    if (themeComponentConfigOption !== undefined) {
      themeComponentConfig = themeComponentConfigOption;
    }
    for (const componentType of themeComponentConfig) {
      document.querySelectorAll(`[data-cmp="${componentType}"]`).forEach((component) => {
        if (component.getAttribute(attribute) === null) resolve(false);
        if (componentType === EnumThemeComponentsType.LAYOUT && attribute !== EnumThemeAttribute.DATAMODE) {
          for (let i = 0; i < component.children.length; i++) {
            for (let j = 0; j < component.children.item(i).children.length; j++) {
              if (component.children.item(i).children.item(j).tagName === 'DIV') {
                if (component.children.item(i).children.item(j).getAttribute(attribute) === null) resolve(false);
              }
            }
          }
        }
      });
    }
    resolve(true);
  });
}
export function validateLayout(document: Document): Promise<boolean> {
  return new Promise((resolve) => {
    document.querySelectorAll(`[data-cmp="${EnumThemeComponentsType.LAYOUT}"]`).forEach((component) => {
      switch (component.getAttribute(EnumThemeAttribute.DATAMODE)) {
        case 'ONE_COLUMN':
          if (component.children.length !== 1 || component.children.item(0).tagName !== 'DIV') {
            resolve(false);
          }
          break;
        case 'THREE_COLUMN':
          if (
            component.children.length !== 3 ||
            component.children.item(0).tagName !== 'DIV' ||
            component.children.item(1).tagName !== 'DIV' ||
            component.children.item(2).tagName !== 'DIV'
          ) {
            resolve(false);
          }
          break;
        case 'FOUR_COLUMN':
          if (
            component.children.length !== 4 ||
            component.children.item(0).tagName !== 'DIV' ||
            component.children.item(1).tagName !== 'DIV' ||
            component.children.item(2).tagName !== 'DIV' ||
            component.children.item(3).tagName !== 'DIV'
          ) {
            resolve(false);
          }
          break;
        case 'FIVE_FIVE_COLUMN':
          if (component.children.length !== 2 || component.children.item(0).tagName !== 'DIV' || component.children.item(1).tagName !== 'DIV') {
            resolve(false);
          }
          break;
        case 'SIX_FOUR_COLUMN':
          if (component.children.length !== 2 || component.children.item(0).tagName !== 'DIV' || component.children.item(1).tagName !== 'DIV') {
            resolve(false);
          }
          break;
        case 'FOUR_SIX_COLUMN':
          if (component.children.length !== 2 || component.children.item(0).tagName !== 'DIV' || component.children.item(1).tagName !== 'DIV') {
            resolve(false);
          }
          break;
        case 'SEVEN_THREE_COLUMN':
          if (component.children.length !== 2 || component.children.item(0).tagName !== 'DIV' || component.children.item(1).tagName !== 'DIV') {
            resolve(false);
          }
          break;
        case 'THREE_SEVEN_COLUMN':
          if (component.children.length !== 2 || component.children.item(0).tagName !== 'DIV' || component.children.item(1).tagName !== 'DIV') {
            resolve(false);
          }
          break;
      }
    });
    resolve(true);
  });
}

function getDifference(str1: string, str2: string): string {
  let i = 0;
  let j = 0;
  let result = '';

  while (j < str2.length) {
    if (str1[i] !== str2[j] || i === str1.length) {
      result += str2[j];
    } else i++;
    j++;
  }
  return result;
}
function validateXMLOfMenu(document: Document) {
  let validate = true;
  document.querySelectorAll(`[data-cmp="${EnumThemeComponentsType.MENU}"]`).forEach((component) => {
    for (let i = 0; i < component.children.length; i++) {
      validate = validateXMLChild(component.children.item(i));
      if (validate === false) break;
    }
  });
  return validate;
}

function validateXMLChild(element: Element): boolean {
  const setting = [
    MenuOptionEnum.SOURCE,
    MenuOptionEnum.SOURCETYPE,
    MenuOptionEnum.STATUS,
    MenuOptionEnum.STICKY,
    MenuOptionEnum.STYLE,
    MenuOptionEnum.TEXT,
    MenuOptionEnum.TEXTANIMATION,
    MenuOptionEnum.THREE,
    MenuOptionEnum.TWO,
    MenuOptionEnum.TYPE,
    MenuOptionEnum.VALUE,
    MenuOptionEnum.XAXIS,
    MenuOptionEnum.YAXIS,
    MenuOptionEnum._CSS,
    MenuOptionEnum.ACTIVE,
    MenuOptionEnum.ACTIVEICON,
    MenuOptionEnum.ANIMATION,
    MenuOptionEnum.BACKGROUND,
    MenuOptionEnum.BACKGROUNDANIMATION,
    MenuOptionEnum.BLUR,
    MenuOptionEnum.COLOR,
    MenuOptionEnum.COLORS,
    MenuOptionEnum.CULTUREUIHTML,
    MenuOptionEnum.DISTACNE,
    MenuOptionEnum.FEATUREICON,
    MenuOptionEnum.FOUR,
    MenuOptionEnum.GRADIENTCOLOR,
    MenuOptionEnum.HAMBURGER,
    MenuOptionEnum.HOVER,
    MenuOptionEnum.ICON,
    MenuOptionEnum.ICONGROUP,
    MenuOptionEnum.ICONS,
    MenuOptionEnum.IMAGE,
    MenuOptionEnum.INACTIVEICON,
    MenuOptionEnum.ISICON,
    MenuOptionEnum.ISLANGUAGE,
    MenuOptionEnum.ISSEARCH,
    MenuOptionEnum.ISSHADOW,
    MenuOptionEnum.ISTEXT,
    MenuOptionEnum.LEVEL,
    MenuOptionEnum.MEGA,
    MenuOptionEnum.MENUGROUPID,
    MenuOptionEnum.MOBILE,
    MenuOptionEnum.NORMAL,
    MenuOptionEnum.ONE,
    MenuOptionEnum.OPACITY,
    MenuOptionEnum.PARENTMENUID,
    MenuOptionEnum.POSITION,
    MenuOptionEnum.SETTING,
    MenuOptionEnum.SHADOW,
    MenuOptionEnum.SIZE,
  ];
  const name = element.tagName.toLowerCase() as MenuOptionEnum;
  if (setting.includes(name)) {
    for (let i = 0; i < element.children.length; i++) {
      const result = validateXMLChild(element.children.item(i));
      if (result === false) {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
}
