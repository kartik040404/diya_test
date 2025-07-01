import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import TestRoutes from './Routes.js';
import dbConnect from './config/database.js';
import { cloudinaryConnect } from './config/cloudinary.js';
import fileUpload from 'express-fileupload';
dotenv.config();

// const corsOptions = {
//     origin: 'https://sohamtamhane.github.io', // Or an array of allowed origins
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // If you need to send cookies or authorization headers
//     optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// Server Configuration
const app = express();
app.use(express.json());
app.use(cors());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp',
    })
);
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
dbConnect();
cloudinaryConnect();

// API Routing
app.use('/api/v1/test', TestRoutes);

server.listen(PORT, () => {
    console.log(`Institute Test Service Started at PORT: ${PORT}`);
});