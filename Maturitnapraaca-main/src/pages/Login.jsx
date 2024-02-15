// Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        username: username,
        password: password,
      });
      

      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem('username', JSON.stringify(username));
      localStorage.setItem('isadmin', response.data.isadmin);

      navigate('../profile');
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('../profile');
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
                <div className="mt-3 text-center">
                  <Link to="../register">Don't have an account? Register</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
