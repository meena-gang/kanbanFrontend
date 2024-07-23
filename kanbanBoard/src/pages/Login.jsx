import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Navbar from '../component/Navbar';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = { email, password };
            const res = await axios.post('https://kanbanbackend-2.onrender.com/user/login', user);
            console.log(res.data.token);
            
            localStorage.setItem('token', res.data.token);
            navigate('/');
            
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
       <Navbar/>
        <form onSubmit={submitHandler}>
            <label>Enter email </label>
            <input 
                type="email" 
                placeholder='Enter email' 
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                required
            />
            <br/>
            <label>Enter password </label>
            <input 
                type="password" 
                placeholder='Enter password' 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                required
            />
            <br/>
            <button type='submit' disabled={loading}>Submit</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
        </>
    )
}

export default Login;
