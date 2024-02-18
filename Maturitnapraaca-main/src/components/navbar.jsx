import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../pages/authContext';
import '../pages/Styles/navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isadmin = localStorage.getItem('isadmin');

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // Determines if the navbar link is active
  const isActive = (path) => {
    if (path === '/profile') {
      return location.pathname === '/profile' || location.pathname === '/register' || location.pathname === '/login';
    }
    return location.pathname === path || (path === '/Menuedit' && location.pathname.includes('/Dailymenuedit'));
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-title">
        Savor's Haven
        </Link>
        <div onClick={handleProfileClick} className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faUser} className="user-icon" />
          <span className="menu-text">Profile</span>
        </div>
        <Link to="/Dailymenu" className={`navbar-link ${isActive('/Dailymenu') ? 'active' : ''}`}>
          Daily Menu
        </Link>
        <Link to="/Menu" className={`navbar-link ${isActive('/Menu') ? 'active' : ''}`}>
          Menu
        </Link>
        <Link to="/reservation" className={`navbar-link ${isActive('/reservation') ? 'active' : ''}`}>
          Reservations
        </Link>
        {isadmin === 'true' && (
          <Link to="/Menuedit" className={`navbar-link ${isActive('/Menuedit') ? 'active' : ''}`}>
            Menuedit
          </Link>
        )}
        {isadmin === 'true' && (
          <Link to="/Orders" className={`navbar-link ${isActive('/Orders') ? 'active' : ''}`}>
            Orders
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
