import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cookieParser from "cookie-parser";
// import cors from "cors";

const app = express();
// app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json());

// Add your routes here
app.use('/api', routes);

export default app;