import gql from 'graphql-tag';

// getContentsByCategories(categories: [String]): [ContentsModel]

export const GET_CONTENTS_BY_CATEGORIES = gql`
  query getContentsByCategories($categories: [String], $limit: Int) {
    getContentsByCategories(categories: $categories, limit: $limit) {
      _id
      name
      language {
        cultureUI
        title
        subTitle
        keyword
      }
      categories
      tags
      authors
      isPin
      priority
      startDate
      isEndDate
      endDate
      views
      coverImage
      isPublish
      customCSS
      draftSections {
        type
        gap
        columns {
          gap
          components {
            ... on ContentsComponentTextModel {
              type
              quillHTMLs {
                cultureUI
                quillHTML
              }
            }
            ... on ContentsComponentEmbededModel {
              type
              option {
                embeded
              }
            }
            ... on ContentsComponentImageModel {
              type
              option {
                imgUrl
                isCaption
                captionType
                language {
                  cultureUI
                  caption
                  alt
                  title
                }
              }
            }
          }
        }
      }
      sections {
        type
        gap
        columns {
          gap
          components {
            ... on ContentsComponentTextModel {
              type
              quillHTMLs {
                cultureUI
                quillHTML
              }
            }
            ... on ContentsComponentEmbededModel {
              type
              option {
                embeded
              }
            }
            ... on ContentsComponentImageModel {
              type
              option {
                imgUrl
                isCaption
                captionType
                language {
                  cultureUI
                  caption
                  alt
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CONTENTS_LIST = gql`
  query getContentsList($tableFilter: InputTableFilter) {
    getContentsList(tableFilter: $tableFilter) {
      total_rows
      contents {
        _id
        name
        language {
          cultureUI
          title
          subTitle
          keyword
        }
        categories
        displayCategories
        tags
        authors
        isPin
        priority
        startDate
        isEndDate
        endDate
        views
        coverImage
        isPublish
        customCSS
        draftSections {
          type
          gap
          columns {
            gap
            components {
              ... on ContentsComponentTextModel {
                type
                quillHTMLs {
                  cultureUI
                  quillHTML
                }
              }
              ... on ContentsComponentEmbededModel {
                type
                option {
                  embeded
                }
              }
              ... on ContentsComponentImageModel {
                type
                option {
                  imgUrl
                  isCaption
                  captionType
                  language {
                    cultureUI
                    caption
                    alt
                    title
                  }
                }
              }
            }
          }
        }
        sections {
          type
          gap
          columns {
            gap
            components {
              ... on ContentsComponentTextModel {
                type
                quillHTMLs {
                  cultureUI
                  quillHTML
                }
              }
              ... on ContentsComponentEmbededModel {
                type
                option {
                  embeded
                }
              }
              ... on ContentsComponentImageModel {
                type
                option {
                  imgUrl
                  isCaption
                  captionType
                  language {
                    cultureUI
                    caption
                    alt
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CONTENTS = gql`
  query getContents($_id: String) {
    getContents(_id: $_id) {
      _id
      name
      language {
        cultureUI
        title
        subTitle
        keyword
      }
      categories
      tags
      authors
      isPin
      priority
      startDate
      isEndDate
      endDate
      views
      coverImage
      isPublish
      customCSS
      draftSections {
        type
        gap
        columns {
          gap
          components {
            ... on ContentsComponentTextModel {
              type
              quillHTMLs {
                cultureUI
                quillHTML
              }
            }
            ... on ContentsComponentEmbededModel {
              type
              option {
                embeded
              }
            }
            ... on ContentsComponentImageModel {
              type
              option {
                imgUrl
                isCaption
                captionType
                language {
                  cultureUI
                  caption
                  alt
                  title
                }
              }
            }
          }
        }
      }
      sections {
        type
        gap
        columns {
          gap
          components {
            ... on ContentsComponentTextModel {
              type
              quillHTMLs {
                cultureUI
                quillHTML
              }
            }
            ... on ContentsComponentEmbededModel {
              type
              option {
                embeded
              }
            }
            ... on ContentsComponentImageModel {
              type
              option {
                imgUrl
                isCaption
                captionType
                language {
                  cultureUI
                  caption
                  alt
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CONTENTS_HTML = gql`
  query getContentsHTML($_id: String) {
    getContentsHTML(_id: $_id)
  }
`;

export const ADD_CONTENTS = gql`
  mutation addContents($contents: ContentsInput) {
    addContents(contents: $contents) {
      status
      value
    }
  }
`;

export const UPDATE_CONTENTS = gql`
  mutation updateContents($contents: ContentsInput, $_id: String, $isSaveAsDraft: Boolean) {
    updateContents(contents: $contents, _id: $_id, isSaveAsDraft: $isSaveAsDraft) {
      status
      value
    }
  }
`;
