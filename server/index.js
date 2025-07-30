import { createRequire } from "module";
const require = createRequire(import.meta.url);

require('dotenv').config();
import express from 'express';
import mongoose  from "mongoose";
import router from './routes/dataTest.js';
import swaggerRouter from './routes/swagger.js';


const app = express();

import cors from 'cors';
app.use(cors());
app.use('/api-docs', swaggerRouter);
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
const db = mongoose.connection
db.on('error', (err) => {console.error(err)});
db.once('open', (open) => {console.log('Connected to DB')});

app.use(express.json());



app.use('/data', router);



app.listen(3010,() => console.log('Server started on port 3010'));