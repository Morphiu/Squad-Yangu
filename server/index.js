import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

require.dotenv()

import postRoutes from './routes/posts.js'

//-initialize app
const app = express();

//-importing routes
app.use('/posts', postRoutes);

//-setting up bodyparser to handle files and send request
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());

//-connecting to mongodb atlas
const CONNECTION_URL = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000;

//-mongoose setup to connect to db
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false);
