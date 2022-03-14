import * as defaultConfig from './default-config.domain';
import {
  EnumLanguageCultureUI,
  IWebsiteConfigCSS,
  IWebsiteConfigDataPrivacy,
  IWebsiteConfigMeta,
  IWebsiteConfigGeneral,
  IWebsiteConfigSEO,
  IWebsiteConfigGeneralLanguage,
  EnumConfigTargetHref,
  EnumConfigLinkTypes,
  EnumCurrency,
} from '../../../../../cms-models-lib/src';

describe('default config test', () => {
  const expectedValueDataPrivacy: IWebsiteConfigDataPrivacy = { is_active: false, data_use: 'DATA USE', privacy_policy: 'PRIVACY POLICY' };
  const expectedValueGeneral: IWebsiteConfigGeneral = {
    temporary_close: false,
    favicon: { image_url: '' },
    email_sender_name: '',
    general: {
      header: {
        language_flag: false,
        fixed_top_menu: false,
        fixed_top_menu_setting: {
          full_screen: false,
          image_url: '',
          link_type: {
            selected_link_type: EnumConfigLinkTypes.LINK,
            link_types: [EnumConfigLinkTypes.ID, EnumConfigLinkTypes.JAVASCRIPT, EnumConfigLinkTypes.LINK, EnumConfigLinkTypes.MAILTO, EnumConfigLinkTypes.TEL],
            target_url: '',
            target_href: {
              selected_target_href: EnumConfigTargetHref.NEW_WINDOW,
              target_href: [EnumConfigTargetHref.NEW_WINDOW, EnumConfigTargetHref.CURRENT_WINDOW],
            },
          },
        },
        shop_cart: false,
        shop_cart_setting: {
          shopcart_icon: 0,
          icon_color: { rgb: '#000000', alpha: 100 },
          text_color: { rgb: '#000000', alpha: 100 },
        },
        currency_converter: false,
        currency_converter_setting: {
          main_converter: EnumCurrency.USD,
          selected_main_converter: [EnumCurrency.THB, EnumCurrency.USD],
        },
      },
      content: {
        scrollbar: false,
        disable_right_click: false,
        back_to_top_button: false,
        back_to_top_button_setting: {
          image_url: '',
          position: '',
        },
        facebook_comment_tab: false,
        facebook_comment_tab_setting: {
          comment_tab: false,
          allow_member_only: false,
        },
        advertising_display: false,
        advertising_display_setting: {
          position: '',
          size: '',
          upload: {
            image_url: '',
            link_type: {
              selected_link_type: EnumConfigLinkTypes.LINK,
              link_types: [EnumConfigLinkTypes.ID, EnumConfigLinkTypes.JAVASCRIPT, EnumConfigLinkTypes.LINK, EnumConfigLinkTypes.MAILTO, EnumConfigLinkTypes.TEL],
              target_url: '',
              target_href: {
                selected_target_href: EnumConfigTargetHref.NEW_WINDOW,
                target_href: [EnumConfigTargetHref.NEW_WINDOW, EnumConfigTargetHref.CURRENT_WINDOW],
              },
            },
          },
          share_clip: {
            embedded_link: '',
          },
        },
        webp_format_system: false,
        printer: false,
        preview_custom_form: false,
      },
      notification: {
        show_as_modal: false,
      },
      login: {
        social_login: false,
      },
      view: {
        support_responsive: false,
        picture_display: false,
        picture_display_setting: {
          width: 0,
          height: 0,
          units: '',
          selected_upload: 'Image',
          image_url: '',
          image: {
            link_type: {
              selected_link_type: EnumConfigLinkTypes.LINK,
              link_types: [EnumConfigLinkTypes.ID, EnumConfigLinkTypes.JAVASCRIPT, EnumConfigLinkTypes.LINK, EnumConfigLinkTypes.MAILTO, EnumConfigLinkTypes.TEL],
              target_url: '',
              target_href: {
                selected_target_href: EnumConfigTargetHref.NEW_WINDOW,
                target_href: [EnumConfigTargetHref.NEW_WINDOW, EnumConfigTargetHref.CURRENT_WINDOW],
              },
            },
          },
          end_time: {
            is_active: false,
            duration: 0,
          },
          display_on_mobile: {
            is_active: false,
          },
        },
        shortened_url_display: false,
      },
    },
    mobile_view: {
      header: {
        fixed_top_menu: false,
      },
      sidebar_menu: {
        sidebar_menu: false,
        sidebar_submenu_auto: false,
      },
      content: {
        search_button: false,
        side_information: false,
        increase_image_size: false,
      },
    },
    language: {
      defaultCultureUI: EnumLanguageCultureUI.TH,
      selectedCultureUIs: [], //
    },
    notification: {
      push_notifications: {
        line_notify: {
          is_active: false,
          line_notify_token: '',
        },
        email: {
          is_active: false,
          emails: [],
        },
      },
      activity: {
        new_order: false,
        new_messages: false,
        new_comments: false,
        reject_order: false,
        submit_form: false,
        field_update: false,
      },
    },
    search: {
      maximun_search_results: {
        selected_maximum_result: 20,
        maximum_results: [20, 40, 60, 80, 100, 120],
      },
      define_search_score: 0,
      search_pattern: {
        pattern_index: 0,
      },
      search_pattern_setting: {
        button: {
          selected_button: '',
          button_types: [],
        },
        search_icon: {
          selected_search_icon: '',
          search_icons: [],
        },
        icon_color: {
          rgb: '#000000',
          alpha: 100,
        },
        text_color: {
          rgb: '#000000',
          alpha: 100,
        },
        background_color: {
          alpha: '',
          type: '',
          solid: {
            rgb: '#000000',
            alpha: 100,
          },
          linear: {
            rgb: [],
            alpha: 100,
          },
          image: {
            url: '',
            alpha: 100,
          },
        },
      },
      search_landing_page: {
        landing_page_index: 0,
      },
      search_type: {
        default_search_type: 'General Website',
        search_types: ['General Website', 'Content System', 'Shopping Cart'],
      },
    },
  };
  const expectedValueSEO: IWebsiteConfigSEO = {
    culture_ui: 'TH',
    title: '',
    keyword: [],
    description: '',
  };
  const expectedValueMeta: IWebsiteConfigMeta = {
    meta_tag: '',
    body_tag: '',
    javascript: '',
  };

  const expectedValueCSS: IWebsiteConfigCSS = {
    global: '',
    css_with_language: [],
  };

  const expectedValueLanguages: IWebsiteConfigGeneralLanguage = {
    defaultCultureUI: EnumLanguageCultureUI.TH,
    selectedCultureUIs: [],
  };
  test('getDefaultConfigDataPolicy should get default value', () => {
    const result = defaultConfig.getDefaultConfigDataPolicy();
    expect(result).toEqual(expectedValueDataPrivacy);
  });

  test('getDefaultConfigData should get default value', () => {
    const result = defaultConfig.getDefaultConfigData();
    expect(result).toEqual(expectedValueGeneral);
  });

  test('getDefaultConfigSEO should get default value', () => {
    const result = defaultConfig.getDefaultConfigSEO();
    expect(result).toEqual(expectedValueSEO);
  });

  test('getDefaultConfigMeta should get default value', () => {
    const result = defaultConfig.getDefaultConfigMeta();
    expect(result).toEqual(expectedValueMeta);
  });

  test('getDefaultConfigCSS should get default value', () => {
    const result = defaultConfig.getDefaultConfigCSS();
    expect(result).toEqual(expectedValueCSS);
  });

  test('getDefaulConfigLanguages should get default value', () => {
    const result = defaultConfig.getDefaulConfigLanguages();
    expect(result).toEqual(expectedValueLanguages);
  });
});
