import gql from 'graphql-tag';

export const SAVE_CONFIG_THEME = gql`
  mutation saveConfigTheme($configTheme: ConfigThemeInput) {
    saveConfigTheme(configTheme: $configTheme) {
      status
      value
    }
  }
`;

export const SAVE_CONFIG_SHORTCUTS = gql`
  mutation saveConfigShortcuts($configShortcuts: [String]) {
    saveConfigShortcuts(configShortcuts: $configShortcuts) {
      status
      value
    }
  }
`;

export const SAVE_CONFIG_GENERAL = gql`
  mutation saveConfigGeneral($configGeneral: ConfigGeneralInput) {
    saveConfigGeneral(configGeneral: $configGeneral) {
      status
      value
    }
  }
`;

export const SAVE_CONFIG_SEO = gql`
  mutation saveConfigSEO($configSEO: ConfigSEOInput) {
    saveConfigSEO(configSEO: $configSEO) {
      status
      value
    }
  }
`;

export const SAVE_CONFIG_DATA_PRIVACY = gql`
  mutation saveConfigDataPrivacy($configDataPrivacy: ConfigDataPrivacyInput) {
    saveConfigDataPrivacy(configDataPrivacy: $configDataPrivacy) {
      status
      value
    }
  }
`;

export const SAVE_CONFIG_CSS = gql`
  mutation saveConfigCSS($configCSS: ConfigCSSInput) {
    saveConfigCSS(configCSS: $configCSS) {
      status
      value
    }
  }
`;

export const SAVE_CONFIG_META = gql`
  mutation saveConfigMeta($configMeta: ConfigMetaInput) {
    saveConfigMeta(configMeta: $configMeta) {
      status
      value
    }
  }
`;

export const SAVE_CONFIG_STYLE = gql`
  mutation saveConfigStyle($style: String) {
    saveConfigStyle(style: $style) {
      status
      value
    }
  }
`;

export const GET_CONFIG_THEME = gql`
  query getConfigTheme {
    getConfigTheme {
      theme_id
      updatedAt
    }
  }
`;

export const GET_CONFIG_SHOTCUTS = gql`
  query getConfigShortcuts {
    getConfigShortcuts
  }
`;

export const GET_CONFIG_STYLE = gql`
  query getConfigStyle {
    getConfigStyle
  }
`;
export const GET_CONFIG_SEO = gql`
  query getConfigSEO {
    getConfigSEO {
      culture_ui
      description
      keyword
      title
    }
  }
`;

export const GET_CONFIG_DATA_PRIVACY = gql`
  query getConfigDataPrivacy {
    getConfigDataPrivacy {
      is_active
      data_use
      privacy_policy
    }
  }
`;

export const GET_CONFIG_CSS = gql`
  query getConfigCSS {
    getConfigCSS {
      global
      css_with_language {
        language
        stylesheet
      }
    }
  }
`;

export const GET_CONFIG_META = gql`
  query getConfigMeta {
    getConfigMeta {
      meta_tag
      body_tag
      javascript
    }
  }
`;

export const GET_CONFIG_GENERAL = gql`
  query getConfigGeneral {
    getConfigGeneral {
      language {
        defaultCultureUI
        selectedCultureUIs
      }
      temporary_close
      general {
        #start general
        header {
          #start header
          language_flag
          fixed_top_menu
          fixed_top_menu_setting {
            full_screen
            image_url
            link_type {
              selected_link_type
              link_types
              target_url
              target_href {
                selected_target_href
                target_href
              }
            }
          }
          shop_cart
          shop_cart_setting {
            shopcart_icon
            icon_color {
              rgb
              alpha
            }
            text_color {
              rgb
              alpha
            }
          }
          currency_converter
          currency_converter_setting {
            main_converter
            selected_main_converter
          }
          #end header
        }
        content {
          #start content
          scrollbar
          disable_right_click
          back_to_top_button
          back_to_top_button_setting {
            image_url
            position
          }
          facebook_comment_tab
          facebook_comment_tab_setting {
            comment_tab
            allow_member_only
          }
          advertising_display
          advertising_display_setting {
            position
            size
            upload {
              image_url
              link_type {
                selected_link_type
                link_types
                target_url
                target_href {
                  selected_target_href
                  target_href
                }
              }
            }
            share_clip {
              embedded_link
            }
          }
          webp_format_system
          printer
          preview_custom_form
          #end content
        }
        notification {
          show_as_modal
        }
        login {
          social_login
        }
        view {
          support_responsive
          picture_display
          picture_display_setting {
            width
            height
            units
            image_url
            selected_upload
            image {
              link_type {
                selected_link_type
                link_types
                target_url
                target_href {
                  selected_target_href
                  target_href
                }
              }
            }
            end_time {
              is_active
              duration
            }
            display_on_mobile {
              is_active
            }
          }
          shortened_url_display
        }

        #end general
      }
      mobile_view {
        #start mobile view
        header {
          fixed_top_menu
        }
        sidebar_menu {
          sidebar_menu
          sidebar_submenu_auto
        }
        content {
          search_button
          side_information
          increase_image_size
        }
        #end mobile view
      }
      search {
        #start search
        maximun_search_results {
          selected_maximum_result
          maximum_results
        }
        define_search_score
        search_pattern {
          pattern_index
        }
        search_pattern_setting {
          button {
            selected_button
            button_types
          }
          search_icon {
            selected_search_icon
            search_icons
          }
          icon_color {
            rgb
            alpha
          }
          text_color {
            rgb
            alpha
          }
          background_color {
            alpha
            type
            solid {
              rgb
              alpha
            }
            linear {
              rgb
              alpha
            }
            image {
              url
              alpha
            }
          }
        }
        search_landing_page {
          landing_page_index
        }
        search_type {
          default_search_type
          search_types
        }

        #end search
      }
      notification {
        #start notification
        push_notifications {
          line_notify {
            is_active
            line_notify_token
          }
          email {
            is_active
            emails
          }
        }
        activity {
          new_order
          new_messages
          new_comments
          reject_order
          submit_form
          field_update
        }

        #end notification
      }
      email_sender_name
    }
  }
`;

export const GET_CONFIG_GENERAL_LANGUAGE = gql`
  query getConfigGeneralLanguage {
    getConfigGeneralLanguage {
      defaultCultureUI
      selectedCultureUIs
    }
  }
`;
