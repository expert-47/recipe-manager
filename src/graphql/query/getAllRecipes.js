import { gql } from "@apollo/client";

export const GET_ALL_RECIPES = gql`
  query Data($filters: RecipeFiltersInput) {
    recipes(filters: $filters) {
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
          user {
            data {
              attributes {
                Name
              }
              id
            }
          }
          ratting {
            data {
              id
              attributes {
                count
              }
            }
          }
          favourites {
            data {
              id
              attributes {
                recipe {
                  data {
                    id
                  }
                }
                user {
                  data {
                    id
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
