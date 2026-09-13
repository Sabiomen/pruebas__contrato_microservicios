const axios = require('axios');

async function getUserReservations(baseUrl, userId) {
  const res = await axios.get(`${baseUrl}/reservations`, {
    params: { userId },
  });
  return res.data;
}

async function createReservation(baseUrl, { userId, room, date, hours }) {
  try {
    const res = await axios.post(`${baseUrl}/reservations`, {
      userId,
      room,
      date,
      hours,
    });
    return { status: res.status, body: res.data };
  } catch (err) {
    if (err.response) {
      return { status: err.response.status, body: err.response.data };
    }
    throw err;
  }
}

module.exports = { getUserReservations, createReservation };
