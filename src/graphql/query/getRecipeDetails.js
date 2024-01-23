import { gql } from "@apollo/client";

export const GET_RECIPE_DETAILS = gql`
  query Recipe($recipeId: ID) {
    recipe(id: $recipeId) {
      data {
        id
        attributes {
          Description
          Images {
            data {
              id
              attributes {
                url
              }
            }
          }
          Title
          categories {
            data {
              id
              attributes {
                Title
              }
            }
          }
          comments {
            data {
              id
              attributes {
                message
                user {
                  data {
                    id
                    attributes {
                      Name
                    }
                  }
                }
              }
            }
          }
          cooking_time
          ingredients {
            data {
              id
              attributes {
                count
                title
              }
            }
          }
          instructions
          prep_time
          tags {
            data {
              id
              attributes {
                Title
              }
            }
          }
        }
      }
    }
  }
`;
