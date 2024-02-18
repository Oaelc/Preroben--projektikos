const prisma = require('../lib/prisma');

// Make a reservation
const makeReservation = async (req, res) => {
    console.log("Received reservation data:", req.body);
    try {
        const { reservationDate, tableNumber, userId } = req.body;
        const reservation = await prisma.reservation.create({
            data: {
                reservationDate: new Date(reservationDate),
                table: Number(tableNumber),
                userId: Number(userId),
                endTime: new Date() // Assuming `endTime` should be set to the current time
            },
        });
        console.log("Reservation created successfully:", reservation);
        res.json({ reservationId: reservation.id });
    } catch (error) {
        console.error('Error making reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Delete a reservation
const deleteReservation = async (req, res) => {
    const { reservationId } = req.params;
    try {
        await prisma.$transaction([
            prisma.order.deleteMany({
                where: { reservationId: Number(reservationId) },
            }),
            prisma.reservation.delete({
                where: { id: Number(reservationId) },
            }),
        ]);
        res.json({ message: 'Reservation and related orders deleted successfully' });
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const checkTableAvailability = async (req, res) => {
    const { reservationDate, tableNumber } = req.body;
    const reservationStart = new Date(reservationDate);
    const reservationEnd = new Date(reservationStart.getTime() + 60 * 60 * 1000); // Adds 1 hour in milliseconds
    const nextHour = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000); // Adds 2 hours in milliseconds

    // Set reservationStart to the beginning of the hour
    reservationStart.setMinutes(0);
    reservationStart.setSeconds(0);

    console.log("Checking availability for table:", tableNumber);
    console.log("Reservation start:", reservationStart.toISOString());
    console.log("Reservation end:", reservationEnd.toISOString());
    console.log("Next hour:", nextHour.toISOString());

    try {
        const overlappingReservations = await prisma.reservation.findMany({
            where: {
                table: Number(tableNumber),
                AND: [
                    {
                        reservationDate: {
                            lt: nextHour,
                        },
                    },
                    {
                        reservationDate: {
                            gte: reservationStart,
                        },
                    },
                ],
            },
        });

        if (overlappingReservations.length > 0) {
            res.status(409).json({ message: 'Table is not available at the selected time.' });
        } else {
            res.json({ message: 'Table is available.' });
        }
    } catch (error) {
        console.error('Error checking table availability:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Fetch user reservations
const getUserReservations = async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const reservations = await prisma.reservation.findMany({
            where: { userId: userId },
            include: {
                orders: {
                    include: {
                        menu: true,
                    },
                },
            },
        });
        const detailedReservations = reservations.map(reservation => ({
            ...reservation,
            totalCost: reservation.orders.reduce((acc, curr) => acc + curr.menu.price, 0),
        }));
        res.json(detailedReservations);
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    makeReservation,
    deleteReservation,
    checkTableAvailability,
    getUserReservations,
};
