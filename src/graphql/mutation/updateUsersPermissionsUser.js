import { gql } from "@apollo/client";

export const UPDATE_USER_PERMISSION = gql`
  mutation UpdateUsersPermissionsUser(
    $data: UsersPermissionsUserInput!
    $updateUsersPermissionsUserId: ID!
  ) {
    updateUsersPermissionsUser(data: $data, id: $updateUsersPermissionsUserId) {
      data {
        id
        attributes {
          image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;
