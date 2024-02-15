import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/styles.css'; // Make sure this is the correct path to your styles

const Menuedit = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isadmin = localStorage.getItem('isadmin');
    if (isadmin !== 'true') {
      navigate('/home');
    }
  }, [navigate]);

  return <Menu isadmin={localStorage.getItem('isadmin')} />;
};

const Menu = ({ isadmin }) => {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);
  const [newItem, setNewItem] = useState({ item: '', price: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const response = await fetch('http://localhost:5000/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuData(data);
      } else {
        setErrorMessage('Failed to fetch menu data.');
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setErrorMessage('Failed to fetch menu data.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage('');
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = async () => {
    if (!newItem.item || isNaN(parseFloat(newItem.price)) || !newItem.description) {
      setErrorMessage('All fields are required and price must be a number.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, price: parseFloat(newItem.price) }),
      });

      if (response.ok) {
        setNewItem({ item: '', price: '', description: '' });
        fetchMenuData();
      } else {
        setErrorMessage('Error adding item. Please check your input.');
      }
    } catch (error) {
      console.error('Error adding new item:', error);
      setErrorMessage('Failed to add the item. Please try again.');
    }
  };

  const handleEditItemChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleEditItem = async () => {
    if (!editingItem.item || isNaN(parseFloat(editingItem.price)) || !editingItem.description) {
      setErrorMessage('All fields are required and price must be a number.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/menu/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        setEditingItem(null);
        fetchMenuData();
      } else {
        setErrorMessage('Error updating item. Please check your input.');
      }
    } catch (error) {
      console.error('Error editing item:', error);
      setErrorMessage('Failed to edit the item. Please try again.');
    }
  };

  const handleDeleteItem = async () => {
    setShowDeleteConfirm(false); // Close the modal first
    try {
      const response = await fetch(`http://localhost:5000/menu/${deleteItemId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchMenuData(); // Refresh the menu data after deletion
        setErrorMessage(''); // Optionally clear any previous error messages
      } else {
        setErrorMessage('Failed to delete the item. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setErrorMessage('Failed to delete the item. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Menu Management</h2>
      {isadmin === 'true' && (
        <button className="btn btn-primary mb-3" onClick={() => navigate('/Dailymenuedit')}>
          Daily Menu
        </button>
      )}
      <button className="btn btn-success mb-3" onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Finish Editing' : 'Edit Menu'}
      </button>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="card">
        <div className="card-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group mb-3">
              <label htmlFor="item-name">Item Name:</label>
              <input type="text" className="form-control" id="item-name" name="item" value={newItem.item} onChange={handleInputChange} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="item-price">Price:</label>
              <input type="text" className="form-control" id="item-price" name="price" value={newItem.price} onChange={handleInputChange} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="item-description">Description:</label>
              <input type="text" className="form-control" id="item-description" name="description" value={newItem.description} onChange={handleInputChange} />
            </div>
            <button type="button" className="btn btn-success" onClick={handleAddItem}>
              Add Item
            </button>
          </form>
        </div>
      </div>
      <div className="list-group mt-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {menuData.map((item, index) => (
          <div key={index} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">{item.item}</h5>
              <p className="mb-1">{item.price}$</p>
              <small>{item.description}</small>
            </div>
            {editMode && (
              <div>
                <button className="btn btn-warning mr-2" onClick={() => { setEditingItem(item); }}>Edit</button>
                <button className="btn btn-danger" onClick={() => { setDeleteItemId(item.id); setShowDeleteConfirm(true); }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {editingItem && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Item</h5>
                <button type="button" className="close" onClick={() => setEditingItem(null)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label>Item Name:</label>
                    <input type="text" className="form-control" name="item" value={editingItem ? editingItem.item : ''} onChange={handleEditItemChange} />
                  </div>
                  <div className="form-group">
                    <label>Price:</label>
                    <input type="text" className="form-control" name="price" value={editingItem ? editingItem.price : ''} onChange={handleEditItemChange} />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <input type="text" className="form-control" name="description" value={editingItem ? editingItem.description : ''} onChange={handleEditItemChange} />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleEditItem}>Save Changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this meal?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteItem}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Menuedit;
