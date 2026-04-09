import express from "express";
import product from "./routes/ProductsRoute.js";
import errorHandelMiddleware from "./middleware/error.js";
import user from "./routes/UserRoutes.js";
import order from "./routes/OrderRoutes.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();


app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

app.use(errorHandelMiddleware);

export default app;
