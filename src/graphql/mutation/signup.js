import { gql } from "@apollo/client";
export const SIGNUP = gql`
  mutation Register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      user {
        confirmed
        email
        id
        username
      }
    }
  }
`;
