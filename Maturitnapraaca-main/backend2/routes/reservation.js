const express = require('express');
const { 
  makeReservation, 
  deleteReservation, 
  checkTableAvailability, 
  getUserReservations 
} = require('../controllers/reservationController');

const router = express.Router();

// Route for making a reservation
router.post('/makereservation', makeReservation);


// Route for deleting a reservation by its ID
router.delete('/:reservationId', deleteReservation);

// Route for checking table availability
router.post('/checkavailability', checkTableAvailability);

// Route for fetching user-specific reservations
router.get('/user/:userId', getUserReservations);

module.exports = router;
