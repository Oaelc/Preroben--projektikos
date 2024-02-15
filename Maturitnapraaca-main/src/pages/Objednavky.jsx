import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../pages/Styles/Objednavky.css';

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isadmin = localStorage.getItem('isadmin');
    if (isadmin !== 'true') {
      navigate('/home');
    } else {
      fetchOrders();
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      const aggregatedOrders = aggregateOrdersByReservation(response.data);
      setOrders(aggregatedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDeleteOrder = async (reservationId) => {
    console.log("Deleting reservation with ID:", reservationId);
    try {
      // Corrected URL to match the server's endpoint for deleting a reservation
      await axios.delete(`http://localhost:5000/api/reservation/${reservationId}`);
      // Filter out the deleted order from your component's state
      const updatedOrders = orders.filter(order => order.id !== reservationId);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };
  

  const aggregateOrdersByReservation = (orders) => {
    const groupedOrders = {};
    orders.forEach(order => {
      if (!groupedOrders[order.reservation.id]) {
        groupedOrders[order.reservation.id] = {
          ...order.reservation,
          meals: [order.menu.item.trim()],
          totalCost: order.menu.price
        };
      } else {
        groupedOrders[order.reservation.id].meals.push(order.menu.item.trim());
        groupedOrders[order.reservation.id].totalCost += order.menu.price;
      }
    });
    return Object.values(groupedOrders);
  };

  const calculateTotalRevenue = (orders) => {
    return orders.reduce((total, order) => total + order.totalCost, 0);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Orders</h2>
      <div className="total-revenue mb-4">
        <h3>Total Revenue: ${calculateTotalRevenue(orders).toFixed(2)}</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>User</th>
              <th>Date of Reservation</th>
              <th>Table</th>
              <th>Meals Ordered</th>
              <th>Total Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="order-row">
                <td>{order.user?.username || 'N/A'}</td>
                <td>{new Date(order.reservationDate).toLocaleDateString()}</td>
                <td>{order.table}</td>
                <td>{order.meals.join(", ")}</td>
                <td>${order.totalCost.toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Order completed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewOrders;
