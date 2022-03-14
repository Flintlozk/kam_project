import gql from 'graphql-tag';

export const ContentsTypeDefs = gql`
  "Contents Schema"
  type ContentsModel {
    _id: String
    name: String
    pageID: Int
    language: [ContentsLanguageModel]
    displayCategories: String
    categories: [String]
    tags: [String]
    authors: [String]
    isPin: Boolean
    priority: Int
    startDate: String
    isEndDate: Boolean
    endDate: String
    views: Int
    coverImage: String
    isPublish: Boolean
    customCSS: String
    draftSections: [ContentsSectionModel]
    sections: [ContentsSectionModel]
  }

  type ContentsLanguageModel {
    cultureUI: String
    title: String
    subTitle: String
    keyword: String
  }

  type ContentsSectionModel {
    type: String
    gap: Int
    columns: [ContentsColumnModel]
  }

  type ContentsColumnModel {
    gap: Int
    components: [ContentsComponentModel]
  }

  union ContentsComponentModel = ContentsComponentTextModel | ContentsComponentEmbededModel | ContentsComponentImageModel

  type ContentsComponentTextModel {
    type: String
    quillHTMLs: [ContentsComponentTextHTMLModel]
  }

  type ContentsComponentEmbededModel {
    type: String
    option: ContentsComponentEmbededOptionModel
  }

  type ContentsComponentEmbededOptionModel {
    embeded: String
  }

  type ContentsComponentImageModel {
    type: String
    option: ContentsComponentImageOptionModel
  }

  type ContentsComponentImageOptionModel {
    imgUrl: String
    isCaption: Boolean
    captionType: String
    language: [ContentsComponentImageLanguageModel]
  }

  type ContentsComponentImageLanguageModel {
    cultureUI: String
    caption: String
    alt: String
    title: String
  }

  type ContentsComponentTextHTMLModel {
    cultureUI: String
    quillHTML: String
  }

  type ContentsWithLengthModel {
    contents: [ContentsModel]
    total_rows: Int
  }

  input ContentsInput {
    _id: String
    pageID: Int
    name: String
    language: [ContentsLanguageInput]
    categories: [String]
    tags: [String]
    authors: [String]
    isPin: Boolean
    priority: Int
    startDate: String
    isEndDate: Boolean
    endDate: String
    views: Int
    coverImage: String
    isPublish: Boolean
    customCSS: String
    draftSections: [ContentsSectionInput]
    sections: [ContentsSectionInput]
  }

  input ContentsLanguageInput {
    cultureUI: String
    title: String
    subTitle: String
    keyword: String
  }

  input ContentsSectionInput {
    type: String
    gap: Int
    columns: [ContentsColumnInput]
  }

  input ContentsColumnInput {
    gap: Int
    components: String
  }

  extend type Query {
    getContentsByCategories(categories: [String], limit: Int): [ContentsModel]
    getContentsList(tableFilter: InputTableFilter): ContentsWithLengthModel
    getContents(_id: String): ContentsModel
    getContentsHTML(_id: String): String
  }

  extend type Mutation {
    addContents(contents: ContentsInput): HTTPResult
    updateContents(contents: ContentsInput, _id: String, isSaveAsDraft: Boolean): HTTPResult
  }
`;
