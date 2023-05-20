import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAtOJOsuZD9GYImdN-WN8t1AW1YphdW1WQ",
  authDomain: "cinemood-ddcb5.firebaseapp.com",
  projectId: "cinemood-ddcb5",
  storageBucket: "cinemood-ddcb5.appspot.com",
  messagingSenderId: "832612297119",
  appId: "1:832612297119:web:194c9eb9b56892414e35aa",
  measurementId: "G-DPJ8GEEYNS"
};

const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


