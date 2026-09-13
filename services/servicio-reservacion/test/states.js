const store = require('../src/store');

const stateHandlers = {
  'el usuario U100 tiene una reserva activa': async () => {
    store.reset();
    store.seedReservation({
      id: 'R-2001',
      userId: 'U100',
      room: 'SALA-1',
      date: '2026-05-01',
      hours: 2,
      status: 'ACTIVA',
    });
  },

  'el usuario U200 no tiene reservas': async () => {
    store.reset();
  },

  'la reserva R-1001 existe y está activa': async () => {
    store.reset();
    store.seedReservation({
      id: 'R-1001',
      userId: 'U999',
      room: 'SALA-2',
      date: '2026-05-02',
      hours: 1,
      status: 'ACTIVA',
    });
  },

  'la reserva no existe': async () => {
    store.reset();
  },

  'el sistema está listo para crear una reserva': async () => {
    store.reset();
  },
};

module.exports = { stateHandlers };
