const express = require('express');
const { checkReservation } = require('./client');

const RESERVATION_SERVICE_URL =
  process.env.RESERVATION_SERVICE_URL || 'http://localhost:3001';

function createApp() {
  const app = express();
  app.use(express.json());

  // Verifica si una reserva existe y está activa
  app.get('/api/verificar/:id', async (req, res) => {
    try {
      const data = await checkReservation(RESERVATION_SERVICE_URL, req.params.id);
      res.status(200).json(data);
    } catch (err) {
      res.status(502).json({ error: 'No fue posible contactar al Servicio de Reservas' });
    }
  });

  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  return app;
}

module.exports = { createApp };
