import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import mealsRouter from './routes/meals.routes';
import authRouter from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());

// Structured request logging: method, path, status, response time on every
// request, without a log line in every controller.
app.use(pinoHttp({ logger }));

// Applies to everything below this line. authRouter also layers its own
// stricter authLimiter on top for /auth/login and /auth/register.
app.use(generalLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/meals', mealsRouter);

// Order matters: 404 handler catches anything no route matched, the error
// handler must be registered last so Express treats it as error-handling
// middleware (it's identified by having 4 arguments).
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`bitesync-api running on http://localhost:${env.port}`);
});
