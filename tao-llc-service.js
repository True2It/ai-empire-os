/**
 * TAO LLC - Expediting & Moving Service
 * 
 * Core business logic for:
 * - Service booking and scheduling
 * - Dynamic pricing based on distance, weight, and urgency
 * - Automated dispatch and routing
 * - Customer management
 * - Revenue tracking
 */

// Service Types and Pricing
const TAO_SERVICES = {
    MOVING: {
        name: 'Local Moving',
        basePrice: 150,
        pricePerMile: 2.5,
        pricePerHour: 50,
        description: 'Professional moving services for residential and commercial moves'
    },
    EXPEDITED_DELIVERY: {
        name: 'Expedited Delivery',
        basePrice: 75,
        pricePerMile: 3.5,
        pricePerHour: 60,
        description: 'Same-day or next-day delivery for time-sensitive shipments',
        urgencyMultiplier: 1.5
    },
    ROADSIDE_ASSISTANCE: {
        name: 'Roadside Assistance',
        basePrice: 100,
        pricePerMile: 2.0,
        pricePerHour: 45,
        description: '24/7 roadside assistance, towing, and emergency services'
    },
    JUNK_REMOVAL: {
        name: 'Junk Removal',
        basePrice: 200,
        pricePerLoad: 150,
        description: 'Efficient junk removal and disposal services'
    },
    NOTARY_SERVICES: {
        name: 'Mobile Notary',
        basePrice: 50,
        pricePerDocument: 15,
        description: 'Mobile notary services for documents and legal paperwork'
    },
    PRESSURE_WASHING: {
        name: 'Pressure Washing',
        basePrice: 100,
        pricePerSqFt: 0.25,
        description: 'Professional pressure washing for residential and commercial properties'
    }
};

// Cities and Service Areas
const SERVICE_AREAS = {
    ATLANTA: {
        name: 'Atlanta, GA',
        radius: 50,
        zones: ['Downtown', 'Midtown', 'Buckhead', 'Marietta', 'Decatur', 'Smyrna'],
        timezone: 'America/Chicago'
    },
    HOUSTON: {
        name: 'Houston, TX',
        radius: 50,
        zones: ['Downtown', 'Midtown', 'Uptown', 'Katy', 'Pearland', 'The Woodlands'],
        timezone: 'America/Chicago'
    }
};

// Booking System
class TAOBooking {
    constructor(bookingId, customerId, serviceType, city, pickupLocation, dropoffLocation, scheduledTime) {
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.serviceType = serviceType;
        this.city = city;
        this.pickupLocation = pickupLocation;
        this.dropoffLocation = dropoffLocation;
        this.scheduledTime = scheduledTime;
        this.status = 'PENDING'; // PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
        this.createdAt = new Date();
        this.estimatedPrice = 0;
        this.finalPrice = 0;
        this.driver = null;
        this.vehicle = null;
        this.notes = '';
    }

    calculatePrice(distance, weight = 0, urgency = 1) {
        const service = TAO_SERVICES[this.serviceType];
        if (!service) return 0;

        let price = service.basePrice;

        if (service.pricePerMile) {
            price += distance * service.pricePerMile;
        }

        if (service.pricePerHour) {
            // Estimate 1 hour per 30 miles
            const estimatedHours = Math.ceil(distance / 30);
            price += estimatedHours * service.pricePerHour;
        }

        if (service.pricePerLoad && weight > 0) {
            price += service.pricePerLoad;
        }

        if (service.urgencyMultiplier) {
            price *= (service.urgencyMultiplier * urgency);
        }

        this.estimatedPrice = Math.round(price * 100) / 100;
        return this.estimatedPrice;
    }

    confirmBooking(paymentMethod = 'CREDIT_CARD') {
        this.status = 'CONFIRMED';
        this.paymentMethod = paymentMethod;
        return {
            bookingId: this.bookingId,
            status: this.status,
            estimatedPrice: this.estimatedPrice,
            confirmationTime: new Date()
        };
    }

    assignDriver(driver) {
        this.driver = driver;
        this.status = 'IN_PROGRESS';
        return {
            bookingId: this.bookingId,
            driver: driver,
            status: this.status,
            estimatedArrival: this.calculateEstimatedArrival()
        };
    }

    calculateEstimatedArrival() {
        // Simulate 15-30 minute arrival time
        const arrivalMinutes = Math.random() * 15 + 15;
        const arrival = new Date();
        arrival.setMinutes(arrival.getMinutes() + arrivalMinutes);
        return arrival;
    }

    completeBooking(finalPrice, notes = '') {
        this.status = 'COMPLETED';
        this.finalPrice = finalPrice || this.estimatedPrice;
        this.notes = notes;
        return {
            bookingId: this.bookingId,
            status: this.status,
            finalPrice: this.finalPrice,
            completedAt: new Date()
        };
    }
}

