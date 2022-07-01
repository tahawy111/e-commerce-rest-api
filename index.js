import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5001, () =>
  console.log(
    `Server is running at http://localhost:${process.env.PORT || 5001}`
  )
);
