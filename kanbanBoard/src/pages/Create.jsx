import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Navbar from '../component/Navbar';

const Login = () => {
    const navigate = useNavigate();
    const [task, setTask] = useState('');
    const [status, setStatus] = useState('pending');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const todo = { task, status };
            const token = localStorage.getItem('token');
            const res = await axios.post('https://kanbanbackend-2.onrender.com/todo/create', todo, {
                headers:{
                Authorization : `Bearer ${token}`
                }
            });
            console.log(res);
            navigate('/');
            
        } catch (err) {
            setError('todo creation failed');
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
       <Navbar/>
        <form onSubmit={submitHandler}>
            <label>Enter task </label>
            <input 
                type="task" 
                placeholder='Enter task' 
                onChange={(e) => setTask(e.target.value)} 
                value={task}
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
