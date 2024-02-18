import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/Styles/profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "Loading..." });
    const [greeting, setGreeting] = useState('');
    const [dailyMenu, setDailyMenu] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login', { replace: true });
        } else {
            const storedUsername = localStorage.getItem("username");
            const userId = localStorage.getItem("user_id");
            if (storedUsername && userId) {
                setUser({ username: storedUsername });
                fetchUserReservations(userId);
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


    const fetchUserReservations = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/reservation/user/${userId}`);
            const aggregatedReservations = aggregateReservations(response.data);
            setReservations(aggregatedReservations);
        } catch (error) {
            console.error('Error fetching user reservations:', error);
        }
    };

    const aggregateReservations = (reservations) => {
        const aggregated = reservations.reduce((acc, curr) => {
            // Create a composite key for each unique reservation
            const key = `${curr.reservationDate}-${curr.table}`;
            if (!acc[key]) {
                acc[key] = { ...curr, orders: {}, orderCount: 0 };
            }
            curr.orders.forEach(order => {
                const orderKey = order.menu.item;
                if (!acc[key].orders[orderKey]) {
                    acc[key].orders[orderKey] = { count: 1, price: order.menu.price };
                } else {
                    acc[key].orders[orderKey].count++;
                }
                acc[key].orderCount++;
            });
            return acc;
        }, {});

        // Convert object back to array and sort by date
        return Object.values(aggregated).map(reservation => ({
            ...reservation,
            orders: Object.entries(reservation.orders).map(([item, details]) => ({ item, ...details }))
        })).sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
    };

    async function handleLogout() {
        try {
            await axios.post('http://localhost:5000/api/logout');
            localStorage.removeItem('authToken');
            localStorage.removeItem("username");
            localStorage.removeItem("user_id");
            localStorage.removeItem("isadmin"); // Make sure this is also removed
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Error during logout:', error);
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
            <button className="btn btn-info mt-3" onClick={() => setShowOrdersModal(true)}>Look at your orders</button>

            <Modal show={showOrdersModal} onHide={() => setShowOrdersModal(false)} size="lg" scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>All Your Orders</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {reservations.length ? (
                        reservations.map((reservation, index) => (
                            <div key={index} className="mb-3">
                                <h5>Date: {new Date(reservation.reservationDate).toLocaleString()}</h5>
                                <h6>Table: {reservation.table}</h6>
                                {reservation.orders.map((order, orderIndex) => (
                                    <div key={orderIndex}>
                                        {order.count > 1 ? `${order.count}x ` : ''}{order.item} - ${order.price.toFixed(2)}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : <p>No orders yet.</p>}
                </Modal.Body>
            </Modal>

            <button onClick={handleLogout} className="btn btn-primary logout-button mt-3">Logout</button>
        </div>
    );
}
