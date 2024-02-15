const prisma = require('../lib/prisma');

// Make a reservation
const makeReservation = async (req, res) => {
    try {
        const { reservationDate, tableNumber, userId } = req.body;
        const reservation = await prisma.reservation.create({
            data: {
                reservationDate: new Date(reservationDate),
                table: Number(tableNumber),
                userId: Number(userId),
            },
        });

        res.json({ reservationId: reservation.id });
    } catch (error) {
        console.error('Error:', error);
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
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Check table availability
const checkTableAvailability = async (req, res) => {
    const { reservationDate, tableNumber } = req.body;
    try {
        const availability = await prisma.reservation.findMany({
            where: {
                AND: [
                    { table: Number(tableNumber) },
                    {
                        reservationDate: {
                            gte: new Date(reservationDate),
                            lt: new Date(new Date(reservationDate).getTime() + 2 * 60 * 60 * 1000), // checks for 2-hour window
                        },
                    },
                ],
            },
        });

        if (availability.length > 0) {
            return res.status(409).json({ message: 'Table is not available at the selected time.' });
        }

        res.json({ message: 'Table is available.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch user reservations with details
const getUserReservationsWithDetails = async (req, res) => {
    // Correctly parse and validate userId from the request, assuming middleware has set it
    const userId = parseInt(req.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                userId: userId,
            },
            include: {
                orders: {
                    include: {
                        menu: true,
                    },
                },
            },
        });

        res.json(reservations);
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    makeReservation,
    deleteReservation,
    checkTableAvailability,
    getUserReservationsWithDetails,
};
