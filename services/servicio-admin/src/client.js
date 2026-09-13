const axios = require('axios');

async function checkReservation(baseUrl, reservationId) {
  const res = await axios.get(`${baseUrl}/reservations/${reservationId}/estado`);
  return res.data;
}

module.exports = { checkReservation };
