const path = require('path');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { createReservation } = require('../src/client');

const { like } = MatchersV3;

const provider = new PactV3({
  consumer: 'AplicacionReserva',
  provider: 'ServicioReservas',
  dir: path.resolve(__dirname, '../../../pacts'),
  logLevel: 'warn',
});

describe('Contrato 1: Aplicación de Reserva -> Servicio de Reservas', () => {
  it('crea una reserva válida (SALA-1, 2 horas)', () => {
    provider
      .given('el sistema está listo para crear una reserva')
      .uponReceiving('una solicitud para crear una reserva válida')
      .withRequest({
        method: 'POST',
        path: '/reservations',
        headers: { 'Content-Type': 'application/json' },
        body: {
          userId: 'U100',
          room: 'SALA-1',
          date: '2026-05-01',
          hours: 2,
        },
      })
      .willRespondWith({
        status: 201,
        body: {
          id: like('R-2001'),
          userId: 'U100',
          room: 'SALA-1',
          date: '2026-05-01',
          hours: 2,
          status: 'ACTIVA',
        },
      });

    return provider.executeTest(async (mockServer) => {
      const { status, body } = await createReservation(mockServer.url, {
        userId: 'U100',
        room: 'SALA-1',
        date: '2026-05-01',
        hours: 2,
      });
      expect(status).toBe(201);
      expect(body.status).toBe('ACTIVA');
      expect(body.id).toBeDefined();
    });
  });

  it('rechaza una reserva con 0 horas', () => {
    provider
      .given('el sistema está listo para crear una reserva')
      .uponReceiving('una solicitud para crear una reserva con 0 horas')
      .withRequest({
        method: 'POST',
        path: '/reservations',
        headers: { 'Content-Type': 'application/json' },
        body: {
          userId: 'U100',
          room: 'SALA-1',
          date: '2026-05-01',
          hours: 0,
        },
      })
      .willRespondWith({
        status: 400,
        body: {
          error: like('Los datos de la reserva no son válidos'),
        },
      });

    return provider.executeTest(async (mockServer) => {
      const { status, body } = await createReservation(mockServer.url, {
        userId: 'U100',
        room: 'SALA-1',
        date: '2026-05-01',
        hours: 0,
      });
      expect(status).toBe(400);
      expect(body.error).toBeDefined();
    });
  });
});
