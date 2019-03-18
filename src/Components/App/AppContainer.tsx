import React from "react";
import { graphql } from "react-apollo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import theme from "../../theme";
import { ThemeProvider } from "../../typed-components";
import AppPresenter from "./AppPresenter";
import { IS_LOGGED_IN } from "./AppQueries";

const AppContainer = ({ data }) => (
  <ThemeProvider theme={theme}>
    <>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
      <ToastContainer draggable={true} position={"bottom-center"}/>
    </>
  </ThemeProvider>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
