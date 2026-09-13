let reservations = [];
let counter = 1;

function reset() {
  reservations = [];
  counter = 1;
}

function generateId() {
  return `R-${1000 + counter++}`;
}

function createReservation({ userId, room, date, hours }) {
  const numericHours = Number(hours);
  if (!numericHours || numericHours <= 0) {
    return { error: 'INVALID_HOURS' };
  }
  const reservation = {
    id: generateId(),
    userId,
    room,
    date,
    hours: numericHours,
    status: 'ACTIVA',
  };
  reservations.push(reservation);
  return { reservation };
}

function getByUser(userId) {
  return reservations.filter((r) => r.userId === userId);
}

function findById(id) {
  return reservations.find((r) => r.id === id);
}

function isValid(id) {
  const r = findById(id);
  return !!(r && r.status === 'ACTIVA');
}

function seedReservation(reservation) {
  reservations.push(reservation);
}

module.exports = {
  reset,
  createReservation,
  getByUser,
  findById,
  isValid,
  seedReservation,
  generateId,
};
