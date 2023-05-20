import React, {useState} from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import { Auth } from '@supabase/auth-ui-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ccecaffoxnxnahwfcpcy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZWNhZmZveG54bmFod2ZjcGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ1NjY1MTAsImV4cCI6MjAwMDE0MjUxMH0.-W7IPp668Pp4uT5ZwzAawRU7fJYj20_6MXGOm06VDgA'
)
const App = () => (
  <Auth
    supabaseClient={supabase}
    className='App'
  />
)

export default App;

/*
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
*/