import { gql } from "@apollo/client";

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($deleteRecipeId: ID!) {
    deleteRecipe(id: $deleteRecipeId) {
      data {
        id
        attributes {
          Title
        }
      }
    }
  }
`;
