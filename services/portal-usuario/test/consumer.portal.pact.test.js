const path = require('path');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { getUserReservations } = require('../src/client');

const { like, eachLike } = MatchersV3;

const provider = new PactV3({
  consumer: 'PortalUsuario',
  provider: 'ServicioReservas',
  dir: path.resolve(__dirname, '../../../pacts'),
  logLevel: 'warn',
});

describe('Contrato 2: Portal de Usuario -> Servicio de Reservas', () => {
  it('retorna las reservas de un usuario que sí posee reservas (U100)', () => {
    provider
      .given('el usuario U100 tiene una reserva activa')
      .uponReceiving('una solicitud de las reservas del usuario U100')
      .withRequest({
        method: 'GET',
        path: '/reservations',
        query: { userId: 'U100' },
      })
      .willRespondWith({
        status: 200,
        body: eachLike({
          id: like('R-2001'),
          userId: 'U100',
          room: like('SALA-1'),
          date: like('2026-05-01'),
          hours: like(2),
          status: 'ACTIVA',
        }),
      });

    return provider.executeTest(async (mockServer) => {
      const reservas = await getUserReservations(mockServer.url, 'U100');
      expect(reservas.length).toBeGreaterThan(0);
      expect(reservas[0].userId).toBe('U100');
      expect(reservas[0].status).toBe('ACTIVA');
    });
  });

  it('retorna una lista vacía para un usuario sin reservas (U200)', () => {
    provider
      .given('el usuario U200 no tiene reservas')
      .uponReceiving('una solicitud de las reservas del usuario U200')
      .withRequest({
        method: 'GET',
        path: '/reservations',
        query: { userId: 'U200' },
      })
      .willRespondWith({
        status: 200,
        body: [],
      });

    return provider.executeTest(async (mockServer) => {
      const reservas = await getUserReservations(mockServer.url, 'U200');
      expect(reservas).toEqual([]);
    });
  });
});
