import React, {useState, useEffect} from 'react';
import logo from '../images/logo.png';
import img from '../images/img.png';
import '../App.css';
import './style.css';
import { Auth } from '@supabase/auth-ui-react'
import { createClient } from '@supabase/supabase-js'
import {ThemeSupa,} from '@supabase/auth-ui-shared'
import { Box, Container } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Reset from './ResetPw/Reset.js';
import Homepage from './Homepage/Homepage.js';
import { useNavigate } from "react-router-dom";



export const supabase = createClient(
  'https://ccecaffoxnxnahwfcpcy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZWNhZmZveG54bmFod2ZjcGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ1NjY1MTAsImV4cCI6MjAwMDE0MjUxMH0.-W7IPp668Pp4uT5ZwzAawRU7fJYj20_6MXGOm06VDgA'
)

const customTheme = {
    default: {
        colors: {
            brand: '#C06C84',
            brandAccent: '#ad5971',
            brandButtonText: 'white',
            defaultButtonBackground: '#C06C84',
            defaultButtonBackgroundHover: '#ad5971',
            defaultButtonText: 'white',
            dividerBackground: '#ad5971',
            inputBackground: 'transparent',
            inputBorder: 'lightgray',
            inputBorderHover: 'gray',
            inputBorderFocus: 'gray',
            inputText: 'black',
            inputLabelText: 'gray',
            inputPlaceholder: 'darkgray',
            messageText: 'gray',
            messageTextDanger: '#c70f06',
            anchorTextColor: 'gray',
            anchorTextHoverColor: 'darkgray',
          },
          space: {
            spaceSmall: '4px',
            spaceMedium: '8px',
            spaceLarge: '16px',
            labelBottomMargin: '0px',
            anchorBottomMargin: '4px',
            emailInputSpacing: '4px',
            buttonPadding: '10px 15px',
            inputPadding: '10px 15px',
          },
          fontSizes: {
            baseBodySize: '13px',
            baseInputSize: '14px',
            baseLabelSize: '14px',
            baseButtonSize: '14px',
          },
          fonts: {
            bodyFontFamily: `ui-sans-serif, sans-serif`,
            buttonFontFamily: `ui-sans-serif, sans-serif`,
            inputFontFamily: `ui-sans-serif, sans-serif`,
            labelFontFamily: `ui-sans-serif, sans-serif`,
          },
          borderWidths: {
            buttonBorderWidth: '1px',
            inputBorderWidth: '1px',
          },
          radii: {
            borderRadiusButton: '4px',
            buttonBorderRadius: '4px',
            inputBorderRadius: '4px',
          },
    },       
}

const Login = () => {


    return(
    <Container
    maxWidth="xs"
    display="flex"
    justifyContent="sssscenter"
    alignItems="center"
    minHeight="100vh"
    >
    <Box
    sx={{
        border: '2px solid #ffffff',
        borderRadius: '15px',
        padding: '18px', 
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    }}
    >
    <img src={logo} alt="Logo" height="80"/>
    <Routes>
      <Route path="/reset" element={<Reset />} />
    <Route path="/" element = {<Auth
    supabaseClient={supabase}
    className='App'
    appearance={{ theme: customTheme,
        extend: true,
        className: {
            button: 'custom-button',
        },
    }} providers={[]} ></Auth>} />
    </Routes>
    </Box>
  </Container>
)}

export default Login;