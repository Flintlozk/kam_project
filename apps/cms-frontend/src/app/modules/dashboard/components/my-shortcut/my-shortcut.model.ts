import { DropListRef } from '@angular/cdk/drag-drop';
import { EnumShortcut, RouteLinkEnum } from '@reactor-room/cms-models-lib';

export interface IShortcut {
  title: string;
  imgUrl: string;
  imgActiveUrl: string;
  isDefault: boolean;
  isActive: boolean;
  childNode?: IShortcut[];
  shortcutId: number;
  route: string;
  isToggle?: boolean;
}

export interface IShortcutDropped {
  container: DropListRef<IShortcutData>;
  previousContainer: DropListRef<IShortcutData>;
}

export interface IShortcutData {
  index: number;
  item: IShortcut;
}

export const shortcutsData: IShortcut[] = [
  {
    title: EnumShortcut.WEBSITE_MANAGEMENT,
    imgUrl: 'assets/shortcuts/website-management.svg',
    imgActiveUrl: 'assets/shortcuts/website-management-a.svg',
    isDefault: true,
    isActive: true,
    childNode: [] as IShortcut[],
    shortcutId: 8,
    route: '/' + RouteLinkEnum.SHORTCUT_WEBSITE_MANAGEMENT,
    isToggle: false,
  },
  {
    title: EnumShortcut.CONTENT_MANAGEMENT,
    imgUrl: 'assets/shortcuts/content-management.svg',
    imgActiveUrl: 'assets/shortcuts/content-management-a.svg',
    isDefault: true,
    isActive: true,
    childNode: [] as IShortcut[],
    shortcutId: 9,
    route: RouteLinkEnum.SHORTCUT_CONTENT_MANAGEMENT,
    isToggle: false,
  },
  {
    title: EnumShortcut.CREATE_PAGE,
    imgUrl: 'assets/shortcuts/create-page.svg',
    imgActiveUrl: 'assets/shortcuts/create-page-a.svg',
    isDefault: false,
    isActive: false,
    childNode: [] as IShortcut[],
    shortcutId: 1,
    route: '/' + RouteLinkEnum.SHORTCUT_CREATE_PAGE,
    isToggle: false,
  },
  {
    title: EnumShortcut.PREVIEW,
    imgUrl: 'assets/shortcuts/preview.svg',
    imgActiveUrl: 'assets/shortcuts/preview-a.svg',
    isDefault: false,
    isActive: false,
    childNode: [] as IShortcut[],
    shortcutId: 2,
    route: '/' + RouteLinkEnum.SHORTCUT_PREVIEW,
    isToggle: false,
  },
  {
    title: EnumShortcut.FILE_MANAGEMENT,
    imgUrl: 'assets/shortcuts/file-management.svg',
    imgActiveUrl: 'assets/shortcuts/file-management-a.svg',
    isDefault: false,
    isActive: false,
    childNode: [] as IShortcut[],
    shortcutId: 3,
    route: RouteLinkEnum.SHORTCUT_FILE_MANAGEMENT,
    isToggle: false,
  },
  {
    title: EnumShortcut.E_COMMERCE,
    imgUrl: 'assets/shortcuts/e-commerce.svg',
    imgActiveUrl: 'assets/shortcuts/e-commerce-a.svg',
    isDefault: false,
    isActive: false,
    childNode: [
      {
        title: EnumShortcut.PRODUCT_MANAGEMENT,
        imgUrl: 'assets/shortcuts/e-commerce/product-management.svg',
        imgActiveUrl: 'assets/shortcuts/e-commerce/product-management-a.svg',
        isDefault: false,
        isActive: false,
        shortcutId: 41,
        route: RouteLinkEnum.SHORTCUT_PRODUCT_MANAGEMENT,
      },
      {
        title: EnumShortcut.SHOP_INFORMATION,
        imgUrl: 'assets/shortcuts/e-commerce/shop-information.svg',
        imgActiveUrl: 'assets/shortcuts/e-commerce/shop-information-a.svg',
        isDefault: false,
        isActive: false,
        shortcutId: 42,
        route: RouteLinkEnum.SHORTCUT_SHOP_INFORMATION,
      },
      {
        title: EnumShortcut.ORDER_MANAGEMENT,
        imgUrl: 'assets/shortcuts/e-commerce/order-management.svg',
        imgActiveUrl: 'assets/shortcuts/e-commerce/order-management-a.svg',
        isDefault: false,
        isActive: false,
        shortcutId: 43,
        route: RouteLinkEnum.SHORTCUT_ORDER_MANAGEMENT,
      },
      {
        title: EnumShortcut.SHIPPING_SYSTEM,
        imgUrl: 'assets/shortcuts/e-commerce/shipping-system.svg',
        imgActiveUrl: 'assets/shortcuts/e-commerce/shipping-system-a.svg',
        isDefault: false,
        isActive: false,
        shortcutId: 44,
        route: RouteLinkEnum.SHORTCUT_SHIPPING_SYSTEM,
      },
      {
        title: EnumShortcut.PAYMENT_SYSTEM,
        imgUrl: 'assets/shortcuts/e-commerce/payment-system.svg',
        imgActiveUrl: 'assets/shortcuts/e-commerce/payment-system-a.svg',
        isDefault: false,
        isActive: false,
        shortcutId: 45,
        route: RouteLinkEnum.SHORTCUT_PAYMENT_SYSTEM,
      },
      {
        title: EnumShortcut.PROMOTION,
        imgUrl: 'assets/shortcuts/e-commerce/promotion.svg',
        imgActiveUrl: 'assets/shortcuts/e-commerce/promotion-a.svg',
        isDefault: false,
        isActive: false,
        shortcutId: 46,
        route: RouteLinkEnum.SHORTCUT_PROMOTION,
      },
      {
        title: EnumShortcut.SALE_CHANNEL,
        imgUrl: 'assets/shortcuts/e-commerce/sale-channel.svg',
        imgActiveUrl: 'assets/shortcuts/e-commerce/sale-channel-a.svg',
        isDefault: false,
        isActive: false,
        shortcutId: 47,
        route: RouteLinkEnum.SHORTCUT_SALE_CHANNEL,
      },
    ] as IShortcut[],
    shortcutId: 4,
    route: '',
    isToggle: false,
  },
  {
    title: EnumShortcut.TRASH,
    imgUrl: 'assets/shortcuts/trash.svg',
    imgActiveUrl: 'assets/shortcuts/trash-a.svg',
    isDefault: false,
    isActive: false,
    childNode: [] as IShortcut[],
    shortcutId: 5,
    route: RouteLinkEnum.SHORTCUT_TRASH,
    isToggle: false,
  },
  {
    title: EnumShortcut.INBOX,
    imgUrl: 'assets/shortcuts/inbox.svg',
    imgActiveUrl: 'assets/shortcuts/inbox-a.svg',
    isDefault: false,
    isActive: false,
    childNode: [] as IShortcut[],
    shortcutId: 6,
    route: RouteLinkEnum.SHORTCUT_INBOX,
    isToggle: false,
  },
  {
    title: EnumShortcut.THEME_SETTING,
    imgUrl: 'assets/shortcuts/template-setting.svg',
    imgActiveUrl: 'assets/shortcuts/template-setting-a.svg',
    isDefault: false,
    isActive: false,
    childNode: [] as IShortcut[],
    shortcutId: 7,
    route: RouteLinkEnum.SHORTCUT_TEMPLATE_SETTING,
    isToggle: false,
  },
];
