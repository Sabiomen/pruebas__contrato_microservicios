const path = require('path');
const fs = require('fs');
const { Verifier } = require('@pact-foundation/pact');
const { createApp } = require('../src/app');
const { stateHandlers } = require('./states');

const PORT = 8081;
const PACTS_DIR = path.resolve(__dirname, '../../../pacts');

describe('Verificación de contratos: Servicio de Reservas (proveedor)', () => {
  let server;

  beforeAll((done) => {
    const app = createApp();
    server = app.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('cumple con todos los contratos generados por sus consumidores', async () => {
    const pactFiles = fs
      .readdirSync(PACTS_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => path.join(PACTS_DIR, f));

    expect(pactFiles.length).toBeGreaterThan(0);

    const opts = {
      provider: 'ServicioReservas',
      providerBaseUrl: `http://localhost:${PORT}`,
      pactUrls: pactFiles,
      stateHandlers,
      logLevel: 'info',
    };

    await new Verifier(opts).verifyProvider();
  });
});
