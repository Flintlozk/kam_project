import gql from 'graphql-tag';

export const GET_ALL_CATEGORIES = gql`
  query getAllCategories($tableFilter: InputTableFilter) {
    getAllCategories(tableFilter: $tableFilter) {
      total_rows
      categories {
        _id
        name
        language {
          cultureUI
          name
          slug
          description
        }
        featuredImg
        parentId
        subCategories {
          _id
          name
          language {
            cultureUI
            name
            slug
            description
          }
          featuredImg
          parentId
        }
      }
    }
  }
`;

export const GET_CATEGORIES_BY_IDS = gql`
  query getCategoriesByIds($_ids: [String]) {
    getCategoriesByIds(_ids: $_ids) {
      _id
      name
      language {
        cultureUI
        name
        slug
        description
      }
      featuredImg
      parentId
      subCategories {
        _id
        name
        language {
          cultureUI
          name
          slug
          description
        }
        featuredImg
        parentId
      }
    }
  }
`;
