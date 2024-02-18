import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State to hold login error messages
    const navigate = useNavigate();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/user/login', { username, password });
            // Setting user details in localStorage without JSON.stringify for simple string values
            localStorage.setItem("user_id", response.data.user_id.toString());
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('username', username); // Directly storing the username as a string
            localStorage.setItem('isadmin', response.data.isadmin.toString());

            navigate('/profile', { replace: true });
        } catch (error) {
            // Display a nicely formatted error message from the response or a default message
            setErrorMessage(error.response?.data?.error || "Incorrect username or password. Please try again.");
        }
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            navigate('/profile', { replace: true });
        }
    }, [navigate]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Login</h2>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <form onSubmit={handleLoginSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="username">Username:</label>
                                    <input type="text" id="username" name="username" className="form-control" value={username} onChange={handleUsernameChange} />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password:</label>
                                    <input type="password" id="password" name="password" className="form-control" value={password} onChange={handlePasswordChange} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                                <div className="mt-3 text-center">
                                    <Link to="/register">Don't have an account? Register</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
