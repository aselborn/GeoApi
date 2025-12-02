import "dotenv/config" ;
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { swaggerSpec, swaggerUi } from './swagger.js';

import smhiRoutes from './routes/smhi.route.js';

const app = express();
app.use(bodyParser.json());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', smhiRoutes);

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});