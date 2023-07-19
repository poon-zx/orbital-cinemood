import { React, useEffect, useState } from "react";
import {Typewriter} from "react-simple-typewriter";
import star from "../../images/star.png"
import backg from "../../images/backg.png";
import movie from "../../images/img.png";
import Header from "./header.js"
import Footer from "./footer.js"
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
    return (
        <div className="landing-container"
        style={{
            backgroundImage: `url(${backg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        >
            <Header />
            <div
                style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                marginTop: '1vh',
                }}
            >
                
                <div style={{ flex: '1', marginRight:'-2.5vw' }}>
                <h1 className="readytext">
                    <Typewriter
                    words={["Ready, Set, Binge!"]}
                    loop={false}
                    cursor
                    cursorStyle="|"
                    typeSpeed={90}
                    deleteSpeed={50}
                    />
                </h1>
                    <div style={{marginLeft: '7vw', marginRight:'7vw', marginTop:'2vh'}}>
                        <p className="desc">The ultimate movie recommendation platform that uses your current MOOD and watch history</p>
                    </div>
                    <Link to="/login">
                        <button className="startbutton" style={{fontSize:'20px'}}>Let's get started !</button>
                    </Link>
                </div>
                    <div style={{ flex: '1', marginRight: '3vw'}}>
                        <img src={movie} alt="Movie" style={{maxWidth: '90%', maxHeight: '90%', width: 'auto', height: 'auto', marginTop:'-2vh'}}/>
                    </div>
                    <img src={star} alt="Star" className="star1" />
                    <img src={star} alt="Star" className="star2" />
                    <img src={star} alt="Star" className="star3" />
                    <img src={star} alt="Star" className="star4" />
                    <img src={star} alt="Star" className="star5" />
                    <img src={star} alt="Star" className="star6" />
                    <img src={star} alt="Star" className="star7" />
            </div>
            <Footer />
        </div>
    );
  };
  
  export default Landing;
  