import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mealsRouter from './routes/meals.routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/meals', mealsRouter);

app.listen(PORT, () => {
  console.log(`bitesync-api running on http://localhost:${PORT}`);
});
