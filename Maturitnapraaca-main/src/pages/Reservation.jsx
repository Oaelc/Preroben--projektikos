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
    const [availabilityMessage, setAvailabilityMessage] = useState('');

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
        }
        // Clear previous meal selections from local storage
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
        // Get user ID and selected meals from local storage
        const userId = localStorage.getItem('user_id');
        const zvoleneMenus = JSON.parse(localStorage.getItem('zvoleneMenus') || '[]');

        // Check if any meals are selected
        if (zvoleneMenus.length === 0) {
            setMessage('Please select at least one meal before reserving a table.');
            return;
        }

        // Create a reservation datetime using the selected date and time
        const reservationDateTime = new Date(datee);
        reservationDateTime.setHours(parseInt(reservationTime.split(':')[0], 10));
        reservationDateTime.setMinutes(parseInt(reservationTime.split(':')[1], 10));

        // Log the final reservation datetime to ensure it's correct
        console.log("Reserving table at:", reservationTime);

        // Prepare reservation data
        const reservationData = {
            reservationDate: reservationDateTime.toISOString(),
            tableNumber: table,
            userId: userId,
        };

        try {
            // Attempt to make a reservation
            const reservationResponse = await axios.post('http://localhost:5000/api/reservation/makereservation', reservationData);
            console.log('Reservation successful:', reservationResponse.data);
            const reservationId = reservationResponse.data.reservationId;

            // Prepare order data
            const orderData = {
                reservation_id: reservationId,
                orders: zvoleneMenus,
            };

            // Attempt to create an order
            const orderResponse = await axios.post('http://localhost:5000/api/orders/makeorder', orderData);
            console.log('Order creation successful:', orderResponse.data);

            // Display success message
            setMessage('Table and meals have been reserved successfully.');
        } catch (error) {
            // Handle errors
            console.error('Error making the reservation or orders:', error);
            setMessage('An error occurred while making the reservation or orders.');
        }
    };

    const checkAvailabilityAndReserve = async () => {
        // Initial check for missing inputs
        if (!table || !reservationTime) {
            setMessage('Please select both a table and a time.');
            return;
        }

        const reservationDateTime = new Date(datee);
        reservationDateTime.setHours(parseInt(reservationTime.split(':')[0], 10));
        reservationDateTime.setMinutes(parseInt(reservationTime.split(':')[1], 10));

        // Log the datetime we're checking for availability
        console.log("Checking availability for datetime:", reservationDateTime.toISOString());

        const requestData = {
            reservationDate: reservationDateTime.toISOString(),
            tableNumber: table,
        };

        // Log the request data before making the axios request
        console.log("Request Data:", requestData);

        // Attempt to check table availability and log the response or error
        try {
            const response = await axios.post('http://localhost:5000/api/reservation/checkavailability', requestData);
            console.log("Availability check response:", response.data);

            if (response.data.message === 'Table is available.') {
                onReserve();
            } else {
                setAvailabilityMessage('Selected table is already reserved at this time. Please choose a different time or table.');
            }
        } catch (error) {
            console.error('Error checking table availability:', error);
            setMessage('An error occurred while checking table availability.');
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
                        <div className="alert alert-warning mt-3">{availabilityMessage}</div>
                    )}
                </div>
            </div>
            <Ordermenu />
        </div>
    );
}

export default MakeReservation;
