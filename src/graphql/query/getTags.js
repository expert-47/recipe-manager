import { gql } from "@apollo/client";

export const GET_TAGS = gql`
  query Data {
    tags {
      data {
        attributes {
          Title
        }
        id
      }
    }
  }
`;
