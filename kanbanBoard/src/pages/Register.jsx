import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Navbar from '../component/Navbar';

const Register = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = { userName, password, email, role, age };
            const res = await axios.post('https://kanbanbackend-2.onrender.com/user/register', user);
            console.log(res);
            navigate('/login');
            
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <Navbar/>
        <form onSubmit={submitHandler}>
            <div>
            <label>Name </label>
            <input 
                name="userName" 
                placeholder="Enter your name" 
                onChange={(e) => setUserName(e.target.value)} 
                value={userName} 
                required
            />
            </div>
            <br/>
            <div>
            <label>Email </label>
            <input 
                name="email" 
                placeholder="Enter your email" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                required
            />
            </div>
            <br/>
            <div>
            <label>Password </label>
            <input 
                name="password" 
                type="password" 
                placeholder="Enter your password" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                required
            />
            </div>
            <br/>
            <div>
            <label>Role </label>
            <select name='role' onChange={handleRoleChange} value={role}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            </div>
            <br/>
            <div>
            <label>Age</label>
            <input 
                name="age" 
                placeholder="Enter your age" 
                onChange={(e) => setAge(e.target.value)} 
                value={age} 
                required
            />
            </div>
            <br/>
            <button type="submit" disabled={loading}>Register</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
        </>
    )
}

export default Register;
