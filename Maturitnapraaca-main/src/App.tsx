// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dmenu from './pages/Dailymenu';
import Menu from './pages/Menu';
import Navbar from './components/navbar';
import { AuthProvider } from './pages/authContext'; // Ensure this path is correct
import PrivateRoute from './PrivateRoute';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import RegistrationForm from './pages/Register';
import ReservationForm from './pages/Reservation';
import Menuedit from "./pages/Menuedit";
import Dailymenuedit from "./pages/Dailymenuedit";
import ViewOrders from './pages/Objednavky';
import  "./App.css"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Dailymenu" element={<Dmenu />} />
            <Route path="/Menu" element={<Menu />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegistrationForm />} />
            <Route path="/Reservation" element={<ReservationForm />} />
            <Route path="/Menuedit" element={<Menuedit />} />
            <Route path="/Dailymenuedit" element={<Dailymenuedit />} />
            <Route path='/Orders' element={<ViewOrders />} />
          </Routes>
        </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
