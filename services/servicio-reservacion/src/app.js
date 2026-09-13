const express = require('express');
const store = require('./store');

function createApp() {
  const app = express();
  app.use(express.json());

  // 1. Crear una reserva
  app.post('/reservations', (req, res) => {
    const { userId, room, date, hours } = req.body || {};
    const result = store.createReservation({ userId, room, date, hours });

    if (result.error) {
      return res.status(400).json({
        error: 'Los datos de la reserva no son válidos',
      });
    }

    return res.status(201).json(result.reservation);
  });

  // 2. Consultar las reservas de un usuario
  app.get('/reservations', (req, res) => {
    const { userId } = req.query;
    const list = store.getByUser(userId);
    return res.status(200).json(list);
  });

  // 3. Verificar si una reserva existe y está activa
  app.get('/reservations/:id/estado', (req, res) => {
    const { id } = req.params;
    const valid = store.isValid(id);
    return res.status(200).json({ reservationId: id, valid });
  });

  // Endpoint auxiliar de salud, útil para docker-compose healthchecks
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  return app;
}

module.exports = { createApp };