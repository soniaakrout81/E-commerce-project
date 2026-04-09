import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"],
    },
    keywords: {
        type: String,
        default: "",
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],

    },
    ratings: {
        type: Number,
        default: 0

    },
    image: [

        {

            publicId: {

                type: String,
                required: true
            },

            url: {

                type: String,
                require: true

            }
        }

    ],
    category: {

        type: String,
        required: [true, "Please Enter Product Category"],

    },
    stock: {

        type: Number,
        required: [true, "Please Enter Product Stock"],
        default: 1

    },
    numOfReviews: {

        type: Number,
        default: 0

    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {

        type: Date,
        default: Date.now

    }


});


export default mongoose.model("Product", productSchema, "products");

