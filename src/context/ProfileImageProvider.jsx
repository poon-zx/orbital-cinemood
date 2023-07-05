import React, { createContext, useState, useEffect, useContext } from 'react';

export const ProfileImageContext = createContext();

export const ProfileImageProvider = ({ children }) => {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  
  return (
    <ProfileImageContext.Provider value={{ profileImageUrl, setProfileImageUrl }}>
      {children}
    </ProfileImageContext.Provider>
  );
}
