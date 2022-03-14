import gql from 'graphql-tag';

export const ContentPatternsTypeDefs = gql`
  "Content Patterns Schema"
  type ContentPattern {
    _id: String
    patternName: String
    patternUrl: String
    patternStyle: ContentPatternStyle
  }

  type ContentPatternStyle {
    container: ContentPaternGrid
    primary: ContentPaternItem
    secondary: ContentPaternItem
    css: String
  }

  type ContentPaternItem {
    maxContent: Int
    grid: ContentPaternGrid
    status: Boolean
  }

  type ContentPaternGrid {
    gridTemplateColumns: String
    gridTemplateRows: String
    gridGap: String
  }

  input ContentPatternInput {
    _id: String
    patternName: String
    patternUrl: String
    patternStyle: ContentPatternStyleInput
  }

  input ContentPatternStyleInput {
    container: ContentPaternGridInput
    primary: ContentPaternItemInput
    secondary: ContentPaternItemInput
    css: String
  }

  input ContentPaternItemInput {
    maxContent: Int
    grid: ContentPaternGridInput
    status: Boolean
  }

  input ContentPaternGridInput {
    gridTemplateColumns: String
    gridTemplateRows: String
    gridGap: String
  }

  extend type Query {
    getTotalPattern: Int
    getContentPatterns(skip: Int, limit: Int): [ContentPattern]
    getContentPattern(_id: String): ContentPattern
  }

  extend type Mutation {
    addContentPattern(pattern: ContentPatternInput): HTTPResult
    updateContentPattern(pattern: ContentPatternInput): HTTPResult
  }
`;