// Driver Management
class TAODriver {
    constructor(driverId, name, phone, vehicle, licenseNumber, rating = 5.0) {
        this.driverId = driverId;
        this.name = name;
        this.phone = phone;
        this.vehicle = vehicle;
        this.licenseNumber = licenseNumber;
        this.rating = rating;
        this.status = 'AVAILABLE'; // AVAILABLE, ON_JOB, OFFLINE
        this.currentBooking = null;
        this.totalCompletedJobs = 0;
        this.totalEarnings = 0;
    }

    acceptBooking(booking) {
        this.status = 'ON_JOB';
        this.currentBooking = booking;
        return {
            driverId: this.driverId,
            bookingId: booking.bookingId,
            status: this.status
        };
    }

    completeJob(finalPrice) {
        this.totalCompletedJobs++;
        this.totalEarnings += finalPrice * 0.7; // Driver gets 70% of revenue
        this.status = 'AVAILABLE';
        this.currentBooking = null;
        return {
            driverId: this.driverId,
            totalEarnings: this.totalEarnings,
            totalJobs: this.totalCompletedJobs
        };
    }
}

// Revenue Tracking
class TAORevenue {
    constructor() {
        this.totalRevenue = 0;
        this.completedBookings = 0;
        this.pendingBookings = 0;
        this.cancelledBookings = 0;
        this.averageBookingValue = 0;
        this.dailyRevenue = {};
    }

    recordBooking(booking) {
        this.totalRevenue += booking.finalPrice;
        this.completedBookings++;
        this.averageBookingValue = this.totalRevenue / this.completedBookings;

        const date = new Date().toISOString().split('T')[0];
        this.dailyRevenue[date] = (this.dailyRevenue[date] || 0) + booking.finalPrice;

        return {
            totalRevenue: this.totalRevenue,
            averageBookingValue: this.averageBookingValue,
            completedBookings: this.completedBookings
        };
    }

    getRevenueReport(startDate, endDate) {
        let periodRevenue = 0;
        for (const [date, revenue] of Object.entries(this.dailyRevenue)) {
            if (date >= startDate && date <= endDate) {
                periodRevenue += revenue;
            }
        }
        return {
            periodRevenue: periodRevenue,
            totalRevenue: this.totalRevenue,
            completedBookings: this.completedBookings,
            averageBookingValue: this.averageBookingValue
        };
    }
}

// Dispatch System
class TAODispatchSystem {
    constructor() {
        this.drivers = [];
        this.bookings = [];
        this.revenue = new TAORevenue();
    }

    addDriver(driver) {
        this.drivers.push(driver);
        return driver;
    }

    createBooking(customerId, serviceType, city, pickupLocation, dropoffLocation, scheduledTime, distance, weight = 0, urgency = 1) {
        const bookingId = `TAO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const booking = new TAOBooking(bookingId, customerId, serviceType, city, pickupLocation, dropoffLocation, scheduledTime);
        booking.calculatePrice(distance, weight, urgency);
        this.bookings.push(booking);
        return booking;
    }

    confirmBooking(bookingId, paymentMethod = 'CREDIT_CARD') {
        const booking = this.bookings.find(b => b.bookingId === bookingId);
        if (booking) {
            return booking.confirmBooking(paymentMethod);
        }
        return null;
    }

    assignDriverToBooking(bookingId) {
        const booking = this.bookings.find(b => b.bookingId === bookingId);
        const availableDriver = this.drivers.find(d => d.status === 'AVAILABLE');

        if (booking && availableDriver) {
            availableDriver.acceptBooking(booking);
            booking.assignDriver(availableDriver);
            return {
                bookingId: bookingId,
                driver: availableDriver,
                estimatedArrival: booking.calculateEstimatedArrival()
            };
        }
        return null;
    }

    completeBooking(bookingId, finalPrice, notes = '') {
        const booking = this.bookings.find(b => b.bookingId === bookingId);
        if (booking && booking.driver) {
            booking.completeBooking(finalPrice, notes);
            booking.driver.completeJob(finalPrice);
            this.revenue.recordBooking(booking);
            return booking;
        }
        return null;
    }

    getRevenueMetrics() {
        return {
            totalRevenue: this.revenue.totalRevenue,
            completedBookings: this.revenue.completedBookings,
            averageBookingValue: this.revenue.averageBookingValue,
            activeBookings: this.bookings.filter(b => b.status === 'IN_PROGRESS').length,
            pendingBookings: this.bookings.filter(b => b.status === 'PENDING').length
        };
    }

    getBookingStatus(bookingId) {
        const booking = this.bookings.find(b => b.bookingId === bookingId);
        if (booking) {
            return {
                bookingId: booking.bookingId,
                status: booking.status,
                estimatedPrice: booking.estimatedPrice,
                finalPrice: booking.finalPrice,
                driver: booking.driver ? { name: booking.driver.name, phone: booking.driver.phone } : null,
                createdAt: booking.createdAt
            };
        }
        return null;
    }
}

// Initialize the dispatch system
const taoDispatch = new TAODispatchSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TAOBooking,
        TAODriver,
        TAORevenue,
        TAODispatchSystem,
        TAO_SERVICES,
        SERVICE_AREAS,
        taoDispatch
    };
}
