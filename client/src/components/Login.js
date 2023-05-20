import React, {useState} from 'react';
import axios from 'axios';
import logo from '../images/logo.png';

export const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });
  
      // Handle successful login response
      console.log(response.data);
    } catch (error) {
      // Handle login error
      console.error(error);
    }
  };

  return (
    <div className="form-container"> 
        <img src={logo} alt="Logo" height="80"/>
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter Email"
                required/>

            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter Password"
                required/>
            <button type="submit">Login</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('register')}> Don't have an account? Register here.</button>
    </div>
  );
};

export default Login;