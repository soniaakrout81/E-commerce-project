import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve('./Backend/config/config.env') });
import app from "./app.js";
import { connectMongoDataBase } from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";

connectMongoDataBase();

cloudinary.config({

  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,

});


process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
})

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
})


process.on('unhandledRejection', (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(() => {
        process.exit(1)
    })
})
