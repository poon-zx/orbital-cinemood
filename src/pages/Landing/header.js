import React from "react";
import logo from "../../images/logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" style={{ height: '65px', marginLeft:'3vw' }} />
      </div>
      <div className="login-container">
        <Link to="/login">
            <button className="loginbutton" style={{marginRight:"3.5vw", fontSize:"20px"}}>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
