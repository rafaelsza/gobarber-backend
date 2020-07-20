import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

// DTO - Data Transfer Object

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;
