import { gql } from "@apollo/client";

export const CREATE_RECIPE = gql`
  mutation CreateRecipe($data: RecipeInput!) {
    createRecipe(data: $data) {
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
          cooking_time
          ingredients {
            data {
              id
              attributes {
                title
                count
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
  }
`;
