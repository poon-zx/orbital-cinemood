import { React, useEffect } from "react";
import logo from "../images/logo.svg";
import "../App.css";
import "./style.css";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { supabase } from "../supabase.js";

const customTheme = {
  default: {
    colors: {
      brand: "#C06C84",
      brandAccent: "#ad5971",
      brandButtonText: "white",
      defaultButtonBackground: "#C06C84",
      defaultButtonBackgroundHover: "#ad5971",
      defaultButtonText: "white",
      dividerBackground: "#ad5971",
      inputBackground: "transparent",
      inputBorder: "lightgray",
      inputBorderHover: "gray",
      inputBorderFocus: "gray",
      inputText: "black",
      inputLabelText: "gray",
      inputPlaceholder: "darkgray",
      messageText: "gray",
      messageTextDanger: "#c70f06",
      anchorTextColor: "gray",
      anchorTextHoverColor: "darkgray",
    },
    space: {
      spaceSmall: "4px",
      spaceMedium: "8px",
      spaceLarge: "16px",
      labelBottomMargin: "0px",
      anchorBottomMargin: "4px",
      emailInputSpacing: "4px",
      buttonPadding: "10px 15px",
      inputPadding: "10px 15px",
    },
    fontSizes: {
      baseBodySize: "13px",
      baseInputSize: "14px",
      baseLabelSize: "14px",
      baseButtonSize: "14px",
    },
    fonts: {
      bodyFontFamily: `ui-sans-serif, sans-serif`,
      buttonFontFamily: `ui-sans-serif, sans-serif`,
      inputFontFamily: `ui-sans-serif, sans-serif`,
      labelFontFamily: `ui-sans-serif, sans-serif`,
    },
    borderWidths: {
      buttonBorderWidth: "1px",
      inputBorderWidth: "1px",
    },
    radii: {
      borderRadiusButton: "4px",
      buttonBorderRadius: "4px",
      inputBorderRadius: "4px",
    },
  },
};

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthStateChange = async (event) => {
      if (event === "SIGNED_IN") {
        navigate("/home");
      }
    };

    const subscription = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
    };
  }, [navigate]);

  return (
    <div className="Login-section center-content">
      <Container
        maxWidth="xs"
        display="flex"
        justifyContent="sssscenter"
        alignItems="center"
        minHeight="100vh"
      >
        <Box
          sx={{
            border: "2px solid #ffffff",
            borderRadius: "15px",
            padding: "18px",
            backgroundColor: "white",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <img src={logo} alt="Logo" height="100" />
          <Auth
          ref={el => el && (el.dataset.testid = 'login-form')}
            supabaseClient={supabase}
            className="App"
            appearance={{
              theme: customTheme,
              extend: true,
              className: {
                button: "custom-button",
              },
            }}
            providers={[]}
          />
        </Box>
      </Container>
    </div>
  );
}

export default Login;
