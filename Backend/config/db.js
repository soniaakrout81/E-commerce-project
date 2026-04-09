import mongoose from "mongoose";

export const connectMongoDataBase = () => {

    mongoose.connect(process.env.DB_URI)
    .then((data) => {
        console.log(`MongoDB is connected with server ${data.connection.host}`);
    }).catch((err) => {

        console.log(err.message);

    });

}
