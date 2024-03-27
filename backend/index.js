import express from 'express'
import Connecton from "./database/db.js";
import dotenv from 'dotenv';
import Router from "./Routes/Router.js";
import TweetRouter from './Routes/TweetRoute.js';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary'
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(fileUpload({useTempFiles:true}));

const currentModuleUrl = import.meta.url;

// Convert the URL to a file path
const currentModulePath = fileURLToPath(currentModuleUrl);

// Get the directory path of the current module
const currentDir = dirname(currentModulePath);
app.use(express.static(join(currentDir, 'frontend', 'build')));

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME , 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret:process.env.CLOUD_API_SECRET,
    secure: true
  });

app.use('/api/auth',Router);
app.use('/api/auth/tweet',TweetRouter)

app.get('*', (req, res) => {
  res.sendFile(join(currentDir, 'frontend', 'build', 'index.html'));
});

const username=process.env.DB_USERNAME;
const password=process.env.DB_PASSWORD;


const PORT= process.env.PORT || 8000;

Connecton(username,password);

app.listen(PORT,()=>{
 console.log(`server is successfully listeing at ${PORT} port`)


});