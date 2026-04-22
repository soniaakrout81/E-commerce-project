import mongoose from "mongoose";

const createSlug = (value = "") =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"],
        trim: true
    },
    keywords: {
        type: String,
        default: "",
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        min: [0, "Product price cannot be negative"]

    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
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
        default: 1,
        min: [0, "Product stock cannot be negative"]

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

productSchema.pre("validate", function (next) {
    if (this.name) {
        this.slug = createSlug(this.name);
    }
    next();
});


export default mongoose.model("Product", productSchema, "products");

