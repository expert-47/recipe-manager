import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import theme from "../styles/theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/api/graphql/client";
import { Provider } from "react-redux";
import store from "../store/index";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
          <ToastContainer />
        </ApolloProvider>
      </Provider>
    </ThemeProvider>
  );
}
