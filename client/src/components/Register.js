import React, { useState } from 'react';
import axios from 'axios';
import logo from '../images/logo.png';

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        email,
        password,
      });

      // Handle successful registration
      console.log(response.data);
    } catch (error) {
      // Handle registration error
      console.error(error);
    }
  };

  return (
    <div className="form-container"> 
        <img src={logo} alt="Logo" height="80"/>
        <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder= "Enter Email"
                required/>

            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder= "Enter Password"
                required/>
            <button type="submit">Register</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}> Already have an account? Login here.</button>
    </div>
  );
};

export default Register;
