const express = require('express');
const { makeReservation, deleteReservation, checkTableAvailability, getUserReservationsWithDetails } = require('../controllers/reservationController');
const router = express.Router();

// In your reservationRoutes.js or wherever you define routes
router.delete('/:reservationId', deleteReservation);
router.post('/makereservation', makeReservation);
router.delete('/reservation/:reservationId', deleteReservation); // Updated route
router.post('/checkavailability', checkTableAvailability);
router.get('/userReservationsWithDetails', getUserReservationsWithDetails);

module.exports = router;
