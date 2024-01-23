import { gql } from "@apollo/client";

export const CREATE_INGREDIENT = gql`
  mutation CreateIngredient($data: IngredientInput!) {
    createIngredient(data: $data) {
      data {
        id
        attributes {
          count
          title
        }
      }
    }
  }
`;
