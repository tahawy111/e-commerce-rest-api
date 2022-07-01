import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import index from './routes/index.js';
dotenv.config();
const app = express();

// router
index(app);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log(err));

// express server
app.listen(process.env.PORT || 5001, () =>
  console.log(
    `Server is running at http://localhost:${process.env.PORT || 5001}`
  )
);
