import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Styles/reservation.css';
import 'react-calendar/dist/Calendar.css';
import { Calendar } from 'react-calendar';
import axios from 'axios';
import Ordermenu from '../components/ordermenu';
import 'bootstrap/dist/css/bootstrap.min.css';

function MakeReservation() {
  const [table, setTable] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const navigate = useNavigate();
  const [datee, setDate] = useState(new Date());
  const [message, setMessage] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('../login');
    }

    // Clear previous meal selections from local storage
    localStorage.removeItem("zvoleneMenus");
  }, [navigate]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        options.push(`${hour}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return options;
  };

  const generateTableOptions = () => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      options.push(i);
    }
    return options;
  };

  const checkTableAvailability = async (requestData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/reservation/checkavailability', requestData);

      return response.data.message === 'Table is available.';
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Selected table is already reserved at this time. Please choose a different time or table.");
      } else {
        console.error('Error checking table availability:', error);
        setMessage("An error occurred while checking table availability.");
      }
      return false;
    }
  };

  const onReserve = async () => {
    setMessage("");
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("../login");
      return;
    }

    if (!table || !reservationTime) {
      setMessage("Please select both a table and a time.");
      return;
    }

    const zvoleneMenus = JSON.parse(localStorage.getItem("zvoleneMenus") || "[]");
    console.log("Selected meals (zvoleneMenus):", zvoleneMenus); // Console log for debugging

    if (zvoleneMenus.length === 0) {
      setMessage("Reservation cannot be made without selecting a meal. Please select at least one meal from the menu.");
      return;
    }

    const userId = localStorage.getItem("user_id");
    const reservationDateTime = new Date(datee);
    reservationDateTime.setHours(parseInt(reservationTime.split(':')[0]));
    reservationDateTime.setMinutes(parseInt(reservationTime.split(':')[1]));

    const requestData = {
      reservationDate: reservationDateTime.toISOString(),
      tableNumber: table,
      userId: userId,
    };

    const isAvailable = await checkTableAvailability(requestData);
    if (!isAvailable) {
      return;
    }

    try {
      const reservationResponse = await axios.post('http://localhost:5000/api/reservation/makereservation', requestData);
      setMessage("Table reserved successfully");
  
      // Assuming `zvoleneMenus` is now an array of { menu_id, quantity }
      await axios.post('http://localhost:5000/api/orders/makeorder', {
        reservation_id: reservationResponse.data.reservationId,
        orders: zvoleneMenus.map(item => ({
          menu_id: item.id,
          quantity: item.quantity,
        })),
      });
  
      // Handle success...
    } catch (error) {
      console.error('Error in making reservation or order:', error);
      setMessage("An error occurred during the reservation or order process.");
    }
  };

  const disablePastDates = (date) => {
    return date < new Date();
  };

  return (
    <div className="container mt-4">
      <h2>Make a Reservation</h2>
      <div className="row">
        <div className="col-md-6">
          <Calendar
            value={datee}
            onChange={(e) => setDate(e)}
            minDate={new Date()}
            tileDisabled={disablePastDates}
          />
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="tableNumber">Table Number:</label>
            <select
              id="tableNumber"
              className="form-control"
              value={table}
              onChange={(e) => setTable(e.target.value)}
            >
              <option value="">Select a table</option>
              {generateTableOptions().map(tableNumber => (
                <option key={tableNumber} value={tableNumber}>
                  Table {tableNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="reservationTime">Time:</label>
            <select
              id="reservationTime"
              className="form-control"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
            >
              <option value="">Select a time</option>
              {generateTimeOptions().map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={onReserve}>Reserve</button>
          {message && (
            <div className="alert alert-info mt-3">{message}</div>
          )}
        </div>
      </div>
      <Ordermenu />
    </div>
  );
}

export default MakeReservation;
