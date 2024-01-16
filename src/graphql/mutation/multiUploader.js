import { gql } from "@apollo/client";

export const MULTI_UPLOADER = gql`
  mutation MultipleUpload($files: [Upload]!) {
    multipleUpload(files: $files) {
      data {
        id
        attributes {
          url
        }
      }
    }
  }
`;

//   "files": null
