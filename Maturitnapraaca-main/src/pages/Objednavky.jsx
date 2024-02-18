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
      console.log("Orders fetched:", response.data); // Check the fetched data
      const aggregatedOrders = aggregateOrdersByReservation(response.data);
      console.log("Aggregated Orders:", aggregatedOrders); // Verify aggregated data structure
      setOrders(aggregatedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const handleDeleteOrder = async (reservationId) => {
    console.log("Attempting to delete reservation with ID:", reservationId); // Confirm deletion attempt
    try {
      await axios.delete(`http://localhost:5000/api/reservation/${reservationId}`);
      console.log(`Reservation with ID: ${reservationId} deleted successfully.`); // Confirm deletion success
      const updatedOrders = orders.filter(order => order.id !== reservationId);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };
  

  const aggregateOrdersByReservation = (orders) => {
    const groupedOrders = {};
    orders.forEach(order => {
      const key = `${order.reservation.id}-${new Date(order.reservation.reservationDate).toISOString()}`;
      if (!groupedOrders[key]) {
        groupedOrders[key] = {
          id: order.reservation.id,
          user: order.reservation.user,
          reservationDate: order.reservation.reservationDate,
          table: order.reservation.table,
          meals: [{ item: order.menu.item, count: 1 }],
          totalCost: order.menu.price
        };
      } else {
        const existingMeal = groupedOrders[key].meals.find(meal => meal.item === order.menu.item);
        if (existingMeal) {
          existingMeal.count += 1;
        } else {
          groupedOrders[key].meals.push({ item: order.menu.item, count: 1 });
        }
        groupedOrders[key].totalCost += order.menu.price;
      }
    });
    return Object.values(groupedOrders).map(order => ({
      ...order,
      mealsDisplay: order.meals.map(meal => `${meal.count > 1 ? `${meal.count}x ` : ''}${meal.item}`).join(", ")
    }));
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
              <th>Date and Time of Reservation</th>
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
                <td>{new Date(order.reservationDate).toLocaleString()}</td>
                <td>{order.table}</td>
                <td>{order.mealsDisplay}</td>
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
