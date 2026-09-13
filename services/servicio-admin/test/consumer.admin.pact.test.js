const path = require('path');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { checkReservation } = require('../src/client');

const { like, boolean } = MatchersV3;

const provider = new PactV3({
  consumer: 'ServicioAdministracion',
  provider: 'ServicioReservas',
  dir: path.resolve(__dirname, '../../../pacts'),
  logLevel: 'warn',
});

describe('Contrato 3: Servicio de Administración -> Servicio de Reservas', () => {
  it('indica que la reserva R-1001 es válida', () => {
    provider
      .given('la reserva R-1001 existe y está activa')
      .uponReceiving('una verificación de la reserva R-1001')
      .withRequest({
        method: 'GET',
        path: '/reservations/R-1001/estado',
      })
      .willRespondWith({
        status: 200,
        body: {
          reservationId: 'R-1001',
          valid: true,
        },
      });

    return provider.executeTest(async (mockServer) => {
      const result = await checkReservation(mockServer.url, 'R-1001');
      expect(result.valid).toBe(true);
    });
  });

  it('indica que una reserva inexistente no es válida', () => {
    provider
      .given('la reserva no existe')
      .uponReceiving('una verificación de una reserva inexistente')
      .withRequest({
        method: 'GET',
        path: '/reservations/R-9999/estado',
      })
      .willRespondWith({
        status: 200,
        body: {
          reservationId: 'R-9999',
          valid: false,
        },
      });

    return provider.executeTest(async (mockServer) => {
      const result = await checkReservation(mockServer.url, 'R-9999');
      expect(result.valid).toBe(false);
    });
  });
});
