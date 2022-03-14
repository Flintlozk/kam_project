import mongoose, { Schema, Document } from 'mongoose';
import { IWebsiteConfig } from '@reactor-room/cms-models-lib';

const DatausePrivacyPolicySettingSchema = new Schema({
  is_active: Boolean,
  data_use: String,
  privacy_policy: String,
});
const CSSWithLanguage = {
  language: String,
  stylesheet: String,
};
const CSSSettingSchema = new Schema({
  global: String,
  css_with_language: [CSSWithLanguage],
});
const SEOSettingSchema = new Schema({
  culture_ui: String,
  title: String,
  keyword: [String],
  description: String,
});
const MetaTagsSchema = new Schema({
  meta_tag: String,
  body_tag: String,
  javascript: String,
});

const linkType = {
  selected_link_type: String, // ENUM
  link_types: [String], // ENUM
  target_url: String,
  target_href: {
    selected_target_href: String, // ENUM
    target_href: [String], // ENUM // New Window , Current Window
  },
};
const generalSchema = {
  temporary_close: Boolean, //
  favicon: { image_url: String }, //
  email_sender_name: String, //
  general: {
    header: {
      language_flag: Boolean,
      fixed_top_menu: Boolean, // Extra settting
      fixed_top_menu_setting: {
        full_screen: Boolean,
        image_url: String, // Uploaded URL
        link_type: linkType,
      },
      shop_cart: Boolean, // Extra settting
      shop_cart_setting: {
        shopcart_icon: Number,
        icon_color: { rgb: String, alpha: Number },
        text_color: { rgb: String, alpha: Number },
      },
      currency_converter: Boolean, // Extra settting
      currency_converter_setting: {
        main_converter: String,
        selected_main_converter: [String],
      },
    },
    content: {
      scrollbar: Boolean,
      disable_right_click: Boolean,
      back_to_top_button: Boolean, // Extra Setting
      back_to_top_button_setting: {
        image_url: String, // Uploaded URL
        position: String, // Bottom Left,Center,Right ENUM
      },
      facebook_comment_tab: Boolean, // Extra Setting
      facebook_comment_tab_setting: {
        comment_tab: Boolean,
        allow_member_only: Boolean,
      },
      advertising_display: Boolean, //  Images,Youtube (Remarketing Ads)/ Extra Setting
      advertising_display_setting: {
        position: String, // Top Right , Top Left , Bottom Right , Bottom Left, ENUM
        size: String, // small,medium,big ENUM
        upload: {
          image_url: String, // Uploaded URL
          link_type: linkType,
        },
        share_clip: {
          embedded_link: String,
        },
      },
      webp_format_system: Boolean,
      printer: Boolean,
      preview_custom_form: Boolean,
    },
    login: {
      social_login: Boolean,
    },
    notification: {
      show_as_modal: Boolean, // Toast to Modal(Dialog)
    },
    view: {
      support_responsive: Boolean,
      picture_display: Boolean, // Extra Setting
      picture_display_setting: {
        width: Number,
        height: Number,
        units: String, // REM,EM, PX, PT, CM, IN
        selected_upload: String,
        image_url: String,
        end_time: {
          is_active: Boolean,
          duration: Number, // unit as second
        },
        display_on_mobile: {
          is_active: Boolean,
        },
        image: {
          link_type: linkType,
        },
      },
      shortened_url_display: Boolean,
    },
  },
  mobile_view: {
    header: {
      fixed_top_menu: Boolean,
    },
    sidebar_menu: {
      sidebar_menu: Boolean,
      sidebar_submenu_auto: Boolean,
    },
    content: {
      search_button: Boolean,
      side_information: Boolean,
      increase_image_size: Boolean,
    },
  },
  language: {
    defaultCultureUI: String,
    selectedCultureUIs: [String], //
  },
  notification: {
    push_notifications: {
      line_notify: {
        is_active: Boolean,
        line_notify_token: String,
      },
      email: {
        is_active: Boolean,
        emails: [String],
      },
    },
    activity: {
      new_order: Boolean,
      new_messages: Boolean,
      new_comments: Boolean,
      reject_order: Boolean,
      submit_form: Boolean,
      field_update: Boolean,
    },
  },
  search: {
    maximun_search_results: {
      selected_maximum_result: Number,
      maximum_results: [Number],
    },
    define_search_score: Number,
    search_pattern: {
      pattern_index: Number,
    },
    search_pattern_setting: {
      button: {
        selected_button: String, // ENUM
        button_types: [String], // ENUM // Normal , Hover, Active
      },
      search_icon: {
        selected_search_icon: String, // ENUM
        search_icons: [String], // ENUM // New Window , Current Window
      },
      icon_color: {
        // ! Must belong to theme
        rgb: String,
        alpha: Number,
      },
      text_color: {
        // ! Must belong to theme
        rgb: String,
        alpha: Number,
      },
      background_color: {
        // ! Must belong to theme
        alpha: String,
        type: String, // Solid , Linear , Image,
        solid: {
          rgb: String,
          alpha: Number,
        },
        linear: {
          rgb: [String],
          alpha: Number,
        },
        image: {
          url: String,
          alpha: Number,
        },
      },
    },
    search_landing_page: {
      landing_page_index: Number,
    },
    search_type: {
      default_search_type: String,
      search_types: [String],
    },
  },
};

export const configSchemaModel = mongoose?.model<IWebsiteConfig & Document>(
  'z_cms_config',
  new Schema({
    page_id: Number,
    theme_id: Schema.Types.ObjectId,
    updatedAt: Schema.Types.Date,
    upload_folder: String,
    style: String,
    shortcuts: [String],
    general: generalSchema,
    seo_setting: SEOSettingSchema,
    meta_tags: MetaTagsSchema,
    css_setting: CSSSettingSchema,
    datause_privacy_policy_setting: DatausePrivacyPolicySettingSchema,
  }),
);
