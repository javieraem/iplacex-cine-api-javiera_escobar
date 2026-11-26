import client from '../common/db.js';
import Actor from './actor.js';
import { ObjectId } from 'mongodb';

const actorCollection = client.db('cine-db').collection('actores');
const peliculaCollection = client.db('cine-db').collection('peliculas');

async function handleInsertActorRequest(req, res) {
  try {
    const oid = ObjectId.createFromHexString(req.body.idPelicula);

    await peliculaCollection
      .findOne({ _id: oid })
      .then(async (pelicula) => {
        if (pelicula === null) {
          return res.status(404).json({ error: 'La película indicada no existe' });
        }

        const campos = Object.keys(Actor).filter((campo) => campo !== '_id');
        const actor = {};
        campos.forEach((campo) => {
          actor[campo] = req.body[campo];
        });

        return await actorCollection
          .insertOne(actor)
          .then((data) => {
            return res.status(201).json(data);
          });
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(400).json({ error: 'Id de película mal formado' });
  }
}

async function handleGetActoresRequest(req, res) {
  await actorCollection
    .find({})
    .toArray()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
}

async function handleGetActorByIdRequest(req, res) {
  try {
    const oid = ObjectId.createFromHexString(req.params.id);

    await actorCollection
      .findOne({ _id: oid })
      .then((data) => {
        if (data === null) {
          return res.status(404).json({ error: 'Actor no encontrado' });
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

async function handleGetActoresByPeliculaIdRequest(req, res) {
  await actorCollection
    .find({ idPelicula: req.params.pelicula })
    .toArray()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
}

export default {
  handleInsertActorRequest,
  handleGetActoresRequest,
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest,
};