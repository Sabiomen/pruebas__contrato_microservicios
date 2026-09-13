const { createApp } = require('./app');

const PORT = process.env.PORT || 3002;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Portal de Usuario escuchando en el puerto ${PORT}`);
});
