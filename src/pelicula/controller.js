import client from '../common/db.js';
import Pelicula from './pelicula.js';
import { ObjectId } from 'mongodb';

const peliculaCollection = client.db('cine-db').collection('peliculas');

async function handleInsertPeliculaRequest(req, res) {
  const campos = Object.keys(Pelicula).filter((campo) => campo !== '_id');
  const pelicula = {};
  campos.forEach((campo) => {
    pelicula[campo] = req.body[campo];
  });

  await peliculaCollection
    .insertOne(pelicula)
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
}

async function handleGetPeliculasRequest(req, res) {
  await peliculaCollection
    .find({})
    .toArray()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
}

async function handleGetPeliculaByIdRequest(req, res) {
  try {
    const oid = ObjectId.createFromHexString(req.params.id);

    await peliculaCollection
      .findOne({ _id: oid })
      .then((data) => {
        if (data === null) {
          return res.status(404).json({ error: 'Película no encontrada' });
        }
        return res.status(200).json(data);
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(400).json({ error: 'Id mal formado' });
  }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
  try {
    const oid = ObjectId.createFromHexString(req.params.id);

    const campos = Object.keys(Pelicula).filter((campo) => campo !== '_id');
    const cambios = {};
    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        cambios[campo] = req.body[campo];
      }
    });

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    await peliculaCollection
      .updateOne({ _id: oid }, { $set: cambios })
      .then((data) => {
        if (data.matchedCount === 0) {
          return res.status(404).json({ error: 'Película no encontrada' });
        }
        return res.status(200).json(data);
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(400).json({ error: 'Id mal formado' });
  }
}

async function handleDeletePeliculaByIdRequest(req, res) {
  try {
    const oid = ObjectId.createFromHexString(req.params.id);

    await peliculaCollection
      .deleteOne({ _id: oid })
      .then((data) => {
        if (data.deletedCount === 0) {
          return res.status(404).json({ error: 'Película no encontrada' });
        }
        return res.status(200).json(data);
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(400).json({ error: 'Id mal formado' });
  }
}


export default {
  handleInsertPeliculaRequest,
  handleGetPeliculasRequest,
  handleGetPeliculaByIdRequest,
  handleUpdatePeliculaByIdRequest,
  handleDeletePeliculaByIdRequest,
};