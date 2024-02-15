import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ message: '', color: '' });
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8 || password.length > 32) {
      return { message: 'Password must be 8-32 characters long', color: 'red' };
    }
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/g.test(password);
    const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password);
    if (hasNumbers && hasSpecial && hasMixed) {
      return { message: 'Strong password', color: 'green' };
    }
    if ((hasNumbers && hasMixed) || (hasSpecial && hasMixed) || (hasNumbers && hasSpecial)) {
      return { message: 'Moderate strength', color: 'orange' };
    }
    return { message: 'Weak password', color: 'red' };
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const { message, color } = checkPasswordStrength(e.target.value);
    setPasswordStrength({ message, color });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordMessage('Passwords do not match');
    } else {
      setPasswordMessage('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    if (password.length < 8 || password.length > 32) {
      setPasswordMessage('Password must be 8-32 characters long');
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/user/register", {
  username, password
});

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <div className="card-body">
              <h2 className="text-center mb-4">Register</h2>
              <form onSubmit={handleRegister}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {password && (
                    <small style={{ color: passwordStrength.color }}>
                      {passwordStrength.message}
                    </small>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                {passwordMessage && (
                  <div className="alert alert-warning">{passwordMessage}</div>
                )}
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
