import { gql } from "@apollo/client";

export const USER_DATA = gql`
  query Query($usersPermissionsUserId: ID) {
    usersPermissionsUser(id: $usersPermissionsUserId) {
      data {
        attributes {
          Name
          email
          username
          image {
            data {
              attributes {
                url
              }
            }
          }
        }
        id
      }
    }
  }
`;
