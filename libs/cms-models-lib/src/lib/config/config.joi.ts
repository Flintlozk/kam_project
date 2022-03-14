import * as Joi from 'joi';

export const ConfigThemeRequest = {
  configTheme: Joi.object({
    theme_id: Joi.string().required(),
    updatedAt: Joi.string().required(),
  }).required(),
};

export const ConfigShortcutRequest = {
  configShortcuts: Joi.array().items(Joi.string().allow('').allow(null)),
};

export const ConfigStyleRequest = {
  style: Joi.string().allow('').allow(null),
};
export const ConfigCSSRequest = {
  configCSS: Joi.object()
    .keys({
      global: Joi.string().allow('').allow(null).optional(),
      css_with_language: Joi.array()
        .items(
          Joi.object().keys({
            language: Joi.string().allow('').allow(null).optional(),
            stylesheet: Joi.string().allow('').allow(null).optional(),
          }),
        )
        .optional(),
    })
    .required(),
};
export const ConfigThemeResponse = {
  theme_id: Joi.string().required(),
  updatedAt: Joi.string().allow('').allow(null),
};

export const ConfigGeneralLanguage = {
  language: Joi.object({
    defaultCultureUI: Joi.string().optional(),
    selectedCultureUIs: Joi.array().items(Joi.string().allow('').allow(null)).optional(),
  }).optional(),
};

export const ConfigGeneralTemporaryClose = {
  temporary_close: Joi.boolean().optional(),
};
export const ConfigGeneralFavicon = {
  favicon: Joi.object()
    .keys({
      image_url: Joi.string().allow('').allow(null).optional(),
    })
    .optional(),
};

