import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/Styles/profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "Loading..." });
    const [greeting, setGreeting] = useState('');
    const [dailyMenu, setDailyMenu] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('../login');
        } else {
            const storedUsername = localStorage.getItem("username");
            if (storedUsername) {
                setUser({ username: storedUsername });
            }
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const determineGreeting = () => {
            const hours = new Date().getHours();
            if (hours < 12) {
                setGreeting('Good Morning');
            } else if (hours < 18) {
                setGreeting('Good Afternoon');
            } else if (hours >= 18 && hours < 22) {
                setGreeting('Good Evening');
            } else {
                setGreeting('Good Night');
            }
        };
        determineGreeting();
    }, []);

    useEffect(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = days[new Date().getDay()];
        const fetchDailyMenu = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/dailymenu/${day}`);
                setDailyMenu(response.data);
            } catch (error) {
                console.error('Error fetching daily menu:', error);
            }
        };
        fetchDailyMenu();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const fetchReservations = async () => {
                const authToken = localStorage.getItem('authToken');
                if (authToken) {
                    try {
                        const response = await axios.get('http://localhost:5000/api/reservation/userReservationsWithDetails', {
                            headers: { Authorization: `Bearer ${authToken}` },
                        });
                        setReservations(response.data);
                    } catch (error) {
                        console.error('Error fetching reservations:', error);
                    }
                }
            };
            fetchReservations();
        }
    }, [isLoading]);

    async function handleLogout() {
        try {
            await axios.post('http://localhost:5000/api/logout');
            localStorage.removeItem('authToken');
            localStorage.removeItem("username");
            navigate('../login');
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    }

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="card welcome-card">
                <h1 className="card-header">{greeting}, {user.username}</h1>
            </div>
            <div className="card daily-menu-card mt-3">
                <div className="card-body">
                    <h2 className="card-title">Today's Menu</h2>
                    {dailyMenu.length ? (
                        <ul className="list-unstyled">
                            {dailyMenu.map((item, index) => (
                                <li key={index} className="mb-2">
                                    <strong>{item.item}</strong> - {item.description} - <span className="text-muted">${item.price}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-muted">No menu available for today.</p>}
                </div>
            </div>
            <div className="card orders-card mt-3">
                <div className="card-body">
                    <h2 className="card-title">Your Reservations</h2>
                    {reservations.length ? (
                        reservations.map((reservation, index) => (
                            <div key={index} className="mb-3">
                                <h5>Date: {new Date(reservation.reservationDate).toLocaleDateString()} - Table: {reservation.tableNumber}</h5>
                                <ul>
                                    {reservation.orders.map((order, orderIndex) => (
                                        <li key={orderIndex}>
                                            {order.menuItem} - {order.menuDescription} - ${order.price}
                                        </li>
                                    ))}
                                </ul>
                                <strong>Total Cost:</strong> ${reservation.totalCost.toFixed(2)}
                            </div>
                        ))
                    ) : <p className="text-muted">You have no reservations yet.</p>}
                </div>
            </div>
            <button onClick={handleLogout} className="btn btn-primary logout-button mt-3">
                Logout
            </button>
        </div>
    );
}
