import { gql } from "@apollo/client";

export const CREATE_FAVOURITE = gql`
  mutation CreateFavourite($data: FavouriteInput!) {
    createFavourite(data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_FAVOURITE = gql`
  mutation DeleteFavourite($deleteFavouriteId: ID!) {
    deleteFavourite(id: $deleteFavouriteId) {
      data {
        id
      }
    }
  }
`;
