import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../pages/Styles/menu.css";

const Menu = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('http://localhost:5000/menu');
        if (response.ok) {
          const data = await response.json();
          setMenuData(data);
        } else {
          console.log('Failed to fetch menu data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchMenuData();
  }, []);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Menu</h2>
      <div className="row">
        {menuData.map((item, index) => (
          <div key={index} className="col-md-4 mb-3" onClick={() => handleCardClick(item)}>
            <div className="card h-100 card-hover"> {/* Added card-hover class */}
              <div className="card-body">
                <h5 className="card-title">{item.item}</h5>
                <p className="card-text">{item.description}</p>
              </div>
              <div className="card-footer">
                <small className="text-muted">Price: {item.price}$</small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.item}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedItem?.description}</p>
          <p>Price: {selectedItem?.price}$</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Menu;
