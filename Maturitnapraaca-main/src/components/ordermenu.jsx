import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages/Styles/ordermenu.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Ordermenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [suma, setSuma] = useState(0);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/menu');
                if (response.status === 200) {
                    setMenuItems(response.data.map(item => ({ ...item, quantity: 0 })));
                } else {
                    console.log('Failed to fetch menu data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchMenuData();
    }, []);

    const handleQuantityChange = (index, change) => {
        const newMenuItems = [...menuItems];
        newMenuItems[index].quantity += change;

        if (newMenuItems[index].quantity < 0) {
            newMenuItems[index].quantity = 0;
        }

        setMenuItems(newMenuItems);
        const newSum = newMenuItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setSuma(newSum);

        // Update local storage with the selected menus and their quantities
        const zvoleneMenus = newMenuItems.filter(item => item.quantity > 0).map(item => ({ id: item.id, quantity: item.quantity }));
        localStorage.setItem('zvoleneMenus', JSON.stringify(zvoleneMenus));
    };

    return (
        <div className="container menuWindow mt-4">
            <h3 className="mb-4 text-center">Select Meals From Menu</h3>
            <div className="total-sum mb-3">
                <p>Total: <span className="text-success">{suma.toFixed(2)}$</span></p>
            </div>
            <ul className="list-group">
                {menuItems.map((item, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{item.item}</h5>
                            <p>Price: <span>{item.price}$</span></p>
                            <small>{item.description}</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <button className="btn btn-secondary btn-minus" onClick={() => handleQuantityChange(index, -1)} disabled={item.quantity <= 0}>-</button>
                            <span>{item.quantity}</span>
                            <button className="btn btn-primary btn-plus" onClick={() => handleQuantityChange(index, 1)}>+</button>

                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Ordermenu;