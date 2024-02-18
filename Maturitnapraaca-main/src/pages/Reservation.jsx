import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Styles/reservation.css';
import 'react-calendar/dist/Calendar.css';
import { Calendar } from 'react-calendar';
import axios from 'axios';
import Ordermenu from '../components/ordermenu';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert'; // Import Alert component from react-bootstrap

function MakeReservation() {
    const [table, setTable] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const navigate = useNavigate();
    const [datee, setDate] = useState(new Date());
    const [message, setMessage] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [showConflictAlert, setShowConflictAlert] = useState(false); // New state to control the visibility of the conflict alert

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
        }
        localStorage.removeItem('zvoleneMenus');
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
      options.push(i.toString());
    }
    return options;
  };

  const onReserve = async () => {
    const userId = localStorage.getItem('user_id');
    const zvoleneMenus = JSON.parse(localStorage.getItem('zvoleneMenus') || '[]');

    if (zvoleneMenus.length === 0) {
      setMessage('Please select at least one meal before reserving a table.');
      return;
    }

    const reservationDateTime = new Date(datee);
    reservationDateTime.setHours(parseInt(reservationTime.split(':')[0], 10));
    reservationDateTime.setMinutes(parseInt(reservationTime.split(':')[1], 10));

    const reservationData = {
      reservationDate: reservationDateTime.toISOString(),
      tableNumber: table,
      userId: userId,
    };

    try {
      const reservationResponse = await axios.post('http://localhost:5000/api/reservation/makereservation', reservationData);
      const reservationId = reservationResponse.data.reservationId;

      const orderData = {
        reservation_id: reservationId,
        orders: zvoleneMenus,
      };

      const orderResponse = await axios.post('http://localhost:5000/api/orders/makeorder', orderData);

      setMessage('Table and meals have been reserved successfully.');
    } catch (error) {
      console.error('Error making the reservation or orders:', error);
      setMessage('An error occurred while making the reservation or orders.');
    }
  };
  const checkAvailabilityAndReserve = async () => {
    if (!table || !reservationTime) {
        setMessage('Please select both a table and a time.');
        return;
    }

    const reservationDateTime = new Date(datee);
    reservationDateTime.setHours(parseInt(reservationTime.split(':')[0], 10));
    reservationDateTime.setMinutes(parseInt(reservationTime.split(':')[1], 10));

    const requestData = {
        reservationDate: reservationDateTime.toISOString(),
        tableNumber: table,
    };

    try {
        await axios.post('http://localhost:5000/api/reservation/checkavailability', requestData);
        onReserve();
    } catch (error) {
        if (error.response && error.response.status === 409) {
            // Specifically handle the 409 Conflict error
            setShowConflictAlert(true); // Show the conflict alert
            setAvailabilityMessage('Selected table is already reserved at this time. Please choose a different time or table.');
        } else {
            console.error('Error checking table availability:', error);
            setMessage('An error occurred while checking table availability.');
        }
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
                <button className="btn btn-primary" onClick={checkAvailabilityAndReserve}>Reserve</button>
                {availabilityMessage && (
                    <Alert variant="danger" onClose={() => setShowConflictAlert(false)} dismissible className="mt-3">
                        <Alert.Heading>Reservation Conflict!</Alert.Heading>
                        <p>{availabilityMessage}</p>
                    </Alert>
                )}
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
