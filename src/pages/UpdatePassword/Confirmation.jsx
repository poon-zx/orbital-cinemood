import React from 'react';
import { Box, Container} from "@mui/material";
import logo from "../../images/logo.svg";
import { Card }  from 'react-bootstrap'
import { useLocation } from 'react-router-dom';


const ConfirmationPage = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const confirmationURL = urlParams.get('confirmation_url');
    console.log(confirmationURL);
  
    const handleConfirmation = () => {
      if (confirmationURL) {
        window.location.href = confirmationURL;
      }
    };

  return (
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
          marginTop: "50px",
        }}
      >
        <img src={logo} alt="Logo" height="100" />
        <Card>
          <Card.Body>
            <h3 className="text-center mb-4">Confirm Reset Password</h3>
            <button className="btn btn-primary w-100" onClick={handleConfirmation}>
                Click To Reset Password
            </button>
            </Card.Body>
        </Card>
        </Box>
    </Container>
    );
};

export default ConfirmationPage;
