import express from 'express';
import actorController from './controller.js';

const ActorRoutes = express.Router();

ActorRoutes.post('/actor', actorController.handleInsertActorRequest);
ActorRoutes.get('/actores', actorController.handleGetActoresRequest);
ActorRoutes.get('/actor/:id', actorController.handleGetActorByIdRequest);
ActorRoutes.get('/actor/pelicula/:pelicula', actorController.handleGetActoresByPeliculaIdRequest);

export default ActorRoutes;