import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      user {
        email
        confirmed
        username
        id
      }
    }
  }
`;
