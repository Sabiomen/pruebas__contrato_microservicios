const express = require('express');
const { getUserReservations, createReservation } = require('./client');

const RESERVATION_SERVICE_URL =
  process.env.RESERVATION_SERVICE_URL || 'http://localhost:3001';

function createApp() {
  const app = express();
  app.use(express.json());

  // Consulta las reservas de un usuario
  app.get('/api/reservas/:userId', async (req, res) => {
    try {
      const data = await getUserReservations(
        RESERVATION_SERVICE_URL,
        req.params.userId
      );
      res.status(200).json(data);
    } catch (err) {
      res.status(502).json({ error: 'No fue posible consultar el Servicio de Reservas' });
    }
  });

  // Crea una reserva
  app.post('/api/reservas', async (req, res) => {
    try {
      const { status, body } = await createReservation(RESERVATION_SERVICE_URL, req.body);
      res.status(status).json(body);
    } catch (err) {
      res.status(502).json({ error: 'No fue posible contactar al Servicio de Reservas' });
    }
  });

  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  return app;
}

module.exports = { createApp };
