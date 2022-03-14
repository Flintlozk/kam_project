import gql from 'graphql-tag';

export const ContentPatternsLandingTypeDefs = gql`
  "Content Patterns Schema"
  type ContentPatternLanding {
    _id: String
    patternName: String
    patternUrl: String
    html: String
    css: String
  }

  extend type Query {
    getContentPatternsLandings(skip: Int, limit: Int): [ContentPatternLanding]
    getContentPatternsLanding(_id: String): ContentPatternLanding
  }
`;
