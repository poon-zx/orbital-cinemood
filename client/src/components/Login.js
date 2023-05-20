import React, {useState} from 'react';
import logo from '../images/logo.png';
import '../App.css';
import { Auth } from '@supabase/auth-ui-react'
import { createClient } from '@supabase/supabase-js'
import {ThemeSupa,} from '@supabase/auth-ui-shared'
import { Container } from "@mui/material";


export const supabase = createClient(
  'https://ccecaffoxnxnahwfcpcy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZWNhZmZveG54bmFod2ZjcGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ1NjY1MTAsImV4cCI6MjAwMDE0MjUxMH0.-W7IPp668Pp4uT5ZwzAawRU7fJYj20_6MXGOm06VDgA'
)
const Login = () => (
  <Container maxWidth="xs" sx={{ height: "100vh", justifyContent: "center" }}>
    <img src={logo} alt="Logo" height="80"/>
    <Auth
      supabaseClient={supabase}
      className='App'
      appearance={{ theme: ThemeSupa }}
      providers={[]}
    />
  </Container>
)

export default Login;