export const ConfigGeneralEmailSenderName = {
  email_sender_name: Joi.string().allow('').allow(null).optional(),
};
export const ConfigGeneralGeneral = {
  general: Joi.object()
    .keys({
      header: Joi.object()
        .keys({
          language_flag: Joi.boolean().optional(),
          fixed_top_menu: Joi.boolean().optional(),
          fixed_top_menu_setting: Joi.object()
            .keys({
              full_screen: Joi.boolean().optional(),
              image_url: Joi.string().optional(),
              link_type: Joi.object()
                .keys({
                  selected_link_type: Joi.string().optional(),
                  link_types: Joi.array().items(Joi.string().allow('').allow(null)).optional(),
                  target_url: Joi.string().optional(),
                  target_href: Joi.object()
                    .keys({
                      selected_target_href: Joi.string().optional(),
                      target_href: Joi.array().items(Joi.string().allow('').allow(null)).optional(),
                    })
                    .optional(),
                })
                .optional(),
            })
            .optional(),

          shop_cart: Joi.boolean().optional(),

          shop_cart_setting: Joi.object()
            .keys({
              shopcart_icon: Joi.number().optional(),
              icon_color: Joi.object().keys({ rgb: Joi.string().optional(), alpha: Joi.number().optional() }).optional(),
              text_color: Joi.object().keys({ rgb: Joi.string().optional(), alpha: Joi.number().optional() }).optional(),
            })
            .optional(),

          currency_converter: Joi.boolean().optional(),

          currency_converter_setting: Joi.object()
            .keys({
              main_converter: Joi.string().optional(),
              selected_main_converter: Joi.array().items(Joi.string()).optional(),
            })
            .optional(),
        })
        .optional(),

      content: Joi.object()
        .keys({
          scrollbar: Joi.boolean().optional(),
          disable_right_click: Joi.boolean().optional(),
          back_to_top_button: Joi.boolean().optional(),
          back_to_top_button_setting: Joi.object()
            .keys({
              image_url: Joi.string().optional(), // Uploaded URL
              position: Joi.string().optional(), // Bottom Left,Center,Right ENUM
            })
            .optional(),
          facebook_comment_tab: Joi.boolean().optional(), // Extra Setting
          facebook_comment_tab_setting: Joi.object()
            .keys({
              comment_tab: Joi.boolean().optional(),
              allow_member_only: Joi.boolean().optional(),
            })
            .optional(),
          advertising_display: Joi.boolean().optional(), //  Images,Youtube (Remarketing Ads)/ Extra Setting
          advertising_display_setting: Joi.object()
            .keys({
              position: Joi.string().optional(), // Top Right , Top Left , Bottom Right , Bottom Left, ENUM
              size: Joi.string().optional(), // small,medium,big ENUM
              upload: Joi.object()
                .keys({
                  image_url: Joi.string().optional(), // Uploaded URL
                  link_type: Joi.object()
                    .keys({
                      selected_link_type: Joi.string().optional(),
                      link_types: Joi.array().items(Joi.string().allow('').allow(null)).optional(),
                      target_url: Joi.string().optional(),
                      target_href: Joi.object()
                        .keys({
                          selected_target_href: Joi.string().optional(),
                          target_href: Joi.array().items(Joi.string().allow('').allow(null)).optional(),
                        })
                        .optional(),
                    })
                    .optional(),
                })
                .optional(),
              share_clip: Joi.object()
                .keys({
                  embedded_link: Joi.string().optional(),
                })
                .optional(),
            })
            .optional(),
          webp_format_system: Joi.boolean().optional(),
          printer: Joi.boolean().optional(),
          preview_custom_form: Joi.boolean().optional(),
        })
        .optional(),

      notification: Joi.object()
        .keys({
          show_as_modal: Joi.boolean().optional(),
        })
        .optional(),
      login: Joi.object()
        .keys({
          social_login: Joi.boolean().optional(),
        })
        .optional(),
      view: Joi.object()
        .keys({
          support_responsive: Joi.boolean().optional(),
          picture_display: Joi.boolean().optional(),
          picture_display_setting: Joi.object()
            .keys({
              width: Joi.number().optional(),
              height: Joi.number().optional(),
              units: Joi.string().optional(),
              image_url: Joi.string().optional(),
              selected_upload: Joi.string().optional(),
              end_time: Joi.object()
                .keys({
                  is_active: Joi.boolean().optional(),
                  duration: Joi.number().optional(),
                })
                .optional(),
              display_on_mobile: Joi.object()
                .keys({
                  is_active: Joi.boolean().optional(),
                })
                .optional(),

              image: Joi.object().keys({
                link_type: Joi.object().keys({
                  selected_link_type: Joi.string().allow('').allow(null).optional(),
                  link_types: Joi.array().items(Joi.string().allow('').allow(null)).optional(),
                  target_url: Joi.string().allow('').allow(null).optional(),
                  target_href: Joi.object()
                    .keys({
                      selected_target_href: Joi.string().allow('').allow(null).optional(),
                      target_href: Joi.array().items(Joi.string().allow('').allow(null)).optional(),
                    })
                    .optional(),
                }),
              }),
            })
            .optional(),
          shortened_url_display: Joi.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
};
export const ConfigGeneralMobileView = {
  mobile_view: Joi.object()
    .keys({
      header: Joi.object()
        .keys({
          fixed_top_menu: Joi.boolean().optional(),
        })
        .optional(),
      sidebar_menu: Joi.object()
        .keys({
          sidebar_menu: Joi.boolean().optional(),
          sidebar_submenu_auto: Joi.boolean().optional(),
        })
        .optional(),
      content: Joi.object().keys({
        search_button: Joi.boolean().optional(),
        side_information: Joi.boolean().optional(),
        increase_image_size: Joi.boolean().optional(),
      }),
    })
    .optional(),
};
export const ConfigGeneralNotification = {
  notification: Joi.object()
    .keys({
      push_notifications: Joi.object()
        .keys({
          line_notify: Joi.object()
            .keys({
              is_active: Joi.boolean().optional(),
              line_notify_token: Joi.string().when('is_active', { is: true, then: Joi.required() }),
            })
            .optional(),
          email: Joi.object()
            .keys({
              is_active: Joi.boolean().optional(),
              emails: Joi.array().items(Joi.string()).when('is_active', { is: true, then: Joi.required() }),
            })
            .optional(),
        })
        .optional(),

      activity: Joi.object()
        .keys({
          new_order: Joi.boolean().optional(),
          new_messages: Joi.boolean().optional(),
          new_comments: Joi.boolean().optional(),
          reject_order: Joi.boolean().optional(),
          submit_form: Joi.boolean().optional(),
          field_update: Joi.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
};

export const ConfigGeneralSearch = {
  search: Joi.object()
    .keys({
      maximun_search_results: Joi.object()
        .keys({
          selected_maximum_result: Joi.number().optional(),
          maximum_results: Joi.array().items(Joi.number().optional()).optional(),
        })
        .optional(),
      define_search_score: Joi.number().optional(),
      search_pattern: Joi.object()
        .keys({
          pattern_index: Joi.number().optional(),
        })
        .optional(),
      search_pattern_setting: Joi.object().keys({
        button: Joi.object()
          .keys({
            selected_button: Joi.string().optional(),
            button_types: Joi.array().items(Joi.string().optional()).optional(),
          })
          .optional(),
        search_icon: Joi.object()
          .keys({
            selected_search_icon: Joi.string().optional(),
            search_icons: Joi.array().items(Joi.string().optional()).optional(),
          })
          .optional(),
        icon_color: Joi.object()
          .keys({
            rgb: Joi.string().optional(),
            alpha: Joi.number().optional(),
          })
          .optional(),
        text_color: Joi.object().keys({
          rgb: Joi.string().optional(),
          alpha: Joi.number().optional(),
        }),
        background_color: Joi.object()
          .keys({
            alpha: Joi.string().optional(),
            type: Joi.string().optional(),
            solid: Joi.object()
              .keys({
                rgb: Joi.string().optional(),
                alpha: Joi.number().optional(),
              })
              .optional(),
            linear: Joi.object()
              .keys({
                rgb: Joi.array().items(Joi.string().optional()).optional(),
                alpha: Joi.number().optional(),
              })
              .optional(),
            image: Joi.object()
              .keys({
                url: Joi.string().optional(),
                alpha: Joi.number().optional(),
              })
              .optional(),
          })
          .optional(),
      }),
      search_landing_page: Joi.object()
        .keys({
          landing_page_index: Joi.number().optional(),
        })
        .optional(),
      search_type: Joi.object().keys({
        default_search_type: Joi.string().optional(),
        search_types: Joi.array().items(Joi.string().optional()).optional(),
      }),
    })
    .optional(),
};
export const ConfigGeneralRequest = {
  configGeneral: Joi.object({})
    .concat(Joi.object(ConfigGeneralLanguage))
    .concat(Joi.object(ConfigGeneralTemporaryClose))
    .concat(Joi.object(ConfigGeneralFavicon))
    .concat(Joi.object(ConfigGeneralEmailSenderName))
    .concat(Joi.object(ConfigGeneralGeneral))
    .concat(Joi.object(ConfigGeneralMobileView))
    .concat(Joi.object(ConfigGeneralNotification))
    .concat(Joi.object(ConfigGeneralSearch))
    .required(),
};

export const ConfigSEORequest = {
  configSEO: Joi.object()
    .keys({
      culture_ui: Joi.string().allow('').allow(null).optional(),
      title: Joi.string().allow('').allow(null).optional(),
      keyword: Joi.array().items(Joi.string().allow('').allow(null)).optional(),
      description: Joi.string().allow('').allow(null).optional(),
    })
    .required(),
};
export const ConfigMetaRequest = {
  configMeta: Joi.object()
    .keys({
      meta_tag: Joi.string().allow('').allow(null).optional(),
      body_tag: Joi.string().allow('').allow(null).optional(),
      javascript: Joi.string().allow('').allow(null).optional(),
    })
    .required(),
};

export const ConfigMetaResponse = {
  meta_tag: Joi.string().allow('').allow(null).required(),
  body_tag: Joi.string().allow('').allow(null).required(),
  javascript: Joi.string().allow('').allow(null).required(),
};

export const ConfigSEOResponse = {
  culture_ui: Joi.string().allow('').allow(null).required(),
  description: Joi.string().allow('').allow(null).required(),
  keyword: Joi.array().items(Joi.string().allow('').allow(null)).required(),
  title: Joi.string().allow('').allow(null).required(),
};

export const ConfigCSSResponse = {
  global: Joi.string().allow('').allow(null).required(),
  css_with_language: Joi.array()
    .items(
      Joi.object().keys({
        language: Joi.string().allow('').allow(null).required(),
        stylesheet: Joi.string().allow('').allow(null).required(),
      }),
    )
    .required(),
};

export const ConfigDataPrivacyResponse = {
  is_active: Joi.boolean().required(),
  data_use: Joi.string().allow('').allow(null).required(),
  privacy_policy: Joi.string().allow('').allow(null).required(),
};

export const ConfigDataPrivacyRequest = {
  configDataPrivacy: Joi.object()
    .keys({
      is_active: Joi.boolean().optional(),
      data_use: Joi.string().allow('').allow(null).optional(),
      privacy_policy: Joi.string().allow('').allow(null).optional(),
    })
    .required(),
};

export const ConfigGeneralResponse = {
  language: Joi.object({
    defaultCultureUI: Joi.string().allow('').optional(),
    selectedCultureUIs: Joi.array().items(Joi.string().allow('').allow(null)).required(),
  }).required(),

  temporary_close: Joi.boolean().required(),

  general: Joi.object({
    header: Joi.object({
      language_flag: Joi.boolean().required(),
      fixed_top_menu: Joi.boolean().required(),
      fixed_top_menu_setting: Joi.object().keys({
        full_screen: Joi.boolean().required(),
        image_url: Joi.string().allow('').allow(null).required(),
        link_type: Joi.object().keys({
          selected_link_type: Joi.string().allow('').allow(null).required(),
          link_types: Joi.array().items(Joi.string().allow('').allow(null)).required(),
          target_url: Joi.string().allow('').allow(null).required(),
          target_href: Joi.object()
            .keys({
              selected_target_href: Joi.string().allow('').allow(null).required(),
              target_href: Joi.array().items(Joi.string().allow('').allow(null)).required(),
            })
            .required(),
        }),
      }),

      shop_cart: Joi.boolean().required(),

      shop_cart_setting: Joi.object()
        .keys({
          shopcart_icon: Joi.number().required(),
          icon_color: Joi.object()
            .keys({ rgb: Joi.string().allow('').allow(null).required(), alpha: Joi.number().allow('').allow(null).required() })
            .required(),
          text_color: Joi.object()
            .keys({ rgb: Joi.string().allow('').allow(null).required(), alpha: Joi.number().allow('').allow(null).required() })
            .required(),
        })
        .required(),

      currency_converter: Joi.boolean().required(),

      currency_converter_setting: Joi.object()
        .keys({
          main_converter: Joi.string().allow('').allow(null).required(),
          selected_main_converter: Joi.array().items(Joi.string()).required(),
        })
        .required(),
    }),
    content: Joi.object()
      .keys({
        scrollbar: Joi.boolean().required(),
        disable_right_click: Joi.boolean().required(),
        back_to_top_button: Joi.boolean().required(),
        back_to_top_button_setting: Joi.object()
          .keys({
            image_url: Joi.string().allow('').allow(null).required(), // Uploaded URL
            position: Joi.string().allow('').allow(null).required(), // Bottom Left,Center,Right ENUM
          })
          .required(),
        facebook_comment_tab: Joi.boolean().required(), // Extra Setting
        facebook_comment_tab_setting: Joi.object()
          .keys({
            comment_tab: Joi.boolean().required(),
            allow_member_only: Joi.boolean().required(),
          })
          .required(),
        advertising_display: Joi.boolean().required(), //  Images,Youtube (Remarketing Ads)/ Extra Setting
        advertising_display_setting: Joi.object()
          .keys({
            position: Joi.string().allow('').allow(null).required(), // Top Right , Top Left , Bottom Right , Bottom Left, ENUM
            size: Joi.string().allow('').allow(null).required(), // small,medium,big ENUM
            upload: Joi.object()
              .keys({
                image_url: Joi.string().allow('').allow(null).required(), // Uploaded URL
                link_type: Joi.object()
                  .keys({
                    selected_link_type: Joi.string().allow('').allow(null).required(),
                    link_types: Joi.array().items(Joi.string().allow('').allow(null)).required(),
                    target_url: Joi.string().allow('').allow(null).required(),
                    target_href: Joi.object()
                      .keys({
                        selected_target_href: Joi.string().allow('').allow(null).required(),
                        target_href: Joi.array().items(Joi.string().allow('').allow(null)).required(),
                      })
                      .required(),
                  })
                  .required(),
              })
              .required(),
            share_clip: Joi.object()
              .keys({
                embedded_link: Joi.string().allow('').allow(null).required(),
              })
              .required(),
          })
          .required(),
        webp_format_system: Joi.boolean().required(),
        printer: Joi.boolean().required(),
        preview_custom_form: Joi.boolean().required(),
      })
      .required(),
    notification: Joi.object()
      .keys({
        show_as_modal: Joi.boolean().required(),
      })
      .required(),
    login: Joi.object()
      .keys({
        social_login: Joi.boolean().required(),
      })
      .required(),
    view: Joi.object()
      .keys({
        support_responsive: Joi.boolean().required(),
        picture_display: Joi.boolean().required(),
        picture_display_setting: Joi.object()
          .keys({
            width: Joi.number().required(),
            height: Joi.number().required(),
            image_url: Joi.string().allow('').allow(null).required(),
            units: Joi.string().allow('').allow(null).required(),
            end_time: Joi.object()
              .keys({
                is_active: Joi.boolean().required(),
                duration: Joi.number().required(),
              })
              .required(),
            display_on_mobile: Joi.object()
              .keys({
                is_active: Joi.boolean().required(),
              })
              .required(),
            selected_upload: Joi.string().required(),
            image: Joi.object().keys({
              link_type: Joi.object().keys({
                selected_link_type: Joi.string().allow('').allow(null).required(),
                link_types: Joi.array().items(Joi.string().allow('').allow(null)).required(),
                target_url: Joi.string().allow('').allow(null).required(),
                target_href: Joi.object()
                  .keys({
                    selected_target_href: Joi.string().allow('').allow(null).required(),
                    target_href: Joi.array().items(Joi.string().allow('').allow(null)).required(),
                  })
                  .required(),
              }),
            }),
          })
          .required(),
        shortened_url_display: Joi.boolean().required(),
      })
      .required(),
  }),

  mobile_view: Joi.object()
    .keys({
      header: Joi.object()
        .keys({
          fixed_top_menu: Joi.boolean().required(),
        })
        .required(),
      sidebar_menu: Joi.object()
        .keys({
          sidebar_menu: Joi.boolean().required(),
          sidebar_submenu_auto: Joi.boolean().required(),
        })
        .required(),
      content: Joi.object().keys({
        search_button: Joi.boolean().required(),
        side_information: Joi.boolean().required(),
        increase_image_size: Joi.boolean().required(),
      }),
    })
    .required(),

  search: Joi.object()
    .keys({
      maximun_search_results: Joi.object()
        .keys({
          selected_maximum_result: Joi.number().required(),
          maximum_results: Joi.array().items(Joi.number()).required(),
        })
        .required(),
      define_search_score: Joi.number().required(),
      search_pattern: Joi.object()
        .keys({
          pattern_index: Joi.number().required(),
        })
        .required(),
      search_pattern_setting: Joi.object().keys({
        button: Joi.object()
          .keys({
            selected_button: Joi.string().allow('').allow(null).required(),
            button_types: Joi.array().items(Joi.string().allow('').allow(null)).required(),
          })
          .required(),
        search_icon: Joi.object()
          .keys({
            selected_search_icon: Joi.string().allow('').allow(null).required(),
            search_icons: Joi.array().items(Joi.string().allow('').allow(null)).required(),
          })
          .required(),
        icon_color: Joi.object()
          .keys({
            rgb: Joi.string().allow('').allow(null).required(),
            alpha: Joi.number().required(),
          })
          .required(),
        text_color: Joi.object().keys({
          rgb: Joi.string().allow('').allow(null).required(),
          alpha: Joi.number().required(),
        }),
        background_color: Joi.object()
          .keys({
            alpha: Joi.string().allow('').allow(null).required(),
            type: Joi.string().allow('').allow(null).required(),
            solid: Joi.object()
              .keys({
                rgb: Joi.string().allow('').allow(null).required(),
                alpha: Joi.number().required(),
              })
              .required(),
            linear: Joi.object()
              .keys({
                rgb: Joi.array().items(Joi.string().allow('').allow(null)).required(),
                alpha: Joi.number().required(),
              })
              .required(),
            image: Joi.object()
              .keys({
                url: Joi.string().allow('').allow(null).required(),
                alpha: Joi.number().required(),
              })
              .required(),
          })
          .required(),
      }),
      search_landing_page: Joi.object()
        .keys({
          landing_page_index: Joi.number().required(),
        })
        .required(),
      search_type: Joi.object().keys({
        default_search_type: Joi.string().allow('').allow(null).required(),
        search_types: Joi.array().items(Joi.string().allow('').allow(null)).required(),
      }),
    })
    .required(),

  notification: Joi.object()
    .keys({
      push_notifications: Joi.object()
        .keys({
          line_notify: Joi.object()
            .keys({
              is_active: Joi.boolean().required(),
              line_notify_token: Joi.string().allow('').allow(null).when('is_active', { is: true, then: Joi.required() }),
            })
            .required(),
          email: Joi.object()
            .keys({
              is_active: Joi.boolean().required(),
              emails: Joi.array().items(Joi.string().allow('').allow(null)).when('is_active', { is: true, then: Joi.required() }),
            })
            .required(),
        })
        .required(),

      activity: Joi.object()
        .keys({
          new_order: Joi.boolean().required(),
          new_messages: Joi.boolean().required(),
          new_comments: Joi.boolean().required(),
          reject_order: Joi.boolean().required(),
          submit_form: Joi.boolean().required(),
          field_update: Joi.boolean().required(),
        })
        .required(),
    })
    .required(),

  email_sender_name: Joi.string().allow('').allow(null).required(),
};

export const ConfigGeneralLanguageResponse = {
  defaultCultureUI: Joi.string().required(),
  selectedCultureUIs: Joi.array().items(Joi.string().allow('').allow(null)),
};
