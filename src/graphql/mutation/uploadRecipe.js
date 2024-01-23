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
export const UPDATE_RECIPE = gql`
  mutation Mutation($updateRecipeId: ID!, $data: RecipeInput!) {
    updateRecipe(id: $updateRecipeId, data: $data) {
      data {
        id
        attributes {
          Title
          Description
        }
      }
    }
  }
`;
