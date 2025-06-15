import express, {Express, NextFunction, Request, Response} from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import { getEnv } from './utils/getEnv';
import Routes from './controller/router';
import { errorHandler } from './utils/errorHandler';

const app: Express = express();
const hostname: string = String(process.env.HOST) || 'localhost';
const port: number = Number(getEnv('HOST_PORT')) || 8080;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE ,OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: getEnv('DOMAIN', '*').split(','), // Allow all origins or specify your frontend URL
    credentials: true
}))

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({'message': 'Welcome to my site!'})
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({'message': 'Welcome to my site!'})
});

app.use(`/${getEnv('API')}`, Routes);
app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server running on ${hostname}:${port}`);
})