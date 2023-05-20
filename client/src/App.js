import React, {useState} from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
    const [currentForm, setCurrentForm] = useState('login');
    const toggleForm = (formName) => {
        setCurrentForm(formName);
    }

    return (
    <div className='App'>
        {
            currentForm === 'login' ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
        }
    </div>
  );
}

export default App;
