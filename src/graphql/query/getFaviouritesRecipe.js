import { gql } from "@apollo/client";

export const GET_FAVIOURITES_RECIPES = gql`
  query Favourites($filters: FavouriteFiltersInput) {
    favourites(filters: $filters) {
      data {
        id
        attributes {
          user {
            data {
              id
              attributes {
                Name
              }
            }
          }
          recipe {
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
                ratting {
                  data {
                    id
                    attributes {
                      count
                    }
                  }
                }
                user {
                  data {
                    id
                    attributes {
                      Name
                      username
                    }
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
