// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dmenu from './pages/Dailymenu';
import Menu from './pages/Menu';
import Navbar from './components/navbar';
import { AuthProvider } from './pages/authContext'; // Import the AuthProvider
import PrivateRoute from './PrivateRoute';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import RegistrationForm from './pages/Register';
import ReservationForm from './pages/Reservation'; // Import the ReservationForm
import Menuedit from "./pages/Menuedit";
import Dailymenuedit from "./pages/Dailymenuedit"
import ViewOrders from './pages/Objednavky';

function App() {
  return (
    <AuthProvider>
      <div style={{display:"flex"}}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Dailymenu" element={<Dmenu />} />
            <Route path="/Menu" element={<Menu />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegistrationForm />} />
            <Route path="/Reservation" element={<ReservationForm />} />
            <Route path="/Menuedit" element={<Menuedit />} />ň
            <Route path="/Dailymenuedit" element={<Dailymenuedit />} />
            <Route path='/Orders' element={<ViewOrders />} />
            
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
