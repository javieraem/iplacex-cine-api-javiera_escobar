import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import cors from 'cors';
import client from './src/common/db.js';
import peliculaRoutes from './src/pelicula/routes.js';
import ActorRoutes from './src/actor/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Bienvenido al cine Iplacex');
});
app.use('/api', peliculaRoutes);
app.use('/api', ActorRoutes);
try {
  await client.connect();
  console.log('Conexión a MongoDB Atlas exitosa');

  app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  });
} catch (error) {
  console.error('Error al conectar con MongoDB Atlas:', error.message);
}