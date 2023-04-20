import express, { Router } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();
app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server started on http://localhost:8080');
});

const MONGO_URL ="mongodb+srv://dd8353:xqzoXpCLEeVYlvis@cluster0.5klh8s9.mongodb.net/test"

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error:Error) => {
    console.log('MongoDB connection error:', error);
})

app.use('/',router())