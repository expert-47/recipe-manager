import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_HOST,
  cache: new InMemoryCache(),
});

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_HOST,
});

export const uploadFileClient = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});
