import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/Styles/dailymenu.css'; // Make sure this path matches your project structure

const Dailymenuedit = () => {
  const [dailyMenu, setDailyMenu] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [editMode, setEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState({ id: null, item: '', price: '', description: '', day: 'Monday' });
  const [errorMessage, setErrorMessage] = useState('');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    fetchDailyMenu(selectedDay);
  }, [selectedDay]);

  const fetchDailyMenu = (day) => {
    setIsLoading(true);
    axios.get(`http://localhost:5000/api/dailymenu/${day}`)
      .then((res) => {
        setDailyMenu(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching daily menu:', error);
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem({ ...selectedItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = selectedItem.id ? 'put' : 'post';
    const url = `http://localhost:5000/api/dailymenu${selectedItem.id ? `/${selectedItem.id}` : ''}`;

    try {
      await axios[method](url, { ...selectedItem, price: parseFloat(selectedItem.price) });
      setShowEditModal(false);
      fetchDailyMenu(selectedDay);
      setSelectedItem({ id: null, item: '', price: '', description: '', day: selectedDay });
    } catch (error) {
      console.error('Error updating menu item:', error);
      setErrorMessage('Failed to update the menu item. Please try again.');
    }
  };

  const handleAddNewClick = () => {
    setSelectedItem({ id: null, item: '', price: '', description: '', day: selectedDay });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/dailymenu/${id}`);
      setShowDeleteConfirm(false);
      fetchDailyMenu(selectedDay);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setErrorMessage('Failed to delete the menu item. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {isLoading && <div className="loading-screen">Loading...</div>}
      <div className={`dmenu-container mt-4 ${!isLoading ? 'loaded' : ''}`}>
        <div className="button-container mb-4">
          {daysOfWeek.map((day) => (
            <button key={day} className={`btn day-button ${selectedDay === day ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedDay(day)}>
              {day}
            </button>
          ))}
          <Button variant="success" onClick={handleAddNewClick}>Add Meal</Button>
          <Button variant={editMode ? "info" : "secondary"} onClick={() => setEditMode(!editMode)}>{editMode ? "Finish Editing" : "Edit Mode"}</Button>
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <div className="menu-items" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {dailyMenu.map((menu, index) => (
            <div key={index} className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{menu.item}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{menu.price}$</h6>
                <p className="card-text">{menu.description}</p>
                {editMode && (
                  <>
                    <Button variant="info" onClick={() => {
                      setSelectedItem(menu);
                      setShowEditModal(true);
                    }}>Edit</Button>
                    <Button variant="danger" className="ml-2" onClick={() => {
                      setSelectedItem(menu);
                      setShowDeleteConfirm(true);
                    }}>Delete</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <Modal show={showEditModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedItem.id ? "Edit Meal" : "Add Meal"}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Item Name</Form.Label>
                <Form.Control type="text" name="item" value={selectedItem.item} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" value={selectedItem.price} onChange={handleInputChange} min="0" step="0.01" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows="3" name="description" value={selectedItem.description} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Day</Form.Label>
                <Form.Control as="select" name="day" value={selectedItem.day} onChange={handleInputChange}>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
              <Button variant="primary" type="submit">{selectedItem.id ? "Save Changes" : "Add Meal"}</Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this meal?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(selectedItem.id)}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Dailymenuedit;
