const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAdminAPI() {
    try {
        console.log('--- Testing SportsPlex Admin API ---');

        // 1. Health Check
        const health = await axios.get(`${BASE_URL}/health`);
        console.log('Health Check:', health.data.message);

        // 2. Fetch Facilities
        const facilities = await axios.get(`${BASE_URL}/admin/facilities`);
        console.log(`Facilities Found: ${facilities.data.length}`);
        const firstFacilityId = facilities.data[0]._id;

        // 3. Create a Walk-in Reservation
        const walkIn = await axios.post(`${BASE_URL}/admin/reservations/walk-in`, {
            walk_in_name: 'Test Walk-in Athelete',
            facility: firstFacilityId,
            seat_number: 1, // Court Slot 1
            date: new Date().toISOString().split('T')[0],
            start_time: '14:00',
            end_time: '14:30'
        });
        console.log('Walk-in Created:', walkIn.data.walk_in_name);
        const reservationId = walkIn.data._id;

        // 4. View All Reservations
        const allRes = await axios.get(`${BASE_URL}/admin/reservations`);
        console.log(`Total Reservations: ${allRes.data.length}`);

        // 5. Update Reservation (Edit)
        const updated = await axios.put(`${BASE_URL}/admin/reservations/${reservationId}`, {
            seat_number: 2
        });
        console.log('Reservation Updated (New Slot):', updated.data.seat_number);

        // 6. Delete Reservation
        const deleted = await axios.delete(`${BASE_URL}/admin/reservations/${reservationId}`);
        console.log('Reservation Deleted:', deleted.data.message);

        console.log('--- All Admin API Tests Passed ---');
    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testAdminAPI();
