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
app.use(pinoHttp({ logger }));
app.use(generalLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/meals', mealsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`bitesync-api running on http://localhost:${env.port}`);
});
