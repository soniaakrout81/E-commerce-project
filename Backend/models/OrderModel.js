import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    shippingInfo: {

        address: {

            type: String,
            required: true

        },
        city: {

            type: String,
            required: true

        },
        state: {

            type: String,
            required: true

        },
        phoneNumber: {

            type: Number,
            required: true

        },





    },
    orderItems: [

        {

            name: {

            type: String,
            required: true
  
            },
            price: {

            type: Number,
            required: true
            
            },
            quantity: {

            type: Number,
            required: true
            
            },
            image: {
                
            type: String,
            required: true

            },
            product: {

                type: mongoose.Schema.ObjectId,
                required: true,
                ref: "Product"

            }

        }

    ],
    orderStatus:{

        type: String,
        required: true,
        default: "Processing"

    },
    user: {

        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true

    },
    itemPrice: {

        type: Number,
        required: true,
        default: 0

    },
    taxPrice: {

        type: Number,
        required: true,
        default: 0

    },
    shippingPrice: {

        type: Number,
        required: true,
        default: 0

    },
    discountPrice: {
        type: Number,
        default: 0
    },
    totalPrice: {

        type: Number,
        required: true,
        default: 0

    },
    couponCode: {
        type: String,
        default: ""
    },
    deliveredAt: Date,
    createdAt: {

        type: Date,
        default: Date.now()

    }

});


export default mongoose.model("Order",orderSchema);
