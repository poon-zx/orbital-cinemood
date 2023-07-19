import React from "react";
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <div className="footer" style={{marginBottom: "3vh"}}>
      <div className="contact-info">
        <p style={{ display: 'inline', fontFamily: 'League Spartan, sans-serif' }}>CONTACT US</p>
        <p style={{ display: 'inline', marginLeft: '50px', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '15px' }}>
            <a href="mailto:poonzhexuan@gmail.com" style={{ textDecoration: 'none', color: '#595858' }}>
                <EmailIcon style={{color:'#B2B1B1', marginRight:'8px'}}/>poonzhexuan@gmail.com
            </a>
        </p>
        <p style={{ display: 'inline', marginLeft: '50px', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '15px' }}>
            <a href="mailto:ikay19.purnama@gmail.com" style={{ textDecoration: 'none', color: '#595858' }}>
                <EmailIcon style={{color:'#B2B1B1', marginRight:'8px'}}/>ikay19.purnama@gmail.com
            </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
