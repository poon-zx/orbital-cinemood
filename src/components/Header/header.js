import React from "react"
import "./header.css"
import { Link } from "react-router-dom"
import logo from '../../images/logo.png';

const Header = () => {
    return (
        <div className="header">
            <div className="headerLeft">
                <Link to="/"><img src={logo} alt="Logo" height="80" /></Link>
                <Link to="/movies/popular" style={{textDecoration: "none"}}><span>Popular</span></Link>
                <Link to="/movies/top_rated" style={{textDecoration: "none"}}><span>Top Rated</span></Link>
                <Link to="/movies/upcoming" style={{textDecoration: "none"}}><span>Upcoming</span></Link>
            </div>
        </div>
    )
}

export default Header