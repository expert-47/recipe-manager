import { gql } from "@apollo/client";

export const UPLOAD_FILE = gql`
  mutation Upload($file: Upload!, $refId: ID) {
    upload(file: $file, refId: $refId) {
      data {
        id
        attributes {
          url
        }
      }
    }
  }
`;
